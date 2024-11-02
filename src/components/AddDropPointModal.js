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
    setDropPoint({ location: "", address: "", MaDiemTra: "" }); // Đặt lại các trường nhập liệu
    onClose(); // Đóng modal
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!dropPoint.location || !dropPoint.address || !dropPoint.MaDiemTra) {
        message.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      if (!dropPoint.MaDiemTra.startsWith("MDP")) {
        message.error("Mã điểm trả phải bắt đầu bằng MDP!");
        return;
      }

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

  const handleMaDiemTraChange = (e) => {
    let value = e.target.value;
    // Đảm bảo mã luôn bắt đầu bằng MDP
    if (!value.startsWith("MDP")) {
      value = "MDP" + value;
    }
    setDropPoint({ ...dropPoint, MaDiemTra: value });
  };
  return (
    <Modal
      title={dropPoint.MaDiemTra ? "Chỉnh Sửa Điểm Đến" : "Thêm Điểm Đến"}
      visible={isOpen}
      onCancel={resetForm}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Mã Điểm Trả"
          required
          rules={[
            { required: true, message: "Vui lòng nhập mã điểm trả!" },
            {
              pattern: /^MDP\d+$/,
              message: "Mã điểm trả phải bắt đầu bằng MDP và theo sau là số!",
            },
          ]}
        >
          <Input
            value={dropPoint.MaDiemTra}
            onChange={handleMaDiemTraChange}
            placeholder="Nhập mã điểm trả (VD: MDP01)"
          />
        </Form.Item>

        <Form.Item label="Điểm trả" required>
          <Input
            value={dropPoint.location}
            onChange={(e) =>
              setDropPoint({ ...dropPoint, location: e.target.value })
            }
            required
          />
        </Form.Item>
        <Form.Item label="Địa chỉ" required>
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
            {dropPoint.MaDiemTra ? "Cập Nhật" : "Thêm"}
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
