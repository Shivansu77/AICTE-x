import api from './axios';

// Register user
export const SignUpUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const LoginUser = async (credentials) => {
  try {
    const response = await api.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all students
export const getAllStudents = async () => {
  try {
    const response = await api.get('/user/students');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all teachers
export const getAllTeachers = async () => {
  try {
    const response = await api.get('/user/teachers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const response = await api.get(`/user/role/${role}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};