import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

const LocationModal = ({ visible, onCancel, onSave, location }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (location) {
      form.setFieldsValue({
        name: location.attributes.name,
      });
    } else {
      form.resetFields();
    }
  }, [location, form]);

  const handleFinish = (values) => {
    onSave(values);
  };

  return (
    <Modal
      title={location ? "Sửa Địa Điểm" : "Thêm Địa Điểm"}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleFinish}>
        <Form.Item
          label="Tên Địa Điểm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên địa điểm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô Tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả địa điểm!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LocationModal;
