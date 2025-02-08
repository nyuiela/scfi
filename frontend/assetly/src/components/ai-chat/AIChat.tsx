/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import db from '../../../firebase.config';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { AIResponse, TradeValues } from '@/lib/utils';
import { useParticleAuth } from '@/lib/hooks/useParticleAuth';

const chatInstructions = [
  "Ask about market analysis and trading insights",
  "Get real-time price information using (S:SYMBOL) format",
  "Analyze multiple assets by comparing different symbols",
  "Request technical analysis with specific indicators",
  "Get trade suggestions with stop loss and take profit levels"
];

interface WelcomeProps {
  onClose: () => void;
  onSendMessage?: (message: string) => Promise<void>;
}

const Welcome: React.FC<WelcomeProps> = ({ onClose, onSendMessage }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 animate-fadeIn">
      <Image
        src="/trading.png"
        alt="AI Assistant"
        width={300}
        height={300}
        className="w-60 h-60 rounded-full mb-6"
      />
      <h2 className="text-2xl font-bold mb-4">Welcome to TradeLLM Assistant</h2>
      <p className="text-gray-600 mb-6">I&apos;m here to help you with market analysis and trading insights.</p>
      
      <Card className="w-full max-w-md mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3">How to interact with me:</h3>
          <ul className="space-y-2 text-left">
            {chatInstructions.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Button 
        onClick={onClose}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        Start Chat
      </Button>
    </div>
  );
};

interface TradeValuesCardProps {
  values: TradeValues;
  onUpdate: (values: TradeValues) => void;
}

const TradeValuesCard: React.FC<TradeValuesCardProps> = ({ values, onUpdate }) => {
  const router = useRouter();
  const handleExecute = () => {
    alert('Trade executed successfully');
  };

  return (
    <Card className="w-full max-w-md mb-4">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <Label className="text-sm text-gray-500">Take Profit</Label>
            <Input
              type="text"
              value={values.takeProfit}
              onChange={(e) => onUpdate({ ...values, takeProfit: e.target.value })}
              className="border bg-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-sm text-gray-500">Stop Loss</Label>
            <Input
              type="text"
              value={values.stopLoss}
              onChange={(e) => onUpdate({ ...values, stopLoss: e.target.value })}
              className="border bg-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <Label className="text-sm text-gray-500">Lot Size</Label>
            <Input
              type="text"
              value={values.lotSize}
              onChange={(e) => onUpdate({ ...values, lotSize: e.target.value })}
              className="border bg-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4 mt-2">
            <Button 
              onClick={handleExecute}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              Execute
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/')}
            >
              Go to Chart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MessageProps {
  content: string;
  isAi: boolean;
  isLoading?: boolean;
}

const Message: React.FC<MessageProps> = ({ content, isAi, isLoading }) => (
  <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
    <div className={`max-w-[80%] lg:max-w-[70%] rounded-lg p-4 ${
      isAi ? 'bg-white border' : 'bg-blue-500 text-white'
    }`}>
      {isLoading ? (
        <div className="flex justify-center">
          <Image
            src="https://i.imgur.com/IcF1dcF.png"
            alt="Loading"
            width={32}
            height={32}
            priority={true}
            unoptimized={true}
            className="animate-pulse"
          />
        </div>
      ) : (
        <div className="whitespace-pre-wrap">{content}</div>
      )}
    </div>
  </div>
);

interface AIChatterProps {
  onChatCreated?: (chatId: string) => void;
  existingChatId?: string;
  initialThreadId?: string;
}

const AIChatter: React.FC<AIChatterProps> = ({ 
  onChatCreated, 
  existingChatId,
  initialThreadId 
}) => {
  const { address } = useParticleAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Array<{
    content: string;
    isAi: boolean;
  }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tradeValues, setTradeValues] = useState<TradeValues | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(initialThreadId);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !address) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { content: userMessage, isAi: false }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const tradingTerms = ['take profit', 'stop loss', 'lot size', 'trade signal', 'signal'];
      const hasTradingTerms = tradingTerms.some(term => 
        userMessage.toLowerCase().includes(term)
      );

      // Prepare the request payload
      const payload = {
        message: userMessage,
        threadId: currentThreadId // Include threadId if it exists
      };

      const url = 'https://tradellm.onrender.com/api/chat';
      const chatUrl = new URL(url);
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      const aiMessage = data.response.kwargs.content;

      // Update messages state with AI response
      setMessages(prev => [...prev, { content: aiMessage, isAi: true }]);

      // Handle new chat creation
      if (!existingChatId && onChatCreated) {
        // For new chats, create the chat document with the threadId from the first response
        const chatRef = await addDoc(collection(db, 'ai_chats'), {
          userId: address.toLowerCase(),
          threadId: data.threadId, // Store the threadId from the first response
          title: userMessage.slice(0, 50) + (userMessage.length > 50 ? '...' : ''),
          lastMessage: {
            content: userMessage,
            timestamp: Date.now()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        });

        // Add user message
        await addDoc(collection(db, 'ai_chat_messages'), {
          chatId: chatRef.id,
          content: userMessage,
          isAi: false,
          timestamp: Date.now()
        });

        // Add AI response
        await addDoc(collection(db, 'ai_chat_messages'), {
          chatId: chatRef.id,
          content: aiMessage,
          isAi: true,
          timestamp: Date.now()
        });

        // Update the current threadId
        setCurrentThreadId(data.threadId);
        onChatCreated(chatRef.id);
      } else if (existingChatId) {
        // For existing chats, update the chat document
        await updateDoc(doc(db, 'ai_chats', existingChatId), {
          lastMessage: {
            content: aiMessage,
            timestamp: Date.now()
          },
          updatedAt: Date.now()
        });

        // Add messages to history
        await addDoc(collection(db, 'ai_chat_messages'), {
          chatId: existingChatId,
          content: userMessage,
          isAi: false,
          timestamp: Date.now()
        });

        await addDoc(collection(db, 'ai_chat_messages'), {
          chatId: existingChatId,
          content: aiMessage,
          isAi: true,
          timestamp: Date.now()
        });
      }

      if (hasTradingTerms) {
        const tpMatch = aiMessage.match(/Take Profit: \$?([\d.]+)/);
        const slMatch = aiMessage.match(/Stop Loss: \$?([\d.]+)/);
        const lotMatch = aiMessage.match(/Lot Size: ([\d.]+)/);

        if (tpMatch && slMatch && lotMatch) {
          setTradeValues({
            takeProfit: tpMatch[1],
            stopLoss: slMatch[1],
            lotSize: lotMatch[1]
          });
        }
      }

      if (showWelcome) {
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        content: 'Sorry, I encountered an error. Please try again.',
        isAi: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto p-4">
      {showWelcome ? (
        <Welcome onClose={() => setShowWelcome(false)} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <Message
                key={index}
                content={message.content}
                isAi={message.isAi}
              />
            ))}
            {isLoading && (
              <Message
                content=""
                isAi={true}
                isLoading={true}
              />
            )}
            {tradeValues && (
              <TradeValuesCard
                values={tradeValues}
                onUpdate={setTradeValues}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="relative">
            <MaxWidthWrapper>
              <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 h-12 min-h-[3rem] bg-white max-h-32 resize-y border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <Button 
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-6"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            </MaxWidthWrapper>
            
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatter;