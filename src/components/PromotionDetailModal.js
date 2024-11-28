// PromotionDetailModal.js
import React from "react";
import { Modal, Descriptions, Table, Tag } from "antd";
import moment from "moment";

const PromotionDetailModal = ({ visible, onCancel, promotion }) => {
  const columns = [
    {
      title: "Mã Chi Tiết",
      dataIndex: ["attributes", "MaChiTietKhuyenMai"],
      key: "MaChiTietKhuyenMai",
    },
    {
      title: "Loại Khuyến Mãi",
      dataIndex: ["attributes", "LoaiKhuyenMai"],
      key: "LoaiKhuyenMai",
    },
    {
      title: "Mô tả",
      dataIndex: ["attributes", "description"],
      key: "description",
    },
  ];

  const expandedRowRender = (record) => {
    const { attributes } = record;
    let details = [];

    if (attributes.LoaiKhuyenMai === "Tặng tiền") {
      details = [
        {
          label: "Tổng tiền hóa đơn",
          value: `${attributes.TongTienHoaDon?.toLocaleString()} VNĐ`,
        },
        {
          label: "Số tiền tặng",
          value: `${attributes.SoTienTang?.toLocaleString()} VNĐ`,
        },
      ];
    } else if (attributes.LoaiKhuyenMai === "Chiết khấu hóa đơn") {
      details = [
        {
          label: "Tổng tiền hóa đơn",
          value: `${attributes.TongTienHoaDon?.toLocaleString()} VNĐ`,
        },
        {
          label: "% Chiết khấu",
          value: `${attributes.PhanTramChietKhau}%`,
        },
        {
          label: "Số tiền KM tối đa",
          value: `${attributes.SoTienKhuyenMaiToiDa?.toLocaleString()} VNĐ`,
        },
      ];
    }

    return (
      <Descriptions column={1}>
        {details.map((item, index) => (
          <Descriptions.Item key={index} label={item.label}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    );
  };

  return (
    <Modal
      visible={visible}
      title="Chi tiết khuyến mãi"
      onCancel={onCancel}
      width={1000}
      footer={null}
      centered
    >
      {promotion && (
        <>
          <Descriptions title="Thông tin khuyến mãi" bordered>
            <Descriptions.Item label="Mã Khuyến Mãi">
              {promotion.attributes.IDPromotion}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {promotion.attributes.description}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {moment(promotion.attributes.startDate).format(
                "DD/MM/YYYY "
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày kết thúc">
              {moment(promotion.attributes.endDate).format("DD/MM/YYYY ")}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={
                  promotion.attributes.status === "Hoạt động" ? "green" : "red"
                }
              >
                {promotion.attributes.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <h3 style={{ margin: "20px 0", fontWeight: "bold" }}>
            Chi tiết loại khuyến mãi
          </h3>
          <Table
            columns={columns}
            dataSource={promotion.attributes.detail_promotions?.data || []}
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => true,
            }}
            rowKey={(record) => record.id}
          />
        </>
      )}
    </Modal>
  );
};

export default PromotionDetailModal;
