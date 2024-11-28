import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography, Spin, message, Row, Col, Divider } from "antd";
import { CheckCircleOutlined, HomeOutlined, FileTextOutlined } from "@ant-design/icons";
import axios from "axios";
import "../assets/BookingSuccessPage.css";

const { Title, Text } = Typography;

const BookingSuccessPage = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const appTransID = localStorage.getItem("currentAppTransID");
        if (!appTransID) {
          throw new Error("Không tìm thấy mã giao dịch");
        }

        // Kiểm tra trạng thái thanh toán
        const response = await axios.get(
          `http://localhost:5000/payment/status/${appTransID}`
        );

        console.log("Payment status response:", response.data);

        if (response.data.status === "completed") {
          // Thanh toán thành công
          handleSuccessfulBooking({
            ...response.data.bookingDetails,
            paymentStatus: "completed",
          });
          message.success("Thanh toán thành công!");
        } else if (response.data.status === "failed") {
          // Thanh toán thất bại
          message.error("Thanh toán thất bại");
          navigate("/payment"); // Chuyển về trang thanh toán
        } else if (response.data.status === "pending") {
          // Thanh toán đang chờ xử lý
          setBookingDetails({
            ...response.data.bookingDetails,
            paymentStatus: "pending",
          });
          // Tiếp tục kiểm tra sau 5 giây
          setTimeout(checkPaymentStatus, 5000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        message.error("Không thể kiểm tra trạng thái thanh toán");
      } finally {
        setLoading(false);
      }
    };

    // Kiểm tra nếu có dữ liệu từ location state
    if (location.state?.bookingDetails) {
      handleSuccessfulBooking(location.state.bookingDetails);
      setLoading(false);
    } else {
      checkPaymentStatus();
    }
  }, [location.state, navigate]);

  const handleSuccessfulBooking = (bookingData) => {
    try {
      // Tạo ticket mới với thông tin khuyến mãi
      const newTicket = {
        id: generateTicketId(),
        tripInfo: bookingData.tripInfo,
        seatNumbers: bookingData.selectedSeats,
        totalAmount: bookingData.totalAmount,
        finalAmount: bookingData.finalAmount, // Thêm số tiền cuối cùng
        promotion: bookingData.promotion, // Thêm thông tin khuyến mãi
        status: "Đã thanh toán",
        customerInfo: bookingData.customerInfo,
        bookingDate: new Date().toISOString(),
        paymentStatus: "completed",
      };

      // Lưu vào localStorage
      const savedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      const updatedTickets = [...savedTickets, newTicket];
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));

      setBookingDetails(bookingData);

      // Xóa dữ liệu tạm
      localStorage.removeItem("currentAppTransID");
      localStorage.removeItem("pendingBookingDetails");
      localStorage.removeItem("paymentInitiated");

      message.success("Đặt vé thành công!");
    } catch (error) {
      console.error("Error handling successful booking:", error);
      message.error("Có lỗi xảy ra khi lưu thông tin vé");
    }
  };

  const generateTicketId = () => {
    return "TK" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours} giờ ${minutes} phút`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>Đang xử lý thông tin đặt vé...</Text>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>Không tìm thấy thông tin đặt vé</h2>
        <Button onClick={() => navigate("/")}>Quay về trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="booking-success-page bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Result
          status="success"
          icon={<CheckCircleOutlined className="text-green-500 text-6xl" />}
          title={<Title level={2}>Đặt vé thành công!</Title>}
          subTitle={
            <Text className="text-lg">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
            </Text>
          }
        />

        <Card className="mt-8 shadow-lg rounded-lg">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Title level={4} className="mb-4">
                Thông tin chuyến đi
              </Title>
              <div className="space-y-2">
                <Text>
                  <strong>Tuyến xe:</strong>{" "}
                  {bookingDetails.tripInfo.departureStation} -{" "}
                  {bookingDetails.tripInfo.destinationStation}
                </Text>
                <br />
                <Text>
                  <strong>Thời gian khởi hành:</strong>{" "}
                  {formatDateTime(bookingDetails.tripInfo.departureTime)}
                </Text>
                <br />
                <Text>
                  <strong>Số ghế:</strong>{" "}
                  {bookingDetails.selectedSeats.join(", ")}
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} className="mb-4">
                Thông tin hành khách
              </Title>
              <div className="space-y-2">
                <Text>
                  <strong>Họ tên:</strong> {bookingDetails.customerInfo.name}
                </Text>
                <br />
                <Text>
                  <strong>Số điện thoại:</strong>{" "}
                  {bookingDetails.customerInfo.phone}
                </Text>
                <br />
                <Text>
                  <strong>Email:</strong> {bookingDetails.customerInfo.email}
                </Text>
              </div>
            </Col>
          </Row>

          <Divider />

          <Title level={4} className="mb-4">
            Thông tin thanh toán
          </Title>
          <div className="space-y-2">
            <Text>
              <strong>Tổng tiền:</strong>{" "}
              {bookingDetails.totalAmount.toLocaleString()} VNĐ
            </Text>
            {bookingDetails.promotion && (
              <>
                <br />
                <Text>
                  <strong>Mã khuyến mãi:</strong>{" "}
                  {bookingDetails.promotion.promotionCode}
                </Text>
                <br />
                <Text>
                  <strong>Giảm giá:</strong>{" "}
                  {bookingDetails.promotion.discountAmount.toLocaleString()} VNĐ
                </Text>
              </>
            )}
            <br />
            <Text className="text-xl">
              <strong>Thành tiền:</strong>{" "}
              {bookingDetails.finalAmount.toLocaleString()} VNĐ
            </Text>
            <br />
            <Text>
              <strong>Trạng thái:</strong>{" "}
              <span className="text-green-500 font-semibold">
                Đã thanh toán
              </span>
            </Text>
          </div>
        </Card>

        <div className="mt-8 flex justify-center space-x-4">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            size="large"
            onClick={() =>
              navigate("/my-tickets", {
                state: { bookingDetails: bookingDetails },
              })
            }
          >
            Xem vé của tôi
          </Button>
          <Button
            icon={<HomeOutlined />}
            size="large"
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </div>
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
