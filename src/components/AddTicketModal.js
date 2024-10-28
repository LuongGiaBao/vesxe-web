import React, { useEffect } from "react";
import { Modal, Form, Button, Select, message } from "antd";

const AddTicketModal = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  ticketData,
  ticketPrices,
}) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(ticketData.id); // Kiểm tra xem đang ở chế độ chỉnh sửa hay không

  useEffect(() => {
    if (
      isEditing &&
      ticketData &&
      ticketData.attributes
      // ticketData.ticketPrices
    ) {
      form.setFieldsValue({
        status: ticketData.attributes.status,
        prices: ticketData.ticketPrices.map((price) => price.id),
      });
    } else {
      form.resetFields();
    }
  }, [ticketData, form, isEditing]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const ticketInfo = {
        status: values.status,
        priceIds: values.prices,
        ...(values.status === "Đã đặt trước" && {
          expirationTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        }),
      };

      const validStatuses = ["Có sẵn", "Đã bán", "Đã đặt trước"];
      if (!validStatuses.includes(ticketInfo.status)) {
        message.error("Trạng thái không hợp lệ!");
        return;
      }

      if (isEditing) {
        onEdit(ticketInfo);
      } else {
        onAdd(ticketInfo);
      }

      onClose();
    } catch (error) {
      message.error("Vui lòng kiểm tra các trường thông tin!");
    }
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa vé" : "Thêm vé"}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Giá"
          name="prices"
          rules={[{ required: true, message: "Vui lòng chọn giá!" }]}
        >
          <Select placeholder="Chọn giá">
            {ticketPrices.map((ticketPrice) => (
              <Select.Option key={ticketPrice.id} value={ticketPrice.id}>
                {`${ticketPrice.attributes.price} VND`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Select.Option value="Đã bán">Đã bán</Select.Option>
            <Select.Option value="Có sẵn">Có sẵn</Select.Option>
            <Select.Option value="Đã đặt trước">Đã đặt trước</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: "8px" }} onClick={onClose}>
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTicketModal;
