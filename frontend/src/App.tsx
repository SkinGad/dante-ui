import { useState, useMemo } from 'react';
import { UserPlus, RefreshCw, Users } from 'lucide-react';
import { useUsers } from './hooks/useUsers';
import { UserCard } from './components/UserCard';
import { AddUserModal } from './components/AddUserModal';
import { SearchBar } from './components/SearchBar';
import { Pagination } from './components/Pagination';

const ITEMS_PER_PAGE = 20;

function App() {
  const { users, loading, error, addUser, deleteUser, getLink, refreshUsers } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.password.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={refreshUsers}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Loading...' : `${filteredUsers.length} users total`}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={refreshUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                <UserPlus size={20} />
                Add User
              </button>
            </div>
          </div>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Click "Add User" to create your first user'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {paginatedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={deleteUser}
                  onGetLink={getLink}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addUser}
      />
    </div>
  );
}

export default App;
