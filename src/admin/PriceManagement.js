import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";

import AddPriceModal from "../components/AddPriceModal";
import {
  createPrice,
  deletePrice,
  fetchAllPrices,
  updatePrice,
} from "../api/PricesApi";
import Sidebar from "../components/Sidebar";

const PricesManagement = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);

  useEffect(() => {
    const getPrices = async () => {
      try {
        const data = await fetchAllPrices();
        setPrices(data.data);
      } catch {
        setError("Không thể lấy danh sách giá");
      } finally {
        setLoading(false);
      }
    };
    getPrices();
  }, []);

  const handleCreate = async (newPrice) => {
    try {
      const data = await createPrice(newPrice);
      setPrices([...prices, data.data]);
      message.success("Thêm giá thành công!");
    } catch {
      setError("Không thể tạo giá");
    }
  };

  const handleEdit = (id) => {
    const priceToEdit = prices.find((p) => p.id === id);
    setEditingPrice({
      id: priceToEdit.id,
      price: priceToEdit.attributes.price,
      startDate: priceToEdit.attributes.startDate,
      endDate: priceToEdit.attributes.endDate,
      status: priceToEdit.attributes.status,
      trips: priceToEdit.attributes.trips.data,
    });
    setModalVisible(true);
  };

  const handleUpdate = async (updatedPrice) => {
    try {
      const data = await updatePrice(editingPrice.id, updatedPrice);
      setPrices(
        prices.map((price) => (price.id === data.data.id ? data.data : price))
      );
      message.success("Cập nhật giá thành công!");
    } catch {
      setError("Không thể cập nhật giá");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa giá này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deletePrice(id);
          setPrices(prices.filter((price) => price.id !== id));
          message.success("Xóa giá thành công!");
        } catch {
          setError("Không thể xóa giá");
        }
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Giá", dataIndex: "price", key: "price" },
    { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate" },
    { title: "Ngày kết thúc", dataIndex: "endDate", key: "endDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record.id)}
            style={{ marginRight: "8px" }}
          >
            Sửa
          </Button>
          <Button type="danger" onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý giá</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingPrice(null);
            setModalVisible(true);
          }}
        >
          Thêm Giá
        </Button>
        <Table
          dataSource={prices.map((price) => ({
            id: price.id,
            price: price.attributes.price,
            startDate: new Date(price.attributes.startDate).toLocaleString(),
            endDate: new Date(price.attributes.endDate).toLocaleString(),
            status: price.attributes.status,
          }))}
          columns={columns}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <AddPriceModal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate}
          priceData={editingPrice || {}}
          setPriceData={setEditingPrice}
        />
      </div>
    </div>
  );
};

export default PricesManagement;
