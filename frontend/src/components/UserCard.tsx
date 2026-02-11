import { useState } from 'react';
import { Trash2, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { User } from '../types/user';

interface UserCardProps {
  user: User;
  onDelete: (id: number) => Promise<void>;
  onGetLink: (id: number) => Promise<string>;
}

export const UserCard = ({ user, onDelete, onGetLink }: UserCardProps) => {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      await onDelete(user.id);
    } catch (error) {
      alert('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleGetLink = async () => {
    try {
      setLinkLoading(true);
      const link = await onGetLink(user.id);
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('Failed to get link');
    } finally {
      setLinkLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Username
            </div>
            <div className="text-sm font-semibold text-gray-900 break-all">
              {user.username}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Password
            </div>
            <div className="text-sm font-mono text-gray-900 break-all">
              {user.password}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleGetLink}
            disabled={linkLoading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                {linkLoading ? <Copy size={16} className="animate-pulse" /> : <LinkIcon size={16} />}
                Get Link
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
