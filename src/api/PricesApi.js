import { apiClient } from "../services/apiservices";

// Lấy tất cả giá
export const fetchAllPrices = async () => {
  try {
    const response = await apiClient.get(
      "/ticket-prices?populate[detai_prices][populate][trip][populate]=*&populate[detai_prices][populate]=*"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
};

// Thêm giá
export const createPrice = async (priceData) => {
  try {
    const response = await apiClient.post(
      "/ticket-prices?populate[detai_prices][populate][trip][populate]=*",
      {
        data: {
          ...priceData,
          // Thêm ID khuyến mãi vào dữ liệu
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating price:", error);
    throw error;
  }
};

// Cập nhật giá
export const updatePrice = async (id, priceData) => {
  try {
    const response = await apiClient.put(`/ticket-prices/${id}`, {
      data: {
        ...priceData,
        // Thêm ID khuyến mãi vào dữ liệu
      },
    });
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
