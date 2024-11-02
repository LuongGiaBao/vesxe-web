import { apiClient } from "../services/apiservices";

export const fetchAllSeats = async () => {
  try {
    const response = await apiClient.get("/seats?populate=*");
    return response.data; // Đảm bảo trả về dữ liệu đúng
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export const createSeat = async (seatData) => {
  try {
    const response = await apiClient.post("/seats", { data: seatData });
    return response.data; // Trả về dữ liệu ghế đã tạo
  } catch (error) {
    console.error("Error creating seat:", error);
    throw error;
  }
};

export const updateSeat = async (seatId, seatData) => {
  try {
    const response = await apiClient.put(`/seats/${seatId}`, {
      data: seatData,
    });
    return response.data; // Trả về dữ liệu ghế đã cập nhật
  } catch (error) {
    console.error("Error updating seat:", error);
    throw error;
  }
};

export const deleteSeat = async (seatId) => {
  try {
    const response = await apiClient.delete(`/seats/${seatId}`);
    return response.data; // Trả về dữ liệu ghế đã xóa (nếu cần)
  } catch (error) {
    console.error("Error deleting seat:", error);
    throw error;
  }
};
