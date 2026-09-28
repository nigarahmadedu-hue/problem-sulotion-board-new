const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('soch_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

export const api = {
  getProblems: async (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    let url = `${API_URL}/problems`;
    if (params) {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      const qs = query.toString();
      if (qs) url += `?${qs}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch problems');
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${API_URL}/problems/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  getProblemById: async (id: string) => {
    const res = await fetch(`${API_URL}/problems/${id}`);
    if (!res.ok) throw new Error('Failed to fetch problem');
    return res.json();
  },

  createProblem: async (data: any) => {
    const res = await fetch(`${API_URL}/problems`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create problem');
    return res.json();
  },

  updateProblem: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/problems/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update problem');
    return res.json();
  },

  voteProblem: async (problemId: string) => {
    const res = await fetch(`${API_URL}/problems/${problemId}/vote`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to vote');
    return res.json();
  },

  uploadEvidenceImage: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers = authHeaders();
    delete (headers as any)['Content-Type'];

    const res = await fetch(`${API_URL}/problems/${id}/evidence-image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to upload image');
    return res.json();
  },

  createComment: async (problemId: string, data: any) => {
    const res = await fetch(`${API_URL}/problems/${problemId}/comments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },

  getIdeas: async (problemId: string) => {
    const res = await fetch(`${API_URL}/problems/${problemId}/ideas`);
    if (!res.ok) throw new Error('Failed to fetch ideas');
    return res.json();
  },

  createIdea: async (problemId: string, data: any) => {
    const res = await fetch(`${API_URL}/problems/${problemId}/ideas`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create idea');
    return res.json();
  },

  voteIdea: async (ideaId: string) => {
    const res = await fetch(`${API_URL}/ideas/${ideaId}/vote`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to vote idea');
    return res.json();
  },

  getProfiles: async () => {
    const res = await fetch(`${API_URL}/profiles`);
    if (!res.ok) throw new Error('Failed to fetch profiles');
    return res.json();
  },

  getProfileById: async (id: string) => {
    const res = await fetch(`${API_URL}/profiles/${id}`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  getDashboard: async () => {
    const res = await fetch(`${API_URL}/profiles/me/dashboard`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return res.json();
  },

  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  // ── Messaging ──────────────────────────────────────────────────────────────

  sendMessage: async (receiverId: string, content: string) => {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ receiverId, content }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to send message: ${res.status} ${text}`);
    }
    return res.json();
  },

  getConversations: async () => {
    const res = await fetch(`${API_URL}/messages/conversations`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  getConversation: async (userId: string) => {
    const res = await fetch(`${API_URL}/messages/conversation/${userId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch conversation');
    return res.json();
  },

  markMessageRead: async (messageId: string) => {
    const res = await fetch(`${API_URL}/messages/${messageId}/read`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark message as read');
    return res.json();
  },
};