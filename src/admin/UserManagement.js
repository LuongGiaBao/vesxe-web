import React, { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  fetchAllUsers,
  updateUser,
} from "../api/UserApi";
import Sidebar from "../components/Sidebar";
import { Table, Button, Modal } from "antd";
import AddUserModal from "../components/AddUserModal";

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
    };
    getUsers();
  }, []);

  const handleCreateUser = async () => {
    const createdUser = await createUser(user);
    setUsers([...users, createdUser]);
    resetForm();
    setModalVisible(false);
  };

  const handleUpdateUser = async () => {
    const updatedUser = await updateUser(editingUserId, user);
    setUsers(users.map((u) => (u.id === editingUserId ? updatedUser : u)));
    resetForm();
    setModalVisible(false);
  };

  const handleDeleteUser = (id) => {
    Modal.confirm({
      title: "Xác Nhận Xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
      },
    });
  };

  const openEditModal = (user) => {
    Modal.confirm({
      title: "Xác Nhận Chỉnh Sửa",
      content: "Bạn có chắc chắn muốn chỉnh sửa thông tin người dùng này?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        setUser({ username: user.username, email: user.email, id: user.id });
        setEditingUserId(user.id);
        setModalVisible(true);
      },
    });
  };

  const resetForm = () => {
    setUser({ username: "", email: "" });
    setEditingUserId(null);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên Người Dùng", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai Trò",
      dataIndex: "role",
      key: "role",
      render: (role) => role.name,
    },
    {
      title: "Trạng Thái",
      dataIndex: "confirmed",
      key: "confirmed",
      render: (confirmed) => (confirmed ? "Đã xác nhận" : "Chưa xác nhận"),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button
            type="danger"
            onClick={() => handleDeleteUser(record.id)}
            style={{ marginLeft: "8px" }}
          >
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
        <h1>Quản Trị Người Dùng</h1>
        <Button
          type="primary"
          onClick={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          Thêm Người Dùng
        </Button>
        <Table dataSource={users} columns={columns} rowKey="id" />

        <AddUserModal
          isOpen={modalVisible}
          onClose={resetForm}
          onAdd={handleCreateUser} // Hàm tạo người dùng
          onEdit={handleUpdateUser} // Truyền hàm sửa
          user={user} // Truyền thông tin người dùng để chỉnh sửa
          setUser={setUser} // Hàm để cập nhật thông tin người dùng
        />
      </div>
    </div>
  );
};

export default UserAdmin;
