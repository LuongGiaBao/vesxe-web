// src/components/ScheduleFormModal.js
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, TimePicker, Select, message } from "antd";
import moment from "moment";
import { fetchAllBuses } from "../api/BusesApi";
import { fetchAllTrips } from "../api/TripApi";
import { fetchAllSchedules } from "../api/ScheduleApi";
const { Option } = Select;
const ScheduleFormModal = ({ visible, onCancel, onOk, initialValues }) => {
  const [form] = Form.useForm();
  const [trips, setTrips] = useState([]); // State cho danh sách tuyến
  const [buses, setBuses] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingSchedules, setExistingSchedules] = useState([]);

  useEffect(() => {
    if (visible) {
      loadExistingSchedules();
    }
  }, [visible]);

  const loadExistingSchedules = async () => {
    try {
      const response = await fetchAllSchedules();
      setExistingSchedules(response.data);
    } catch (error) {
      console.error("Error loading schedules:", error);
    }
  };

  // Hàm kiểm tra mã lịch trình đã tồn tại
  const checkScheduleIdExists = (scheduleId) => {
    return existingSchedules.some((schedule) => {
      // Nếu đang trong chế độ chỉnh sửa, bỏ qua ID của chính nó
      if (initialValues && schedule.id === initialValues.id) {
        return false;
      }
      return schedule.attributes.IDSchedule === scheduleId;
    });
  };

  // Hàm validate mã lịch trình
  const validateScheduleId = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Vui lòng nhập mã lịch trình!"));
    }

    // Kiểm tra định dạng
    if (!/^ML\d{2}$/.test(value)) {
      return Promise.reject(
        new Error("Mã lịch trình phải có định dạng ML + 2 số!")
      );
    }

    // Kiểm tra trùng lặp
    if (checkScheduleIdExists(value)) {
      return Promise.reject(new Error("Mã lịch trình đã tồn tại!"));
    }

    return Promise.resolve();
  };

  // Fetch dữ liệu tuyến và xe khi modal mở
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsResponse, busesResponse] = await Promise.all([
          fetchAllTrips(),
          fetchAllBuses(),
        ]);
        const activeTrips = tripsResponse.data.filter(
          (trip) => trip.attributes.status === "Hoạt động"
        );
        const activeBuses = busesResponse.data.filter(
          (bus) => bus.attributes.status === "Hoạt động"
        );
        setTrips(activeTrips);
        setBuses(activeBuses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible]);

  React.useEffect(() => {
    setIsEditing(!!initialValues);
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues.attributes,
        ngaydi: moment(initialValues.attributes.ngaydi),
        ExpectedTime: moment(
          initialValues.attributes.MaTuyen.data.attributes.ExpectedTime,
          "HH:mm"
        ),
        MaTuyen: initialValues.attributes.MaTuyen.data.attributes.MaTuyen,
        BienSo: initialValues.attributes?.BienSo?.data?.attributes?.BienSo,
        status: initialValues.attributes.status,
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
      form.setFieldsValue({
        status: "Ngưng hoạt động",
      });
    }
  }, [initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (checkScheduleIdExists(values.IDSchedule)) {
        message.error("Mã lịch trình đã tồn tại!");
        return;
      }
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
      title={isEditing ? "Cập nhật Lịch Trình" : "Thêm Lịch Trình Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Lịch Trình"
          name="IDSchedule"
          rules={[
            { required: true, message: "Vui lòng nhập mã lịch trình!" },
            { validator: validateScheduleId },
          ]}
          validateTrigger={["onChange", "onBlur"]}
        >
          <Input
            placeholder="ML0000"
            maxLength={6}
            onChange={(e) => {
              let value = e.target.value.toUpperCase();
              // Tự động thêm ML nếu chưa có
              if (!value.startsWith("ML")) {
                value = "ML" + value.replace(/[^0-9]/g, "");
              } else {
                value = "ML" + value.replace(/[^0-9]/g, "");
              }
              // Cập nhật giá trị trong form
              form.setFieldsValue({
                IDSchedule: value,
              });
            }}
          />
        </Form.Item>
        <Form.Item label="Ngày Đi" name="ngaydi" rules={[{ required: true }]}>
          <DatePicker showTime format="DD-MM-YYYY HH:mm" />
        </Form.Item>

        <Form.Item
          label="Tuyến Đường"
          name="MaTuyen"
          rules={[{ required: true, message: "Vui lòng chọn tuyến!" }]}
        >
          <Select
            placeholder="Chọn tuyến đường"
            onChange={(value) => {
              const selectedTrip = trips.find((trip) => trip.id === value);
              setSelectedTrip(selectedTrip);
            }}
          >
            {trips.map((trip) => (
              <Option key={trip.id} value={trip.id}>
                {trip.attributes &&
                trip.attributes.departure_location_id &&
                trip.attributes.arrival_location_id
                  ? `${
                      trip.attributes.departure_location_id.data?.attributes
                        ?.name || "N/A"
                    } → ${
                      trip.attributes.arrival_location_id.data?.attributes
                        ?.name || "N/A"
                    }`
                  : "Tuyến không hợp lệ"}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedTrip && (
          <>
            <Form.Item label="Điểm Khởi Hành">
              <Input
                value={
                  selectedTrip.attributes.departure_location_id.data.attributes
                    .name
                }
                disabled
              />
            </Form.Item>
            <Form.Item label="Điểm Đến">
              <Input
                value={
                  selectedTrip.attributes.arrival_location_id.data.attributes
                    .name
                }
                disabled
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          label="Biển Số Xe"
          name="BienSo"
          rules={[{ required: true, message: "Vui lòng chọn xe!" }]}
        >
          <Select>
            {buses.map((bus) => (
              <Option key={bus.id} value={bus.id}>
                {`${bus.attributes.BienSo} - ${bus.attributes.busName}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select disabled={!isEditing}>
            {" "}
            {/* Disable khi đang tạo mới */}
            <Option value="Hoạt động">Hoạt động</Option>
            <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ScheduleFormModal;
