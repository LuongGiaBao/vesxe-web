import React, { useEffect, useState } from "react";
import {
  fetchAllTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../api/TripApi";
import { Table, Modal, Button, message, Space } from "antd";
import TripFormModal from "../components/TripFormModal";
import Sidebar from "../components/Sidebar";
import { formatVietnamTime } from "../utils/timeUtils";
import { fetchAllTickets } from "../api/TicketApi";
import { fetchAllPickupPoint } from "../api/PickupPoint";
import { fetchAllDropPoint } from "../api/DropoffPoint";
import TripDetailModal from "../components/TripDetailModal";
import { fetchAllLocations } from "../api/LocationApi";
import moment from "moment-timezone";
const TripTable = () => {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [dropOffPoints, setDropOffPoints] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      loadTrips(),
      loadTickets(),
      loadPickupPoints(),
      loadDropOffPoints(),
      loadLocation(),
    ]);
  };

  const loadTrips = async () => {
    try {
      const response = await fetchAllTrips();

      setTrips(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách chuyến đi.");
    }
  };

  const loadTickets = async () => {
    try {
      const response = await fetchAllTickets();
      setTickets(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách vé.");
    }
  };

  const loadPickupPoints = async () => {
    try {
      const response = await fetchAllPickupPoint();
      setPickupPoints(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách điểm đón.");
    }
  };

  const loadDropOffPoints = async () => {
    try {
      const response = await fetchAllDropPoint();
      setDropOffPoints(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách điểm trả.");
    }
  };

  const loadLocation = async () => {
    try {
      const response = await fetchAllLocations();

      setLocations(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách địa điểm khởi hành.");
    }
  };

  const handleAddTrip = async (values) => {
    try {
      const newTrip = await createTrip(values);
      setTrips([...trips, newTrip]);
      message.success("Tạo chuyến đi mới thành công!");
      setIsModalVisible(false);
      loadTrips();
    } catch (error) {
      message.error("Tạo chuyến đi mới thất bại!");
    }
  };

  const handleEditTrip = async (values) => {
    if (!editingTrip) return;
    try {
      await updateTrip(editingTrip.id, values);
      message.success("Cập nhật chuyến đi thành công!");
      setIsModalVisible(false);
      loadTrips();
    } catch (error) {
      message.error("Cập nhật chuyến đi thất bại!");
    }
  };

  const handleDeleteTrip = (tripId) => {
    Modal.confirm({
      title: "Xác Nhận Xóa",
      content: "Bạn có chắc chắn muốn xóa chuyến đi này?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteTrip(tripId);
          setTrips(trips.filter((trip) => trip.id !== tripId));
          message.success("Xóa chuyến đi thành công!");
        } catch (error) {
          message.error("Không thể xóa chuyến đi. Vui lòng thử lại!");
        }
      },
    });
  };

  const openModalForEdit = (trip) => {
    setEditingTrip(trip);
    setIsModalVisible(true);
  };

  const openModalForCreate = () => {
    setEditingTrip(null);
    setIsModalVisible(true);
  };

  const openDetailModal = (trip) => {
    setSelectedTrip(trip);
    setIsDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedTrip(null);
  };

  const formatMaTuyen = (maTuyen) => {
    if (maTuyen.startsWith("MTMT")) {
      return "MT" + maTuyen.substring(4);
    }
    return maTuyen;
  };
  const formatExpectedTime = (expectedTime) => {
    const time = moment(expectedTime, "HH:mm:ss.SSS");
    const hours = time.hours(); // Lấy giờ
    const minutes = time.minutes(); // Lấy phút
    return `${hours} giờ ${minutes} phút`; // Trả về chuỗi theo định dạng mong muốn
  };
  const columns = [
    {
      title: "ID", // Thay đổi từ "ID" thành "ID"
      dataIndex: ["id"], // Đây là nơi bạn lấy ID từ dữ liệu
      key: "id",
    },
    {
      title: "Mã Tuyến", // Thay đổi từ "ID" thành "Mã Tuyến"
      dataIndex: ["attributes", "MaTuyen"], // Thay đổi từ "id" thành ["attributes", "MaTuyen"]
      key: "matuyen",
      render: (text) => <span>{formatMaTuyen(text)}</span>,
    },
    {
      title: "Điểm Đón",
      dataIndex: ["attributes", "MaDiemDon", "data", "attributes", "location"],
      key: "MaDiemDon",
    },
    {
      title: "Điểm Trả",
      dataIndex: ["attributes", "MaDiemTra", "data", "attributes", "location"],
      key: "MaDiemTra",
    },
    {
      title: "Điểm Khởi Hành",
      dataIndex: [
        "attributes",
        "departure_location_id",
        "data",
        "attributes",
        "name",
      ],
      key: "departureLocation",
    },
    {
      title: "Điểm Đến",
      dataIndex: [
        "attributes",
        "arrival_location_id",
        "data",
        "attributes",
        "name",
      ],
      key: "arrivalLocation",
    },
    {
      title: "Tổng Số Ghế",
      dataIndex: ["attributes", "totalSeats"],
      key: "totalSeats",
    },
    {
      title: "Thời Gian Dự kiến",
      dataIndex: ["attributes", "ExpectedTime"], // Thêm dòng này
      key: "ExpectedTime",
      render: (text) => <span>{formatExpectedTime(text)}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: ["attributes", "status"],
      key: "status",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, trip) => (
        <Space>
          <Button type="primary" onClick={() => openModalForEdit(trip)}>
            Cập Nhật
          </Button>
          <Button danger onClick={() => handleDeleteTrip(trip.id)}>
            Xóa
          </Button>
          <Button onClick={() => openDetailModal(trip)}>Chi Tiết</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard ">
      <Sidebar />
      <div className="admin-content">
        <h2>Danh Sách Chuyến Đi</h2>
        <Button type="primary" onClick={openModalForCreate}>
          Tạo Chuyến Đi Mới
        </Button>
        <Table
          columns={columns}
          dataSource={trips}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          style={{ marginTop: 20 }}
        />
        <TripFormModal
          visible={isModalVisible}
          onAdd={handleAddTrip}
          onEdit={handleEditTrip}
          onCancel={() => setIsModalVisible(false)}
          trip={editingTrip}
          tickets={tickets}
          pickupPoints={pickupPoints}
          dropOffPoints={dropOffPoints}
          locations={locations}
          existingTrips={trips}
        />
        <TripDetailModal
          visible={isDetailModalVisible}
          onCancel={handleDetailModalClose}
          trip={selectedTrip}
        />
      </div>
    </div>
  );
};

export default TripTable;
