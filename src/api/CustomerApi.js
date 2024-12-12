// import { apiClient } from "../services/apiservices";

// // Lấy tất cả khách hàng
// export const fetchAllCustomers = async () => {
//   try {
//     const response = await apiClient.get("/customers?populate=*");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching customers:", error);
//     throw error;
//   }
// };

// // Tạo khách hàng mới
// export const createCustomer = async (customerData) => {
//   try {
//     const response = await apiClient.post("/customers", {
//       data: customerData,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error creating customer:", error);
//     throw error;
//   }
// };

// // Cập nhật khách hàng
// export const updateCustomer = async (id, customerData) => {
//   try {
//     const response = await apiClient.put(`/customers/${id}`, {
//       data: customerData,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error updating customer:", error);
//     throw error;
//   }
// };

// // Đăng nhập khách hàng
// export const loginCustomer = async (email, password) => {
//   try {
//     const response = await apiClient.post("/auth/local", {
//       identifier: email,
//       password: password,
//     });
//     return response.data; // Giả sử API trả về thông tin người dùng
//   } catch (error) {
//     console.error("Error logging in:", error);
//     throw error;
//   }
// };

// // Đăng ký khách hàng

// export const registerCustomer = async (customerData) => {
//   try {
//     // Đăng ký user
//     const userResponse = await apiClient.post("/auth/local/register", {
//       username: customerData.TenKH,
//       email: customerData.Email,
//       password: customerData.Password,
//       role: 3, // Role customer
//       confirmed: true,
//     });

//     // Tạo thông tin khách hàng
//     const customerResponse = await apiClient.post("/customers", {
//       data: {
//         MaKH: `MKH${Math.floor(Math.random() * 1000)}`,
//         TenKH: customerData.TenKH,
//         DienThoai: customerData.DienThoai,
//         DiaChi: customerData.DiaChi,
//         GioiTinh: customerData.GioiTinh || "Nam",
//         user: userResponse.id, // Liên kết với user
//       },
//     });

//     return {
//       user: userResponse,
//       customer: customerResponse.data.data,
//     };
//   } catch (error) {
//     console.error("Registration error:", error);
//     throw error;
//   }
// };

// export const findCustomerByEmail = async (email) => {
//   try {
//     const response = await apiClient.get(
//       `/customers?filters[Email][$eq]=${email}`
//     );
//     return response.data.data.length > 0 ? response.data.data[0] : null;
//   } catch (error) {
//     console.error("Error finding customer:", error);
//     throw error;
//   }
// };

// // Xóa khách hàng
// export const deleteCustomer = async (id) => {
//   try {
//     const response = await apiClient.delete(`/customers/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting customer:", error);
//     throw error;
//   }
// };

import { apiClient } from "../services/apiservices";

// Lấy tất cả khách hàng
export const fetchAllCustomers = async () => {
  try {
    const response = await apiClient.get("/customers?populate=admin_user");
    return response.data?.data?.map((item) => ({
      id: item.id,
      ...item.attributes,
      type: "Khách hàng",
      confirmed: item.attributes.user?.data?.attributes?.confirmed || false,
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post("/customers", {
      data: customerData,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await apiClient.put(`/customers/${customerId}`, {
      data: customerData,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    await apiClient.delete(`/customers/${customerId}`);
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

// CustomerApi.js
export const loginCustomer = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
      type: "customer", // Xác định loại người dùng
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Đăng ký khách hàng
export const registerCustomer = async (username, email, password) => {
  try {
    const response = await apiClient.post("/auth/local/register", {
      username: username,
      email: email,
      password: password,
      type: "customer",
    });
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkUsernameExists = async (username) => {
  try {
    const response = await apiClient.get(
      `users?filters[username][$eq]=${username}`
    ); // Thay đổi endpoint nếu cần
    console.log("Resspon", response.data);

    return response.data.length > 0; // Giả sử API trả về danh sách khách hàng
  } catch (error) {
    throw error;
  }
};

// Đăng ký khách hàng
// export const registerCustomer = async (customerData) => {
//   try {
//     // Đăng ký user
//     const userResponse = await apiClient.post("/auth/local/register", {
//       username: customerData.TenKH,
//       email: customerData.Email,
//       password: customerData.Password,
//       role: 3,
//     });
//     console.log(userResponse);

//     // Tạo thông tin khách hàng
//     const customerResponse = await apiClient.post("/customers", {
//       data: {
//         MaKH: `MKH${Math.floor(Math.random() * 1000)}`,
//         TenKH: customerData.TenKH,
//         Email: customerData.Email,
//         DienThoai: customerData.DienThoai,
//         DiaChi: customerData.DiaChi,
//         GioiTinh: customerData.GioiTinh || "Nam",
//         user: userResponse.data.id, // Liên kết với user
//       },
//     });
//     console.log(customerResponse);

//     return {
//       user: userResponse.data.user,
//       customer: customerResponse.data.data,
//     };
//   } catch (error) {
//     console.error("Registration error:", error);
//     throw error;
//   }
// };

// Tìm kiếm khách hàng theo email
export const findCustomerByEmail = async (email) => {
  try {
    const response = await apiClient.get(
      `/customers?filters[Email][$eq]=${email}`
    );
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error("Error finding customer:", error);
    throw error;
  }
};
