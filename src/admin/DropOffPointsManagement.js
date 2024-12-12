// src/admin/DropPointsManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  createDropPoint,
  deleteDropPoint,
  fetchAllDropPoint,
  updateDropPoint,
} from "../api/DropoffPoint";
import { Button, Modal, Table, message } from "antd";
import AddDropPointModal from "../components/AddDropPointModal";
// Thêm modal tương tự cho drop points

const DropPointsManagement = () => {
  const [dropPoints, setDropPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDropPoint, setNewDropPoint] = useState({
    location: "",
    address: "",
  });
  const [editingPoint, setEditingPoint] = useState(null);

  useEffect(() => {
    const getDropPoints = async () => {
      try {
        const data = await fetchAllDropPoint();
        setDropPoints(data.data);
      } catch {
        setError("Không thể lấy danh sách điểm đến");
      } finally {
        setLoading(false);
      }
    };

    getDropPoints();
  }, []);

  const handleCreate = async () => {
    try {
      const data = await createDropPoint(newDropPoint);
      setDropPoints([...dropPoints, data.data]);
      resetForm();
      message.success("Thêm điểm đến thành công!");
      setIsModalOpen(false);
    } catch {
      setError("Không thể tạo điểm đến");
    }
  };

  const handleEdit = (id) => {
    const point = dropPoints.find((p) => p.id === id);
    setEditingPoint(point);
    setNewDropPoint({
      id: point.id,
      location: point.attributes.location,
      address: point.attributes.address,
      MaDiemTra: point.attributes.MaDiemTra,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPoint) return;

    const updatedData = {
      location: newDropPoint.location,
      address: newDropPoint.address,
      MaDiemTra: newDropPoint.MaDiemTra,
    };

    try {
      const data = await updateDropPoint(editingPoint.id, updatedData);
      setDropPoints(
        dropPoints.map((point) =>
          point.id === data.data.id ? data.data : point
        )
      );
      message.success("Cập nhật điểm đến thành công!");
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setError("Không thể cập nhật điểm đến");
      message.error(`Cập nhật điểm đến thất bại: ${error.message}`);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa điểm đến này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteDropPoint(id);
          setDropPoints(dropPoints.filter((point) => point.id !== id));
          message.success("Xóa điểm đến thành công!");
        } catch {
          setError("Không thể xóa điểm đến");
          message.error("Xóa điểm đến thất bại!");
        }
      },
    });
  };

  const resetForm = () => {
    setNewDropPoint({ location: "", address: "" });
    setEditingPoint(null);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Mã Điểm trả",
      dataIndex: "MaDiemTra",
      render: (text) => text,
    },
    {
      title: "Điểm trả",
      dataIndex: "location",
      render: (text) => text,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (text) => text,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleEdit(record.id)}
            style={{ marginRight: "8px" }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý điểm trả</h1>
        <Button
          type="primary"
          style={{ marginBottom: 20 }}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Điểm Trả
        </Button>
        <Table
          dataSource={dropPoints.map((point) => ({
            id: point.id,
            location: point.attributes.location,
            address: point.attributes.address,
            MaDiemTra: point.attributes.MaDiemTra,
          }))}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
        <AddDropPointModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate}
          dropPoint={{ ...newDropPoint, id: editingPoint?.id }} // Truyền thông tin điểm đến
          setDropPoint={setNewDropPoint}
        />
      </div>
    </div>
  );
};

export default DropPointsManagement;
