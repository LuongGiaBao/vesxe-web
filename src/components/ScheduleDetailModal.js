// src/components/ScheduleDetailModal.js
import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import moment from "moment";

const ScheduleDetailModal = ({ visible, onCancel, schedule }) => {
  if (!schedule) return null;

  const {
    attributes: {
      IDSchedule,
      ngaydi,
      MaTuyen,
      BienSo,
      MaDiemDon,
      MaDiemTra,
    } = {},
  } = schedule;

  const calculateArrivalTime = (departureTime, expectedTime) => {
    if (!departureTime || !expectedTime) return null;
    const departure = moment(departureTime);
    const [hours, minutes, seconds] = expectedTime.split(":");

    return departure
      .clone()
      .add(parseInt(hours) || 0, "hours")
      .add(parseInt(minutes) || 0, "minutes")
      .add(parseInt(seconds) || 0, "seconds");
  };

  const expectedTime = MaTuyen?.data?.attributes?.ExpectedTime;
  const arrivalTime = calculateArrivalTime(ngaydi, expectedTime);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "hoạt động":
        return "green";
      case "ngưng hoạt động":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Modal
      title="Chi Tiết Lịch Trình"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered={true}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID Lịch Trình">
          {IDSchedule || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Thời Gian Di Chuyển">
          <div>
            <strong>Ngày đi:</strong>{" "}
            {moment(ngaydi).format("DD/MM/YYYY HH:mm")}
          </div>
          <div>
            <strong>Ngày đến:</strong>{" "}
            {arrivalTime
              ? moment(arrivalTime).format("DD/MM/YYYY HH:mm")
              : "N/A"}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Thông Tin Tuyến">
          {MaTuyen?.data ? (
            <>
              <div>
                <strong>Tuyến đường</strong>{" "}
                {`${MaTuyen.data.attributes.departure_location_id.data.attributes.name} → ${MaTuyen.data.attributes.arrival_location_id.data.attributes.name}`}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <Tag
                  color={
                    MaTuyen.data.attributes.status === "Hoạt động"
                      ? "green"
                      : "red"
                  }
                >
                  {MaTuyen.data.attributes.status}
                </Tag>
              </div>
              <div>
                <strong>Số ghế:</strong> {MaTuyen.data.attributes.totalSeats}
              </div>
              <div>
                <strong>Thời gian dự kiến:</strong>{" "}
                {moment(
                  MaTuyen.data.attributes.ExpectedTime,
                  "HH:mm:ss.SSS"
                ).format("HH:mm")}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Thông Tin Xe">
          {BienSo?.data ? (
            <>
              <div>
                <strong>Biển số:</strong> {BienSo.data.attributes.BienSo}
              </div>
              <div>
                <strong>Tên xe:</strong> {BienSo.data.attributes.busName}
              </div>
              <div>
                <strong>Số ghế:</strong> {BienSo.data.attributes.seatCount}
              </div>
              <div>
                <strong>Trạng thái:</strong>{" "}
                <Tag
                  color={
                    BienSo.data.attributes.status === "Hoạt động"
                      ? "green"
                      : "red"
                  }
                >
                  {BienSo.data.attributes.status}
                </Tag>
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>

        {/* Thêm thông tin về điểm đón */}
        <Descriptions.Item label="Điểm Đón">
          {MaTuyen?.data?.attributes?.MaDiemDon?.data ? (
            <>
              <div>
                <strong>Mã điểm đón:</strong>{" "}
                {MaTuyen.data.attributes.MaDiemDon.data.attributes.MaDiemDon}
              </div>
              <div>
                <strong>Địa đón:</strong>{" "}
                {MaTuyen.data.attributes.MaDiemDon.data.attributes.location}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {MaTuyen.data.attributes.MaDiemDon.data.attributes.address}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>

        {/* Thêm thông tin về điểm trả */}
        <Descriptions.Item label="Điểm Trả">
          {MaTuyen?.data?.attributes?.MaDiemTra?.data ? (
            <>
              <div>
                <strong>Mã điểm trả:</strong>{" "}
                {MaTuyen.data.attributes.MaDiemTra.data.attributes.MaDiemTra}
              </div>
              <div>
                <strong>Địa trả:</strong>{" "}
                {MaTuyen.data.attributes.MaDiemTra.data.attributes.location}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {MaTuyen.data.attributes.MaDiemTra.data.attributes.address}
              </div>
            </>
          ) : (
            "N/A"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng Thái" span={3}>
          <Tag color={getStatusColor(schedule.attributes.status)}>
            {schedule.attributes.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ScheduleDetailModal;
