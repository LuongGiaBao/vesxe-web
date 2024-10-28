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
import { fetchAllPromotions } from "../api/PromotionApi";
import TicketPriceDetail from "../api/TicketPriceDetail";

const PricesManagement = () => {
  const [prices, setPrices] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceDetail, setPriceDetail] = useState(null);

  useEffect(() => {
    loadPrices();
    loadPromotions();
  }, []);

  const loadPrices = async () => {
    try {
      const data = await fetchAllPrices();
      setPrices(data.data); // Assuming the structure is { data: [ ...prices ] }
    } catch (err) {
      setError("Failed to load prices.");
      console.error(err);
    }
  };

  const loadPromotions = async () => {
    try {
      const data = await fetchAllPromotions();
      setPromotions(data.data);
    } catch (err) {
      setError("Failed to load promotions.");
      console.error(err);
    }
  };

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
      promotionId: priceToEdit.attributes.promotion.data?.id,
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
      loadPrices();
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

  const formatVietnamTime = (isoString) => {
    const date = new Date(isoString);
    const vietnamTime = new Date(date.getTime() - 12 * 60 * 60 * 1000);
    const hours = vietnamTime.getHours();
    const minutes = vietnamTime.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${vietnamTime.toLocaleDateString(
      "vi-VN"
    )} ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const handleViewDetail = (id) => {
    const selectedPrice = prices.find((price) => price.id === id);
    setPriceDetail(selectedPrice);
    setDetailModalVisible(true);
  };
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} VND`,
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotion",
      key: "promotion",
      render: (promotion) =>
        promotion && promotion.data
          ? promotion.data.attributes.promotionName
          : "Không có",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => <span>{formatVietnamTime(startDate)}</span>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => <span>{formatVietnamTime(endDate)}</span>,
    },
    {
      title: "Trạng thái vé",
      dataIndex: "status",
      key: "status",
    },
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
          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
          <Button
            onClick={() => handleViewDetail(record.id)}
            style={{ marginRight: "8px" }}
          >
            Xem chi tiết
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
          style={{ marginBottom: "16px" }}
        >
          Thêm Giá
        </Button>
        <Table
          dataSource={prices.map((price) => ({
            id: price.id,
            price: price.attributes.price,
            startDate: price.attributes.startDate,
            endDate: price.attributes.endDate,
            status: price.attributes.status,
            promotion: price.attributes.promotion,
          }))}
          columns={columns}
          rowKey="id"
          pagination={true}
        />
        <AddPriceModal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate}
          priceData={editingPrice || {}}
          setPriceData={setEditingPrice}
          promotions={promotions}
        />

        <TicketPriceDetail
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          priceDetail={priceDetail}
        />
      </div>
    </div>
  );
};

export default PricesManagement;
