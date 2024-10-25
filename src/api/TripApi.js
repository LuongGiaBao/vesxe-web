import { apiClient } from "../services/apiservices";

export const fetchAllTrips = async () => {
  try {
    const response = await apiClient.get("/trips"); // Gọi API để lấy danh sách chuyến đi
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error; // Ném lỗi nếu có
  }
};
