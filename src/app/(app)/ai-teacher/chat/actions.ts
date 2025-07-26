'use server';

import { cookies } from 'next/headers';
import { AiConversation } from '@/lib/types/ai';

export async function sendMessage(teacherId: string, message: string, conversationId?: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString(),
      },
      body: JSON.stringify({
        teacherId,
        message,
        conversationId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    
    if (!conversationId && data.conversationId) {
      const newConversation: AiConversation = {
        id: data.conversationId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return {
        message: data.message,
        newConversation,
      };
    }

    return {
      message: data.message,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}
