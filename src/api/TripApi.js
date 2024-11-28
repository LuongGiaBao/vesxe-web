import { message } from "antd";
import { apiClient } from "../services/apiservices";

export const fetchAllTrips = async () => {
  try {
    const response = await apiClient.get("/trips?populate=*"); // Gọi API để lấy danh sách chuyến đi
  

    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error; // Ném lỗi nếu có
  }
};

// Tạo chuyến xe mới
export const createTrip = async (tripData) => {
  try {
    // Send trip data including related fields by their IDs
    const response = await apiClient.post("/trips?populate=*", {
      data: {
        ...tripData,
        // travelTime: tripData.travelTime,
        ticket: tripData.ticketId, // Relational ID for ticket
        MaDiemDon: tripData.pickupPoint, // Relational ID for pickup point
        MaDiemTra: tripData.dropOffPoint, // Relational ID for drop-off point
        departure_location_id: tripData.departureLocationId, // ID cho địa điểm khởi hành
        arrival_location_id: tripData.arrivalLocationId,
      },
    });

    // Log response to check populated relations

    return response.data.data; // Return the created trip data with populated relations
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error; // Rethrow error for handling by caller
  }
};

export const updateTrip = async (tripId, tripData) => {
  try {
    // Tạo cấu trúc dữ liệu cho chuyến đi, bao gồm các quan hệ
    const formattedData = {
      data: {
        ...tripData,
        ticket: tripData.ticketId, // Relational ID for ticket
        MaDiemDon: tripData.pickupPoint, // Relational ID for pickup point
        MaDiemTra: tripData.dropOffPoint, //// Thêm ID điểm trả vào cấu trúc đúng
        departure_location_id: tripData.departureLocationId, // ID cho địa điểm khởi hành
        arrival_location_id: tripData.arrivalLocationId,
      },
    };

    // Gọi API để cập nhật chuyến đi
    const response = await apiClient.put(`/trips/${tripId}`, formattedData);

    // Trả về dữ liệu nhận được từ API
    return response.data;
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error; // Ném lỗi nếu có
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const response = await apiClient.delete(`/trips/${tripId}`); // Gọi API để xóa chuyến đi
    return response.data; // Trả về dữ liệu nhận được từ API
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error; // Ném lỗi nếu có
  }
};

export const fetchTripDetails = async (tripId) => {
  try {
    const response = await apiClient.get(
      `/trips/${tripId}?populate=pickup_point,drop_off_point,ticket`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching trip details:", error);
    throw error;
  }
};

export const fetchTripsByCriteria = async ({
  departureId,
  destinationId,
  date,
}) => {
  try {
    const response = await apiClient.get(`/trips`, {
      params: {
        populate: "*",
        "filters[departure_location_id][id][$eq]": departureId,
        "filters[arrival_location_id][id][$eq]": destinationId,
        "filters[departureTime][$gte]": date,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};
