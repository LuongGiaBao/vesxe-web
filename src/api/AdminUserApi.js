// src/api/AdminUserApi.js
import axios from "axios";
import { apiClient } from "../services/apiservices";

const BASE_URL = "http://localhost:1337/admin"; // Điều chỉnh URL Strapi admin

// Cấu hình Axios với token
const adminAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token
adminAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch tất cả users
export const fetchAllAdminUsers = async () => {
  try {
    const response = await apiClient.get("/employees", {
      params: {
        populate: ["users_permissions_user"], // Populate thông tin admin user
      },
    });
    return response.data.data.map((item) => ({
      id: item.id,
      ...item.attributes,
      type: "Nhân viên",
      confirmed: item.attributes.user?.data?.attributes?.confirmed || true,
    }));
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

// Tạo nhân viên mới
export const createAdminUser = async (userData) => {
  try {
    const response = await apiClient.post("/employees", {
      data: userData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

// Cập nhật nhân viên
export const updateAdminUser = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/employees/${userId}`, {
      data: userData,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating admin user:", error);
    throw error;
  }
};

// Xóa nhân viên
export const deleteAdminUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/employees/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting admin user:", error);
    throw error;
  }
};
// AdminUserApi.js
export const loginAdminUser = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
      type: "Nhân viên", // Xác định loại người dùng
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerAdminUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/local/register", {
      ...userData,
      type: "Nhân viên",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
