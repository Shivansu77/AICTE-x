import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CurriculumDetail from './screens/CurriculumDetail';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import CommunityScreen from './screens/CommunityScreen';
import ManageCourses from './screens/ManageCourses';
import CourseDetail from './screens/CourseDetail';
import FacultyCourseView from './screens/FacultyCourseView';

import FacultyScreen from './screens/FacultyScreen';

// Layout Wrapper
const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

// Route Handler for /curriculum
const CurriculumRouter = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.role === 'admin' ? <ManageCourses /> : <FacultyScreen />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/curriculum" element={<CurriculumRouter />} />
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
          <Route path="/announcements" element={<AnnouncementsScreen />} />
          <Route path="/community" element={<CommunityScreen />} />

          {/* Admin Routes */}
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/course/:id" element={<CourseDetail />} />

          {/* Faculty Routes */}
          <Route path="/faculty/course/:id" element={<FacultyCourseView />} />

          <Route path="/settings" element={<div className="p-8 font-bold text-secondary">Settings Page Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
