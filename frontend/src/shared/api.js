const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('neural_academy_token');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error('Unable to reach the Neural Academy server. Start the backend with npm run server.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}
