/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, doc, limit, startAfter, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import Image from 'next/image';
// import useAuth from '@/lib/hooks/useAuth';
import AIInputCard from '@/components/ai-chat/InputCard';
import MessageList from '@/components/ai-chat/MessageList';
import TradeValuesCard from '@/components/ai-chat/TradeValues';
import AIWelcome from '@/components/ai-chat/Welcome';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ChatMessage, AIChat, TradeValues, AIMessage, AIResponse } from '@/lib/utils';
import db from '../../../../firebase.config';
import { useParticleAuth } from '@/lib/hooks/useParticleAuth';


const MESSAGES_PER_PAGE = 50;
const AI_SENDER_ID = 'ai-assistant';
const DEFAULT_USER_ID = 'anonymous-user';

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;
  const router = useRouter();
  const { address, isConnected } = useParticleAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<AIChat | null>(null);
  const [sending, setSending] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [tradeValues, setTradeValues] = useState<TradeValues | null>(null);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageRef, setLastMessageRef] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const userAddress = address || DEFAULT_USER_ID;

  const convertToChatMessage = (doc: any): ChatMessage => {
    const data = doc.data() as Omit<AIMessage, 'id'>;
    return {
      id: doc.id,
      chatId: data.chatId,
      senderId: data.isAi ? AI_SENDER_ID : userAddress,
      recipientId: data.isAi ? userAddress : AI_SENDER_ID,
      content: data.content,
      timestamp: data.timestamp,
      isWeb3Mail: false
    };
  };

  const loadInitialMessages = async () => {
    if (!chatId || !db) return;

    try {
      const messagesRef = collection(db, 'ai_chat_messages');
      const q = query(
        messagesRef,
        where('chatId', '==', chatId),
        orderBy('timestamp', 'desc'),
        limit(MESSAGES_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const messageList = snapshot.docs.map(convertToChatMessage);
        setMessages(messageList.reverse());
        setLastMessageRef(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);
      }
      setMessagesLoaded(true);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      setError(error.message);
      setMessagesLoaded(true);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMore || !lastMessageRef || !chatId || !db) return;

    try {
      const messagesRef = collection(db, 'ai_chat_messages');
      const q = query(
        messagesRef,
        where('chatId', '==', chatId),
        orderBy('timestamp', 'desc'),
        startAfter(lastMessageRef),
        limit(MESSAGES_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const newMessages = snapshot.docs.map(convertToChatMessage);
        setMessages(prev => [...prev, ...newMessages.reverse()]);
        setLastMessageRef(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === MESSAGES_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      console.error('Error loading more messages:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      router.push('/ai-chats');
      return;
    }

    if (!chatId || !db) return;

    const unsubscribeChat = onSnapshot(
      doc(db, 'ai_chats', chatId),
      {
        next: (docSnapshot) => {
          if (docSnapshot.exists()) {
            const chatData = {
              id: docSnapshot.id,
              ...(docSnapshot.data() as Omit<AIChat, 'id'>)
            };
            setChat(chatData);
            if (chatData.lastMessage) {
              setShowWelcome(false);
            }
          } else {
            router.push('/ai-chats');
          }
        },
        error: (error) => {
          console.error('Error in chat listener:', error);
          setError(error.message);
        }
      }
    );

    loadInitialMessages();

    const messagesRef = collection(db, 'ai_chat_messages');
    const newMessagesQuery = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribeNewMessages = onSnapshot(
      newMessagesQuery,
      {
        next: (snapshot) => {
          if (!snapshot.empty) {
            const newMessage = convertToChatMessage(snapshot.docs[0]);
            setMessages(prev => {
              if (prev.find(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
            setShowWelcome(false);
          }
        },
        error: (error) => {
          console.error('Error in messages listener:', error);
          setError(error.message);
        }
      }
    );

    return () => {
      unsubscribeChat();
      unsubscribeNewMessages();
    };
  }, [chatId, isConnected, router, userAddress]);

  const handleSendMessage = async (message: string) => {
    if (!chat) {
      setError('Chat not found');
      return;
    }

    setSending(true);
    setError(null);

    try {
      const tradingTerms = ['take profit', 'stop loss', 'lot size', 'trade signal', 'signal'];
      const hasTradingTerms = tradingTerms.some(term => 
        message.toLowerCase().includes(term)
      );

      let updatedMessage = message;
      if (hasTradingTerms) {
        updatedMessage += " please in your response can you indicate the values for the take profit, stop loss and lot size respectively";
      }

      // First, save the user's message to Firestore
      const timestamp = Date.now();
      await addDoc(collection(db, 'ai_chat_messages'), {
        chatId,
        content: updatedMessage,
        isAi: false,
        timestamp
      });

      // Create the request payload, always including threadId for existing chats
      const payload = {
        message: updatedMessage,
        threadId: chat.threadId
      };

      const url = 'https://tradellm.onrender.com/api/chat';
      const chatUrl = new URL(url);
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send message to API');
      }

      const data: AIResponse = await response.json();
      const aiMessage = data.response.kwargs.content;
      
      // Save the AI's response to Firestore
      await addDoc(collection(db, 'ai_chat_messages'), {
        chatId,
        content: aiMessage,
        isAi: true,
        timestamp: Date.now()
      });

      // Update the chat's last message
      await updateDoc(doc(db, 'ai_chats', chatId), {
        lastMessage: {
          content: aiMessage,
          timestamp: Date.now()
        },
        updatedAt: Date.now()
      });
      
      // If no threadId exists yet (edge case), update it now
      if (!chat.threadId && data.threadId) {
        await updateDoc(doc(db, 'ai_chats', chatId), {
          threadId: data.threadId
        });
      }

      if (hasTradingTerms) {
        const tpMatch = data.response.kwargs.content.match(/Take Profit: \$?([\d.]+)/);
        const slMatch = data.response.kwargs.content.match(/Stop Loss: \$?([\d.]+)/);
        const lotMatch = data.response.kwargs.content.match(/Lot Size: ([\d.]+)/);

        if (tpMatch && slMatch && lotMatch) {
          const newTradeValues: TradeValues = {
            takeProfit: tpMatch[1],
            stopLoss: slMatch[1],
            lotSize: lotMatch[1]
          };
          setTradeValues(newTradeValues);
        }
      }

      if (showWelcome) {
        setShowWelcome(false);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the AI chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/ai-chats')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">AI Chat</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm min-h-[calc(100vh-16rem)]">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-t-lg">
                {error}
              </div>
            )}
            
            {!messagesLoaded ? (
              <div className="flex justify-center items-center h-64">
                <Image
                  src="https://i.imgur.com/IcF1dcF.png"
                  alt="Loading"
                  width={128}
                  height={128}
                  priority={true}
                  unoptimized={true}
                  className="animate-pulse rounded-full bg-fuchsia-700"
                />
              </div>
            ) : messages.length === 0 && showWelcome ? (
              <AIWelcome onSendMessage={handleSendMessage} onClose={() => setShowWelcome(false)} />
            ) : (
              <>
                {hasMore && (
                  <Button 
                    onClick={loadMoreMessages}
                    variant="ghost"
                    className="w-full"
                  >
                    Load More Messages
                  </Button>
                )}
                <MessageList 
                  messages={messages}
                  currentUserAddress={userAddress}
                />
                {tradeValues && (
                  <TradeValuesCard
                    values={tradeValues}
                    onUpdate={(values: TradeValues) => setTradeValues(values)}
                  />
                )}
                <AIInputCard
                  onSendMessage={handleSendMessage}
                  disabled={sending}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}