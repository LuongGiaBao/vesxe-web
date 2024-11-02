import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import moment from "moment";

const TripDetailModal = ({ visible, onCancel, trip }) => {
  if (!trip) return null;

  const {
    id,
    attributes: {
      status,
      totalSeats,
      ExpectedTime,
      MaTuyen,
      seats,
      MaDiemDon,
      MaDiemTra,
      departure_location_id,
      arrival_location_id,
    } = {},
  } = trip;

  const formatTime = (time) => {
    if (!time) return "N/A";
    const momentTime = moment(time, "HH:mm:ss.SSS");
    const hours = momentTime.hours();
    const minutes = momentTime.minutes();
    return `${hours} giờ ${minutes} phút`;
  };

  return (
    <Modal
      title="Chi Tiết Chuyến Đi"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered={true}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã Tuyến">
          {MaTuyen || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng Thái">
          <Tag color={status === "Hoạt động" ? "green" : "red"}>
            {status || "N/A"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Điểm Đón">
          {MaDiemDon?.data ? (
            <>
              <div>
                <strong>Địa điểm:</strong>{" "}
                {MaDiemDon.data.attributes.location}
              </div>
              <div>
                <strong>Địa chỉ:</strong> {MaDiemDon.data.attributes.address}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm Trả">
          {MaDiemTra?.data ? (
            <>
              <div>
                <strong>Địa điểm:</strong>{" "}
                {MaDiemTra.data.attributes.location}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {MaDiemTra.data.attributes.address}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm Khởi Hành">
          {departure_location_id?.data ? (
            <>
              <div>
                <strong>Tên:</strong>{" "}
                {departure_location_id.data.attributes.name}
              </div>
              <div>
                <strong>Mô tả:</strong>{" "}
                {departure_location_id.data.attributes.description ||
                  "Không có mô tả"}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm Đến">
          {arrival_location_id?.data ? (
            <>
              <div>
                <strong>Tên:</strong> {arrival_location_id.data.attributes.name}
              </div>
              <div>
                <strong>Mô tả:</strong>{" "}
                {arrival_location_id.data.attributes.description ||
                  "Không có mô tả"}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng Số Ghế">
          {totalSeats || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Thời Gian Dự Kiến">
          {formatTime(ExpectedTime)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TripDetailModal;
