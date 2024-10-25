import { apiClient } from "../services/apiservices";

// Lấy tất cả điểm đi
export const fetchAllDropPoint = async () => {
  try {
    const response = await apiClient.get("/drop-off-points?populate=trips");
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error fetching drop points:", error);
    throw error; // Ném lỗi nếu có
  }
};

// Thêm điểm đi
export const createDropPoint = async (dropPoint) => {
  try {
    const response = await apiClient.post("/drop-off-points", {
      data: dropPoint,
    });
    return response.data; // Trả về dữ liệu của điểm đi mới được tạo
  } catch (error) {
    console.error("Error creating drop point:", error);
    throw error; // Ném lỗi nếu có
  }
};

// Cập nhật điểm đi
export const updateDropPoint = async (id, updatedPoint) => {
  try {
    const response = await apiClient.put(`/drop-off-points/${id}`, {
      data: updatedPoint,
    });
    return response.data; // Trả về dữ liệu của điểm đi đã được cập nhật
  } catch (error) {
    console.error("Error updating drop point:", error);
    throw error; // Ném lỗi nếu có
  }
};

// Xóa điểm đi
export const deleteDropPoint = async (id) => {
  try {
    const response = await apiClient.delete(`/drop-off-points/${id}`);
    return response.data; // Trả về dữ liệu đã xóa (nếu cần)
  } catch (error) {
    console.error("Error deleting drop point:", error);
    throw error; // Ném lỗi nếu có
  }
};
