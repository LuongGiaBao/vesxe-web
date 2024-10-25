import React, { useState } from "react";
import { Modal, Form, Input, Button, DatePicker, message } from "antd";

const AddPriceModal = ({ isOpen, onClose, onAdd, onEdit, priceData, setPriceData }) => {
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPriceData({ price: 0, startDate: null, endDate: null, status: "ACTIVE", trips: [] });
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (priceData.id) {
        await onEdit(); // Gọi hàm onEdit nếu có ID
      } else {
        await onAdd(); // Gọi hàm onAdd nếu không có ID
      }
      resetForm();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={priceData.id ? "Chỉnh Sửa Giá" : "Thêm Giá"}
      open={isOpen}
      onCancel={resetForm}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Giá" required>
          <Input
            type="number"
            value={priceData.price}
            onChange={(e) => setPriceData({ ...priceData, price: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu" required>
          <DatePicker
            showTime
            value={priceData.startDate}
            onChange={(date) => setPriceData({ ...priceData, startDate: date })}
            required
          />
        </Form.Item>
        <Form.Item label="Ngày kết thúc" required>
          <DatePicker
            showTime
            value={priceData.endDate}
            onChange={(date) => setPriceData({ ...priceData, endDate: date })}
            required
          />
        </Form.Item>
        <Form.Item label="Trạng thái">
          <Input
            value={priceData.status}
            onChange={(e) => setPriceData({ ...priceData, status: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {priceData.id ? "Cập Nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={resetForm}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPriceModal;
