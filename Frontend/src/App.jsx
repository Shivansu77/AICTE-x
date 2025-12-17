import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CurriculumDetail from './screens/CurriculumDetail';

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
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
          <Route path="/curriculum" element={<div className="text-center py-20 font-bold text-secondary text-xl">Curriculum Management Coming Soon</div>} />
          <Route path="/settings" element={<div className="text-center py-20 font-bold text-secondary text-xl">Settings Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
