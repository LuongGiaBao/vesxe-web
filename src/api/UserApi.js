import { apiClient } from "../services/apiservices";

// Lấy tất cả người dùng
export const fetchAllUsers = async () => {
  try {
    const response = await apiClient.get("/users?populate=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Tạo người dùng mới
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", {
      data: userData,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Cập nhật người dùng
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, {
      data: userData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (id) => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
