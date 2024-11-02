import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message, Space } from "antd";
import {
  fetchAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../api/PromotionApi";
import AddPromotionModal from "../components/AddPromotionModal";
import Sidebar from "../components/Sidebar";
import moment from "moment-timezone";
const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [detailPromotion, setDetailPromotion] = useState(null);
  useEffect(() => {
    const getPromotions = async () => {
      try {
        const data = await fetchAllPromotions();
        setPromotions(data.data);
      } catch {
        message.error("Không thể lấy danh sách khuyến mãi");
      } finally {
        setLoading(false);
      }
    };
    getPromotions();
  }, []);

  const handleCreate = async (newPromotion) => {
    try {
      const data = await createPromotion(newPromotion);
      setPromotions([...promotions, data.data]);
      message.success("Thêm khuyến mãi thành công!");
    } catch {
      message.error("Không thể tạo khuyến mãi");
    }
  };

  const handleEdit = (id) => {
    const promotionToEdit = promotions.find((p) => p.id === id);
    setEditingPromotion({
      id: promotionToEdit.id,
      promotionName: promotionToEdit.attributes.promotionName,
      description: promotionToEdit.attributes.description,
      discountType: promotionToEdit.attributes.discountType,
      discountValue: promotionToEdit.attributes.discountValue,
      startDate: promotionToEdit.attributes.startDate,
      endDate: promotionToEdit.attributes.endDate,
      status: promotionToEdit.attributes.status,
    });
    setModalVisible(true);
  };

  const handleUpdate = async (updatedPromotion) => {
    try {
      const data = await updatePromotion(editingPromotion.id, updatedPromotion);
      setPromotions(
        promotions.map((promotion) =>
          promotion.id === data.data.id ? data.data : promotion
        )
      );
      message.success("Cập nhật khuyến mãi thành công!");
    } catch {
      message.error("Không thể cập nhật khuyến mãi");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa khuyến mãi này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deletePromotion(id);
          setPromotions(promotions.filter((promotion) => promotion.id !== id));
          message.success("Xóa khuyến mãi thành công!");
        } catch {
          message.error("Không thể xóa khuyến mãi");
        }
      },
    });
  };
  const handleViewDetails = (id) => {
    const promotionToView = promotions.find((p) => p.id === id);
    setDetailPromotion({
      id: promotionToView.id,
      promotionName: promotionToView.attributes.promotionName,
      description: promotionToView.attributes.description,
      discountType: promotionToView.attributes.discountType,
      discountValue: promotionToView.attributes.discountValue,
      startDate: moment(promotionToView.attributes.startDate).format(
        "DD/MM/YYYY HH:mm"
      ),
      endDate: moment(promotionToView.attributes.endDate).format(
        "DD/MM/YYYY HH:mm"
      ),
      status: promotionToView.attributes.status,
    });
    setDetailModalVisible(true); // Mở modal chi tiết
  };
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tên Khuyến Mãi",
      dataIndex: "promotionName",
      key: "promotionName",
    },
    { title: "Mô Tả", dataIndex: "description", key: "description" },

    {
      title: "Giá Trị Giảm Giá",
      dataIndex: "discountValue",
      key: "discountValue",
    },
    { title: "Loại Giảm Giá", dataIndex: "discountType", key: "discountType" },
    { title: "Trạng Thái", dataIndex: "status", key: "status" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
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
            type="default"
            onClick={() => handleViewDetails(record.id)}
            style={{ marginRight: "8px" }}
          >
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý khuyến mãi</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingPromotion(null);
            setModalVisible(true);
          }}
        >
          Thêm Khuyến Mãi
        </Button>
        <Table
          dataSource={promotions.map((promotion) => ({
            id: promotion.id,
            promotionName: promotion.attributes.promotionName,
            description: promotion.attributes.description,
            discountValue: promotion.attributes.discountValue,
            discountType: promotion.attributes.discountType,
            status: promotion.attributes.status,
          }))}
          columns={columns}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <AddPromotionModal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate}
          promotionData={editingPromotion || {}}
          setPromotionData={setEditingPromotion}
        />

        {/* Modal chi tiết khuyến mãi */}
        <Modal
          title="Chi Tiết Khuyến Mãi"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
        >
          {detailPromotion && (
            <div>
              <p>
                <strong>Tên Khuyến Mãi:</strong> {detailPromotion.promotionName}
              </p>
              <p>
                <strong>Mô Tả:</strong> {detailPromotion.description}
              </p>
              <p>
                <strong>Giá Trị Giảm Giá:</strong>{" "}
                {detailPromotion.discountValue}
              </p>
              <p>
                <strong>Loại Giảm Giá:</strong> {detailPromotion.discountType}
              </p>
              <p>
                <strong>Trạng Thái:</strong> {detailPromotion.status}
              </p>
              <p>
                <strong>Ngày Bắt Đầu:</strong> {detailPromotion.startDate}
              </p>
              <p>
                <strong>Ngày Kết Thúc:</strong> {detailPromotion.endDate}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PromotionsManagement;
