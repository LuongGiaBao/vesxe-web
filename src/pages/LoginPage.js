// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";

// import "../assets/AuthPage.css";
// import {
//   loginCustomer,
//   registerCustomer,
//   findCustomerByEmail,
// } from "../api/CustomerApi";

// const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     TenKH: "",
//     Email: "",
//     Password: "",
//     DienThoai: "",
//     DiaChi: "",
//     GioiTinh: "Nam",
//   });

//   // Validate email
//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(String(email).toLowerCase());
//   };

//   // Xử lý đăng nhập
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     if (!validateEmail(formData.Email)) {
//       message.error("Email không hợp lệ");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await loginCustomer(formData.Email, formData.Password);

//       // Lưu thông tin người dùng
//       localStorage.setItem("user", JSON.stringify(response.user));
//       localStorage.setItem("jwt", response.jwt);

//       message.success("Đăng nhập thành công");
//       navigate("/");
//     } catch (error) {
//       message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xử lý đăng ký
//   const handleRegister = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     if (!validateEmail(formData.Email)) {
//       message.error("Email không hợp lệ");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Kiểm tra email đã tồn tại
//       // const existingCustomer = await findCustomerByEmail(formData.Email);
//       // if (existingCustomer) {
//       //   message.error("Email đã được sử dụng");
//       //   setLoading(false);
//       //   return;
//       // }

//       const result = await registerCustomer(formData);

//       // Lưu thông tin người dùng
//       localStorage.setItem("user", JSON.stringify(result.user));
//       localStorage.setItem("customer", JSON.stringify(result.customer));
//       localStorage.setItem("jwt", result.jwt);

//       message.success("Đăng ký thành công");
//       navigate("/");
//     } catch (error) {
//       message.error("Đăng ký thất bại. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xử lý thay đổi form
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Chuyển đổi giữa đăng nhập và đăng ký
//   const handleSwitchMode = () => {
//     setIsLogin(!isLogin);
//     // Reset form
//     setFormData({
//       TenKH: "",
//       Email: "",
//       Password: "",
//       DienThoai: "",
//       DiaChi: "",
//       GioiTinh: "Nam",
//     });
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>

//         <form onSubmit={isLogin ? handleLogin : handleRegister}>
//           {!isLogin && (
//             <>
//               <div className="form-group">
//                 <label>Tên người dùng:</label>
//                 <input
//                   type="text"
//                   name="TenKH"
//                   value={formData.TenKH}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Nhập tên người dùng"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Số điện thoại:</label>
//                 <input
//                   type="tel"
//                   name="DienThoai"
//                   value={formData.DienThoai}
//                   onChange={handleInputChange}
//                   placeholder="Nhập số điện thoại"
//                 />
//               </div>
//             </>
//           )}

//           <div className="form-group">
//             <label>Email:</label>
//             <input
//               type="email"
//               name="Email"
//               value={formData.Email}
//               onChange={handleInputChange}
//               required
//               placeholder="Nhập email"
//             />
//           </div>
//           <div className="form-group">
//             <label>Mật khẩu:</label>
//             <input
//               type="password"
//               name="Password"
//               value={formData.Password}
//               onChange={handleInputChange}
//               required
//               placeholder="Nhập mật khẩu"
//             />
//           </div>
//           <button type="submit" disabled={loading}>
//             {loading
//               ? isLogin
//                 ? "Đang đăng nhập..."
//                 : "Đang đăng ký..."
//               : isLogin
//               ? "Đăng nhập"
//               : "Đăng ký"}
//           </button>
//         </form>
//         <p>
//           {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
//           <span
//             onClick={handleSwitchMode}
//             style={{ cursor: "pointer", color: "blue" }}
//           >
//             {isLogin ? "Đăng ký" : "Đăng nhập"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "../assets/AuthPage.css";
import {
  checkUsernameExists,
  findCustomerByEmail,
  loginCustomer,
  registerCustomer,
} from "../api/CustomerApi";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    TenKH: "",
    Email: "",
    Password: "",
    DienThoai: "",
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // const handleLogin = async (event) => {
  //   event.preventDefault();
  //   setLoading(true);

  //   if (!validateEmail(formData.Email)) {
  //     message.error("Email không hợp lệ");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await loginCustomer(formData.Email, formData.Password);
  //     localStorage.setItem("user", JSON.stringify(response.user));
  //     localStorage.setItem("jwt", response.jwt);

  //     // Lấy thông tin khách hàng dựa trên email
  //     const customer = await findCustomerByEmail(formData.Email); // Bạn cần tạo hàm này trong CustomerApi
  //     localStorage.setItem("customer", JSON.stringify(customer)); // Lưu thông tin khách hàng vào local storage

  //     message.success("Đăng nhập thành công");
  //     navigate("/");
  //   } catch (error) {
  //     message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!validateEmail(formData.Email)) {
      message.error("Email không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      const response = await loginCustomer(formData.Email, formData.Password);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("jwt", response.jwt);

      // Lấy thông tin khách hàng dựa trên email
      const customer = await findCustomerByEmail(formData.Email);
      localStorage.setItem("customer", JSON.stringify(customer)); // Lưu thông tin khách hàng vào local storage

      // Cập nhật thông tin khách hàng vào localStorage
      const customerInfo = {
        name: customer.TenKH, // Giả sử bạn có trường TenKH trong customer
        phone: customer.DienThoai, // Giả sử bạn có trường DienThoai trong customer
        email: customer.Email, // Giả sử bạn có trường Email trong customer
      };
      localStorage.setItem("customerInfo", JSON.stringify(customerInfo));

      message.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!validateEmail(formData.Email)) {
      message.error("Email không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      // Kiểm tra xem tên người dùng đã tồn tại chưa
      const usernameExists = await checkUsernameExists(formData.TenKH);
      console.log("Username exists:", usernameExists);
      if (usernameExists) {
        message.error("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
        setLoading(false);
        return;
      }

      const result = await registerCustomer(
        formData.TenKH,
        formData.Email,
        formData.Password
      ); // Gửi tên người dùng, email và mật khẩu
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("jwt", result.jwt);
      const customerInfo = {
        name: formData.TenKH,
        phone: formData.DienThoai,
        email: formData.Email,
      };
      localStorage.setItem("customerInfo", JSON.stringify(customerInfo));

      message.success("Đăng ký thành công");
      navigate("/"); // Chuyển hướng đến trang profile sau khi đăng ký
    } catch (error) {
      message.error("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      TenKH: "",
      Email: "",
      Password: "",
      DienThoai: "",
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Tên người dùng:</label>
                <input
                  type="text"
                  name="TenKH"
                  value={formData.TenKH}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên người dùng"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="tel"
                  name="DienThoai"
                  value={formData.DienThoai}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleInputChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading
              ? isLogin
                ? "Đang đăng nhập..."
                : "Đang đăng ký..."
              : isLogin
              ? "Đăng nhập"
              : "Đăng ký"}
          </button>
        </form>
        <p>
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <span
            onClick={handleSwitchMode}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
