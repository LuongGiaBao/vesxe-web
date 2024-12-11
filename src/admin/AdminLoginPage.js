// // src/pages/AdminLoginPage.js
// import React, { useState } from "react";
// import "../assets/AdminLoginPage .css";
// import backgroundImage from "../assets/image/banner2.jpg"; // Đảm bảo hình ảnh nền đúng // Đảm bảo hình ảnh nền đúng
// import { loginAdmin } from "../api/LoginApi";
// import { apiClient } from "../services/apiservices";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
// // Import hàm đăng nhập

// const AdminLoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(""); // Thêm trạng thái lỗi
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       // Gọi API đăng nhập
//       const response = await apiClient.post("/auth/local", {
//         identifier: email,
//         password: password,
//       });

//       const { jwt, user } = response.data;

//       // Kiểm tra trạng thái confirmed
//       if (!user.confirmed) {
//         if (!user.isAdmin) {
//           message.warning(
//             "Tài khoản của bạn chưa được xác nhận. Vui lòng kiểm tra email và làm theo hướng dẫn để xác nhận tài khoản. Nếu bạn không nhận được email xác nhận, hãy kiểm tra hộp thư rác hoặc liên hệ với bộ phận hỗ trợ.",
//             10 // Thời gian hiển thị thông báo (giây)
//           );
//         } else {
//           message.warning(
//             "Tài khoản admin chưa được xác nhận. Vui lòng liên hệ với quản trị viên hệ thống để được hỗ trợ.",
//             10
//           );
//         }
//         return;
//       }

//       // Nếu tài khoản đã được xác nhận, lưu token và tên admin
//       localStorage.setItem("token", jwt);
//       localStorage.setItem("adminName", user.username);
//       message.success(
//         `Đăng nhập thành công! Chào mừng bạn trở lại, ${user.username}!`,
//         7
//       );

//       // Chuyển hướng đến trang admin/dashboard
//       navigate("/admin/dashboard");
//     } catch (error) {
//       // Hiển thị thông báo lỗi
//       const errorMessage =
//         error.response?.data?.message ||
//         "Đăng nhập thất bại. Vui lòng thử lại.";
//       alert(errorMessage);
//     }
//   };

//   return (
//     <div
//       className="admin-login-page"
//       style={{ backgroundImage: `url(${backgroundImage})` }}
//     >
//       <div className="admin-login-container">
//         <h2>VESXE - Admin</h2>
//         {error && <p className="error-message">{error}</p>}{" "}
//         {/* Hiển thị thông báo lỗi */}
//         <form onSubmit={handleLogin}>
//           <div className="admin-input-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Nhập email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="admin-input-group">
//             <label htmlFor="password">Mật khẩu</label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Nhập mật khẩu"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" className="admin-login-button">
//             Đăng nhập
//           </button>
//         </form>
//         <div className="admin-forgot-password">
//           <a href="#">Quên mật khẩu?</a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLoginPage;

import React, { useState } from "react";
import "../assets/AdminLoginPage.css";
import backgroundImage from "../assets/image/banner2.jpg";
import { apiClient } from "../services/apiservices";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/local", {
        identifier: email,
        password: password,
      });
      const { jwt, user } = response.data;
      // Kiểm tra xem người dùng có phải là admin không
      if (!user.confirmed) {
        message.warning(
          "Tài khoản của bạn chưa được xác nhận. Vui lòng kiểm tra email."
        );
        return;
      }
      // if (!user.isAdmin) {
      //   message.warning("Bạn không có quyền truy cập vào trang quản trị.");
      //   return;
      // }
      localStorage.setItem("token", jwt);
      localStorage.setItem("adminName", user.username);
      message.success(`Đăng nhập thành công! Chào mừng bạn, ${user.username}!`);
      navigate("/admin/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="admin-login-container">
        <h2>VESXE - Admin</h2>
        <form onSubmit={handleLogin}>
          <div className="admin-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-button">
            Đăng nhập
          </button>
        </form>
        <div className="admin-forgot-password">
          <a href="#">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
