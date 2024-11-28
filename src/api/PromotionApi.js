import { apiClient } from "../services/apiservices";

// Lấy tất cả khuyến mãi
export const fetchAllPromotions = async () => {
  try {
    const response = await apiClient.get(
      "/promotions?populate[detail_promotions][populate][trip][populate]=*&populate[detai_prices][populate]=*"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

// Thêm khuyến mãi
export const createPromotion = async (promotionData) => {
  try {
    const response = await apiClient.post(
      "/promotions?populate[detail_promotions][populate][trip][populate]=*&populate[detai_prices][populate]=*",
      { data: promotionData }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating promotion:", error);
    throw error;
  }
};

// Cập nhật khuyến mãi
export const updatePromotion = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/promotions/${id}`, {
      data: updatedData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating promotion:", error);
    throw error;
  }
};

// Xóa khuyến mãi
export const deletePromotion = async (id) => {
  try {
    await apiClient.delete(`/promotions/${id}`);
  } catch (error) {
    console.error("Error deleting promotion:", error);
    throw error;
  }
};
