import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/SeatSelectionPage.css";
import {
  Button,
  Card,
  message,
  Input,
  Typography,
  Modal,
  List,
  Tag,
} from "antd";
import { createUser, updateUser, getLoggedInUser } from "../api/UserApi";
import { fetchAllPromotions } from "../api/PromotionApi";
import { createCustomer, updateCustomer } from "../api/CustomerApi";

const { Text } = Typography;

const PromotionModal = ({
  visible,
  onClose,
  totalAmount,
  onSelectPromotion,
}) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPromotions();
    }
  }, [visible]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetchAllPromotions();
      const today = new Date();
      const activePromotions = response.data.filter((promotion) => {
        const startDate = new Date(promotion.attributes.startDate);
        const endDate = new Date(promotion.attributes.endDate);
        return (
          promotion.attributes.status === "Hoạt động" &&
          startDate <= today &&
          endDate >= today
        );
      });

      // Tính toán mức giảm giá cho từng khuyến mãi
      const promotionsWithDiscounts = activePromotions.map((promotion) => {
        const detailPromotions = promotion.attributes.detail_promotions.data;
        const maxDiscount = detailPromotions.reduce((max, detail) => {
          const attributes = detail.attributes;
          let discountAmount = 0;

          if (attributes.LoaiKhuyenMai === "Tặng tiền") {
            discountAmount = attributes.SoTienTang;
          } else if (attributes.LoaiKhuyenMai === "Chiết khấu hóa đơn") {
            discountAmount = Math.min(
              (totalAmount * attributes.PhanTramChietKhau) / 100,
              attributes.SoTienKhuyenMaiToiDa || Infinity
            );
          }

          return Math.max(max, discountAmount);
        }, 0);

        return {
          ...promotion,
          maxDiscount,
        };
      });

      // Sắp xếp khuyến mãi theo mức giảm giá từ cao đến thấp
      promotionsWithDiscounts.sort((a, b) => b.maxDiscount - a.maxDiscount);

      setPromotions(promotionsWithDiscounts);
    } catch (error) {
      message.error("Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromotion = (promotion) => {
    const detailPromotions = promotion.attributes.detail_promotions.data;
    const applicablePromotion = detailPromotions.find((detail) => {
      const attributes = detail.attributes;
      return totalAmount >= attributes.TongTienHoaDon;
    });

    if (!applicablePromotion) {
      message.warning("Đơn hàng chưa đạt điều kiện áp dụng khuyến mãi này");
      return;
    }

    const promotionDetail = applicablePromotion.attributes;
    let discountAmount = 0;

    if (promotionDetail.LoaiKhuyenMai === "Tặng tiền") {
      discountAmount = promotionDetail.SoTienTang;
    } else if (promotionDetail.LoaiKhuyenMai === "Chiết khấu hóa đơn") {
      discountAmount = Math.min(
        (totalAmount * promotionDetail.PhanTramChietKhau) / 100,
        promotionDetail.SoTienKhuyenMaiToiDa || Infinity
      );
    }

    onSelectPromotion({
      promotionId: promotion.id,
      discountAmount: discountAmount,
      promotionCode: promotion.attributes.IDPromotion,
      description: promotionDetail.description,
    });

    message.success("Áp dụng mã giảm giá thành công");
    onClose();
  };

  return (
    <Modal
      title="Chọn mã giảm giá"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <List
        loading={loading}
        dataSource={promotions}
        renderItem={(promotion) => {
          const { attributes } = promotion;
          return (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <Tag color="blue">{attributes.IDPromotion}</Tag>
                    <h4>{attributes.description}</h4>
                    <p>
                      Thời gian:{" "}
                      {new Date(attributes.startDate).toLocaleDateString()} -{" "}
                      {new Date(attributes.endDate).toLocaleDateString()}
                    </p>
                    {attributes.detail_promotions.data.map((detail, index) => (
                      <div key={index} style={{ fontSize: "0.9em" }}>
                        <p>
                          •{" "}
                          {detail.attributes.LoaiKhuyenMai === "Tặng tiền"
                            ? `Tặng ${detail.attributes.SoTienTang.toLocaleString()}đ`
                            : `Giảm ${
                                detail.attributes.PhanTramChietKhau
                              }% (tối đa ${detail.attributes.SoTienKhuyenMaiToiDa?.toLocaleString()}đ)`}
                        </p>
                        <p style={{ color: "gray" }}>
                          Áp dụng cho đơn từ{" "}
                          {detail.attributes.TongTienHoaDon.toLocaleString()}đ
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="primary"
                    onClick={() => handleApplyPromotion(promotion)}
                  >
                    Áp dụng
                  </Button>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTrip } = location.state || {};
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const ticketPrice = selectedTrip?.price || 0;
  const totalAmount = selectedSeats.length * ticketPrice;

  useEffect(() => {
    if (!selectedTrip) {
      message.error("Không có thông tin chuyến đi");
      navigate(-1);
      return;
    }

    if (
      !selectedTrip.id ||
      !selectedTrip.departureStation ||
      !selectedTrip.destinationStation
    ) {
      message.error("Thông tin chuyến đi không đầy đủ");
      navigate(-1);
    }
  }, [selectedTrip, navigate]);

  useEffect(() => {
    const checkUserLogin = async () => {
      const loggedInUser = await getLoggedInUser();
      if (loggedInUser) {
        setCurrentUser(loggedInUser);
        setCustomerInfo({
          name: loggedInUser.fullName || "",
          phone: loggedInUser.phone || "",
          email: loggedInUser.email || "",
        });
      }
    };

    checkUserLogin();
  }, []);

  const saveCustomerInfo = async () => {
    try {
      if (currentUser) {
        // Cập nhật thông tin khách hàng nếu đã đăng nhập
        await updateCustomer(currentUser.id, {
          TenKH: customerInfo.name,
          DienThoai: customerInfo.phone,
          Email: customerInfo.email,
        });
      } else {
        // Tạo mới khách hàng nếu chưa đăng nhập
        const newUser = await createCustomer({
          MaKH: `MKH${Math.floor(Math.random() * 1000)}`,
          username: customerInfo.email,
          Email: customerInfo.email,
          TenKH: customerInfo.name,
          DienThoai: customerInfo.phone,
        });
        setCurrentUser(newUser);
      }
      message.success("Thông tin khách hàng đã được lưu");
    } catch (error) {
      console.error("Error saving customer info:", error);
      message.error("Không thể lưu thông tin khách hàng");
    }
  };
  const handleBack = () => {
    navigate(-1);
  };

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((s) => s !== seatNumber)
        : [...prevSeats, seatNumber]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (currentUser) {
      setCurrentUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const renderSeats = () => {
    const totalSeats = selectedTrip?.totalSeats || 34;
    const availableSeats = selectedTrip?.availableSeats || totalSeats;

    const seatsInColumn = [
      { count: 6, seats: [] }, // Column 1
      { count: 5, seats: [] }, // Column 2
      { count: 6, seats: [] }, // Column 3
    ];

    for (let i = 1; i <= 17; i++) {
      let seatNumber;
      if (i <= 6) {
        seatNumber = i;
        const isSelected = selectedSeats.includes(seatNumber);
        seatsInColumn[0].seats.push(
          <Button
            key={`lower-${seatNumber}`}
            className={`seat ${isSelected ? "selected" : "available"}`}
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {"A" + String(seatNumber).padStart(2, "0")}
          </Button>
        );
      } else if (i <= 11) {
        seatNumber = i;
        const isSelected = selectedSeats.includes(seatNumber);
        seatsInColumn[1].seats.push(
          <Button
            key={`lower-${seatNumber}`}
            className={`seat ${isSelected ? "selected" : "available"}`}
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {"A" + String(seatNumber).padStart(2, "0")}
          </Button>
        );
      } else {
        seatNumber = i;
        const isSelected = selectedSeats.includes(seatNumber);
        seatsInColumn[2].seats.push(
          <Button
            key={`lower-${seatNumber}`}
            className={`seat ${isSelected ? "selected" : "available"}`}
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {"A" + String(seatNumber).padStart(2, "0")}
          </Button>
        );
      }
    }

    const upperSeatsInColumn = [
      { count: 6, seats: [] }, // Column 1
      { count: 5, seats: [] }, // Column 2
      { count: 6, seats: [] }, // Column 3
    ];

    for (let i = 1; i <= 17; i++) {
      let seatNumber = i + 17;
      if (i <= 6) {
        const isSelected = selectedSeats.includes(seatNumber);
        upperSeatsInColumn[0].seats.push(
          <Button
            key={`upper-${seatNumber}`}
            className={`seat ${isSelected ? "selected" : "available"}`}
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {"B" + String(i).padStart(2, "0")}
          </Button>
        );
      } else if (i <= 11) {
        const isSelected = selectedSeats.includes(seatNumber);
        upperSeatsInColumn[1].seats.push(
          <Button
            key={`upper-${seatNumber}`}
            className={`seat ${isSelected ? "selected" : "available"}`}
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {"B" + String(i).padStart(2, "0")}
          </Button>
        );
      } else {
        const isSelected = selectedSeats.includes(seatNumber);
        upperSeatsInColumn[2].seats.push(
          <Button
            key={`upper-${seatNumber}`}
            className={`seat ${isSelected ? "selected" : "available"}`}
            onClick={() => handleSeatSelect(seatNumber)}
          >
            {"B" + String(i).padStart(2, "0")}
          </Button>
        );
      }
    }

    const lowerLevelSeats = seatsInColumn.map((column, colIndex) => (
      <div
        key={`lower-column-${colIndex}`}
        className={`seat-column ${colIndex === 1 ? "middle-column" : ""}`}
      >
        {column.seats}
      </div>
    ));

    const upperLevelSeats = upperSeatsInColumn.map((column, colIndex) => (
      <div
        key={`upper-column-${colIndex}`}
        className={`seat-column ${colIndex === 1 ? "middle-column" : ""}`}
      >
        {column.seats}
      </div>
    ));

    return (
      <div className="seat-levels">
        <div className="seat-level lower-level">
          <h4>Tầng Dưới</h4>
          <div className="seat-row">{lowerLevelSeats}</div>
        </div>
        <div className="seat-level upper-level">
          <h4>Tầng Trên</h4>
          <div className="seat-row">{upperLevelSeats}</div>
        </div>
      </div>
    );
  };

  const handleNavigateToPayment = async () => {
    if (selectedSeats.length === 0) {
      message.error("Vui lòng chọn ít nhất một ghế trước khi thanh toán.");
      return;
    }
    await saveCustomerInfo();

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      message.error("Vui lòng điền đầy đủ thông tin khách hàng.");
      return;
    }

    const calculatedTotalAmount = selectedSeats.length * selectedTrip.price;

    let finalAmount = calculatedTotalAmount;
    let promotionInfo = null;

    if (selectedPromotion) {
      finalAmount = calculatedTotalAmount - selectedPromotion.discountAmount;
      promotionInfo = {
        promotionId: selectedPromotion.promotionId,
        promotionCode: selectedPromotion.promotionCode,
        discountAmount: selectedPromotion.discountAmount,
        description: selectedPromotion.description,
      };
    }

    const bookingDetails = {
      tripInfo: {
        id: selectedTrip.id,
        departureStation: selectedTrip.departureStation,
        destinationStation: selectedTrip.destinationStation,
        departureTime: selectedTrip.departureTime,
        price: selectedTrip.price,
      },
      selectedSeats: selectedSeats.map((seatNumber) => {
        return seatNumber <= 17
          ? "A" + String(seatNumber).padStart(2, "0")
          : "B" + String(seatNumber - 17).padStart(2, "0");
      }),
      customerInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
      },
      totalAmount: calculatedTotalAmount,
      finalAmount: finalAmount,
      promotion: promotionInfo,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingDetails));
    navigate("/payment", { state: { bookingDetails } });
    localStorage.removeItem("pendingBooking");
  };

  return (
    <div className="seat-selection-page flex flex-col items-center min-h-screen">
      <Card bordered={true} className="w-full ">
        <div className="flex items-center bg-green-300 px-4 py-2">
          <Button type="link" onClick={handleBack} className="text-white">
            Quay lại
          </Button>
          <div className="flex-grow text-center">
            <h2 className="text-lg font-bold text-white">
              Chọn ghế cho chuyến: {selectedTrip?.departureStation} -{" "}
              {selectedTrip?.destinationStation}
            </h2>
          </div>
        </div>

        <div className="main-content mt-6 flex w-full">
          <div className="seat-selection w-3/5 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Chọn ghế</h3>
            <div className="seat-grid grid grid-cols-4 gap-4">
              {renderSeats()}
            </div>
            <div className="seat-info mt-4">
              <p className="text-gray-700">
                Tổng số ghế: {selectedTrip.totalSeats}
              </p>
            </div>
            <div className="seat-legend flex gap-4 mt-4">
              <div className="legend-item flex items-center gap-2 text-sm">
                <span className="seat sold w-8 h-8 bg-gray-400 rounded-md"></span>{" "}
                Đã bán
              </div>
              <div className="legend-item flex items-center gap-2 text-sm">
                <span className="seat available w-8 h-8 bg-teal-100 rounded-md"></span>{" "}
                Còn trống
              </div>
              <div className="legend-item flex items-center gap-2 text-sm">
                <span className="seat selected w-8 h-8 bg-orange-200 rounded-md"></span>{" "}
                Đang chọn
              </div>
            </div>
          </div>

          <div className="info-section w-2/5 flex flex-col gap-4 ml-6">
            <Card
              title="Thông tin lượt đi"
              bordered={true}
              className="p-4 border border-gray-300 shadow-md rounded-lg"
            >
              <p>
                <strong>Tuyến xe:</strong> {selectedTrip.departureStation} -{" "}
                {selectedTrip.destinationStation}
              </p>
              <p>
                <strong>Thời gian xuất bến:</strong>{" "}
                {(() => {
                  const departureDate = new Date(selectedTrip.departureTime);
                  const day = departureDate.getDate();
                  const month = departureDate.getMonth() + 1;
                  const year = departureDate.getFullYear();
                  const hours = departureDate.getHours();
                  const minutes = departureDate.getMinutes();
                  return `${day}/${month}/${year} ${hours} giờ ${minutes} phút`;
                })()}
              </p>
              <p>
                <strong>Số ghế:</strong> {selectedSeats.length}
              </p>
            </Card>

            <Card
              title="Thông tin khách hàng"
              bordered={true}
              className="p-4 border border-gray-300 shadow-md rounded-lg"
            >
              <div className="grid grid-cols-3 gap-4">
                <Input
                  placeholder="Họ và tên"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  name="name"
                />
                <Input
                  placeholder="Số điện thoại"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  name="phone"
                />
                <Input
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  name="email"
                  disabled={!!currentUser}
                />
              </div>
            </Card>

            <Card
              title="Chi tiết giá vé"
              bordered={true}
              className="p-4 border border-gray-300 shadow-md rounded-lg"
            >
              <p>
                Ghế đã chọn:{" "}
                {selectedSeats.length > 0
                  ? selectedSeats
                      .map((seatNumber) => {
                        return seatNumber <= 17
                          ? "A" + String(seatNumber).padStart(2, "0")
                          : "B" + String(seatNumber - 17).padStart(2, "0");
                      })
                      .join(", ") + ` (${selectedSeats.length} ghế)`
                  : "Chưa chọn"}
              </p>
              <p>Giá vé lượt đi: {ticketPrice.toLocaleString()} ₫</p>
              <p>Tổng tiền: {totalAmount?.toLocaleString()} ₫</p>
              {selectedPromotion && (
                <div>
                  <Text strong>Tổng tiền sau khuyến mãi: </Text>
                  <Text>
                    {(
                      totalAmount - selectedPromotion.discountAmount
                    )?.toLocaleString("vi-VN")}
                    đ
                  </Text>
                </div>
              )}
              <Button
                type="primary"
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: 20 }}
              >
                Chọn khuyến mẫi
              </Button>
            </Card>

            <Button
              type="primary"
              className="payment-button w-full mt-4"
              onClick={handleNavigateToPayment}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </Card>

      <PromotionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        totalAmount={totalAmount}
        onSelectPromotion={setSelectedPromotion}
      />
    </div>
  );
};

export default SeatSelectionPage;
