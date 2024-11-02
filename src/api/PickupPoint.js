// src/api/PickupPoint.js
import { apiClient } from "../services/apiservices";

export const fetchAllPickupPoint = async () => {
  try {
    const response = await apiClient.get("/pickup-points?populate=trips");
    return response.data;
  } catch (error) {
    console.error("Error fetching pickup points:", error);
    throw error;
  }
};

export const createPickupPoint = async (pickupPoint) => {
  try {
    const response = await apiClient.post("/pickup-points", {
      data: pickupPoint,
    });
    return response.data;

  } catch (error) {
    console.error("Error creating pickup point:", error);
    throw error;
  }
};

export const updatePickupPoint = async (id, updatedPoint) => {
  try {
    const response = await apiClient.put(`/pickup-points/${id}`, {
      data: updatedPoint,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating pickup point:", error);
    throw error;
  }
};

export const deletePickupPoint = async (id) => {
  try {
    const response = await apiClient.delete(`/pickup-points/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pickup point:", error);
    throw error;
  }
};
