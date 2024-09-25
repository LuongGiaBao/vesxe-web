import { apiClient } from "../services/apiservices";
export const FetchData = async () => {
  try {
    const response = await apiClient.get("/api/bus-ticket?populate=BusTicket");
    return response.data.data.BusTicket; // Adjust this line if needed
  } catch (error) {
    console.error("Error fetching departure options:", error);
    throw error;
  }
};
