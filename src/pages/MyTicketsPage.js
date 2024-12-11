import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Typography,
  Button,
  Modal,
  Empty,
  Row,
  Col,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  QrcodeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
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
      const sortedTickets = savedTickets.sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );
      setTickets(savedTickets);
    };

    if (bookingDetails) {
      // Kiểm tra xem vé đã tồn tại chưa
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
          finalAmount: bookingDetails.finalAmount, // Thêm thành tiền cuối cùng
          promotion: bookingDetails.promotion,
          // status: bookingDetails.paymentStatus,
          customerInfo: bookingDetails.customerInfo,
          bookingDate: new Date().toISOString(),
        };

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="mr-4"
            size="large"
          >
            Quay lại
          </Button>
          <Title level={2} className="mb-0">
            Vé của tôi
          </Title>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <Empty
              description={
                <span className="text-lg text-gray-500">
                  Bạn chưa có vé nào
                </span>
              }
            />
          </div>
        ) : (
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={tickets}
            renderItem={(ticket) => (
              <List.Item>
                <Card
                  className="ticket-card hover:shadow-lg transition-shadow duration-300"
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        {ticket.id}
                      </span>
                      {/* <Button
                        type="primary"
                        icon={<QrcodeOutlined />}
                        onClick={() => showQRCode(ticket.id)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Hiển thị QR
                      </Button> */}
                    </div>
                  }
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <EnvironmentOutlined className="text-blue-500 mr-2 text-xl" />
                          <div>
                            <Text strong className="block">
                              Chuyến xe:
                            </Text>
                            <Text className="text-gray-600">
                              {ticket.tripInfo.departureStation} -{" "}
                              {ticket.tripInfo.destinationStation}
                            </Text>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <UserOutlined className="text-green-500 mr-2 text-xl" />
                          <div>
                            <Text strong className="block">
                              Thông tin khách hàng:
                            </Text>
                            <Text className="text-gray-600">
                              {ticket.customerInfo.name} -{" "}
                              {ticket.customerInfo.phone}
                            </Text>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <ClockCircleOutlined className="text-orange-500 mr-2 text-xl" />
                          <div>
                            <Text strong className="block">
                              Thời gian:
                            </Text>
                            <Text className="text-gray-600">
                              Khởi hành:{" "}
                              {formatDate(ticket.tripInfo.departureTime)}
                            </Text>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CalendarOutlined className="text-purple-500 mr-2 text-xl" />
                          <div>
                            <Text strong className="block">
                              Ngày đặt vé:
                            </Text>
                            <Text className="text-gray-600">
                              {formatDate(ticket.bookingDate)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <div className="space-y-4">
                        <div>
                          <Text strong className="block">
                            Số ghế:
                          </Text>
                          <Text className="text-gray-600">
                            {ticket.seatNumbers.join(", ")}
                          </Text>
                        </div>

                        <Divider className="my-3" />

                        <div>
                          <Text strong className="block">
                            Tổng tiền:
                          </Text>
                          <Text className="text-gray-600">
                            {ticket.totalAmount.toLocaleString()} VNĐ
                          </Text>
                        </div>

                        {ticket.promotion && (
                          <div>
                            <Text strong className="block">
                              Khuyến mãi:
                            </Text>
                            <Text className="text-green-600">
                              {ticket.promotion.promotionCode}
                            </Text>
                            <Text className="block text-gray-600">
                              Giảm giá:{" "}
                              {ticket.promotion.discountAmount?.toLocaleString() ||
                                "Không có"}{" "}
                              VNĐ
                            </Text>
                          </div>
                        )}

                        <div>
                          <Text strong className="block">
                            Thành tiền:
                          </Text>
                          <Text className="text-2xl text-red-500 font-bold">
                            {ticket.finalAmount?.toLocaleString() ||
                              ticket.totalAmount.toLocaleString()}{" "}
                            VNĐ
                          </Text>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        )}

        <Modal
          title={
            <Text strong className="text-lg">
              Mã QR Vé
            </Text>
          }
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          className="text-center"
        >
          <div className="p-4 bg-gray-50 rounded-lg">
            <QRCodeSVG value={currentQR} size={256} className="mx-auto" />
            <Text className="block mt-4 text-lg">Mã vé: {currentQR}</Text>
          </div>
        </Modal>
      </div>
    </div>

    // <div className="my-tickets-page">
    //   <div className="page-header">
    //     <Button
    //       type="primary"
    //       icon={<ArrowLeftOutlined />}
    //       onClick={handleGoBack}
    //     >
    //       Quay lại
    //     </Button>
    //   </div>

    //   {tickets.length === 0 ? (
    //     <Empty description="Bạn chưa có vé nào" />
    //   ) : (
    //     <List
    //       grid={{ gutter: 16, column: 1 }}
    //       dataSource={tickets}
    //       renderItem={(ticket) => (
    //         <List.Item>
    //           <Card
    //             title={`Vé ${ticket.id}`}
    //             extra={
    //               <Button
    //                 icon={<QrcodeOutlined />}
    //                 onClick={() => showQRCode(ticket.id)}
    //               >
    //                 Hiển thị QR
    //               </Button>
    //             }
    //             className="ticket-card"
    //           >
    //             <div className="ticket-info">
    //               <div className="trip-details">
    //                 <Text strong>Chuyến xe: </Text>
    //                 <Text>
    //                   {ticket.tripInfo.departureStation} -{" "}
    //                   {ticket.tripInfo.destinationStation}
    //                 </Text>
    //               </div>
    //               <div className="customer-details">
    //                 <Text strong>Thông tin khách hàng: </Text>
    //                 <Text>
    //                   {ticket.customerInfo.name} - {ticket.customerInfo.phone}
    //                 </Text>
    //               </div>
    //               <div className="time-details">
    //                 <Text strong>Khởi hành: </Text>
    //                 <Text>{formatDate(ticket.tripInfo.departureTime)}</Text>
    //               </div>
    //               <div className="booking-date">
    //                 <Text strong>Ngày đặt vé: </Text>
    //                 <Text>{formatDate(ticket.bookingDate)}</Text>
    //               </div>
    //               <div className="seat-details">
    //                 <Text strong>Số ghế: </Text>
    //                 <Text>{ticket.seatNumbers.join(", ")}</Text>
    //               </div>
    //               <div className="amount-details">
    //                 <Text strong>Tổng tiền: </Text>
    //                 <Text>{ticket.totalAmount.toLocaleString()} VNĐ</Text>
    //               </div>
    //               {ticket.promotion && (
    //                 <div className="promotion-details">
    //                   <Text strong>Khuyến mãi: </Text>
    //                   <Text>{ticket.promotion.promotionCode}</Text>
    //                   <br />
    //                   <Text strong>Giảm giá: </Text>
    //                   <Text>
    //                     {ticket.promotion.discountAmount
    //                       ? ticket.promotion.discountAmount.toLocaleString()
    //                       : "Không có"}{" "}
    //                     VNĐ
    //                   </Text>
    //                 </div>
    //               )}

    //               <div className="final-amount-details">
    //                 <Text strong>Thành tiền: </Text>
    //                 <Text type="danger">
    //                   {ticket.finalAmount
    //                     ? ticket.finalAmount.toLocaleString()
    //                     : "Không có"}{" "}
    //                   VNĐ
    //                 </Text>
    //               </div>
    //               {/* <div className="status-details">
    //                 <Text strong>Trạng thái: </Text>
    //                 <Tag color="green">{ticket.status}</Tag>
    //               </div> */}
    //             </div>
    //           </Card>
    //         </List.Item>
    //       )}
    //     />
    //   )}

    //   <Modal
    //     title="Mã QR Vé"
    //     visible={isModalVisible}
    //     onCancel={handleModalClose}
    //     footer={null}
    //   >
    //     <div style={{ textAlign: "center" }}>
    //       <QRCodeSVG value={currentQR} size={256} />
    //       <p style={{ marginTop: "16px" }}>Mã vé: {currentQR}</p>
    //     </div>
    //   </Modal>
    // </div>
  );
};

export default MyTicketsPage;
