import { apiClient } from "../services/apiservices";

export const fetchAllCustomReport = async () => {
  try {
    const response = await apiClient.get("/customers?populate=*");
    console.log(response.data);

    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error fetching drop points:", error);
    throw error; // Ném lỗi nếu có
  }
};
