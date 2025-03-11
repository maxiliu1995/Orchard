import { Pod } from '@/types/lock';

export async function getPodById(id: string): Promise<Pod> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pods/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pod');
  }

  return response.json();
}

export async function getAvailablePods(): Promise<Pod[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pods/available`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch available pods');
  }

  return response.json();
} 