import { getTeachers } from '@/lib/services/ai';

export async function fetchTeachersWithConversations() {
  try {
    return await getTeachers({
      includeConversations: true,
      limit: 20,
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
}
