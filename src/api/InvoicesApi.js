import { apiClient } from "../services/apiservices";

export const fetchAllInvoices = async () => {
  try {
    const response = await apiClient.get(
      "invoices?populate=*,customerId,employeeId,scheduleId,detail_invoices.trip,detail_invoices.detai_price,detail_invoices.invoice"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};
export const createInvoice = async (invoiceData) => {
  try {
    const response = await apiClient.post("/invoices", {
      data: {
        MaHoaDon: invoiceData.MaHoaDon,
        PhuongThucThanhToan: invoiceData.PhuongThucThanhToan,
        status: invoiceData.status,
        customerId: invoiceData.customerId,
        employeeId: invoiceData.employeeId,
        scheduleId: invoiceData.scheduleId,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new Error(`Failed to create invoice: ${error.message}`);
  }
};
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await apiClient.put(`/invoices/${id}`, {
      data: {
        MaHoaDon: invoiceData.MaHoaDon,
        PhuongThucThanhToan: invoiceData.PhuongThucThanhToan,
        status: invoiceData.status,
        customerId: invoiceData.customerId,
        employeeId: invoiceData.employeeId,
        scheduleId: invoiceData.scheduleId,
      },
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
