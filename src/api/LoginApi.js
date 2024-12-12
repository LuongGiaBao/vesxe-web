// src/api/LoginApi.js
import { apiClient } from "../services/apiservices";

export const loginWithEmail = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/local", {
      identifier: email,
      password: password,
    });

    if (response.status === 200) {
      const user = response.data.user;

      // Kiểm tra trạng thái tài khoản
      if (user.confirmed === false) {
        throw new Error(
          "Tài khoản chưa được xác thực. Vui lòng liên hệ quản trị viên."
        );
      }

      if (user.blocked) {
        throw new Error(
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ."
        );
      }

      // Xác định vai trò và quyền
      const userRole = user.confirmed ? "admin" : "customer";

      return {
        token: response.data.jwt,
        user: {
          ...user,
          userRole: userRole,
        },
        redirectPath: getUserRedirectPath(userRole),
      };
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw handleLoginError(error);
  }
};

export const registerWithEmail = async (email, password, username) => {
  try {
    const response = await apiClient.post("/auth/local/register", {
      username: username,
      email: email,
      password: password,
      role: {
        id: 1, // ID của vai trò Authenticated
        name: "Authenticated",
        type: "authenticated",
      },
      // Đặt confirmed là false để chỉ định là khách hàng mới
      confirmed: false,
      blocked: false,

      // Thêm thông tin bổ sung
      registrationSource: "web",
      registrationDate: new Date().toISOString(),
    });

    if (response.status === 200) {
      // Tạo hồ sơ khách hàng
      const customerProfile = await createCustomerProfile(
        response.data.user.id,
        {
          userId: response.data.user.id,
          email: email,
          username: username,
          status: "pending", // Trạng thái chờ xác nhận
          registrationDate: new Date().toISOString(),
        }
      );

      return {
        token: response.data.jwt,
        user: response.data.user,
        customerProfile: customerProfile,
        message: "Tài khoản khách hàng đã được tạo. Vui lòng chờ xác thực.",
      };
    }
  } catch (error) {
    // Xử lý các lỗi đăng ký chi tiết
    console.error("Đăng ký thất bại:", error);

    if (error.response) {
      const errorMessage = error.response.data.error.message;

      if (errorMessage.includes("Email")) {
        throw new Error("Email đã được sử dụng. Vui lòng chọn email khác.");
      } else if (errorMessage.includes("Username")) {
        throw new Error("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
      } else if (errorMessage.includes("Password")) {
        throw new Error("Mật khẩu không đáp ứng yêu cầu. Vui lòng thử lại.");
      } else {
        throw new Error(errorMessage || "Đăng ký thất bại");
      }
    } else {
      throw new Error("Đăng ký thất bại. Vui lòng thử lại.");
    }
  }
};

// Hàm tạo hồ sơ khách hàng chi tiết
const createCustomerProfile = async (userId, customerData) => {
  try {
    const response = await apiClient.post("/customers", {
      data: {
        ...customerData,
        user: userId, // Liên kết với tài khoản người dùng
        status: "pending",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi tạo hồ sơ khách hàng:", error);
    throw new Error("Không thể tạo hồ sơ khách hàng");
  }
};

// Hàm để quản trị viên cập nhật vai trò và quyền
export const updateUserRole = async (userId, roleData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, {
      role: roleData,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Không thể cập nhật vai trò người dùng");
  }
};

export const loginWithGoogle = async (accessToken) => {
  try {
    const response = await apiClient.get("/auth/google/callback", {
      params: { access_token: accessToken },
    });

    if (response.status === 200) {
      return {
        token: response.data.jwt,
        user: response.data.user,
      };
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng nhập Google thất bại"
    );
  }
};
const getUserRedirectPath = (userRole) => {
  switch (userRole) {
    case "admin":
      return "/admin/dashboard";
    case "customer":
      return "/";
  }
};

// Hàm xử lý lỗi đăng nhập
const handleLoginError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return new Error("Thông tin đăng nhập không chính xác");
      case 401:
        return new Error(error.message || "Đăng nhập thất bại");
      default:
        return new Error(error.response.data.message || "Đăng nhập thất bại");
    }
  }
  return error;
};
