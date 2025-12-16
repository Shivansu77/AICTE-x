// src/utils/AuthUtils.js
import { LoginUser, SignUpUser as RegisterUser } from './UserApi';

// Retrieve stored token synchronously
const getUserToken = () => {
  return localStorage.getItem('token');
};

// Save user and token data in localStorage
const setUser = (data) => {
  try {
    if (!data || !data.token || !data.user) {
      console.error('Invalid auth data received:', data);
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

// Register new user, store token locally, and return user data
const registerUserFunction = async (userData) => {
  const data = await RegisterUser(userData);
  setUser(data);
  return data;
};

// Handle login similarly
const loginUserFunction = async ({ email, password }) => {
  const data = await LoginUser({ email, password });
  setUser(data);
  return data;
};

export { getUserToken, loginUserFunction, registerUserFunction };