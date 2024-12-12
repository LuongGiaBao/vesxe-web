import { apiClient } from "../services/apiservices";
export const FetchData = async () => {
  try {
    const response = await apiClient.get("/api/provinces");

    

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

export const FetchProvinces = async () => {
  try {
    const response = await apiClient.get("/api/provinces", {
      params: {
        populate: "*", // Đảm bảo lấy tất cả các trường dữ liệu
      },
    });

    // Lọc và map dữ liệu về định dạng mong muốn
    const provinces = response.data.data.map((province) => ({
      id: province.id, // id của tỉnh
      documentId: province.documentId,
      name: province.name.trim(), // Tên tỉnh
      description: province.Description.trim(), // Mô tả tỉnh
      createdAt: province.createdAt,
      updatedAt: province.updatedAt,
      publishedAt: province.publishedAt,
      chuyenXeDi: province.chuyen_xe_di.map((trip) => ({
        id: trip.id,
        documentId: trip.documentId,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        seatsLeft: trip.seatsLeft,
        price: trip.price,
        type: trip.type,
        seatClass: trip.seatClass,
      })),
      chuyenXeDen: province.chuyen_xe_dens.map((trip) => ({
        id: trip.id,
        documentId: trip.documentId,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        seatsLeft: trip.seatsLeft,
        price: trip.price,
        type: trip.type,
        seatClass: trip.seatClass,
      })),
    }));

    return provinces; // Trả về danh sách các tỉnh
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error; // Ném lỗi ra ngoài
  }
};
export const FetchTrips = async (
  departureId,
  destinationId,
  seatsLeft,
  documentId
) => {
  try {
    const response = await apiClient.get("/api/bus-schedules", {
      params: {
        populate: {
          departure: {
            fields: ["id", "documentId", "name", "Description"],
          },
          destination: {
            fields: ["id", "documentId", "name", "Description"],
          },
        },
      },
    });


    // Map lại dữ liệu response theo cấu trúc mong muốn
    const trips = response.data.data.map((trip) => ({
      id: trip.id,
      documentId: trip.documentId,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      seatsLeft: trip.seatsLeft,
      price: trip.price,
      type: trip.type,
      seatClass: trip.seatClass,
      departure: {
        id: trip.departure.id,
        documentId: trip.departure.documentId,
        name: trip.departure.name.trim(),
        description: trip.departure.Description,
      },
      destination: {
        id: trip.destination.id,
        documentId: trip.destination.documentId,
        name: trip.destination.name.trim(),
        description: trip.destination.Description,
      },
    }));
    // Lọc các chuyến xe có điểm đi hoặc điểm đến là TP. Hồ Chí Minh
    const tripsFromCity = trips.filter(
      (trip) =>
        trip.departure.name.includes("TP. Hồ Chí Minh") ||
        trip.destination.name.includes("TP. Hồ Chí Minh")
    );

    return trips;
  } catch (error) {
    console.error("Error fetching trips:", error);
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
