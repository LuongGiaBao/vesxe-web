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

// Lấy thông tin người dùng đã đăng nhập
export const getLoggedInUser = async () => {
  try {
    // Lấy token từ localStorage hoặc nơi bạn lưu trữ nó
    const token = localStorage.getItem("token");

    if (!token) {
      return null; // Không có token, người dùng chưa đăng nhập
    }

    // Gọi API để lấy thông tin người dùng
    const response = await apiClient.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching logged in user:", error);
    return null; // Trả về null nếu có lỗi
  }
};

export const changeUserRole = async (id, role) => {
  try {
    const response = await apiClient.put(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleUserStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/users/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
