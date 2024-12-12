// src/components/PriceDetailModal.js
import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import moment from "moment";

const PriceDetailModal = ({ visible, onCancel, price }) => {
  if (!price) return null;

  const { attributes } = price;
  const detailPrices = attributes.detai_prices?.data || [];
  return (
    <Modal
      title="Chi Tiết Bảng Giá"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
    >
      <Descriptions bordered column={1}>
        {/* Thông tin chung về giá */}
        <Descriptions.Item label="Mã Giá">
          {attributes.MaGia || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Thời Gian Áp Dụng">
          <div>
            <strong>Bắt đầu:</strong>{" "}
            {moment(attributes.startDate).format("DD/MM/YYYY HH:mm")}
          </div>
          <div>
            <strong>Kết thúc:</strong>{" "}
            {moment(attributes.endDate).format("DD/MM/YYYY HH:mm")}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          {attributes.Mota || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">
          {detailPrices.length > 0
            ? detailPrices.map((detail) => (
                <div key={detail.id}>
                  {`${parseInt(detail.attributes.Gia).toLocaleString()} VNĐ`}
                </div>
              ))
            : "N/A"}
        </Descriptions.Item>

        {/* Thông tin chi tiết giá */}
        <Descriptions.Item label="Mã Chi Tiết Giá">
          {detailPrices.length > 0
            ? detailPrices.map((detail) => (
                <div key={detail.id}>
                  {detail.attributes.MaChiTietGia || "N/A"}
                </div>
              ))
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tuyến">
          {detailPrices.length > 0
            ? detailPrices.map((detail) => {
                const departure =
                  detail.attributes.trip?.data?.attributes
                    ?.departure_location_id?.data?.attributes?.name || "N/A";
                const arrival =
                  detail.attributes.trip?.data?.attributes?.arrival_location_id
                    ?.data?.attributes?.name || "N/A";
                return (
                  <div key={detail.id}>
                    {`${departure} → ${arrival}`}{" "}
                    {/* Gom điểm khởi hành và điểm đến */}
                  </div>
                );
              })
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={attributes.status === "Hoạt động" ? "green" : "red"}>
            {attributes.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PriceDetailModal;
