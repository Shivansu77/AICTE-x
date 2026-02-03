import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import UsersTable from '../components/adminUsers/UsersTable';
import UserProfileModal from '../components/shared/UserProfileModal';

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser._id || currentUser.id;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/user/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <header className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 mb-4 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Students</h1>
          <p className="text-gray-500 font-medium mt-1">View the enrolled student roster.</p>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-medium">Loading students...</div>
      ) : (
        <UsersTable
          users={students}
          onUserClick={setSelectedUser}
          currentUserId={currentUserId}
          showActions={false}
        />
      )}

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          isAdmin={false}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default StudentsList;
