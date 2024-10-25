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
    setPickupPoint({ location: "", address: "" }); // Reset input fields
    onClose(); // Close the modal
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
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

  return (
    <Modal
      title={pickupPoint.id ? "Chỉnh Sửa Điểm Đón" : "Thêm Điểm Đón"}
      open={isOpen}
      onCancel={resetForm}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Location" required>
          <Input
            value={pickupPoint?.location}
            onChange={(e) =>
              setPickupPoint({ ...pickupPoint, location: e.target.value })
            }
            required
          />
        </Form.Item>
        <Form.Item label="Address" required>
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
            {pickupPoint.id ? "Cập Nhật" : "Thêm"}
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
