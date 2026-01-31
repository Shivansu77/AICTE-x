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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Using the specific endpoints or the new generic one based on needs.
                // Since we added /user/all, let's try to use that if possible, or combine.
                // Assuming /user/all was added as per plan.
                const response = await api.get('/user/all');
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users", error);
                // Fallback if /all fails during dev hot reload or if not ready
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
                <UsersTable users={filteredUsers} onUserClick={handleUserClick} />
            )}

            {/* User Profile Modal */}
            {selectedUser && (
                <UserProfileModal user={selectedUser} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AdminUsers;
