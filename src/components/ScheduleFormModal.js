// src/components/ScheduleFormModal.js
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, TimePicker, Select } from "antd";
import moment from "moment";
import { fetchAllBuses } from "../api/BusesApi";
import { fetchAllTrips } from "../api/TripApi";
const { Option } = Select;
const ScheduleFormModal = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const [trips, setTrips] = useState([]); // State cho danh sách tuyến
  const [buses, setBuses] = useState([]);

  // Fetch dữ liệu tuyến và xe khi modal mở
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsResponse, busesResponse] = await Promise.all([
          fetchAllTrips(),
          fetchAllBuses(),
        ]);
        setTrips(tripsResponse.data);
        setBuses(busesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible]);

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues.attributes,
        ngaydi: moment(initialValues.attributes.ngaydi),
        ExpectedTime: moment(
          initialValues.attributes.MaTuyen.data.attributes.ExpectedTime,
          "HH:mm"
        ),
        MaTuyen: initialValues.attributes.MaTuyen.data.attributes.MaTuyen,
        BienSo: initialValues.attributes.BienSo.data.attributes.BienSo,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        IDSchedule: initialValues.attributes.IDSchedule,
        ngaydi: moment(initialValues.attributes.ngaydi),
        MaTuyen: initialValues.attributes.MaTuyen?.data?.id,
        BienSo: initialValues.attributes.BienSo?.data?.id,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk({
        ...values,
        ngaydi: values.ngaydi.toISOString(),
        // ExpectedTime: values.ExpectedTime.format("HH:mm:ss"),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật Lịch Trình" : "Thêm Lịch Trình Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Lịch Trình"
          name="IDSchedule"
          rules={[{ required: true }]}
        >
          <Input
            value={`ML${
              form.getFieldValue("IDSchedule")?.replace("ML", "") || ""
            }`}
            onChange={(e) => {
              const value = e.target.value;
              // Loại bỏ "ML" và các ký tự không phải số
              const numericValue = value
                .replace(/ML/g, "")
                .replace(/[^0-9]/g, "");
              form.setFieldsValue({
                IDSchedule: `ML${numericValue}`,
              });
            }}
            maxLength={6} // ML + 4 số
          />
        </Form.Item>
        <Form.Item label="Ngày Đi" name="ngaydi" rules={[{ required: true }]}>
          <DatePicker showTime format="DD-MM-YYYY HH:mm" />
        </Form.Item>
        {/* <Form.Item
          label="Thời Gian Dự Kiến"
          name="ExpectedTime"
          rules={[{ required: true }]}
        >
          <TimePicker format="HH:mm" />
        </Form.Item> */}
        <Form.Item
          label="Mã Tuyến"
          name="MaTuyen"
          rules={[{ required: true, message: "Vui lòng chọn tuyến!" }]}
        >
          <Select>
            {trips.map((trip) => (
              <Option key={trip.id} value={trip.id}>
                {trip.attributes.MaTuyen}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Biển Số Xe"
          name="BienSo"
          rules={[{ required: true, message: "Vui lòng chọn xe!" }]}
        >
          <Select>
            {buses.map((bus) => (
              <Option key={bus.id} value={bus.id}>
                {bus.attributes.BienSo}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleFormModal;
