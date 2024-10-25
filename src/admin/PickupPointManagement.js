import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  createPickupPoint,
  deletePickupPoint,
  fetchAllPickupPoint,
  updatePickupPoint,
} from "../api/PickupPoint";
import { Button, Modal, Table, message } from "antd";
import AddPickupPointModal from "../components/Modal";

const PickupPointsManagement = () => {
  const [pickupPoints, setPickupPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [newPickupPoint, setNewPickupPoint] = useState({
    location: "",
    address: "",
  });
  const [editingPoint, setEditingPoint] = useState(null);

  useEffect(() => {
    const getPickupPoints = async () => {
      try {
        const data = await fetchAllPickupPoint();
        setPickupPoints(data.data);
      } catch {
        setError("Không thể lấy danh sách điểm đón");
      } finally {
        setLoading(false);
      }
    };

    getPickupPoints();
  }, []);

  const handleCreate = async () => {
    try {
      const data = await createPickupPoint(newPickupPoint);
      setPickupPoints([...pickupPoints, data.data]);
      resetForm();
      message.success("Thêm điểm đón thành công!");
      setIsModalOpen(false); // Đóng modal sau khi thêm thành công
    } catch {
      setError("Không thể tạo điểm đón");
    }
  };

  const handleEdit = (id) => {
    const point = pickupPoints.find((p) => p.id === id);
    setEditingPoint(point);
    setNewPickupPoint({
      location: point.attributes.location,
      address: point.attributes.address,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingPoint) return;

    const updatedData = {
      location: newPickupPoint.location,
      address: newPickupPoint.address,
    };

    try {
      const data = await updatePickupPoint(editingPoint.id, updatedData);
      setPickupPoints(pickupPoints.map((point) => (point.id === data.data.id ? data.data : point)));
      message.success("Cập nhật điểm đón thành công!");
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      setError("Không thể cập nhật điểm đón");
      message.error(`Cập nhật điểm đón thất bại: ${error.message}`);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa điểm đón này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deletePickupPoint(id);
          setPickupPoints(pickupPoints.filter((point) => point.id !== id));
          message.success("Xóa điểm đón thành công!");
        } catch {
          setError("Không thể xóa điểm đón");
          message.error("Xóa điểm đón thất bại!");
        }
      },
    });
  };

  const resetForm = () => {
    setNewPickupPoint({ location: "", address: "" });
    setEditingPoint(null); // Reset editing point
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Location",
      dataIndex: "location",
      render: (text) => text,
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (text) => text,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
    },
    {
      title: "Published At",
      dataIndex: "publishedAt",
      render: (publishedAt) => new Date(publishedAt).toLocaleString(),
    },
    {
      title: "Action",
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
          <Button type="danger" onClick={() => handleDelete(record.id)}>
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
        <h1>Pickup Points</h1>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm Điểm Đón
        </Button>
        <Table
          dataSource={pickupPoints.map((point) => ({
            id: point.id,
            location: point.attributes.location,
            address: point.attributes.address,
            createdAt: point.attributes.createdAt,
            updatedAt: point.attributes.updatedAt,
            publishedAt: point.attributes.publishedAt,
          }))}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
        <AddPickupPointModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate} 
          pickupPoint={{ ...newPickupPoint, id: editingPoint?.id }} // Truyền thông tin điểm đón
          setPickupPoint={setNewPickupPoint}
        />
      </div>
    </div>
  );
};

export default PickupPointsManagement;
