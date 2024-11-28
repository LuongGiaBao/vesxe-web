// src/api/PromotionDetailApi.js
import { apiClient } from "../services/apiservices";

// Lấy tất cả chi tiết khuyến mãi
export const fetchAllPromotionDetails = async () => {
  try {
    const response = await apiClient.get(
      "/detail-promotions?populate[trip][populate][departure_location_id][populate]=*&populate[trip][populate][arrival_location_id][populate]=*"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion details:", error);
    throw error;
  }
};

// Thêm chi tiết khuyến mãi
export const createPromotionDetail = async (promotionDetailData) => {
  try {
    const response = await apiClient.post("/detail-promotions", {
      data: {
        MaChiTietKhuyenMai: promotionDetailData.MaChiTietKhuyenMai,
        description: promotionDetailData.description,
        LoaiKhuyenMai: promotionDetailData.LoaiKhuyenMai,
        TongTienHoaDon: promotionDetailData.TongTienHoaDon,
        SoTienTang: promotionDetailData.SoTienTang,
        PhanTramChietKhau: promotionDetailData.PhanTramChietKhau,
        SoTienKhuyenMaiToiDa: promotionDetailData.SoTienKhuyenMaiToiDa,
        promotion: {
          connect: [{ id: promotionDetailData.promotionId }],
        },
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating promotion detail:", error);
    throw error;
  }
};

// Cập nhật chi tiết khuyến mãi
export const updatePromotionDetail = async (id, promotionDetailData) => {
  try {
    const response = await apiClient.put(`/detail-promotions/${id}`, {
      data: {
        ...promotionDetailData,
        // promotion: promotionDetailData.promotionId, // Thêm ID khuyến mãi vào dữ liệu
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating promotion detail:", error);
    throw error;
  }
};

// Xóa chi tiết khuyến mãi
export const deletePromotionDetail = async (id) => {
  try {
    await apiClient.delete(`/detail-promotions/${id}`);
  } catch (error) {
    console.error("Error deleting promotion detail:", error);
    throw error;
  }
};

// Lấy chi tiết khuyến mãi theo ID
export const getPromotionDetailById = async (id) => {
  try {
    const response = await apiClient.get(`/detail-promotions/${id}?populate=*`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion detail:", error);
    throw error;
  }
};

// Lấy chi tiết khuyến mãi theo ID khuyến mãi
export const getPromotionDetailsByPromotionId = async (promotionId) => {
  try {
    const response = await apiClient.get(
      `/detail-promotions?filters[promotion][id]=${promotionId}&populate[trip][populate][departure_location_id][populate]=*&populate[trip][populate][arrival_location_id][populate]=*&populate[promotion][populate]=*`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion details by promotion ID:", error);
    throw error;
  }
};

// Lấy chi tiết khuyến mãi theo ID chuyến đi
export const getPromotionDetailsByTripId = async (tripId) => {
  try {
    const response = await apiClient.get(
      `/detail-promotions?filters[trip][id]=${tripId}&populate[trip][populate][departure_location_id][populate]=*&populate[trip][populate][arrival_location_id][populate]=*&populate[promotion][populate]=*`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion details by trip ID:", error);
    throw error;
  }
};
