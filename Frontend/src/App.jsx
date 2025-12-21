import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { UserProvider, useUser } from './utils/UserContext';
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
import AdminUsers from './screens/AdminUsers'; // Import corrected

import FacultyScreen from './screens/FacultyScreen';
import StudentScreen from './screens/StudentScreen';
import SettingsScreen from './screens/SettingsScreen';
import ContactAdministration from './screens/ContactAdministration';
import AdminQueries from './screens/AdminQueries';
import AboutUs from './screens/AboutUs';

// Layout Wrapper
const AppLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

// Route Handler for /
const DashboardRouter = () => {
  return <Dashboard />;
};

// Route Handler for /curriculum
const CurriculumRouter = () => {
  const { user } = useUser();
  if (user.role === 'admin') return <ManageCourses />;
  if (user.role === 'student') return <FacultyScreen />;
  return <FacultyScreen />;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Student Routes (No Layout) */}
          <Route path="/student" element={<StudentScreen />} />
          {/* Student Program View (Reusing Faculty View in Read-Only Mode) */}
          <Route path="/student/course/:id" element={<FacultyCourseView />} />

          {/* Protected Routes with Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardRouter />} />
            <Route path="/curriculum" element={<CurriculumRouter />} />
            <Route path="/curriculum/:id" element={<CurriculumDetail />} />
            <Route path="/announcements" element={<AnnouncementsScreen />} />
            <Route path="/community" element={<CommunityScreen />} />
            <Route path="/contact" element={<ContactAdministration />} />
            <Route path="/about" element={<AboutUs />} />


            {/* Admin Routes */}
            <Route path="/admin/courses" element={<ManageCourses />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/course/:id" element={<CourseDetail />} />
            <Route path="/admin/queries" element={<AdminQueries />} />

            {/* Faculty Routes */}
            <Route path="/faculty/course/:id" element={<FacultyCourseView />} />

            <Route path="/settings" element={<SettingsScreen />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
