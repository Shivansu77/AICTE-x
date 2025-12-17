import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CurriculumDetail from './screens/CurriculumDetail';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import CommunityScreen from './screens/CommunityScreen';

// Layout Wrapper
const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/curriculum" element={<div className="text-center py-20 font-bold text-secondary text-xl">Curriculum Management Coming Soon</div>} /> {/* Reusing Dashboard for now or separate list */}
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
          <Route path="/announcements" element={<AnnouncementsScreen />} />
          <Route path="/community" element={<CommunityScreen />} />
          <Route path="/settings" element={<div className="p-8 font-bold text-secondary">Settings Page Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
