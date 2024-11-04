// src/api/PriceDetailApi.js
import { apiClient } from "../services/apiservices";

// Lấy tất cả chi tiết giá
export const fetchAllPriceDetails = async () => {
  try {
    const response = await apiClient.get(
      "/detai-prices?populate[trip][populate][departure_location_id][populate]=*&populate[trip][populate][arrival_location_id][populate]=*"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching price details:", error);
    throw error;
  }
};

// Thêm chi tiết giá
export const createPriceDetail = async (priceDetailData) => {
  try {
    const response = await apiClient.post(
      "/detai-prices?populate[trip][populate][departure_location_id][populate]=*&populate[trip][populate][arrival_location_id][populate]=*",
      {
        data: {
          ...priceDetailData,
          // trip: priceDetailData.tripId, // Thêm ID chuyến đi vào dữ liệu
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating price detail:", error);
    throw error;
  }
};

// Cập nhật chi tiết giá
export const updatePriceDetail = async (id, priceDetailData) => {
  try {
    const response = await apiClient.put(`/detai-prices/${id}`, {
      data: {
        ...priceDetailData,
        // trip: priceDetailData.tripId, // Thêm ID chuyến đi vào dữ liệu
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating price detail:", error);
    throw error;
  }
};

// Xóa chi tiết giá
export const deletePriceDetail = async (id) => {
  try {
    await apiClient.delete(`/detai-prices/${id}`);
  } catch (error) {
    console.error("Error deleting price detail:", error);
    throw error;
  }
};

// Lấy chi tiết giá theo ID
export const getPriceDetailById = async (id) => {
  try {
    const response = await apiClient.get(`/detai-prices/${id}?populate=*`);
    return response.data;
  } catch (error) {
    console.error("Error fetching price detail:", error);
    throw error;
  }
};

// Lấy chi tiết giá theo ID bảng giá
export const getPriceDetailsByPriceId = async (priceId) => {
  try {
    const response = await apiClient.get(
      `/detai-prices?filters[price][id]=${priceId}&populate=*`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching price details by price ID:", error);
    throw error;
  }
};

// Lấy chi tiết giá theo ID chuyến đi
export const getPriceDetailsByTripId = async (tripId) => {
  try {
    const response = await apiClient.get(
      `/detai-prices?filters[trip][id]=${tripId}&populate=*`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching price details by trip ID:", error);
    throw error;
  }
};
