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
      const storedBookingDetails = localStorage.getItem(
        "pendingBookingDetails"
      );
      if (storedBookingDetails) {
        try {
          const parsedDetails = JSON.parse(storedBookingDetails);
          setBookingDetails(parsedDetails);
        } catch (error) {
          console.error("Error parsing booking details:", error);
          message.error("Có lỗi khi tải thông tin đặt vé");
        }
      }
    };

    loadBookingDetails();
  }, [location.state]);

  const handleBack = () => {
    navigate(-1);
  };

  // const handlePayment = async () => {
  //   const user = JSON.parse(localStorage.getItem("user"));

  //   if (!user) {
  //     localStorage.setItem(
  //       "pendingBookingDetails",
  //       JSON.stringify(bookingDetails)
  //     );
  //     message.warning("Vui lòng đăng nhập trước khi thực hiện thanh toán.");
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // Tính toán số tiền cuối cùng sau khi áp dụng khuyến mãi
  //     const finalAmount = bookingDetails.promotion
  //       ? bookingDetails.totalAmount - bookingDetails.promotion.discountAmount
  //       : bookingDetails.totalAmount;

  //     const response = await axios.post("http://localhost:5000/payment", {
  //       amount: finalAmount,
  //       userId: bookingDetails.customerInfo.email,
  //       description: `Thanh toán vé xe từ ${bookingDetails.tripInfo.departureStation} đến ${bookingDetails.tripInfo.destinationStation}`,
  //       bookingDetails: {
  //         ...bookingDetails,
  //         finalAmount: finalAmount,
  //         promotionDetails: bookingDetails.promotion
  //           ? {
  //               promotionId: bookingDetails.promotion.promotionId,
  //               promotionCode: bookingDetails.promotion.promotionCode,
  //               discountAmount: bookingDetails.promotion.discountAmount,
  //               description: bookingDetails.promotion.description,
  //             }
  //           : null,
  //       },
  //     });

  //     if (
  //       response.data &&
  //       response.data.order_url &&
  //       response.data.appTransID
  //     ) {
  //       localStorage.setItem("currentAppTransID", response.data.appTransID);
  //       localStorage.setItem("paymentInitiated", "true");

  //       const updatedBookingDetails = {
  //         ...bookingDetails,
  //         paymentStatus: "pending",
  //         appTransID: response.data.appTransID,
  //         finalAmount: finalAmount,
  //       };
  //       localStorage.setItem(
  //         "bookingDetails",
  //         JSON.stringify(updatedBookingDetails)
  //       );

  //       const paymentWindow = window.open(response.data.order_url, "_blank");

  //       const checkPaymentStatus = setInterval(async () => {
  //         try {
  //           const statusResponse = await axios.get(
  //             `http://localhost:5000/payment/status/${response.data.appTransID}`
  //           );
  //           if (statusResponse.data.status === "completed") {
  //             clearInterval(checkPaymentStatus);
  //             message.success("Thanh toán thành công!");
  //             navigate("/booking-success", {
  //               state: { bookingDetails: statusResponse.data.bookingDetails },
  //             });
  //           } else if (statusResponse.data.status === "failed") {
  //             clearInterval(checkPaymentStatus);
  //             message.error("Thanh toán thất bại. Vui lòng thử lại.");
  //           }
  //         } catch (error) {
  //           console.error("Error checking payment status:", error);
  //         }
  //       }, 5000);

  //       return () => clearInterval(checkPaymentStatus);
  //     } else {
  //       throw new Error("Invalid payment response");
  //     }
  //   } catch (error) {
  //     console.error("Payment error:", error);
  //     message.error("Có lỗi xảy ra khi tạo yêu cầu thanh toán");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
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
      // Tính toán số tiền cuối cùng sau khi áp dụng khuyến mãi
      const finalAmount = bookingDetails.promotion
        ? bookingDetails.totalAmount - bookingDetails.promotion.discountAmount
        : bookingDetails.totalAmount;
  
      const response = await axios.post("http://localhost:5000/payment", {
        amount: finalAmount,
        userId: bookingDetails.customerInfo.email,
        description: `Thanh toán vé xe từ ${bookingDetails.tripInfo.departureStation} đến ${bookingDetails.tripInfo.destinationStation}`,
        bookingDetails: {
          ...bookingDetails,
          finalAmount: finalAmount,
          promotionDetails: bookingDetails.promotion
            ? {
                promotionId: bookingDetails.promotion.promotionId,
                promotionCode: bookingDetails.promotion.promotionCode,
                discountAmount: bookingDetails.promotion.discountAmount,
                description: bookingDetails.promotion.description,
              }
            : null,
        },
      });
  
      if (
        response.data &&
        response.data.order_url &&
        response.data.appTransID
      ) {
        localStorage.setItem("currentAppTransID", response.data.appTransID);
        localStorage.setItem("paymentInitiated", "true");
  
        const updatedBookingDetails = {
          ...bookingDetails,
          paymentStatus: "pending",
          appTransID: response.data.appTransID,
          finalAmount: finalAmount,
        };
        localStorage.setItem(
          "bookingDetails",
          JSON.stringify(updatedBookingDetails)
        );
  
        const paymentWindow = window.open(response.data.order_url, "_blank");
  
        const checkPaymentStatus = setInterval(async () => {
          try {
            const statusResponse = await axios.get(
              `http://localhost:5000/payment/status/${response.data.appTransID}`
            );
            if (statusResponse.data.status === "completed") {
              clearInterval(checkPaymentStatus);
              message.success("Thanh toán thành công!");
  
              // Gọi API để lưu thông tin hóa đơn
             // await saveInvoice(updatedBookingDetails, user);
  
              navigate("/booking-success", {
                state: { bookingDetails: statusResponse.data.bookingDetails },
              });
            } else if (statusResponse.data.status === "failed") {
              clearInterval(checkPaymentStatus);
              message.error("Thanh toán thất bại. Vui lòng thử lại.");
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
          }
        }, 5000);
  
        return () => clearInterval(checkPaymentStatus);
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
  
  // const saveInvoice = async (bookingDetails, user) => {
  //   try {
  //     const invoiceData = {
  //       customerId: user.id,
  //       employeeId: null, // Nếu có nhân viên hỗ trợ, thêm mã nhân viên
  //       scheduleId: bookingDetails.tripInfo.scheduleId,
  //       paymentMethod: "online", // hoặc các giá trị khác như "cash"
  //       type: "ticket_payment",
  //       status: "completed",
  //       detail_invoices: bookingDetails.selectedSeats.map((seat) => ({
  //         ticketId: seat.ticketId,
  //         detailPriceId: bookingDetails.detailPriceId, // ID chi tiết giá
  //         quantity: 1,
  //         totalPrice: bookingDetails.finalAmount / bookingDetails.selectedSeats.length,
  //       })),
  //     };
  
  //     const response = await axios.post("http://localhost:5000/invoices", invoiceData);
  
  //     if (response.status === 201) {
  //       message.success("Hóa đơn đã được lưu thành công.");
  //     } else {
  //       throw new Error("Error saving invoice");
  //     }
  //   } catch (error) {
  //     console.error("Error saving invoice:", error);
  //     message.error("Có lỗi xảy ra khi lưu hóa đơn.");
  //   }
  // };
  
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
          <div className="no-booking">Không tìm thấy thông tin đặt vé</div>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours} giờ ${minutes} phút`;
  };

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
                  <strong>Thời gian khởi hành :</strong>{" "}
                  {formatDateTime(bookingDetails.tripInfo.departureTime)}
                </p>
                <p>
                  <strong>Số ghế:</strong>{" "}
                  {bookingDetails.selectedSeats.join(", ")}
                </p>
              </div>
            </div>

            <div className="customer-info">
              <h2>Thông tin khách hàng</h2>
              <div className="info-box">
                <p>
                  <strong>Họ tên:</strong> {bookingDetails.customerInfo.name}
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
              {bookingDetails.promotion && (
                <>
                  <p>
                    <strong>Mã khuyến mãi:</strong>{" "}
                    {bookingDetails.promotion.promotionCode}
                  </p>
                  <p>
                    <strong>Giảm giá:</strong>{" "}
                    {bookingDetails.promotion.discountAmount.toLocaleString()}đ
                  </p>
                  <p className="final-amount">
                    <strong>Thành tiền:</strong>{" "}
                    {(
                      bookingDetails.totalAmount -
                      bookingDetails.promotion.discountAmount
                    ).toLocaleString()}
                    đ
                  </p>
                </>
              )}
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
