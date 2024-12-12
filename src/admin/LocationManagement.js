import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message, Space } from "antd";
import LocationModal from "../components/LocationModal";
import Sidebar from "../components/Sidebar";
import {
  createLocation,
  deleteLocation,
  fetchAllLocations,
  updateLocation,
} from "../api/LocationApi";
import { Descriptions } from "antd";
const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await fetchAllLocations();
      setLocations(data.data);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const handleCreateLocation = async (values) => {
    try {
      await createLocation(values);
      message.success("Thêm địa điểm mới thành công!");
      loadLocations();
      handleCloseModal();
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm địa điểm. Vui lòng thử lại!");
      console.error("Error creating location:", error);
    }
  };

  const handleUpdateLocation = async (values) => {
    try {
      await updateLocation(selectedLocation.id, values);
      message.success("Cập nhật địa điểm thành công!");
      loadLocations();
      handleCloseModal();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật địa điểm. Vui lòng thử lại!");
      console.error("Error updating location:", error);
    }
  };

  const handleDeleteLocation = (locationId) => {
    Modal.confirm({
      title: "Xác Nhận Xóa",
      content: "Bạn có chắc chắn muốn xóa địa điểm này?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteLocation(locationId);
          message.success("Xóa địa điểm thành công!");
          loadLocations();
        } catch (error) {
          message.error("Không thể xóa địa điểm. Vui lòng thử lại!");
          console.error("Error deleting location:", error);
        }
      },
    });
  };

  const handleSaveLocation = (values) => {
    if (isEditing) {
      handleUpdateLocation(values);
    } else {
      handleCreateLocation(values);
    }
  };

  const showModal = (location = null) => {
    setSelectedLocation(location);
    setIsEditing(!!location);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedLocation(null);
  };

  const showDetailModal = (location) => {
    setSelectedLocation(location);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedLocation(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã địa điểm",
      dataIndex: ["attributes", "MaDiaDiem"],
      key: "MaDiaDiem",
    },
    {
      title: "Tên Địa Điểm",
      dataIndex: ["attributes", "name"],
      key: "name",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, location) => (
        <Space>
          <Button type="primary" onClick={() => showModal(location)}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDeleteLocation(location.id)}>
            Xóa
          </Button>
          <Button type="default" onClick={() => showDetailModal(location)}>
            Xem Chi Tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h2>Quản Lý Địa Điểm</h2>
        <Button type="primary" onClick={() => showModal()}>
          Thêm Địa Điểm
        </Button>
        <Table columns={columns} dataSource={locations} rowKey="id" />

        {/* Modal để thêm/sửa địa điểm */}
        <LocationModal
          visible={isModalVisible}
          onCancel={handleCloseModal}
          onSave={handleSaveLocation}
          location={selectedLocation}
          existingLocations={locations}
        />

        {/* Modal chi tiết địa điểm */}
        <Modal
          title="Chi Tiết Địa Điểm"
          visible={isDetailModalVisible}
          onCancel={handleCloseDetailModal}
          footer={null}
        >
          {selectedLocation && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã Địa Điểm">
                {selectedLocation.attributes.MaDiaDiem}
              </Descriptions.Item>
              <Descriptions.Item label="Tên Địa Điểm">
                {selectedLocation.attributes.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mô Tả">
                {selectedLocation.attributes.description || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default LocationManagement;
