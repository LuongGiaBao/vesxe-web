import { Space, Table } from "antd";
import React, { useState } from "react";

const PriceDetailComponent = ({ priceId, priceDetails }) => {
  const relevantDetails = priceDetails.filter(
    (detail) => detail.attributes.price?.data?.id === priceId
  );
  const detailColumns = [
    {
      title: "Mã Chi Tiết Giá",
      dataIndex: ["attributes", "MaChiTietGia"],
      key: "MaChiTietGia",
    },
    // {
    //   title: "Tuyến",
    //   dataIndex: ["trip", "data", "attributes"],
    //   key: "trip",
    //   render: (trip) => (
    //     <Space direction="vertical">
    //       <span>Từ: {trip.departure_location_id.data.attributes.name}</span>
    //       <span>Đến: {trip.arrival_location_id.data.attributes.name}</span>
    //     </Space>
    //   ),
    // },
    // {
    //   title: "Tuyến",
    //   key: "tuyen",
    //   render: (_, record) => `${record.trip.data.attributes.MaTuyen}`,
    // },
    {
      title: "Giá",
      dataIndex: ["attributes", "Gia"],
      key: "Gia",
      render: (text) => `${parseInt(text).toLocaleString()} VNĐ`,
    },
  ];
  return (
    <div style={{ padding: "0 48px" }}>
      <Table
        columns={detailColumns}
        dataSource={relevantDetails}
        pagination={false}
        size="small"
        rowKey="id"
      />
    </div>
  );
};

export default PriceDetailComponent;
