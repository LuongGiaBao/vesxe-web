import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  message,
} from "antd";
import { fetchAllUsers } from "../api/UserApi";
import { fetchAllTrips } from "../api/TripApi";
const { Option } = Select;

const InvoiceFormModal = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  title,

  isEditing,
}) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersResponse, tripsResponse] = await Promise.all([
          fetchAllUsers(),
          fetchAllTrips(),
        ]);
        setUsers(usersResponse.data);
        setTrips(tripsResponse.data);
      } catch (error) {
        message.error("Không thể tải dữ liệu");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        invoiceNumber: initialValues.invoiceNumber,
        status: initialValues.status,
        totalAmount: initialValues.totalAmount,
        userId: initialValues.users_permissions_user?.data?.id, // Thêm userId
        tripId: initialValues.trip?.data?.id,
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };
  return (
    <Modal
      visible={visible}
      title={title || "Tạo hóa đơn mới"}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="invoiceNumber"
          label="Mã hóa đơn"
          rules={[{ required: true, message: "Vui lòng nhập mã hóa đơn!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="userId"
          label="Khách hàng"
          rules={[{ required: true, message: "Vui lòng chọn khách hàng!" }]}
        >
          <Select>
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.attributes.fullName || user.attributes.username}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="tripId"
          label="Chuyến đi"
          rules={[{ required: true, message: "Vui lòng chọn chuyến đi!" }]}
        >
          <Select>
            {trips.map((trip) => (
              <Option key={trip.id} value={trip.id}>
                {`${trip.attributes.departureLocation} - ${
                  trip.attributes.arrivalLocation
                } (${formatDateTime(trip.attributes.departureTime)})`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value="hoàn thành">Hoàn thành</Option>
            <Option value="chờ thanh toán">Chờ thanh toán</Option>
            <Option value="đã hủy">Đã hủy</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="totalAmount"
          label="Tổng tiền"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền!" }]}
        >
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="paidAt" label="Ngày thanh toán">
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceFormModal;
