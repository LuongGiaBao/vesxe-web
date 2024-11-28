import { apiClient } from "../services/apiservices";

export const fetchAllEmployeeReport = async () => {
  try {
    const response = await apiClient.get("/employee-sales?populate=*");
    console.log(response.data);

    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error fetching drop points:", error);
    throw error; // Ném lỗi nếu có
  }
};
