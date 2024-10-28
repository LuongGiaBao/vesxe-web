import { apiClient } from "../services/apiservices";

export const loginAdmin = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/local', {
        identifier: email,
        password: password,
      });
  
      // Kiểm tra xem phản hồi có thành công không
      if (response.status === 200) {
        // Trả về token và thông tin người dùng
        return {
          token: response.data.jwt,
          user: response.data.user,
        };
      } else {
        throw new Error('Đăng nhập không thành công');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.message);
      throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
  };