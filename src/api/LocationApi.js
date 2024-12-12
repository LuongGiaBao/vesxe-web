import { apiClient } from "../services/apiservices";

// Lấy tất cả các địa điểm
export const fetchAllLocations = async () => {
  try {
    const response = await apiClient.get("/locations?populate=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

// Thêm địa điểm
export const createLocation = async (locationData) => {
  try {
    const response = await apiClient.post("/locations", { data: locationData });
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

// Cập nhật địa điểm
export const updateLocation = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/locations/${id}`, { data: updatedData });
    return response.data;
  } catch (error) {
    console.error("Error updating location:", error);
    throw error;
  }
};

// Xóa địa điểm
export const deleteLocation = async (id) => {
  try {
    await apiClient.delete(`/locations/${id}`);
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};
