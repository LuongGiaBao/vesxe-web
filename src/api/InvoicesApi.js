import { apiClient } from "../services/apiservices";

export const fetchAllInvoices = async () => {
  try {
    const response = await apiClient.get("/invoices?populate=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  try {
    const response = await apiClient.post("/invoices", { data: invoiceData });
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await apiClient.put(`/invoices/${id}`, {
      data: invoiceData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
