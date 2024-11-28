// import { apiClient } from "../services/apiservices";

// // Lấy tất cả chi tiết hóa đơn
// export const fetchAllInvoiceDetails = async () => {
//   try {
//     const response = await apiClient.get(
//       "/detail-invoices?populate=trip,invoice,detai_price"
//     ); // Sử dụng endpoint mới

//     return response.data;
//   } catch (error) {
//     console.error("Error fetching invoice details:", error);
//     throw error;
//   }
// };

// // Tạo chi tiết hóa đơn mới
// export const createInvoiceDetail = async (invoiceDetail) => {
//   try {
//     // Chuẩn bị dữ liệu trực tiếp với các ID
//     const requestData = {
//       data: {
//         MaChiTietHoaDon: invoiceDetail.detailCode, // Mã chi tiết hóa đơn
//         invoice: invoiceDetail.invoiceCode, // ID của hóa đơn
//         trip: invoiceDetail.ticketCode, // ID của chuyến xe
//         detai_price: invoiceDetail.priceDetailCode, // ID của chi tiết giá
//         soluong: invoiceDetail.quantity, // Số lượng
//         tongTien: invoiceDetail.totalAmount, // Tổng tiền
//       },
//     };

//     // Gửi request POST đến API với dữ liệu đã chuẩn bị
//     const response = await apiClient.post(
//       "/detail-invoices?populate=trip,invoice,detai_price",
//       requestData
//     );
//     console.log("response", response);

//     return response.data;
//   } catch (error) {
//     console.error("Error creating invoice detail:", error);
//     throw error;
//   }
// };

// // Cập nhật chi tiết hóa đơn
// // Cập nhật chi tiết hóa đơn
// export const updateInvoiceDetail = async (id, invoiceDetail) => {
//   try {
//     // Chuẩn bị dữ liệu trực tiếp với các ID
//     const requestData = {
//       data: {
//         MaChiTietHoaDon: invoiceDetail.detailCode, // Mã chi tiết hóa đơn
//         invoice: invoiceDetail.invoiceCode, // ID của hóa đơn
//         trip: invoiceDetail.ticketCode, // ID của chuyến xe
//         detai_price: invoiceDetail.priceDetailCode, // ID của chi tiết giá
//         soluong: invoiceDetail.quantity, // Số lượng
//         tongTien: invoiceDetail.totalAmount, // Tổng tiền
//       },
//     };

//     // Gửi request PUT đến API với dữ liệu đã chuẩn bị
//     const response = await apiClient.put(`/detail-invoices/${id}`, requestData); // Sử dụng endpoint mới
//     return response.data;
//   } catch (error) {
//     console.error("Error updating invoice detail:", error);
//     throw error;
//   }
// };

// // Xóa chi tiết hóa đơn
// export const deleteInvoiceDetail = async (id) => {
//   try {
//     const response = await apiClient.delete(`/detail-invoices/${id}`); // Sử dụng endpoint mới
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting invoice detail:", error);
//     throw error;
//   }
// };

import { apiClient } from "../services/apiservices";

// Lấy tất cả chi tiết hóa đơn
export const fetchAllInvoiceDetails = async () => {
  try {
    const response = await apiClient.get(
      "/detail-invoices?populate=trip,invoice,detai_price"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    throw error;
  }
};

// Tạo chi tiết hóa đơn mới
export const createInvoiceDetail = async (invoiceDetail) => {
  try {
    const requestData = {
      data: {
        MaChiTietHoaDon: invoiceDetail.detailCode,
        invoice: invoiceDetail.invoiceCode,
        trip: invoiceDetail.ticketCode,
        detai_price: invoiceDetail.priceDetailCode,
        soluong: invoiceDetail.quantity,
        tongTien: invoiceDetail.totalAmount,
      },
    };
    console.log("requestData", requestData);

    const response = await apiClient.post(
      "/detail-invoices?populate=*",
      requestData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating invoice detail:", error);
    throw error;
  }
};

// Cập nhật chi tiết hóa đơn
export const updateInvoiceDetail = async (id, invoiceDetail) => {
  try {
    const requestData = {
      data: {
        MaChiTietHoaDon: invoiceDetail.detailCode,
        invoice: invoiceDetail.invoiceCode,
        trip: invoiceDetail.ticketCode,
        detai_price: invoiceDetail.priceDetailCode,
        soluong: invoiceDetail.quantity,
        tongTien: invoiceDetail.totalAmount,
      },
    };
    const response = await apiClient.put(`/detail-invoices/${id}`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice detail:", error);
    throw error;
  }
};

// Xóa chi tiết hóa đơn
export const deleteInvoiceDetail = async (id) => {
  try {
    const response = await apiClient.delete(`/detail-invoices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice detail:", error);
    throw error;
  }
};
