// src/components/PriceDetailModal.js
import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import moment from "moment";

const PriceDetailModal = ({ visible, onCancel, price }) => {
  if (!price) return null;

  const { attributes } = price;

  return (
    <Modal
      title="Chi Tiết Bảng Giá"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1}>
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
