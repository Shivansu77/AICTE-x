import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import PageHeader from '../components/adminUsers/PageHeader';
import FilterBar from '../components/adminUsers/FilterBar';
import UsersTable from '../components/adminUsers/UsersTable';
import UserProfileModal from '../components/shared/UserProfileModal';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    
    // Get current user ID
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser._id || currentUser.id;

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user/all');
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            try {
                const [students, teachers] = await Promise.all([
                    api.get('/user/students'),
                    api.get('/user/teachers')
                ]);
                const combined = [...teachers.data, ...students.data];
                setUsers(combined);
                setFilteredUsers(combined);
            } catch (e) { console.error('Fallback failed', e); }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;

        if (filterRole !== 'all') {
            result = result.filter(u => u.role === filterRole);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(u =>
                (u.firstName?.toLowerCase() || '').includes(lowerTerm) ||
                (u.lastName?.toLowerCase() || '').includes(lowerTerm) ||
                (u.email?.toLowerCase() || '').includes(lowerTerm)
            );
        }

        setFilteredUsers(result);
    }, [filterRole, searchTerm, users]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleBlockUser = async (user) => {
        const action = user.isActive ? 'block' : 'unblock';
        if (!window.confirm(`Are you sure you want to ${action} ${user.firstName} ${user.lastName}?`)) {
            return;
        }

        try {
            const response = await api.put(`/user/${user._id}/toggle-block`);
            // Update the user in the list
            setUsers(prev => prev.map(u => 
                u._id === user._id ? { ...u, isActive: response.data.user.isActive } : u
            ));
            // Also update selected user if it's the same
            if (selectedUser && selectedUser._id === user._id) {
                setSelectedUser({ ...selectedUser, isActive: response.data.user.isActive });
            }
            alert(response.data.message);
        } catch (error) {
            console.error('Failed to toggle user block:', error);
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to permanently delete ${user.firstName} ${user.lastName}? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.delete(`/user/${user._id}`);
            // Remove from list
            setUsers(prev => prev.filter(u => u._id !== user._id));
            // Close modal if viewing this user
            if (selectedUser && selectedUser._id === user._id) {
                setSelectedUser(null);
            }
            alert('User deleted successfully');
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <PageHeader onBack={() => navigate('/admin')} />

            {/* Filters */}
            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterRole={filterRole}
                setFilterRole={setFilterRole}
            />

            {loading ? (
                <div className="text-center py-20 text-gray-400 font-medium">Loading users...</div>
            ) : (
                <UsersTable 
                    users={filteredUsers} 
                    onUserClick={handleUserClick}
                    onBlockUser={handleBlockUser}
                    onDeleteUser={handleDeleteUser}
                    currentUserId={currentUserId}
                />
            )}

            {/* User Profile Modal */}
            {selectedUser && (
                <UserProfileModal 
                    user={selectedUser} 
                    onClose={handleCloseModal}
                    onBlockUser={handleBlockUser}
                    onDeleteUser={handleDeleteUser}
                    isAdmin={true}
                    currentUserId={currentUserId}
                />
            )}
        </div>
    );
};

export default AdminUsers;
