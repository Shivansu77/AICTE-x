import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, Filter, Shield, GraduationCap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase flex items-center gap-1"><Shield size={10} /> Admin</span>;
            case 'teacher':
            case 'faculty':
                return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase flex items-center gap-1"><User size={10} /> Faculty</span>;
            default:
                return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase flex items-center gap-1"><GraduationCap size={10} /> Student</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <header className="mb-8">
                <button onClick={() => navigate('/admin')} className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 mb-4 transition-colors">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">User Management</h1>
                        <p className="text-gray-500 font-medium mt-1">View and manage all registered users.</p>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', 'student', 'teacher', 'admin'].map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${filterRole === role
                                ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {role === 'teacher' ? 'Faculty' : role}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400 font-medium">Loading users...</div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{user.firstName} {user.lastName}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-6 text-sm text-gray-500 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-gray-400 font-medium">
                            No users found matching your filters.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
