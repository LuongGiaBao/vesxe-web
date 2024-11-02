

// PaymentPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import "../assets/PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Load booking details from location state or localStorage
  useEffect(() => {
    const loadBookingDetails = () => {
      // First try to get from location state
      if (location.state?.bookingDetails) {
        setBookingDetails(location.state.bookingDetails);
        return;
      }

      // If not in location state, try localStorage
      const storedBookingDetails = localStorage.getItem('pendingBookingDetails');
      if (storedBookingDetails) {
        try {
          const parsedDetails = JSON.parse(storedBookingDetails);
          setBookingDetails(parsedDetails);
        } catch (error) {
          console.error('Error parsing booking details:', error);
          message.error('Có lỗi khi tải thông tin đặt vé');
        }
      }
    };

    loadBookingDetails();
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePayment = async () => {
    const isLoggedIn = localStorage.getItem("token");

    if (!isLoggedIn) {
      // Lưu thông tin đặt vé vào localStorage trước khi chuyển hướng
      localStorage.setItem(
        "pendingBookingDetails",
        JSON.stringify(bookingDetails)
      );
      message.warning("Vui lòng đăng nhập trước khi thực hiện thanh toán.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/payment", {
        amount: bookingDetails.totalAmount,
        userId: bookingDetails.customerInfo.email,
        description: `Thanh toán vé xe từ ${bookingDetails.tripInfo.departureStation} đến ${bookingDetails.tripInfo.destinationStation}`,
        bookingDetails: bookingDetails,
      });

      if (response.data && response.data.order_url && response.data.appTransID) {
        // Lưu thông tin thanh toán
        localStorage.setItem("currentAppTransID", response.data.appTransID);
        localStorage.setItem("paymentInitiated", "true");
        
        const updatedBookingDetails = {
          ...bookingDetails,
          paymentStatus: "pending",
          appTransID: response.data.appTransID
        };
        localStorage.setItem("bookingDetails", JSON.stringify(updatedBookingDetails));
        // Chuyển hướng đến trang thanh toán ZaloPay
        window.location.href = response.data.order_url;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Có lỗi xảy ra khi tạo yêu cầu thanh toán");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="header">
            <button onClick={handleBack} className="back-button">
              Quay lại
            </button>
            <h1>Thanh toán</h1>
          </div>
          <div className="no-booking">
            Không tìm thấy thông tin đặt vé
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="header">
          <button onClick={handleBack} className="back-button">
            Quay lại
          </button>
          <h1>Thanh toán</h1>
        </div>

        <div className="booking-details">
          <div className="trip-content">
            <div className="trip-info">
              <h2>Thông tin chuyến đi</h2>
              <div className="info-box">
                <p>
                  <strong>Điểm đi:</strong>{" "}
                  {bookingDetails.tripInfo.departureStation}
                </p>
                <p>
                  <strong>Điểm đến:</strong>{" "}
                  {bookingDetails.tripInfo.destinationStation}
                </p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {bookingDetails.tripInfo.departureTime}
                </p>
                <p>
                  <strong>Số ghế:</strong> {bookingDetails.selectedSeats.join(", ")}
                </p>
              </div>
            </div>

            <div className="customer-info">
              <h2>Thông tin khách hàng</h2>
              <div className="info-box">
                <p>
                  <strong>Họ tên:</strong>{" "}
                  {bookingDetails.customerInfo.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {bookingDetails.customerInfo.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {bookingDetails.customerInfo.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="payment-info">
            <h2>Thông tin thanh toán</h2>
            <div className="info-box">
              <p className="total-amount">
                <strong>Tổng tiền:</strong>{" "}
                {bookingDetails.totalAmount.toLocaleString()}đ
              </p>
            </div>

            <button
              onClick={handlePayment}
              className="payment-button"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Thanh toán ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;