import React from 'react';
import { Ban, Trash2, ShieldCheck } from 'lucide-react';
import RoleBadge from './RoleBadge';

const UsersTable = ({ users, onUserClick, onBlockUser, onDeleteUser, currentUserId, showActions = true }) => (
  <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">User</th>
            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Role</th>
            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Joined</th>
            {showActions && (
              <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(user => {
            const isCurrentUser = user._id === currentUserId;
            return (
              <tr 
                key={user._id} 
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-6">
                  <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => onUserClick && onUserClick(user)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 hover:text-accent-blue transition-colors">
                        {user.firstName} {user.lastName}
                        {isCurrentUser && <span className="ml-2 text-xs text-gray-400">(You)</span>}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <RoleBadge role={user.role} />
                </td>
                <td className="p-6">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="p-6 text-sm text-gray-500 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="p-6">
                    {!isCurrentUser && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBlockUser && onBlockUser(user);
                          }}
                          className={`p-2 rounded-xl transition-all ${
                            user.isActive 
                              ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          title={user.isActive ? 'Block User' : 'Unblock User'}
                        >
                          {user.isActive ? <Ban size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser && onDeleteUser(user);
                          }}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {users.length === 0 && (
      <div className="p-12 text-center text-gray-400 font-medium">
        No users found matching your filters.
      </div>
    )}
  </div>
);

export default UsersTable;
