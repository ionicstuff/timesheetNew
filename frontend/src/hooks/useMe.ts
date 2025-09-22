import { useQuery } from "@tanstack/react-query";

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token') || '';
  const h: HeadersInit = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export function useMe() {
  return useQuery<any, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me', { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to load current user');
      return res.json();
    }
  });
}