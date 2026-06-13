const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  health: () => request('/health'),

  getUsers: () => request('/users'),

  getUser: (id) => request(`/users/${id}`),

  createUser: (data) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUserSkills: (userId) => request(`/users/${userId}/skills`),

  getUserStats: (userId) => request(`/users/${userId}/stats`),

  getRanking: () => request('/ranking'),

  getSkills: () => request('/skills'),

  getSkill: (id) => request(`/skills/${id}`),

  createSkill: (data) =>
    request('/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateSkill: (id, data) =>
    request(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteSkill: (id) =>
    request(`/skills/${id}`, {
      method: 'DELETE',
    }),

  getSessions: (skillId) => request(`/skills/${skillId}/sesiones`),

  createSession: (skillId, data) =>
    request(`/skills/${skillId}/sesiones`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
