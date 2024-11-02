// src/pages/MyTicketsPage.js
import React, { useState, useEffect } from "react";
import { Card, List, Typography, Tag, Button, Modal, Empty } from "antd";
import { ArrowLeftOutlined, QrcodeOutlined } from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import "../assets/MyTicketsPage.css";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const MyTicketsPage = () => {
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQR, setCurrentQR] = useState("");
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    const loadTickets = () => {
      const savedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      setTickets(savedTickets);
    };

    if (bookingDetails) {
      // Check if ticket already exists
      const savedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
      const isDuplicate = savedTickets.some(
        (ticket) =>
          ticket.tripInfo.departureStation ===
            bookingDetails.tripInfo.departureStation &&
          ticket.tripInfo.destinationStation ===
            bookingDetails.tripInfo.destinationStation &&
          ticket.tripInfo.departureTime ===
            bookingDetails.tripInfo.departureTime &&
          ticket.seatNumbers.join(",") ===
            bookingDetails.selectedSeats.join(",") &&
          ticket.customerInfo.phone === bookingDetails.customerInfo.phone
      );

      if (!isDuplicate) {
        console.log("BookingDetails before creating ticket:", {
          status: bookingDetails.status,
          paymentStatus: bookingDetails.paymentStatus,
          fullBookingDetails: bookingDetails,
        });
        const newTicket = {
          id: generateTicketId(),
          tripInfo: {
            departureStation: bookingDetails.tripInfo.departureStation,
            destinationStation: bookingDetails.tripInfo.destinationStation,
            departureTime: bookingDetails.tripInfo.departureTime,
            arrivalTime: bookingDetails.tripInfo.arrivalTime,
          },
          seatNumbers: bookingDetails.selectedSeats,
          totalAmount: bookingDetails.totalAmount,
          status: bookingDetails.paymentStatus,
          customerInfo: bookingDetails.customerInfo,
          bookingDate: new Date().toISOString(),
        };
        console.log("New ticket created:", {
          ticketStatus: newTicket.status,
          fullTicket: newTicket
      });
        const updatedTickets = [...savedTickets, newTicket];
        localStorage.setItem("tickets", JSON.stringify(updatedTickets));
        setTickets(updatedTickets);
      } else {
        loadTickets(); // Load existing tickets if duplicate found
      }
    } else {
      loadTickets(); // Load tickets if no new booking details are present
    }
  }, [location.state]);

  const generateTicketId = () => {
    return "TK" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const showQRCode = (ticketId) => {
    setCurrentQR(ticketId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
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

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="my-tickets-page">
      <div className="page-header">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
        >
          Quay lại
        </Button>
      </div>

      {tickets.length === 0 ? (
        <Empty description="Bạn chưa có vé nào" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={tickets}
          renderItem={(ticket) => (
            <List.Item>
              <Card
                title={`Vé ${ticket.id}`}
                extra={
                  <Button
                    icon={<QrcodeOutlined />}
                    onClick={() => showQRCode(ticket.id)}
                  >
                    Hiển thị QR
                  </Button>
                }
                className="ticket-card"
              >
                <div className="ticket-info">
                  <div className="trip-details">
                    <Text strong>Chuyến xe: </Text>
                    <Text>
                      {ticket.tripInfo.departureStation} -{" "}
                      {ticket.tripInfo.destinationStation}
                    </Text>
                  </div>

                  <div className="customer-details">
                    <Text strong>Thông tin khách hàng: </Text>
                    <Text>
                      {ticket.customerInfo.name} - {ticket.customerInfo.phone}
                    </Text>
                  </div>

                  <div className="time-details">
                    <Text strong>Khởi hành: </Text>
                    <Text>{formatDate(ticket.tripInfo.departureTime)}</Text>
                  </div>

                  <div className="booking-date">
                    <Text strong>Ngày đặt vé: </Text>
                    <Text>{formatDate(ticket.bookingDate)}</Text>
                  </div>

                  <div className="seat-details">
                    <Text strong>Số ghế: </Text>
                    <Text>{ticket.seatNumbers.join(", ")}</Text>
                  </div>

                  <div className="amount-details">
                    <Text strong>Tổng tiền: </Text>
                    <Text>{ticket.totalAmount.toLocaleString()} VNĐ</Text>
                  </div>

                  <div className="status-details">
                    <Text strong>Trạng thái: </Text>
                    <Tag color="green">{ticket.status}</Tag>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="Mã QR Vé"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <QRCodeSVG value={currentQR} size={256} />
          <p style={{ marginTop: "16px" }}>Mã vé: {currentQR}</p>
        </div>
      </Modal>
    </div>
  );
};

export default MyTicketsPage;
