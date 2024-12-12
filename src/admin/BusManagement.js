// src/admin/BusManagement.js
import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Modal, Tag } from "antd";
import {
  fetchAllBuses,
  createBus,
  updateBus,
  deleteBus,
} from "../api/BusesApi";
import Sidebar from "../components/Sidebar";
import BusFormModal from "../components/BusFormModal";
import BusDetailModal from "../components/BusDetailModal";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setLoading(true);
    try {
      const response = await fetchAllBuses();
      setBuses(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách xe.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (values) => {
    try {
      await createBus(values);
      message.success("Thêm xe mới thành công!");
      setIsModalVisible(false);
      loadBuses();
    } catch (error) {
      message.error("Thêm xe mới thất bại!");
    }
  };

  const handleEditBus = async (values) => {
    try {
      await updateBus(editingBus.id, values);
      message.success("Cập nhật thông tin xe thành công!");
      setIsModalVisible(false);
      loadBuses();
    } catch (error) {
      message.error("Cập nhật thông tin xe thất bại!");
    }
  };

  const handleDeleteBus = async (busId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa xe này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteBus(busId);
          message.success("Xóa xe thành công!");
          loadBuses();
        } catch (error) {
          message.error("Xóa xe thất bại!");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID", // Thay đổi từ "ID" thành "ID"
      dataIndex: ["id"], // Đây là nơi bạn lấy ID từ dữ liệu
      key: "id",
    },
    {
      title: "Mã Xe",
      dataIndex: ["attributes", "MaXe"],
      render: (text) => text,
    },
    {
      title: "Biển Số",
      dataIndex: ["attributes", "BienSo"],
      key: "BienSo",
    },
    {
      title: "Tên Xe",
      dataIndex: ["attributes", "busName"],
      key: "busName",
    },
    {
      title: "Số Ghế",
      dataIndex: ["attributes", "seatCount"],
      key: "seatCount",
      render: () => <span>34</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: ["attributes", "status"],
      key: "status",
      render: (status) => (
        <Tag color={status === "Hoạt động" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingBus(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDeleteBus(record.id)}>
            Xóa
          </Button>
          <Button
            onClick={() => {
              setSelectedBus(record);
              setIsDetailModalVisible(true);
            }}
          >
            Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h2>Quản Lý Xe</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingBus(null);
            setIsModalVisible(true);
          }}
        >
          Thêm Xe Mới
        </Button>
        <Table
          columns={columns}
          dataSource={buses}
          rowKey="id"
          loading={loading}
        />
        <BusFormModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={editingBus ? handleEditBus : handleAddBus}
          initialValues={editingBus}
        />
        <BusDetailModal
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          bus={selectedBus}
        />
      </div>
    </div>
  );
};

export default BusManagement;
