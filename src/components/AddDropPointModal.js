// src/components/AddDropPointModal.js
import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";

const AddDropPointModal = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  dropPoint,
  setDropPoint,
}) => {
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setDropPoint({ location: "", address: "" }); // Đặt lại các trường nhập liệu
    onClose(); // Đóng modal
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (dropPoint.id) {
        await onEdit(); // Gọi hàm onEdit nếu đang sửa
      } else {
        await onAdd(); // Gọi hàm onAdd nếu đang thêm
      }
      resetForm(); // Đặt lại form sau khi thành công
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error:", error); // Ghi log lỗi để kiểm tra
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={dropPoint.id ? "Thêm Điểm Đến" : "Chỉnh Sửa Điểm Đến"}
      visible={isOpen}
      onCancel={resetForm}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Location" required>
          <Input
            value={dropPoint.location}
            onChange={(e) =>
              setDropPoint({ ...dropPoint, location: e.target.value })
            }
            required
          />
        </Form.Item>
        <Form.Item label="Address" required>
          <Input
            value={dropPoint.address}
            onChange={(e) =>
              setDropPoint({ ...dropPoint, address: e.target.value })
            }
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {dropPoint.id ? "Cập Nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={resetForm}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDropPointModal;
