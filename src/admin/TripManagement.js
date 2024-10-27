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
import { fetchAllDepartureLocation } from "../api/DepartureLocationApi";
import { fetchAllArrivalLocation } from "../api/ArrivalLocation";
import { fetchAllLocations } from "../api/LocationApi";

const TripTable = () => {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [dropOffPoints, setDropOffPoints] = useState([]);
  const [departureLocations, setDepartureLocations] = useState([]);
  const [arrivalLocations, setArrivalLocations] = useState([]);
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
      console.log("responson trip", response);

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
      console.log("res", response);

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "ID Vé",
      dataIndex: ["attributes", "ticket", "data", "id"],
      key: "ticketId",
    },
    {
      title: "Điểm Đón",
      dataIndex: [
        "attributes",
        "pickup_point",
        "data",
        "attributes",
        "location",
      ],
      key: "pickupPoint",
    },
    {
      title: "Điểm Trả",
      dataIndex: [
        "attributes",
        "drop_off_point",
        "data",
        "attributes",
        "location",
      ],
      key: "dropOffPoint",
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
      title: "Khoảng Cách",
      dataIndex: ["attributes", "distance"],
      key: "distance",
    },
    {
      title: "Thời Gian Khởi Hành",
      dataIndex: ["attributes", "departureTime"],
      key: "departureTime",
      render: (text) => <span>{formatVietnamTime(text)}</span>,
    },
    {
      title: "Thời Gian Đến",
      dataIndex: ["attributes", "arrivalTime"],
      key: "arrivalTime",
      render: (text) => <span>{formatVietnamTime(text)}</span>,
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
    <div className="admin-dashboard">
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
