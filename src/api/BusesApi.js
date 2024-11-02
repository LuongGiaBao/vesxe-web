// src/api/BusApi.js
import { apiClient } from "../services/apiservices";

export const fetchAllBuses = async () => {
  try {
    const response = await apiClient.get("/buses?populate=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching buses:", error);
    throw error;
  }
};

export const createBus = async (busData) => {
  try {
    const response = await apiClient.post("/buses", {
      data: busData
    });
    return response.data;
  } catch (error) {
    console.error("Error creating bus:", error);
    throw error;
  }
};

export const updateBus = async (busId, busData) => {
  try {
    const response = await apiClient.put(`/buses/${busId}`, {
      data: busData
    });
    return response.data;
  } catch (error) {
    console.error("Error updating bus:", error);
    throw error;
  }
};

export const deleteBus = async (busId) => {
  try {
    const response = await apiClient.delete(`/buses/${busId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bus:", error);
    throw error;
  }
};