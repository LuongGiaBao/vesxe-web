import { apiClient } from "../services/apiservices";

// export const FetchDataSchedule = async () => {
//   try {
//     const response = await apiClient.get("/api/bus-schedules?populate=*");
//     return response.data; // Adjust this line if needed
//   } catch (error) {
//     console.error("Error fetching departure options:", error);
//     throw error;
//   }
// };

export const FetchDataSchedule = async ({
  // departure,
  // destination,
  // date,
  name,
}) => {
  try {
    const response = await apiClient.get(`/api/bus-schedules`, {
      params: {
        "filters[departureStation][$eq]": name,
        "filters[destinationStation][$eq]": name,
        // "filters[date][$eq]": date,
        populate: "*", // Sử dụng populate để lấy đầy đủ dữ liệu
      },
    });

    return response.data.data; // Trả về dữ liệu của các chuyến xe
  } catch (error) {
    console.error("Error fetching bus schedules:", error);
    throw error;
  }
};
