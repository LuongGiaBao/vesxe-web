import { apiClient } from "../services/apiservices";


export const FetchTrips = async (departureId, destinationId, seatsLeft) => {
  try {
    const response = await apiClient.get("/api/bus-schedules", {
      params: {
        populate: ["departure", "destination"], // Populate cả departure và destination
        filters: {
          departure: {
            id: departureId, // Lọc theo departure id
          },
          destination: {
            id: destinationId, // Lọc theo destination id
          },
          seatsLeft: {
            $gte: seatsLeft, // Lọc theo số lượng ghế còn trống
          },
        },
      },
    });

    // Map lại dữ liệu response theo cấu trúc mong muốn
    const trips = response.data.data.map((trip) => ({
      id: trip.documentId, // Sử dụng documentId làm id cho chuyến xe
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      seatsLeft: trip.seatsLeft,
      price: trip.price,
      type: trip.type,
      seatClass: trip.seatClass,
      departure: {
        id: trip.departure.id, // Sử dụng id của điểm đi
        name: trip.departure.name.trim(),
      },
      destination: {
        id: trip.destination.id, // Sử dụng id của điểm đến
        name: trip.destination.name.trim(),
      },
    }));

    return trips;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};


// export const FetchDataSchedule = async () => {
//   try {
//     const response = await apiClient.get("/api/bus-schedules?populate=*");
   
//     return response.data; // Adjust this line if needed
//   } catch (error) {
//     console.error("Error fetching departure options:", error);
//     throw error;
//   }
// };

// export const FetchDataSchedule = async ({
//   // departure,
//   // destination,
//   // date,
//   name,
// }) => {
//   try {
//     const response = await apiClient.get(`/api/bus-schedules`, {
//       params: {
//         "filters[departureStation][$eq]": name,
//         "filters[destinationStation][$eq]": name,
//         // "filters[date][$eq]": date,
//         populate: "*", // Sử dụng populate để lấy đầy đủ dữ liệu
//       },
//     });

//     return response.data.data; // Trả về dữ liệu của các chuyến xe
//   } catch (error) {
//     console.error("Error fetching bus schedules:", error);
//     throw error;
//   }
// };
