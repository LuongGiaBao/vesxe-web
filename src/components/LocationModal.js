import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { Descriptions } from "antd";
const LocationModal = ({
  visible,
  onCancel,
  onSave,
  location,
  existingLocations,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const formItemStyle = {
    width: "100%",
    marginBottom: "15px",
  };

  // Style chung cho tất cả các Input
  const inputStyle = {
    width: "100%",
    maxWidth: "400px", // Đặt chiều rộng tối đa cho input
  };

  useEffect(() => {
    if (location) {
      form.setFieldsValue({
        name: location.attributes.name,
        description: location.attributes.description || "",
        MaDiaDiem: location.attributes.MaDiaDiem || "MDD",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        MaDiaDiem: "MDD", // Giá trị mặc định khi tạo mới
      });
    }
  }, [location, form]);

  const handleFinish = (values) => {
    onSave(values);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    form.setFieldsValue({ name: value });

    // Kiểm tra xem tên địa điểm đã tồn tại chưa
    const isDuplicate = existingLocations.some(
      (loc) => loc.attributes.name.toLowerCase() === value.toLowerCase()
    );

    if (isDuplicate) {
      message.error("Địa điểm này đã tồn tại! Vui lòng nhập tên khác.");
    }
  };

  const handleMaDiaDiemChange = (e) => {
    let value = e.target.value;

    // Nếu mã địa điểm bắt đầu bằng "MDDMDD", chỉ giữ lại một "MDD"
    if (value.startsWith("MDDMDD")) {
      value = "MDD" + value.substring(6);
    }
    // Nếu mã địa điểm không bắt đầu bằng "MDD", thêm "MDD" vào đầu
    else if (!value.startsWith("MDD")) {
      value = "MDD" + value;
    }

    // Cập nhật giá trị trong form
    form.setFieldsValue({ MaDiaDiem: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      const isDuplicate = existingLocations.some(
        (loc) =>
          loc.attributes.name.toLowerCase() === values.name.toLowerCase() &&
          (!location || loc.id !== location.id) // Bỏ qua trường hợp đang edit chính location đó
      );

      if (isDuplicate) {
        message.error("Địa điểm này đã tồn tại! Vui lòng nhập tên khác.");
        setLoading(false);
        return; // Dừng việc tạo/cập nhật nếu trùng
      }

      values.MaDiaDiem = values.MaDiaDiem.startsWith("MDD")
        ? values.MaDiaDiem
        : "MDD" + values.MaDiaDiem;
      await onSave(values);
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={location ? "Sửa Địa Điểm" : "Thêm Địa Điểm"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      centered={true}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Mã Địa Điểm"
          name="MaDiaDiem"
          rules={[
            { required: true, message: "Vui lòng nhập mã địa điểm!" },
            {
              pattern: /^MDD\d+$/,
              message: "Mã địa điểm phải bắt đầu bằng MDD và theo sau là số!",
            },
            {
              min: 4,
              message: "Vui lòng nhập số sau MDD",
            },
          ]}
        >
          <Input
            style={inputStyle}
            onChange={handleMaDiaDiemChange}
            placeholder="Nhập mã địa điểm"
          />
        </Form.Item>
        <Form.Item
          label="Tên Địa Điểm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên địa điểm!" }]}
        >
          <Input
            style={inputStyle}
            onChange={handleNameChange} // Thêm sự kiện onChange
            placeholder="Nhập tên địa điểm"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả!" },
            {
              min: 5,
              message: "Mô tả phải có ít nhất 5 ký tự!",
            },
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả địa điểm"
            rows={4}
            maxLength={500}
            showCount
            style={{ width: "100%", resize: "none" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LocationModal;
