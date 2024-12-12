// src/admin/ScheduleManagement.js
import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Modal, Tag } from "antd";
import {
  fetchAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../api/ScheduleApi";
import Sidebar from "../components/Sidebar";
import ScheduleFormModal from "../components/ScheduleFormModal";
import ScheduleDetailModal from "../components/ScheduleDetailModal";
import moment from "moment-timezone";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetchAllSchedules();
      setSchedules(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách lịch trình.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (values) => {
    try {
      const scheduleData = {
        ...values,
        status: "Ngưng hoạt động", // Luôn set là "Ngưng hoạt động" khi tạo mới
      };
      await createSchedule(scheduleData);
      message.success("Tạo lịch trình mới thành công!");
      setIsModalVisible(false);
      loadSchedules();
    } catch (error) {
      message.error("Tạo lịch trình mới thất bại!");
    }
  };

  const handleEditSchedule = async (values) => {
    try {
      const scheduleData = {
        ...values,
        status: values.status, // Giữ nguyên status được chọn khi edit
      };
      await updateSchedule(editingSchedule.id, scheduleData);
      message.success("Cập nhật lịch trình thành công!");
      setIsModalVisible(false);
      loadSchedules();
    } catch (error) {
      message.error("Cập nhật lịch trình thất bại!");
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa lịch trình này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      async onOk() {
        try {
          await deleteSchedule(scheduleId);
          message.success("Xóa lịch trình thành công!");
          loadSchedules();
        } catch (error) {
          message.error("Xóa lịch trình thất bại!");
        }
      },
      onCancel() {
        // Người dùng đã hủy thao tác xóa
      },
    });
  };

  const calculateArrivalTime = (departureTime, expectedTime) => {
    const departure = moment(departureTime);
    const [hours, minutes, seconds] = expectedTime.split(":");

    return departure
      .clone()
      .add(parseInt(hours), "hours")
      .add(parseInt(minutes), "minutes")
      .add(parseInt(seconds), "seconds");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã Lịch Trình",
      dataIndex: ["attributes", "IDSchedule"],
      key: "IDSchedule",
    },
    {
      title: "Tuyến Đường",
      dataIndex: ["attributes", "MaTuyen", "data", "attributes"],
      key: "route",
      render: (record, row) => {
        if (!row.attributes?.MaTuyen?.data?.attributes) {
          return "N/A";
        }
        const departureLocation =
          row.attributes.MaTuyen.data.attributes.departure_location_id?.data
            ?.attributes?.name;
        const arrivalLocation =
          row.attributes.MaTuyen.data.attributes.arrival_location_id?.data
            ?.attributes?.name;
        return (
          <span>
            <span>{departureLocation || "N/A"}</span>
            <span style={{ margin: "0 8px" }}>→</span>
            <span>{arrivalLocation || "N/A"}</span>
          </span>
        );
      },
    },
    {
      title: "Biển Số Xe",
      dataIndex: ["attributes", "BienSo", "data", "attributes", "BienSo"],
      key: "BienSo",
    },
    {
      title: "Ngày Đi",
      dataIndex: ["attributes", "ngaydi"],
      key: "ngaydi",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày Đến",
      dataIndex: "attributes",
      key: "ngayden",
      render: (record) => {
        if (
          !record?.ngaydi ||
          !record?.MaTuyen?.data?.attributes?.ExpectedTime
        ) {
          return "N/A";
        }
        const departureTime = record.ngaydi;
        const expectedTime = record.MaTuyen.data.attributes.ExpectedTime;
        const arrivalTime = calculateArrivalTime(departureTime, expectedTime);
        return moment(arrivalTime).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: ["attributes", "status"],
      key: "status",
      render: (status) => (
        <Tag color={status === "Hoạt động" ? "green" : "red"}>
          {status || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingSchedule(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDeleteSchedule(record.id)}>
            Xóa
          </Button>
          <Button
            onClick={() => {
              setSelectedSchedule(record);
              setIsDetailModalVisible(true);
            }}
          >
            Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h2>Quản Lý Lịch Trình</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingSchedule(null);
            setIsModalVisible(true);
          }}
        >
          Thêm Lịch Trình Mới
        </Button>
        <Table
          columns={columns}
          dataSource={schedules}
          rowKey="id"
          loading={loading}
        />
        <ScheduleFormModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={editingSchedule ? handleEditSchedule : handleAddSchedule}
          initialValues={editingSchedule}
        />
        <ScheduleDetailModal
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          schedule={selectedSchedule}
        />
      </div>
    </div>
  );
};

export default ScheduleManagement;
