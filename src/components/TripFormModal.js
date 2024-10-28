import React from "react";
import { Modal, Form, Input, Select, message } from "antd";

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
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const { Option } = Select;

  React.useEffect(() => {
    if (trip) {
      form.setFieldsValue({
        distance: trip.attributes?.distance || "",
        travelTime: trip.attributes?.travelTime || "",
        departureTime: trip.attributes?.departureTime || "",
        arrivalTime: trip.attributes?.arrivalTime || "",
        status: trip.attributes?.status || "",
        ticketId: trip.attributes?.ticket?.data?.id || "",
        ticketPrice:
          trip.attributes?.ticket_price?.data?.attributes.price || "",
        seatNumber: trip.attributes?.seat?.data?.attributes.seatNumber || "",
        pickupPoint: trip.attributes?.pickup_point?.data?.id || "",
        dropOffPoint: trip.attributes?.drop_off_point?.data?.id || "",
        departureLocationId: trip.attributes.departure_location_id.data.id,
        arrivalLocationId: trip.attributes.arrival_location_id.data.id,
      });
    } else {
      form.resetFields();
    }
  }, [trip, form]);

  const calculateTravelTime = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const travelTimeInMs = Math.abs(arrival - departure);

    const hours = Math.floor(travelTimeInMs / (1000 * 60 * 60));
    const minutes = Math.floor(
      (travelTimeInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${hours} giờ ${minutes} phút`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      values.travelTime = calculateTravelTime(
        values.departureTime,
        values.arrivalTime
      );
      // Kiểm tra xem điểm khởi hành và điểm đến có trùng nhau không
      if (values.departureLocationId === values.arrivalLocationId) {
        message.error("Điểm khởi hành và điểm đến không được trùng nhau!");
        return; // Dừng hàm nếu có lỗi
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

  return (
    <Modal
      title={trip ? "Cập Nhật Chuyến Đi" : "Tạo Chuyến Đi Mới"}
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={loading}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical">
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
          name="distance"
          label="Khoảng Cách"
          rules={[{ required: true, message: "Vui lòng nhập khoảng cách!" }]}
        >
          <Input placeholder="Nhập khoảng cách" />
        </Form.Item>

        <Form.Item
          name="departureTime"
          label="Thời Gian Khởi Hành"
          rules={[
            { required: true, message: "Vui lòng nhập thời gian khởi hành!" },
          ]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item
          name="arrivalTime"
          label="Thời Gian Đến"
          rules={[{ required: true, message: "Vui lòng nhập thời gian đến!" }]}
        >
          <Input type="datetime-local" />
        </Form.Item>
        <Form.Item
          name="ticketId"
          label="Vé"
          rules={[{ required: true, message: "Vui lòng chọn vé!" }]}
        >
          <Select placeholder="Chọn vé">
            {tickets.map((ticket) => (
              <Option key={ticket.id} value={ticket.id}>
                {`Vé ID: ${ticket.id} - ${
                  ticket.attributes?.status || "Unknown Status"
                }`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="seatNumber"
          label="Số Ghế"
          rules={[{ required: true, message: "Vui lòng nhập số ghế!" }]} // Thêm rule nếu cần
        >
          <Input placeholder="Nhập số ghế" />
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
          name="status"
          label="Trạng Thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value="HOẠT ĐỘNG">HOẠT ĐỘNG</Option>
            <Option value="HẾT HẠN">HẾT HẠN</Option>
            <Option value="KHÔNG HOẠT ĐỘNG">KHÔNG HOẠT ĐỘNG</Option>
            <Option value="HỦY">HỦY</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TripFormModal;
