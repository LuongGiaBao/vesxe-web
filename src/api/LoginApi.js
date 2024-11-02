// src/api/LoginApi.js
import { apiClient } from "../services/apiservices";

// Login với email/password
export const loginWithEmail = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/local', {
      identifier: email,
      password: password,
    });

    if (response.status === 200) {
      return {
        token: response.data.jwt,
        user: response.data.user,
      };
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

// Register với email/password và username
export const registerWithEmail = async (email, password, username) => {
  try {
    const response = await apiClient.post('/auth/local/register', {
      username: username, // Sử dụng username được cung cấp
      email: email,
      password: password,
    });

    if (response.status === 200) {
      return {
        token: response.data.jwt,
        user: response.data.user,
      };
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};

// Login với Google
export const loginWithGoogle = async (accessToken) => {
  try {
    const response = await apiClient.get('/auth/google/callback', {
      params: { access_token: accessToken }
    });

    if (response.status === 200) {
      return {
        token: response.data.jwt,
        user: response.data.user,
      };
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập Google thất bại');
  }
};