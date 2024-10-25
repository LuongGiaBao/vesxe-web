import { apiClient } from "../services/apiservices";

// Lấy tất cả vé
export const fetchAllTickets = async () => {
  try {
    const response = await apiClient.get("/tickets?populate=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Thêm vé
export const createTicket = async (ticketData) => {
  try {
    const response = await apiClient.post("/tickets", { data: ticketData });
    return response.data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

// Cập nhật vé
export const updateTicket = async (id, updatedData) => {
  try {
    const response = await apiClient.put(`/tickets/${id}`, { data: updatedData });
    return response.data;
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

// Xóa vé
export const deleteTicket = async (id) => {
  try {
    await apiClient.delete(`/tickets/${id}`);
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};
