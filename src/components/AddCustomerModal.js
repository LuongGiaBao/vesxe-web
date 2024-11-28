import React from "react";
import { Modal, Form, Input } from "antd";

const AddCustomerModal = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  customer,
  setCustomer,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const updatedCustomer = { ...customer, ...values };
      setCustomer(updatedCustomer);

      if (customer.id) {
        onEdit();
      } else {
        onAdd();
      }
    });
  };

  return (
    <Modal
      title={customer.id ? "Chỉnh Sửa Khách Hàng" : "Thêm Khách Hàng"}
      visible={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form form={form} initialValues={customer} layout="vertical">
        <Form.Item
          name="TenKH"
          label="Tên Khách Hàng"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          name="Email"
          label="Email"
          rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          name="DienThoai"
          label="Điện Thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="DiaChi"
          label="Địa Chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
