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

// PriceDetailApi.js
// export const checkDuplicatePriceDetail = async (maChiTietGia, tripId, gia) => {
//   try {
//     // Truy vấn API với các bộ lọc cho MaChiTietGia, Gia và tripId
//     const response = await apiClient.get(
//       `/detai-prices?filters[MaChiTietGia][$eq]=${maChiTietGia}&filters[Gia][$eq]=${gia}&filters[trip][id][$eq]=${tripId}`
//     );
//     const data = await response.json();

//     // Kiểm tra xem có bản ghi nào trùng lặp không
//     const isDuplicate = data.data.length > 0;
//     return isDuplicate;
//   } catch (error) {
//     console.error("Error checking for duplicates:", error);
//     return false; // Trả về false nếu có lỗi
//   }
// };

export const checkDuplicatePriceDetail = async (maChiTietGia, tripId, gia) => {
  try {
    const response = await apiClient.get(`/detai-prices`, {
      params: {
        populate: {
          trip: {
            populate: ["departure_location_id", "arrival_location_id"],
          },
        },
        filters: {
          MaChiTietGia: { $eq: maChiTietGia },
          Gia: { $eq: gia },
          "trip.id": { $eq: tripId },
        },
      },
    });

    // Kiểm tra trạng thái API
    if (response.status !== 200) {
      console.error("Failed to fetch data:", response);
      return false;
    }

    const data = response.data?.data || []; // Lấy mảng `data` từ phản hồi

    // Kiểm tra trùng lặp
    const isDuplicate = data.some((item) => {
      const tripData = item.attributes.trip.data;
      return (
        item.attributes.MaChiTietGia === maChiTietGia &&
        item.attributes.Gia === gia &&
        tripData &&
        tripData.id === tripId
      );
    });

    return isDuplicate;
  } catch (error) {
    console.error("Error checking for duplicates:", error);
    return false; // Trả về false nếu gặp lỗi
  }
};
