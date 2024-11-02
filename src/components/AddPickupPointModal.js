import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";

const AddPickupPointModal = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  pickupPoint,
  setPickupPoint,
}) => {
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPickupPoint({ location: "", address: "", MaDiemDon: "" }); // Reset input fields
    onClose(); // Close the modal
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (
        !pickupPoint.location ||
        !pickupPoint.address ||
        !pickupPoint.MaDiemDon
      ) {
        message.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      if (!pickupPoint.MaDiemDon.startsWith("MPP")) {
        message.error("Mã điểm đón phải bắt đầu bằng MPP!");
        return;
      }

      if (pickupPoint.id) {
        await onEdit(); // Call edit function if editing
      } else {
        await onAdd(); // Call add function if adding
      }
      resetForm(); // Reset form after success
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error:", error); // Log error for debugging
    } finally {
      setLoading(false);
    }
  };
  const handleMaDiemDonChange = (e) => {
    let value = e.target.value;
    if (!value.startsWith("MPP")) {
      value = "MPP" + value;
    }
    setPickupPoint({ ...pickupPoint, MaDiemDon: value });
  };

  return (
    <Modal
      title={pickupPoint.MaDiemDon ? "Chỉnh Sửa Điểm Đón" : "Thêm Điểm Đón"}
      open={isOpen}
      onCancel={resetForm}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Mã Điểm Đón"
          required
          rules={[
            { required: true, message: "Vui lòng nhập mã điểm đón!" },
            {
              pattern: /^MPP\d+$/,
              message: "Mã điểm đón phải bắt đầu bằng MPP và theo sau là số!",
            },
          ]}
        >
          <Input
            value={pickupPoint.MaDiemDon}
            onChange={handleMaDiemDonChange}
            placeholder="Nhập mã điểm đón (VD: MPP01)"
          />
        </Form.Item>
        <Form.Item label="Điểm đón" required>
          <Input
            value={pickupPoint?.location}
            onChange={(e) =>
              setPickupPoint({ ...pickupPoint, location: e.target.value })
            }
            required
          />
        </Form.Item>
        <Form.Item label="Địa chỉ" required>
          <Input
            value={pickupPoint?.address}
            onChange={(e) =>
              setPickupPoint({ ...pickupPoint, address: e.target.value })
            }
            required
          />
        </Form.Item>
        {pickupPoint.trips && pickupPoint.trips.data && (
          <Form.Item label="Chuyến đi liên quan">
            <ul>
              {pickupPoint.trips.data.map((trip) => (
                <li key={trip.id}>
                  {trip.attributes.departureLocation} -{" "}
                  {trip.attributes.arrivalLocation} ({trip.attributes.status})
                </li>
              ))}
            </ul>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {pickupPoint.MaDiemDon ? "Cập Nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={resetForm}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPickupPointModal;
