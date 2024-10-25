// src/components/AddUserModal.js

import { Modal, Form, Input, Button, message } from "antd";
import { useState } from "react";

const AddUserModal = ({ isOpen, onClose, onAdd, onEdit, user, setUser }) => {
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUser({ username: "", email: "", id: null }); // Đặt lại các trường nhập liệu
    onClose(); // Đóng modal
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (user.id) {
        await onEdit(); // Gọi hàm onEdit nếu đang sửa
      } else {
        await onAdd(); // Gọi hàm onAdd nếu đang thêm
      }
      resetForm(); // Đặt lại form sau khi thành công
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={user.id ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng"}
      visible={isOpen}
      onCancel={resetForm}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Tên Người Dùng" required>
          <Input
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item label="Email" required>
          <Input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {user.id ? "Cập Nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={resetForm}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
