import React from 'react';
import { Modal, Descriptions, Tag, Typography } from 'antd';

const { Title } = Typography;

const InvoiceDetailModal = ({ visible, onCancel, invoice }) => {
  if (!invoice) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      visible={visible}
      title={`Chi tiết hóa đơn: ${invoice.attributes.invoiceNumber}`}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Mã hóa đơn">{invoice.attributes.invoiceNumber}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={invoice.attributes.status === 'hoàn thành' ? 'green' : 'orange'}>
            {invoice.attributes.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">{invoice.attributes.totalAmount?.toLocaleString('vi-VN')} VNĐ</Descriptions.Item>
        <Descriptions.Item label="Ngày thanh toán">{formatDateTime(invoice.attributes.paidAt)}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo" span={2}>{formatDateTime(invoice.attributes.createdAt)}</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 20 }}>Thông tin khách hàng</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Tên khách hàng">{invoice.attributes.users_permissions_user.data.attributes.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{invoice.attributes.users_permissions_user.data.attributes.email}</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 20 }}>Thông tin chuyến đi</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Khởi hành">{formatDateTime(invoice.attributes.trip.data.attributes.departureTime)}</Descriptions.Item>
        <Descriptions.Item label="Đến">{formatDateTime(invoice.attributes.trip.data.attributes.arrivalTime)}</Descriptions.Item>
        <Descriptions.Item label="Thời gian di chuyển">{invoice.attributes.trip.data.attributes.travelTime}</Descriptions.Item>
        <Descriptions.Item label="Khoảng cách">{invoice.attributes.trip.data.attributes.distance}</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 20 }}>Thông tin ghế</Title>
      {invoice.attributes.seats.data.map(seat => (
        <Tag key={seat.id} color={seat.attributes.status === 'đã bán' ? 'red' : 'green'} style={{ marginBottom: 8 }}>
          Ghế {seat.attributes.seatNumber} - {seat.attributes.status}
        </Tag>
      ))}

      {invoice.attributes.notes && (
        <>
          <Title level={4} style={{ marginTop: 20 }}>Ghi chú</Title>
          <p>{invoice.attributes.notes}</p>
        </>
      )}
    </Modal>
  );
};

export default InvoiceDetailModal;