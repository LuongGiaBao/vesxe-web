import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, Divider } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import "../assets/InvoicePage.css";

const InvoicePage = () => {
  const location = useLocation();
  const { bookingDetails } = location.state || {};
  const invoiceRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="invoice-page">
      <Card className="invoice-container" ref={invoiceRef}>
        

        <Divider />

        <div className="customer-info">
          <h3>THÔNG TIN KHÁCH HÀNG</h3>
          <div className="info-grid">
            <div>
              <p>
                <strong>Họ và tên:</strong> {bookingDetails?.customerInfo?.name}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {bookingDetails?.customerInfo?.phone}
              </p>
            </div>
            <div>
              <p>
                <strong>Email:</strong> {bookingDetails?.customerInfo?.email}
              </p>
              <p>
                <strong>Mã khách hàng:</strong>{" "}
                {bookingDetails?.customerInfo?.id || "KH000000"}
              </p>
            </div>
          </div>
        </div>

        <Divider />

        <div className="trip-details">
          <h3>CHI TIẾT CHUYẾN ĐI</h3>
          <div className="info-grid">
            <div>
              <p>
                <strong>Tuyến xe:</strong>
                {bookingDetails?.tripInfo?.departureStation} -
                {bookingDetails?.tripInfo?.destinationStation}
              </p>
              <p>
                <strong>Thời gian khởi hành:</strong>
                {formatDate(bookingDetails?.tripInfo?.departureTime)}
              </p>
            </div>
            <div>
              <p>
                <strong>Số ghế:</strong>{" "}
                {bookingDetails?.selectedSeats?.join(", ")}
              </p>
              <p>
                <strong>Loại vé:</strong> Vé một chiều
              </p>
            </div>
          </div>
        </div>

        <Divider />

        <div className="payment-details">
          <h3>CHI TIẾT THANH TOÁN</h3>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Mô tả</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vé xe khách</td>
                <td>{bookingDetails?.selectedSeats?.length || 1}</td>
                <td>{formatCurrency(bookingDetails?.tripInfo?.price || 0)}</td>
                <td>{formatCurrency(bookingDetails?.totalAmount || 0)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">
                  <strong>Tổng cộng</strong>
                </td>
                <td>
                  <strong>
                    {formatCurrency(bookingDetails?.totalAmount || 0)}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <Divider />

        <div className="invoice-footer">
          <div className="terms">
            <p>
              <strong>Điều khoản và lưu ý:</strong>
            </p>
            <ul>
              <li>Vui lòng đến trước giờ khởi hành 30 phút</li>
              <li>Mang theo giấy tờ tùy thân khi lên xe</li>
              <li>Hóa đơn đã xuất không được hoàn trả</li>
            </ul>
          </div>
          <div className="signature-section">
            <div className="customer-signature">
              <p>Khách hàng</p>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="company-signature">
              <p>Đại diện công ty</p>
              <p>(Ký và đóng dấu)</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="invoice-actions">
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          className="print-button"
        >
          In hóa đơn
        </Button>
      </div>
    </div>
  );
};

export default InvoicePage;
