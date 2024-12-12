// src/components/BusFormModal.js
import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const BusFormModal = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        MaXe: initialValues.attributes.MaXe,
        BienSo: initialValues.attributes.BienSo,
        busName: initialValues.attributes.busName,
        seatCount: initialValues.attributes.seatCount,
        status: initialValues.attributes.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Ngưng hoạt động" });
    }
  }, [initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật Thông tin Xe" : "Thêm Xe Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Xe"
          name="MaXe"
          rules={[{ required: true, message: "Vui lòng nhập mã xe!" }]}
        >
          <Input placeholder="Nhập mã xe" maxLength={10} />
        </Form.Item>
        <Form.Item
          label="Biển Số Xe"
          name="BienSo"
          rules={[
            { required: true, message: "Vui lòng nhập biển số xe!" },
            // {
            //   pattern: /^[A-Z0-9]+$/,
            //   message: "Biển số xe chỉ được chứa chữ in hoa và số!",
            // },
          ]}
        >
          <Input placeholder="Nhập biển số xe" maxLength={10} />
        </Form.Item>

        <Form.Item
          label="Tên Xe"
          name="busName"
          rules={[{ required: true, message: "Vui lòng nhập tên xe!" }]}
        >
          <Input placeholder="Nhập tên xe" />
        </Form.Item>

        <Form.Item label="Số Ghế" name="seatCount" initialValue={34}>
          <Input disabled value={34} />
        </Form.Item>

        <Form.Item
          label="Trạng Thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái" disabled={!initialValues}>
            <Option value="Hoạt động">Hoạt động</Option>
            <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BusFormModal;
