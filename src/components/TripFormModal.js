import React, { useState } from "react";
import { Modal, Form, Input, Select, message, TimePicker } from "antd";
import moment from "moment-timezone";

const TripFormModal = ({
  visible,
  onAdd,
  onEdit,
  onCancel,
  trip,
  tickets,
  pickupPoints,
  dropOffPoints,
  locations,
  existingTrips,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { Option } = Select;

  React.useEffect(() => {
    if (trip) {
      const expectedTime = trip.attributes?.ExpectedTime
        ? moment(trip.attributes.ExpectedTime, "HH:mm:ss")
        : null;
      const numericPart = trip.attributes?.MaTuyen?.substring(2) || "";
      form.setFieldsValue({
        MaTuyen: trip.attributes?.MaTuyen || "MT",
        totalSeats: 34, // Ép cứng 34 ghế
        travelTime: trip.attributes?.travelTime || "",
        status: trip.attributes?.status || "",
        ticketId: trip.attributes?.ticket?.data?.id || "",
        ticketPrice:
          trip.attributes?.ticket_price?.data?.attributes.price || "",
        ExpectedTime: expectedTime,
        pickupPoint: trip.attributes?.MaDiemDon?.data?.id || "",
        dropOffPoint: trip.attributes?.MaDiemTra?.data?.id || "",
        departureLocationId: trip.attributes.departure_location_id?.data?.id,
        arrivalLocationId: trip.attributes.arrival_location_id?.data?.id,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        totalSeats: 34, // Ép cứng 34 ghế cho trường hợp tạo mới
        MaTuyen: "MT",
        status: "Ngưng hoạt động",
      });
    }
  }, [trip, form]);

  const formatMaTuyen = (maTuyen) => {
    if (maTuyen.startsWith("MT")) {
      return "MT" + maTuyen.substring(2);
    }
    return maTuyen;
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      values.totalSeats = 34;

      values.MaTuyen = formatMaTuyen(values.MaTuyen);
      if (values.ExpectedTime) {
        values.ExpectedTime = values.ExpectedTime.format("HH:mm:ss");
      }
      // Kiểm tra xem điểm khởi hành và điểm đến có trùng nhau không
      if (values.departureLocationId === values.arrivalLocationId) {
        message.error("Điểm khởi hành và điểm đến không được trùng nhau!");
        return; // Dừng hàm nếu có lỗi
      }

      // Kiểm tra trạng thái hoạt động
      if (values.status === "Hoạt động") {
        const duplicateTrip = existingTrips.find(
          (existingTrip) =>
            existingTrip.id !== trip?.id && // Bỏ qua chuyến hiện tại đang edit
            existingTrip.attributes.status === "Hoạt động" &&
            existingTrip.attributes.departure_location_id.data.id ===
              values.departureLocationId &&
            existingTrip.attributes.arrival_location_id.data.id ===
              values.arrivalLocationId
        );

        if (duplicateTrip) {
          message.error(
            "Đã có một chuyến xe đang hoạt động trên tuyến đường này!"
          );
          return;
        }
      }

      if (trip?.id) {
        await onEdit(values, trip.id);
      } else {
        await onAdd(values);
      }
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMaTuyenChange = (e) => {
    let value = e.target.value;

    // Nếu mã tuyến bắt đầu bằng "MTMT", chỉ giữ lại một "MT"
    if (value.startsWith("MTMT")) {
      value = "MT" + value.substring(4);
    }
    // Nếu mã tuyến không bắt đầu bằng "MT", thêm "MT" vào đầu
    else if (!value.startsWith("MT")) {
      value = "MT" + value;
    }

    // Cập nhật giá trị trong form
    form.setFieldsValue({ MaTuyen: value });
  };
  return (
    <Modal
      title={
        trip
          ? `Cập Nhật Chuyến Đi: ${trip.attributes.MaTuyen}`
          : "Tạo Chuyến Đi Mới"
      }
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={loading}
      onCancel={onCancel}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="MaTuyen"
          label="Mã Tuyến"
          initialValue="MT"
          rules={[
            { required: true, message: "Vui lòng nhập mã tuyến!" },
            {
              pattern: /^MT\d+$/,
              message: "Mã tuyến phải bắt đầu bằng MT và theo sau là số!",
            },
            {
              min: 3,
              message: "Vui lòng nhập số sau MT",
            },
          ]}
        >
          <Input
            value={form.getFieldValue("MaTuyen")}
            onChange={handleMaTuyenChange}
            placeholder="Nhập mã tuyến"
          />
        </Form.Item>
        <Form.Item
          name="departureLocationId"
          label="Điểm Khởi Hành"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn địa điểm khởi hành"
            onChange={(value) => {
              // Lấy giá trị của điểm đến
              const arrivalLocationId = form.getFieldValue("arrivalLocationId");
              if (value === arrivalLocationId) {
                message.error(
                  "Điểm khởi hành và điểm đến không được trùng nhau!"
                );
                form.setFieldsValue({ arrivalLocationId: undefined }); // Reset điểm đến nếu trùng
              }
            }}
          >
            {locations.map((location) => (
              <Select.Option key={location.id} value={location.id}>
                {location.attributes.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="arrivalLocationId"
          label="Điểm Đến"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Chọn địa điểm đến"
            onChange={(value) => {
              // Lấy giá trị của điểm khởi hành
              const departureLocationId = form.getFieldValue(
                "departureLocationId"
              );
              if (value === departureLocationId) {
                message.error(
                  "Điểm khởi hành và điểm đến không được trùng nhau!"
                );
                form.setFieldsValue({ departureLocationId: undefined }); // Reset điểm khởi hành nếu trùng
              }
            }}
          >
            {locations.map((location) => (
              <Select.Option key={location.id} value={location.id}>
                {location.attributes.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="pickupPoint"
          label="Điểm Đón"
          rules={[{ required: true, message: "Vui lòng chọn điểm đón!" }]}
        >
          <Select placeholder="Chọn điểm đón">
            {pickupPoints.map((point) => (
              <Option key={point.id} value={point.id}>
                {point.attributes?.location || "Unknown Pickup Point"}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="dropOffPoint"
          label="Điểm Trả"
          rules={[{ required: true, message: "Vui lòng chọn điểm trả!" }]}
        >
          <Select placeholder="Chọn điểm trả">
            {dropOffPoints.map((point) => (
              <Option key={point.id} value={point.id}>
                {point.attributes?.location || "Unknown Drop-off Point"}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ExpectedTime"
          label="Thời Gian Dự Kiến"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian dự kiến!" },
          ]}
        >
          <TimePicker
            format="HH:mm:ss"
            placeholder="Chọn thời gian dự kiến"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[{ required: true }]}
          initialValue="Ngưng hoạt động"
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option
              value="Hoạt động"
              disabled={!trip} // Disable nếu đang tạo mới (trip === null)
            >
              Hoạt động
            </Select.Option>
            <Select.Option value="Ngưng hoạt động">
              Ngưng hoạt động
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TripFormModal;
