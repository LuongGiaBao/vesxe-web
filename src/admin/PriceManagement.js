// src/admin/PriceManagement.js
import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Modal, Tag } from "antd";
import {
  fetchAllPrices,
  createPrice,
  updatePrice,
  deletePrice,
} from "../api/PricesApi";
import Sidebar from "../components/Sidebar";
import PriceFormModal from "../components/PriceFormModal";
import PriceDetailModal from "../components/PriceDetailModal";
import moment from "moment";

const PriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const response = await fetchAllPrices();
      setPrices(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách bảng giá.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrice = async (values) => {
    try {
      await createPrice(values);
      message.success("Tạo bảng giá thành công.");
      loadPrices();
    } catch (error) {
      message.error("Không thể tạo bảng giá.");
    }
  };

  const handleUpdatePrice = async (values) => {
    try {
      // Kiểm tra xem có bảng giá nào đang hoạt động trong khoảng thời gian này không
      const conflictingPrice = prices.find(
        (price) =>
          price.id !== editingPrice.id &&
          price.attributes.status === "Hoạt động" &&
          moment(price.attributes.endDate).isAfter(values.startDate)
      );

      if (conflictingPrice && values.status === "Hoạt động") {
        message.error(
          "Không thể cập nhật bảng giá hoạt động vì đã có bảng giá khác đang hoạt động trong khoảng thời gian này."
        );
        return;
      }

      await updatePrice(editingPrice.id, values);
      message.success("Cập nhật bảng giá thành công.");
      loadPrices();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Không thể cập nhật bảng giá.");
    }
  };

  const columns = [
    {
      title: "Mã Giá",
      dataIndex: ["attributes", "MaGia"],
      key: "MaGia",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: ["attributes", "startDate"],
      key: "startDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"), // Format date
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: ["attributes", "endDate"],
      key: "endDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"), // Format date
    },
    {
      title: "Mô tả",
      dataIndex: ["attributes", "Mota"],
      key: "Mota",
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "status"],
      key: "status",
      render: (text) => (
        <Tag color={text === "Hoạt động" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingPrice(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="danger"
            onClick={() => {
              deletePrice(record.id)
                .then(() => {
                  message.success("Xóa bảng giá thành công.");
                  loadPrices();
                })
                .catch((error) => {
                  message.error("Không thể xóa bảng giá.");
                });
            }}
          >
            Xóa
          </Button>
          <Button
            onClick={() => {
              setSelectedPrice(record);
              setIsDetailModalVisible(true);
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý bảng giá</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Thêm bảng giá mới
        </Button>
        <Table
          columns={columns}
          dataSource={prices}
          loading={loading}
          rowKey="id"
        />
        <PriceFormModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingPrice(null);
          }}
          onOk={editingPrice ? handleUpdatePrice : handleCreatePrice}
          initialValues={editingPrice}
          existingPrices={prices}
        />
        <PriceDetailModal
          visible={isDetailModalVisible}
          onCancel={() => {
            setIsDetailModalVisible(false);
            setSelectedPrice(null);
          }}
          price={selectedPrice}
        />
      </div>
    </div>
  );
};

export default PriceManagement;
