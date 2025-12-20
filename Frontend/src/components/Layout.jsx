import React from 'react';
import { BookOpen, Home, Settings, User, Bell, LogOut, Megaphone, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

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
  // Safe check for user existence
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || "Faculty";
  const name = user.firstName ? `Dr. ${user.lastName}` : "Faculty";

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Curriculum', path: '/curriculum' },
    { icon: Megaphone, label: 'Announcements', path: '/announcements' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

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
            <div className="w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-sm uppercase">
              {role[0]}
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
        <header className="flex justify-between items-center mb-10 pl-4">
          <div>
            <h2 className="text-4xl font-extrabold text-primary">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <p className="text-secondary font-medium mt-1">Welcome back, get ready to teach!</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-secondary hover:text-accent-blue transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent-peach rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-shadow">
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
