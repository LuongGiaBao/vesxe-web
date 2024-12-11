import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { fetchAllTrips } from "../api/TripApi";
import {
  checkDuplicatePriceDetail,
  createPriceDetail,
  deletePriceDetail,
  updatePriceDetail,
} from "../api/PriceDetailApi";
const { Option } = Select;
// PriceDetailFormModal.js
const PriceDetailFormModal = ({
  visible,
  onCancel,
  onOk,
  priceId,
  editingPriceDetail,
  reloadData,
}) => {
  const [form] = Form.useForm();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    loadTrips();
    if (editingPriceDetail) {
      form.setFieldsValue({
        MaChiTietGia: editingPriceDetail.attributes.MaChiTietGia,
        trip: editingPriceDetail.attributes.trip?.data?.id,
        Gia: editingPriceDetail.attributes.Gia,
      });
    }
  }, [editingPriceDetail, form]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await fetchAllTrips();
      const activeTrips = response.data.filter(
        (trip) => trip.attributes.status === "Hoạt động"
      );
      setTrips(activeTrips);
    } catch (error) {
      message.error("Không thể tải danh sách tuyến");
    } finally {
      setLoading(false);
    }
  };
  const handleOk = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const values = await form.validateFields();

      // Chuẩn bị dữ liệu để gửi
      const submitData = {
        data: {
          MaChiTietGia: values.MaChiTietGia,
          Gia: Number(values.Gia),
          trip: { connect: [{ id: values.trip }] },
          ticket_price: { connect: [{ id: priceId }] },
        },
      };

      // Gửi dữ liệu, kiểm tra trạng thái đang sửa hoặc thêm mới
      if (editingPriceDetail) {
        await updatePriceDetail(editingPriceDetail.id, submitData.data);
      } else {
        await createPriceDetail(submitData.data);
      }

      // Hiển thị thông báo thành công
      message.success(
        editingPriceDetail
          ? "Cập nhật chi tiết giá thành công!"
          : "Thêm chi tiết giá thành công!"
      );

      // Reset form và làm mới giao diện
      form.resetFields();
      onCancel();
      await reloadData();
      if (typeof onOk === "function") {
        await onOk(values);
      }
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Có lỗi xảy ra khi xử lý dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (editingPriceDetail) {
      try {
        await deletePriceDetail(editingPriceDetail.id);
        message.success("Xóa chi tiết giá thành công");
        onCancel(); // Đóng modal sau khi xóa
      } catch (error) {
        message.error("Có lỗi xảy ra khi xóa chi tiết giá");
      }
    }
  };

  const handleMaGiaChange = async (e) => {
    let value = e.target.value.trim(); // Loại bỏ khoảng trắng thừa

    // Kiểm tra xem giá trị có bắt đầu với "MCTG" hay không
    if (value && !value.startsWith("MCTG")) {
      // Nếu mã không bắt đầu bằng "MCTG", tự động thêm vào đầu
      form.setFieldsValue({ MaChiTietGia: "MCTG" + value });
    } else if (value && value.startsWith("MCTG")) {
      // Nếu mã bắt đầu bằng "MCTG", chỉ giữ nguyên phần số sau "MCTG"
      let numberPart = value.substring(4); // Lấy phần số sau "MCTG"

      // Kiểm tra xem phần số có phải là số hay không
      if (!/^\d+$/.test(numberPart)) {
        numberPart = "01"; // Nếu phần số không hợp lệ, mặc định thành "01"
      }

      // Đảm bảo số có ít nhất 2 chữ số
      if (numberPart.length === 1) {
        numberPart = "0" + numberPart;
      }

      // Cập nhật lại giá trị mã chi tiết giá
      form.setFieldsValue({ MaChiTietGia: "MCTG" + numberPart });
    }
  };

  return (
    <Modal
      title={editingPriceDetail ? "Cập nhật chi tiết giá" : "Thêm chi tiết giá"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered
      footer={[
        <Button
          key="delete"
          type="danger"
          onClick={handleDelete}
          disabled={!editingPriceDetail}
        >
          Xóa
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {editingPriceDetail ? "Cập nhật" : "Thêm"}
        </Button>,
      ]}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="MaChiTietGia"
          label="Mã Chi Tiết Giá"
          initialValue="MCTG"
          rules={[
            { required: true, message: "Vui lòng nhập mã chi tiết giá!" },
            {
              min: 6,
              message: "Vui lòng nhập số sau MCTG",
            },
          ]}
        >
          <Input
            placeholder="Ví dụ: MCTG001"
            onChange={handleMaGiaChange}
            value={form.getFieldValue("MaChiTietGia")}
          />
        </Form.Item>

        <Form.Item
          name="trip"
          label="Tuyến"
          rules={[{ required: true, message: "Vui lòng chọn tuyến!" }]}
        >
          <Select
            placeholder="Chọn tuyến"
            loading={loading}
            showSearch
            optionFilterProp="children"
          >
            {trips.map((trip) => (
              <Option key={trip.id} value={trip.id}>
                {`${trip.attributes.departure_location_id.data.attributes.name} → 
            ${trip.attributes.arrival_location_id.data.attributes.name}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="Gia"
          label="Giá"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Ví dụ: 100000"
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PriceDetailFormModal;
