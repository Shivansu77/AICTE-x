import React, { useState, useEffect } from 'react';
import { BookOpen, Home, Settings, User, Bell, LogOut, Megaphone, Users, X, MessageSquare, Info } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import api from '../utils/api';
import { useUser } from '../utils/UserContext';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  return (
    <Link
      to={path}
      className={clsx(
        "flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 font-bold text-lg mb-2",
        active
          ? "bg-white text-primary shadow-sm"
          : "text-secondary hover:bg-white/50 hover:text-primary"
      )}
    >
      <Icon size={24} className={active ? "text-accent-blue" : "text-secondary"} />
      <span>{label}</span>
    </Link>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const role = user.role || "Faculty";
  const title = role === 'teacher' || role === 'faculty' ? 'Dr.' : '';
  const name = user.firstName ? (role === 'admin' ? `${user.firstName} ${user.lastName}` : `${title} ${user.lastName}`).trim() : (role === 'admin' ? 'Admin' : role === 'teacher' || role === 'faculty' ? 'Faculty' : 'Student');

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (role === 'teacher' || role === 'faculty') {
        try {
          const { data } = await api.get('/api/requests/my-requests');
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications", error);
        }
      }
    };
    fetchNotifications();
  }, [role, location.pathname]);

  const baseNavItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Curriculum', path: '/curriculum' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Info, label: 'About Us', path: '/about' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const navItems = role === 'student'
    ? [
        ...baseNavItems.slice(0, 1),
        { icon: MessageSquare, label: 'Contact Administration', path: '/contact' },
        ...baseNavItems.slice(1)
      ]
    : role === 'admin'
    ? [
        ...baseNavItems.slice(0, 1),
        { icon: MessageSquare, label: 'Student Queries', path: '/admin/queries' },
        ...baseNavItems.slice(1)
      ]
    : baseNavItems;

  return (
    <div className="min-h-screen bg-cream flex p-6 gap-6 font-sans text-primary">
      {/* Sidebar */}
      <aside className="w-72 flex flex-col">
        <div className="px-8 py-6 mb-8">
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <span className="text-accent-peach">AICTE</span>
            <span className="text-accent-blue">Unified Portal</span>
          </h1>
        </div>

        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="bg-accent-yellow/20 p-6 rounded-3xl flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-sm uppercase overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                role[0]
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-sm text-secondary opacity-80 capitalize">{role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary mt-2 cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white/50 rounded-[3rem] p-8 shadow-sm border-2 border-white overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-peach/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>

        {/* Top Header */}
        <header className="flex justify-between items-center mb-10 pl-4 z-20 relative">
          <div>
            <h2 className="text-4xl font-extrabold text-primary">
              {user.role === 'student' ? 'Student Portal' : (navItems.find(i => i.path === location.pathname)?.label || 'Dashboard')}
            </h2>
            <p className="text-secondary font-medium mt-1">
              {user.role === 'student' ? 'Welcome back, ready to learn!' : 'Welcome back, get ready to teach!'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-secondary hover:text-accent-blue transition-colors relative"
              >
                <Bell size={22} />
                {notifications.some(r => r.status !== 'pending') && (
                  <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 animate-in slide-in-from-top-4 origin-top-right">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg text-primary">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-secondary hover:text-red-500"><X size={18} /></button>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {notifications.filter(r => r.status !== 'pending').length > 0 ? (
                      notifications.filter(r => r.status !== 'pending').map(req => (
                        <div key={req._id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-l-accent-blue hover:bg-blue-50/50 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-bold text-primary">Request {req.status === 'approved' ? 'Approved' : 'Rejected'}</p>
                            <span className="text-[10px] text-secondary">{new Date(req.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-secondary leading-relaxed">
                            Your request to <b>{req.requestType}</b> has been <span className={`font-bold ${req.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{req.status}</span>.
                          </p>
                          {req.reviewComments && <p className="text-xs text-secondary/70 mt-2 italic">"{req.reviewComments}"</p>}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-secondary">
                        <Bell size={40} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No new notifications.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <User size={20} className="text-secondary" />
              <span className="font-bold">Prof. Profile</span>
              <div className="w-6 h-6 bg-accent-green rounded-full flex items-center justify-center text-[10px] text-white font-bold ml-1">
                BP
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
