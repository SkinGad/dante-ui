import { User } from '../types/user';

const API_BASE = '/api/v1';

export const api = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async addUser(username: string, password: string): Promise<void> {
    const response = await fetch(
      `${API_BASE}/add_user?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      { method: 'POST' }
    );
    if (!response.ok) throw new Error('Failed to add user');
  },

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/user?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  async getLink(id: number): Promise<string> {
    const response = await fetch(`${API_BASE}/get_link?id=${id}`);
    if (!response.ok) throw new Error('Failed to get link');
    const data = await response.text();
    return data;
  },
};
