import { useState, useEffect } from 'react';
import { X, RefreshCw, Copy, Check } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (username: string, password: string) => Promise<void>;
}

const generatePassword = (): string => {
  const length = 32;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const AddUserModal = ({ isOpen, onClose, onAdd }: AddUserModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword(generatePassword());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onAdd(username, password);
      setUsername('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError(null);
    setCopied(false);
    onClose();
  };

  const handleRegeneratePassword = () => {
    setPassword(generatePassword());
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New User</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleRegeneratePassword}
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Generate new password"
              >
                <RefreshCw size={18} />
              </button>
              <button
                type="button"
                onClick={handleCopyPassword}
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Copy password"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
