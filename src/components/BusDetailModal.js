// src/components/BusDetailModal.js
import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import moment from "moment";

const BusDetailModal = ({ visible, onCancel, bus }) => {
  if (!bus) return null;

  const { attributes } = bus;

  return (
    <Modal
      title="Chi Tiết Xe"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered={true}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã Xe">
          {attributes.MaXe || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Biển Số Xe">
          {attributes.BienSo || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Tên Xe">
          {attributes.busName || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Số Ghế">
          {attributes.seatCount || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng Thái">
          <Tag color={attributes.status === "Hoạt động" ? "green" : "red"}>
            {attributes.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Lịch Trình">
          {attributes.schedules?.data?.length > 0 ? (
            attributes.schedules.data.map((schedule) => (
              <div key={schedule.id} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Mã lịch trình:</strong>{" "}
                  {schedule.attributes.IDSchedule}
                </p>
                <p>
                  <strong>Ngày đi:</strong>{" "}
                  {moment(schedule.attributes.ngaydi).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </p>
                {schedule.attributes.ngayden && (
                  <p>
                    <strong>Ngày đến:</strong>{" "}
                    {moment(schedule.attributes.ngayden).format(
                      "DD/MM/YYYY HH:mm"
                    )}
                  </p>
                )}
                <hr />
              </div>
            ))
          ) : (
            <p>Chưa có lịch trình</p>
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BusDetailModal;
