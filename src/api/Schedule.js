import { apiClient } from "../services/apiservices";

export const FetchDataSchedule = async () => {
  try {
    const response = await apiClient.get("/api/bus-schedules");
    return response.data; // Adjust this line if needed
  } catch (error) {
    console.error("Error fetching departure options:", error);
    throw error;
  }
};
