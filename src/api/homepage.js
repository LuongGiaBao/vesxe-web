import { apiClient } from "../services/apiservices";
export const FetchData = async () => {
  try {
    const response = await apiClient.get("/api/provinces");

    console.log("res", response);

    // Map the response data to extract necessary fields like 'name' and others if needed
    const provinces = response.data.data.map((province) => ({
      id: province.id,
      name: province.name,
      description: province.Description, // or any other fields you want to include
    }));

    return provinces; // Return the array of provinces with necessary attributes
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

// Hàm lấy danh sách bến xe dựa trên tỉnh/thành phố
export const fetchBusStations = async (provinceId) => {
  try {
    const response = await apiClient.get(
      "/api/bus-stations?populate=provinces",
      {
        params: {
          filters: {
            province: provinceId,
          },
          populate: "*", // Tùy chọn: lấy thông tin liên quan nếu cần
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching bus stations:", error);
    throw error;
  }
};

// Hàm tìm kiếm chuyến xe
export const searchBusTrips = async (
  departureStationId,
  destinationStationId,
  departureDate,
  requiredSeats
) => {
  try {
    const formattedDate = departureDate.toISOString().split("T")[0]; // Định dạng ngày theo YYYY-MM-DD
    const response = await apiClient.get("/api/bus-trips", {
      params: {
        filters: {
          departureStation: departureStationId,
          destinationStation: destinationStationId,
          departureDate: formattedDate,
          availableSeats: {
            $gte: requiredSeats,
          },
        },
        populate: ["departureStation", "destinationStation"], // Lấy thông tin liên quan
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error searching bus trips:", error);
    throw error;
  }
};
