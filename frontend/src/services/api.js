const API_BASE = import.meta.env.VITE_API_URL ?? '';
const RETRY_DELAYS = [450, 900];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getErrorMessage(response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const payload = await response.json().catch(() => null);
    if (payload?.error) return payload.error;
  }

  return (await response.text().catch(() => '')) || `Error ${response.status}`;
}

async function request(url, options = {}, attempt = 0) {
  const method = options.method ?? 'GET';
  let response;

  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (error) {
    const canRetry = method === 'GET' && attempt < RETRY_DELAYS.length;
    if (canRetry) {
      await wait(RETRY_DELAYS[attempt]);
      return request(url, options, attempt + 1);
    }

    throw error;
  }

  if (!response.ok) {
    const canRetry = method === 'GET' && response.status >= 500 && attempt < RETRY_DELAYS.length;
    if (canRetry) {
      await wait(RETRY_DELAYS[attempt]);
      return request(url, options, attempt + 1);
    }

    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) return null;
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
