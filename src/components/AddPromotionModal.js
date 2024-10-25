import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
import moment from "moment";

const AddPromotionModal = ({ isOpen, onClose, onAdd, onEdit, promotionData }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = React.useState(false);

  useEffect(() => {
    if (promotionData.id) {
      form.setFieldsValue({
        promotionName: promotionData.promotionName,
        description: promotionData.description,
        discountType: promotionData.discountType,
        discountValue: promotionData.discountValue,
        startDate: moment(promotionData.startDate),
        endDate: moment(promotionData.endDate),
        status: promotionData.status,
      });
      setIsEditing(true);
    } else {
      form.resetFields();
      setIsEditing(false);
    }
  }, [promotionData, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const promotionInfo = {
      promotionName: values.promotionName,
      description: values.description,
      discountType: values.discountType,
      discountValue: values.discountValue,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      status: values.status,
    };

    if (isEditing) {
      onEdit(promotionInfo);
    } else {
      onAdd(promotionInfo);
    }

    onClose();
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa khuyến mãi" : "Thêm khuyến mãi"}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên Khuyến Mãi" name="promotionName" rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mô Tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Loại Giảm Giá" name="discountType" rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}>
          <Select>
            <Select.Option value="percentage">Phần trăm</Select.Option>
            <Select.Option value="amount">Số tiền</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Giá Trị Giảm Giá" name="discountValue" rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá!' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Ngày Bắt Đầu" name="startDate" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Ngày Kết Thúc" name="endDate" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Trạng Thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select>
            <Select.Option value="ACTIVE">Hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Cập nhật" : "Thêm"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPromotionModal;
