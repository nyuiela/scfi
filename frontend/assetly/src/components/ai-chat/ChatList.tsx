'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import db from '../../../firebase.config';
import { Card, CardContent } from '../ui/card';

interface AIChat {
  id: string;
  userId: string;
  threadId: string;
  lastMessage: {
    content: string;
    timestamp: number;
  };
  title: string;
  createdAt: number;
  updatedAt: number;
}

export const AIChatList = ({ userId }: { userId: string }) => {
  const [chats, setChats] = useState<AIChat[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const truncateBySentence = (sentence: string, maxSentences = 2) => {
    // Match sentences ending with ., !, or ?
    const sentences = sentence.match(/[^.!?]+[.!?]+/g) || [sentence];
    
    if (sentences.length <= maxSentences) return sentence;
    return sentences.slice(0, maxSentences).join('').trim();
  };

  useEffect(() => {
    const chatsRef = collection(db, 'ai_chats');
    const q = query(
      chatsRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIChat));
        setChats(chatList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching chats:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Image
          src="https://i.imgur.com/IcF1dcF.png"
          alt="Loading"
          priority={true}
          width={48}
          height={48}
          unoptimized={true}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => (
        <Card
          key={chat.id}
          className="cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => router.push(`/ai-chat/${chat.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {chat.title || 'New Chat'}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 break-words">
                  {truncateBySentence(chat.lastMessage?.content)}
                </p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatTimestamp(chat.lastMessage?.timestamp || chat.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      {chats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No chats yet. Start a new conversation!</p>
        </div>
      )}
    </div>
  );
};

export default AIChatList;