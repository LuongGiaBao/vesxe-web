import { apiClient } from "../services/apiservices";

// Lấy tất cả giá
export const fetchAllPrices = async () => {
  try {
    const response = await apiClient.get("/ticket-prices?populate=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
};

// Thêm giá
export const createPrice = async (priceData) => {
  try {
    const response = await apiClient.post("/ticket-prices", { data: priceData });
    return response.data;
  } catch (error) {
    console.error("Error creating price:", error);
    throw error;
  }
};

// Cập nhật giá
export const updatePrice = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/ticket-prices/${id}`, { data: updatedData });
    return response.data;
  } catch (error) {
    console.error("Error updating price:", error);
    throw error;
  }
};

// Xóa giá
export const deletePrice = async (id) => {
  try {
    await apiClient.delete(`/ticket-prices/${id}`);
  } catch (error) {
    console.error("Error deleting price:", error);
    throw error;
  }
};
