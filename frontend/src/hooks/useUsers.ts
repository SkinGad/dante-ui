import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';
import { api } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (username: string, password: string) => {
    await api.addUser(username, password);
    await fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await api.deleteUser(id);
    await fetchUsers();
  };

  const getLink = async (id: number) => {
    return await api.getLink(id);
  };

  return {
    users,
    loading,
    error,
    addUser,
    deleteUser,
    getLink,
    refreshUsers: fetchUsers,
  };
};
