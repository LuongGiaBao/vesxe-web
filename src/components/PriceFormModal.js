// src/components/PriceFormModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Button,
  Table,
  InputNumber,
  Space,
  Tag,
} from "antd";
import moment from "moment";
import { fetchAllTrips } from "../api/TripApi";
import {
  createPriceDetail,
  getPriceDetailsByPriceId,
} from "../api/PriceDetailApi";
const { RangePicker } = DatePicker;
const { Option } = Select;
const PriceFormModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  existingPrices,
}) => {
  const [form] = Form.useForm();
  const [canActivate, setCanActivate] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        MaGia: initialValues.attributes.MaGia,
        Mota: initialValues.attributes.Mota,
        status: initialValues.attributes.status,
        startDate: moment(initialValues.attributes.startDate),
        endDate: moment(initialValues.attributes.endDate),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Ngưng hoạt động" });
    }
  }, [initialValues, form]);

  const handleDateChange = () => {
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");
    const currentStatus = form.getFieldValue("status"); // Lấy trạng thái hiện tại

    if (startDate && endDate) {
      // Kiểm tra xem có bảng giá nào đang hoạt động trong khoảng thời gian này
      const isActivePriceInRange = existingPrices.some(
        (price) =>
          price.attributes.status === "Hoạt động" &&
          moment(price.attributes.startDate).isBefore(endDate) &&
          moment(price.attributes.endDate).isAfter(startDate)
      );

      // Nếu trạng thái hiện tại là "Ngưng hoạt động" và muốn chuyển sang "Hoạt động"
      if (currentStatus === "Ngưng hoạt động") {
        if (isActivePriceInRange) {
          message.warning(
            "Không thể kích hoạt bảng giá này vì đã có bảng giá hoạt động trong khoảng thời gian này."
          );
          return;
        } else {
          // Nếu không có bảng giá nào đang hoạt động, cho phép chuyển sang "Hoạt động"
          form.setFieldsValue({ status: "Hoạt động" });
          return;
        }
      }

      // Nếu trạng thái hiện tại là "Hoạt động", cho phép chuyển sang "Ngưng hoạt động" mà không cần kiểm tra
      if (currentStatus === "Hoạt động") {
        form.setFieldsValue({ status: "Ngưng hoạt động" });
        return;
      }
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const startDate = values.startDate;
      const endDate = values.endDate;
      const currentStatus = values.status; // Lấy trạng thái hiện tại

      // Nếu trạng thái hiện tại là "Ngưng hoạt động", không cần kiểm tra chồng lấp
      if (currentStatus === "Hoạt động") {
        const canActivate = !existingPrices.some(
          (price) =>
            price.attributes.status === "Hoạt động" &&
            moment(price.attributes.endDate).isAfter(startDate) &&
            moment(price.attributes.startDate).isBefore(endDate) // Kiểm tra xem có chồng lấp không
        );

        if (!canActivate) {
          message.warning(
            "Không thể kích hoạt bảng giá này vì đã có bảng giá hoạt động trong khoảng thời gian này."
          );
          return;
        }
      }

      // Gọi hàm onOk với các giá trị đã chuẩn bị
      onOk({
        ...values,
        startDate: startDate.startOf("day").toISOString(),
        endDate: endDate.endOf("day").toISOString(),
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleMaGiaChange = (e) => {
    let value = e.target.value;

    // Nếu mã giá bắt đầu bằng "MGMG", chỉ giữ lại một "MG"
    if (value.startsWith("MGMG")) {
      value = "MG" + value.substring(4);
    }
    // Nếu mã giá không bắt đầu bằng "MG", thêm "MG" vào đầu
    else if (!value.startsWith("MG")) {
      value = "MG" + value;
    }

    // Cập nhật giá trị trong form
    form.setFieldsValue({ MaGia: value });
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật Bảng Giá" : "Thêm Bảng Giá Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Giá"
          name="MaGia"
          initialValue="MG"
          rules={[
            { required: true, message: "Vui lòng nhập mã giá!" },

            {
              min: 3,
              message: "Vui lòng nhập số sau MG",
            },
          ]}
        >
          <Input
            placeholder="Ví dụ: MG001"
            onChange={handleMaGiaChange}
            value={form.getFieldValue("MaGia")}
          />
        </Form.Item>

        <Form.Item
          label="Ngày Bắt Đầu"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="Ngày Kết Thúc"
          name="endDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="Mota"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả bảng giá" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select
            placeholder="Chọn trạng thái"
            disabled={!canActivate && !initialValues}
          >
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">
              Ngưng hoạt động
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PriceFormModal;
