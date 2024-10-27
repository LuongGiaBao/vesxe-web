import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const AddTicketModal = ({ isOpen, onClose, onAdd, onEdit, ticketData }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (ticketData.id) {
      form.setFieldsValue({
        status: ticketData.status,
        // price: ticketData.price,
        // seatNumber: ticketData.seat ? ticketData.seat.seatNumber : '',
      });
      setIsEditing(true);
    } else {
      form.resetFields();
      setIsEditing(false);
    }
  }, [ticketData, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const ticketInfo = {
      status: values.status,
      // price: values.price,
      // seat: values.seatNumber ? { data: { attributes: { seatNumber: values.seatNumber } } } : null,
      // Add more fields as needed
    };

    if (isEditing) {
      onEdit(ticketInfo);
    } else {
      onAdd(ticketInfo);
    }

    onClose();
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa vé" : "Thêm vé"}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* 
        <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
          <Input type="number" />
        </Form.Item> 
        */}
        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select>
            <Select.Option value="booked">Đã đặt</Select.Option>
            <Select.Option value="available">Có sẵn</Select.Option>
            <Select.Option value="canceled">Đã hủy</Select.Option>
          </Select>
        </Form.Item>
        {/*
        <Form.Item label="Số ghế" name="seatNumber">
          <Input type="number" />
        </Form.Item> 
        */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={onClose}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTicketModal;
