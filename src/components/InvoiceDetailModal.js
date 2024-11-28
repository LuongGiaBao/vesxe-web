import React from "react";
import { Modal, Descriptions, Tag, Typography } from "antd";

const { Title } = Typography;

const InvoiceDetailModal = ({ visible, onCancel, invoices }) => {


  if (!invoices) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const invoiceData = invoices.data?.attributes; // Lấy thuộc tính của hóa đơn đầu tiên

  return (
    <Modal
      visible={visible}
      title={`Chi tiết hóa đơn: ${invoiceData?.MaHoaDon}`}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={1}>
        {/* <Descriptions.Item label="Mã hóa đơn">
          {invoiceData?.MaHoaDon}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label="Mã khách hàng">
          {invoiceData?.customerId?.data?.attributes?.MaKH || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">
          {invoiceData?.customerId?.data?.attributes?.TenKH || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {invoiceData?.customerId?.data?.attributes?.Email || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Mã nhân viên">
          {invoiceData?.employeeId?.data?.attributes?.MaNV || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tên nhân viên">
          {invoiceData?.employeeId?.data?.attributes?.tenNV || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Mã lịch">
          {invoiceData?.scheduleId?.data?.attributes?.IDSchedule || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag
            color={invoiceData?.status === "Thành công" ? "green" : "orange"}
          >
            {invoiceData?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDateTime(invoiceData?.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {invoiceData?.PhuongThucThanhToan?.trim() || "N/A"}
        </Descriptions.Item> */}
      </Descriptions>

      {/* <Title level={4} style={{ marginTop: 20 }}>
        Chi tiết hóa đơn
      </Title>
      <Descriptions bordered column={1}>
        {invoiceData?.detail_invoices?.data?.map((detail) => (
          <Descriptions.Item
            key={detail.id}
            label={`Chi tiết ${detail.attributes.MaChiTietHoaDon}`}
          >
            Số lượng: {detail.attributes.soluong} - Tổng tiền:{" "}
            {detail.attributes.tongTien.toLocaleString("vi-VN")} VNĐ
          </Descriptions.Item>
        )) || (
          <Descriptions.Item label="Không có chi tiết hóa đơn">
            N/A
          </Descriptions.Item>
        )}
      </Descriptions> */}
    </Modal>
  );
};

export default InvoiceDetailModal;
