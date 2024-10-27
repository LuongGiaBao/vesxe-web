import React from "react";
import { Modal } from "antd";
import { formatVietnamTime } from "../utils/timeUtils";

const TripDetailModal = ({ visible, onCancel, trip }) => {
  return (
    <Modal
      title="Chi Tiết Chuyến Đi"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered={true}
      // style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {trip && (
        <div>
          <p>
            <strong>ID Chuyến Đi:</strong> {trip.id}
          </p>
          <p>
            <strong>ID Vé:</strong> {trip.attributes?.ticket?.data?.id || "N/A"}
          </p>
          <p>
            <strong>Điểm Đón:</strong>{" "}
            {trip.attributes?.pickup_point?.data?.attributes?.location || "N/A"}
          </p>
          <p>
            <strong>Điểm Trả:</strong>{" "}
            {trip.attributes?.drop_off_point?.data?.attributes?.location ||
              "N/A"}
          </p>
          <p>
            <strong>Điểm Khởi Hành:</strong>{" "}
            {trip.attributes?.departure_location_id?.data?.attributes?.name ||
              "N/A"}
          </p>
          <p>
            <strong>Điểm Đến:</strong>{" "}
            {trip.attributes?.arrival_location_id?.data?.attributes?.name ||
              "N/A"}
          </p>
          <p>
            <strong>Số ghế:</strong>{" "}
            {trip.attributes?.seat?.data?.attributes?.seatNumber || "N/A"}
          </p>
          <p>
            <strong>Khoảng Cách:</strong> {trip.attributes?.distance || "N/A"}
          </p>
          <p>
            <strong>Thời Gian Di Chuyển:</strong>{" "}
            {trip.attributes?.departureTime && trip.attributes?.arrivalTime
              ? (() => {
                  const departureTime = new Date(trip.attributes.departureTime);
                  const arrivalTime = new Date(trip.attributes.arrivalTime);
                  const travelTime = Math.abs(arrivalTime - departureTime); // Tính khoảng cách thời gian

                  const days = Math.floor(travelTime / (1000 * 60 * 60 * 24)); // Số ngày
                  const hours = Math.floor(
                    (travelTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  ); // Số giờ
                  const minutes = Math.floor(
                    (travelTime % (1000 * 60 * 60)) / (1000 * 60)
                  ); // Số phút

                  return `${days} ngày, ${hours} giờ ${minutes} phút`;
                })()
              : "N/A"}
          </p>
          <p>
            <strong>Thời Gian Khởi Hành:</strong>{" "}
            {trip.attributes?.departureTime
              ? formatVietnamTime(trip.attributes.departureTime)
              : "N/A"}
          </p>
          <p>
            <strong>Thời Gian Đến:</strong>{" "}
            {trip.attributes?.arrivalTime
              ? formatVietnamTime(trip.attributes.arrivalTime)
              : "N/A"}
          </p>
          <p>
            <strong>Trạng Thái:</strong> {trip.attributes?.status || "N/A"}
          </p>
        </div>
      )}
    </Modal>
  );
};

export default TripDetailModal;
