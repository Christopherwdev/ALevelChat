import { cookies } from 'next/headers';

export async function fetchTeachersWithConversations() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ai/teachers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: (await cookies()).toString(),
      },
      body: JSON.stringify({
        includeConversations: true,
        limit: 20,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }

    const data = await response.json();
    return data.teachers;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
}
