import { Todo, TodoFormData } from '@/types/todo';
import { User } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Ensure the base URL ends with a slash for proper concatenation, but avoid double slashes
const ensureTrailingSlash = (url: string): string => {
  return url.endsWith('/') ? url : `${url}/`;
};

const BASE_URL = ensureTrailingSlash(API_BASE_URL);

// Add /api prefix to all API calls to match backend expectations
const addApiPrefix = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

  if (cleanEndpoint.startsWith('auth') || cleanEndpoint.startsWith('todos')) {
    return `api/${cleanEndpoint}`;
  }
  return cleanEndpoint;
};

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const prefixedEndpoint = addApiPrefix(endpoint);
    const response = await fetch(`${BASE_URL}${prefixedEndpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const prefixedEndpoint = addApiPrefix(endpoint);
    const response = await fetch(`${BASE_URL}${prefixedEndpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const prefixedEndpoint = addApiPrefix(endpoint);
    const response = await fetch(`${BASE_URL}${prefixedEndpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const prefixedEndpoint = addApiPrefix(endpoint);
    const response = await fetch(`${BASE_URL}${prefixedEndpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete(endpoint: string): Promise<void> {
    const prefixedEndpoint = addApiPrefix(endpoint);
    const response = await fetch(`${BASE_URL}${prefixedEndpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Authentication methods
  async signup(email: string, password: string, name?: string) {
    return this.post<{ access_token: string; token_type: string; user: User }>('/auth/signup', { email, password, name });
  }

  async signin(email: string, password: string) {
    return this.post<{ access_token: string; token_type: string; user: User }>('/auth/signin', { email, password });
  }

  async signout() {
    // Call backend to clear cookie
    await this.post('/auth/signout', {});
    // Also clear localStorage for backward compatibility
    localStorage.removeItem('access_token');
  }

  async getMe(): Promise<User> {
    return this.get('/auth/me');
  }

  // Todo methods
  async getTodos() {
    return this.get<Todo[]>('/todos');
  }

  async createTodo(todo: TodoFormData & { status: string; completed: boolean }) {
    return this.post<Todo>('/todos', todo);
  }

  async updateTodo(id: string, todo: Partial<Todo>) {
    return this.put<Todo>(`/todos/${id}`, todo);
  }

  async deleteTodo(id: string) {
    return this.delete(`/todos/${id}`);
  }

  async toggleTodo(id: string) {
    return this.patch<Todo>(`/todos/${id}/toggle`, { completed: true });
  }

  async toggleTodoCompletion(id: string, completed: boolean) {
    return this.patch<Todo>(`/todos/${id}/toggle`, { completed });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const apiClient = new ApiClient();