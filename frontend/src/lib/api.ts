import type { AuthTokens } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;
    const tokens = localStorage.getItem('tokens');
    return tokens ? JSON.parse(tokens) : null;
  }

  private setTokens(tokens: AuthTokens) {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  private clearTokens() {
    localStorage.removeItem('tokens');
  }

  private async refreshToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens?.refresh) return null;
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });
      if (!res.ok) { this.clearTokens(); return null; }
      const data = await res.json();
      this.setTokens({ access: data.access, refresh: data.refresh || tokens.refresh });
      return data.access;
    } catch { this.clearTokens(); return null; }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const tokens = this.getTokens();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (tokens?.access) headers['Authorization'] = `Bearer ${tokens.access}`;

    let res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });

    // Auto-refresh on 401
    if (res.status === 401 && tokens?.refresh) {
      const newAccess = await this.refreshToken();
      if (newAccess) {
        headers['Authorization'] = `Bearer ${newAccess}`;
        res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
      }
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new ApiError(res.status, error);
    }

    if (res.status === 204) return {} as T;
    return res.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // ── Auth helpers ────────────────────────────────────
  async login(email: string, password: string) {
    const data = await this.post<AuthTokens>('/auth/login/', { email, password });
    this.setTokens(data);
    return data;
  }

  async register(payload: Record<string, string>) {
    return this.post('/auth/register/', payload);
  }

  logout() {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getTokens()?.access;
  }
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    super(data.detail || 'API Error');
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient(API_URL);
