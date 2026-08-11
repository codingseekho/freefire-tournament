const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://custom-tournament-backend.onrender.com/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("tournament_token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Server response:", text);

    throw new Error(`Invalid server response (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function saveToken(token) {
  localStorage.setItem("tournament_token", token);
}

export function getToken() {
  return localStorage.getItem("tournament_token");
}

export function clearToken() {
  localStorage.removeItem("tournament_token");
}