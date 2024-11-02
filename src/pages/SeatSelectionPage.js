import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { fetchTripSeats } from "../api/fakeapi"; // API giả để lấy danh sách ghế
import "../assets/SeatSelectionPage.css"; // Import CSS
import { Button, Card, message, Modal } from "antd";
import { fetchAllSeats } from "../api/SeatApi";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  getLoggedInUser,
} from "../api/UserApi"; // Đảm bảo đường dẫn chính xác
const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
  const { selectedTrip } = location.state || {}; // Nhận thông tin chuyến xe từ trang trước
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]); // Danh sách ghế
  const [selectedSeats, setSelectedSeats] = useState([]); // Ghế đang chọn
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [currentUser, setCurrentUser] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  }); // Thông tin khách hàng
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discounts = [
    { name: "Giảm giá 10%", discountPercentage: 10 },
    { name: "Giảm giá 20%", discountPercentage: 20 },
    { name: "Giảm giá 30%", discountPercentage: 30 },
    // Thêm các mã giảm giá khác nếu cần
  ];
  const ticketPrice = 300000;
  useEffect(() => {
   
  }, [selectedTrip]);
  // Gọi API để lấy danh sách ghế
  useEffect(() => {
    fetchSeats();
  }, [selectedTrip?.id]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
    

      const response = await fetchAllSeats(selectedTrip.id);
    

      if (response && response.data) {
        // Chuyển đổi dữ liệu từ response format sang format mong muốn
        const formattedSeats = response.data.map((seat) => ({
          id: seat.id,
          number: seat.attributes.seatNumber,
          status: seat.attributes.status,
        }));

       
        setSeats(formattedSeats);
        message.success("Tải thông tin ghế thành công!");
      } else {
        console.warn("Response không có data:", response);
        message.warning("Không có dữ liệu ghế");
      }
    } catch (error) {
      console.error("Chi tiết lỗi:", {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
      message.error("Không thể tải thông tin ghế. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUserLogin = async () => {
      // Giả sử bạn có một hàm để lấy thông tin người dùng đã đăng nhập
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
        // Nếu người dùng đã đăng nhập, cập nhật thông tin
        await updateUser(currentUser.id, {
          fullName: customerInfo.name,
          phone: customerInfo.phone,
        });
      } else {
        // Nếu chưa đăng nhập, tạo người dùng mới
        const newUser = await createUser({
          username: customerInfo.email,
          email: customerInfo.email,
          fullName: customerInfo.name,
          phone: customerInfo.phone,
        });
        setCurrentUser(newUser);
      }
      message.success("Thông tin khách hàng đã được lưu");
    } catch (error) {
      console.error("Error saving customer info:", error);
      message.error("Không thể lưu thông tin khách hàng");
    }
  };
  // Hàm xử lý quay lại trang trước
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // Hàm xử lý chọn và bỏ chọn ghế
  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatNumber)
        ? prevSeats.filter((s) => s !== seatNumber)
        : [...prevSeats, seatNumber]
    );
  };
  const isSeatSelected = (seatNumber) => {
    return selectedSeats.includes(seatNumber);
  };

  const getSeatStatus = (status, seatNumber) => {
    if (isSeatSelected(seatNumber)) return "selected";
    return status === "còn trống" ? "available" : "sold";
  };

  // Hàm xử lý thay đổi thông tin khách hàng
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (currentUser) {
      setCurrentUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const totalAmount = selectedSeats.length * selectedTrip.price; // Tổng số tiền dựa trên số ghế đã chọn

  const handleSelectDiscount = (discount) => {
   
    closeModal();
  };
  const handleConfirmBooking = async () => {
    try {
      // Lưu thông tin khách hàng
      await saveCustomerInfo();

      // Tiếp tục xử lý đặt vé
      const bookingDetails = {
        departure: selectedTrip.departureStation,
        destination: selectedTrip.destinationStation,
        departureTime: selectedTrip.departureTime,
        seatNumbers: selectedSeats,
        totalAmount: totalAmount,
        userId: currentUser?.id,
      };

      // Gọi API đặt vé
      // ...

      navigate("/booking-success", { state: { bookingDetails } });
    } catch (error) {
      console.error("Error in booking process:", error);
      message.error("Không thể hoàn tất đặt vé");
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderSeats = () => {
    const totalSeats = selectedTrip.totalSeats || 40;
    const availableSeats = selectedTrip.availableSeats || totalSeats;
    const rows = Math.ceil(totalSeats / 4);
    const seatsPerRow = 4;
    let seatGrid = [];

    const getSeatStatus = (seatNumber) => {
      if (selectedSeats.includes(seatNumber)) return "selected";
      if (seatNumber > availableSeats) return "sold";
      return "available";
    };

    for (let row = 0; row < rows; row++) {
      let rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = row * seatsPerRow + col + 1;
        if (seatNumber <= totalSeats) {
          const seatStatus = getSeatStatus(seatNumber);

          rowSeats.push(
            <Button
              key={seatNumber}
              className={`seat ${seatStatus}`}
              onClick={() =>
                seatStatus !== "sold" && handleSeatSelect(seatNumber)
              }
              disabled={seatStatus === "sold"}
            >
              {seatNumber}
            </Button>
          );
        }
      }
      if (rowSeats.length > 0) {
        seatGrid.push(
          <div key={`row-${row}`} className="seat-row">
            {rowSeats}
          </div>
        );
      }
    }
    return seatGrid;
  };

  const handleNavigateToPayment = () => {
    // Kiểm tra xem đã chọn ghế chưa
    if (selectedSeats.length === 0) {
      message.error("Vui lòng chọn ít nhất một ghế trước khi thanh toán.");
      return;
    }

    // Kiểm tra thông tin khách hàng
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      message.error("Vui lòng điền đầy đủ thông tin khách hàng.");
      return;
    }

    // Tính toán lại tổng tiền để đảm bảo chính xác
    const calculatedTotalAmount = selectedSeats.length * selectedTrip.price;

    // Chuẩn bị dữ liệu để chuyển sang trang thanh toán
    const bookingDetails = {
      tripInfo: {
        id: selectedTrip.id,
        departureStation: selectedTrip.departureStation,
        destinationStation: selectedTrip.destinationStation,
        departureTime: selectedTrip.departureTime,
        price: selectedTrip.price,
      },
      selectedSeats: selectedSeats,
      customerInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
      },
      totalAmount: calculatedTotalAmount,
    };

    // Log để kiểm tra dữ liệu trước khi chuyển trang
  
    localStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
    // Chuyển hướng đến trang thanh toán
    navigate("/payment", { state: { bookingDetails } });
  };
  return (
    <div className="seat-selection-page">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          Quay lại
        </button>
        <h2>
          Chọn ghế cho chuyến: {selectedTrip?.departureStation} -{" "}
          {selectedTrip?.destinationStation}
        </h2>
      </div>

      <div className="main-content">
        <div className="seat-selection">
          <h3>Chọn ghế</h3>
          <div className="seat-grid">{renderSeats()}</div>
          <div className="seat-info">
            <p>Tổng số ghế: {selectedTrip.totalSeats}</p>
            <p>Số ghế còn trống: {selectedTrip.availableSeats}</p>
          </div>
          <div className="seat-legend">
            <div className="legend-item">
              <span className="seat sold"></span> Đã bán
            </div>
            <div className="legend-item">
              <span className="seat available"></span> Còn trống
            </div>
            <div className="legend-item">
              <span className="seat selected"></span> Đang chọn
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="trip-info">
            <h3>Thông tin lượt đi</h3>
            <p>
              <strong>Tuyến xe:</strong> {selectedTrip.departureStation} -{" "}
              {selectedTrip.destinationStation}
            </p>
            <p>
              <strong>Thời gian xuất bến:</strong>{" "}
              {new Date(selectedTrip.departureTime).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Số ghế:</strong> {selectedSeats.length}
            </p>
          </div>

          <div className="customer-info">
            <h3>Thông tin khách hàng</h3>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={customerInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={customerInfo.phone}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={handleInputChange}
              disabled={!!currentUser} // Disable nếu đã đăng nhập
            />
            {/* <Button onClick={saveCustomerInfo}>Lưu thông tin</Button> */}
          </div>

          <div className="total-price">
            <h2 className="text-lg font-bold mt-8 mb-4">Chi tiết giá vé</h2>
            <p>
              Ghế đã chọn:{" "}
              {selectedSeats.length > 0
                ? `${selectedSeats.join(", ")} (${selectedSeats.length} ghế)`
                : "Chưa chọn"}
            </p>
            <p>
              Giá vé lượt đi: {selectedTrip?.price?.toLocaleString() || "0"} ₫
            </p>
            <p>Tổng tiền: {totalAmount?.toLocaleString() || "0"} ₫</p>

            {/* <Button type="primary" onClick={openModal}>
              Chọn Mã Giảm Giá
            </Button> */}

            <Modal
              title="Chọn Mã Giảm Giá"
              visible={isModalOpen}
              onCancel={closeModal}
              footer={null}
            >
              {/* Nội dung modal */}
            </Modal>
          </div>

          <Button
            type="primary"
            className="payment-button"
            onClick={handleNavigateToPayment}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;




