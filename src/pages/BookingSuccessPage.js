import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography, Spin, message } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "../assets/BookingSuccessPage.css";

const { Title, Text } = Typography;

const BookingSuccessPage = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Lấy thông tin từ localStorage
        const appTransID = localStorage.getItem("currentAppTransID");
        const pendingBookingDetails = localStorage.getItem(
          "pendingBookingDetails"
        );

        console.log("AppTransID:", appTransID);
        console.log("Pending Booking Details:", pendingBookingDetails);

        // Nếu không có cả hai thông tin
        if (!appTransID && !pendingBookingDetails) {
          throw new Error("Không tìm thấy thông tin đặt vé");
        }

        // Nếu có pendingBookingDetails, sử dụng nó
        if (pendingBookingDetails) {
          const parsedBookingDetails = JSON.parse(pendingBookingDetails);

          // Nếu có appTransID, kiểm tra trạng thái thanh toán
          if (appTransID) {
            try {
              const response = await axios.get(
                `http://localhost:5000/payment/status/${appTransID}`
              );
              console.log("Payment status response:", response.data);

              if (response.data.status === "success") {
                // Xử lý khi thanh toán thành công
                handleSuccessfulBooking(parsedBookingDetails);
              } else if (response.data.status === "pending") {
                // Xử lý khi thanh toán đang chờ
                // message.warning("Đang chờ xác nhận thanh toán");
                setBookingDetails(parsedBookingDetails);
              } else {
                // Xử lý khi thanh toán thất bại
                throw new Error("Thanh toán thất bại");
              }
            } catch (error) {
              console.error("Error checking payment status:", error);
              message.error("Không thể kiểm tra trạng thái thanh toán");
              // Vẫn hiển thị thông tin đặt vé
              setBookingDetails(parsedBookingDetails);
            }
          } else {
            // Nếu không có appTransID, có thể là đặt vé không qua thanh toán
            handleSuccessfulBooking(parsedBookingDetails);
          }
        } else {
          throw new Error("Không tìm thấy thông tin đặt vé");
        }
      } catch (error) {
        console.error("Error in fetchBookingDetails:", error);
        message.error(
          error.message || "Có lỗi xảy ra khi tải thông tin đặt vé"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleSuccessfulBooking = (bookingData) => {
    try {
      // Tạo ticket mới
      const newTicket = {
        id: generateTicketId(),
        tripInfo: bookingData.tripInfo,
        seatNumbers: bookingData.selectedSeats,
        totalAmount: bookingData.totalAmount,
        status: "Đã thanh toán",
        customerInfo: bookingData.customerInfo,
        bookingDate: new Date().toISOString(),
      };

      // Lưu vào localStorage
      const savedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      const updatedTickets = [...savedTickets, newTicket];
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));

      // Cập nhật state
      setBookingDetails(bookingData);

      // Xóa dữ liệu tạm
      localStorage.removeItem("currentAppTransID");
      localStorage.removeItem("pendingBookingDetails");

      message.success("Đặt vé thành công!");
    } catch (error) {
      console.error("Error handling successful booking:", error);
      message.error("Có lỗi xảy ra khi lưu thông tin vé");
    }
  };

  const generateTicketId = () => {
    return "TK" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewMyTickets = () => {
    if (bookingDetails) {
      navigate("/my-tickets", { state: { bookingDetails } });
    } else {
      navigate("/my-tickets");
    }
  };

  if (!bookingDetails) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Không tìm thấy thông tin đặt vé</h2>
        <Button onClick={() => navigate("/")}>Quay về trang chủ</Button>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Đang tải thông tin đặt vé...</Text>
      </div>
    );
  }

  return (
    <div className="booking-success-page">
      <h1>Đặt vé thành công!</h1>
      <div className="booking-details">
        <h2>Chi tiết đặt vé</h2>
        <div className="trip-info">
          <p>
            <strong>Tuyến xe:</strong>{" "}
            {bookingDetails.tripInfo.departureStation} -{" "}
            {bookingDetails.tripInfo.destinationStation}
          </p>
          <p>
            <strong>Thời gian khởi hành:</strong>{" "}
            {new Date(bookingDetails.tripInfo.departureTime).toLocaleString()}
          </p>
          <p>
            <strong>Số ghế:</strong> {bookingDetails.selectedSeats.join(", ")}
          </p>
        </div>
        <div className="customer-info">
          <h3>Thông tin khách hàng</h3>
          <p>
            <strong>Họ tên:</strong> {bookingDetails.customerInfo.name}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {bookingDetails.customerInfo.phone}
          </p>
          <p>
            <strong>Email:</strong> {bookingDetails.customerInfo.email}
          </p>
        </div>
        <div className="payment-info">
          <h3>Thông tin thanh toán</h3>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            {bookingDetails.totalAmount.toLocaleString()} VNĐ
          </p>
        </div>
      </div>
      <div className="actions">
        {/* <Button type="primary" onClick={handleViewMyTickets}>
          Xem vé của tôi
        </Button> */}
        <Button onClick={() => navigate("/")}>Về trang</Button>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

// BookingSuccessPage.js
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { message } from 'antd';

// const BookingSuccessPage = () => {
//   const [bookingDetails, setBookingDetails] = useState(null);
//   console.log("Current payment status:", bookingDetails.paymentStatus);

//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkPaymentStatus = async () => {
//       const appTransID = localStorage.getItem("currentAppTransID");
//       if (!appTransID) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`http://localhost:5000/payment/status/${appTransID}`);
        
//         if (response.data.bookingDetails) {
//           setBookingDetails(response.data.bookingDetails);
//           localStorage.setItem("bookingDetails", JSON.stringify(response.data.bookingDetails));
          
//           if (response.data.status === "completed") {
//             message.success("Thanh toán thành công!");
//             localStorage.removeItem("currentAppTransID");
//             localStorage.removeItem("paymentInitiated");
//           } else if (response.data.status === "failed") {
//             message.error("Thanh toán thất bại. Vui lòng thử lại.");
//           }
//         }
//       } catch (error) {
//         console.error("Error checking payment status:", error);
//         message.error("Không thể kiểm tra trạng thái thanh toán");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const intervalId = setInterval(checkPaymentStatus, 5000); // Kiểm tra mỗi 5 giây

//     return () => clearInterval(intervalId);
//   }, []);

//   const handleViewTickets = () => {
//     navigate('/my-tickets');
//   };

//   if (loading) {
//     return <div>Đang kiểm tra trạng thái thanh toán...</div>;
//   }

//   if (!bookingDetails) {
//     return <div>Không tìm thấy thông tin đặt vé</div>;
//   }

//   return (
//     <div className="booking-success-page">
//       <h1>Thông tin đặt vé</h1>
//       <div className="booking-details">
        
//         <p><strong>Trạng thái thanh toán:</strong> {bookingDetails.paymentStatus === "completed" ? "Đã thanh toán" : "Đang chờ thanh toán"}</p>
//         <p><strong>Mã đặt vé:</strong> {bookingDetails.appTransID}</p>
//         <p><strong>Tuyến xe:</strong> {bookingDetails.tripInfo.departureStation} - {bookingDetails.tripInfo.destinationStation}</p>
//         <p><strong>Thời gian khởi hành:</strong> {bookingDetails.tripInfo.departureTime}</p>
//         <p><strong>Số ghế:</strong> {bookingDetails.selectedSeats.join(", ")}</p>
//         <p><strong>Tổng tiền:</strong> {bookingDetails.totalAmount.toLocaleString()}đ</p>
//       </div>
//       <button onClick={handleViewTickets}>Xem danh sách vé</button>
//     </div>
//   );
// };

// export default BookingSuccessPage;