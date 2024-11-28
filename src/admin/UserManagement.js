// import React, { useEffect, useState } from "react";
// import {
//   createUser,
//   deleteUser,
//   fetchAllUsers,
//   updateUser,
// } from "../api/UserApi";
// import Sidebar from "../components/Sidebar";
// import { Table, Button, Modal, Tag } from "antd";
// import AddUserModal from "../components/AddUserModal";
// import { USER_ROLES, USER_STATUS } from "../models/UserModel";
// const UserAdmin = () => {
//   const [users, setUsers] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [user, setUser] = useState({ username: "", email: "" });

//   useEffect(() => {
//     const getUsers = async () => {
//       const fetchedUsers = await fetchAllUsers();
//       setUsers(fetchedUsers);
//     };
//     getUsers();
//   }, []);

//   const handleCreateUser = async () => {
//     const createdUser = await createUser(user);
//     setUsers([...users, createdUser]);
//     resetForm();
//     setModalVisible(false);
//   };

//   const handleUpdateUser = async () => {
//     const updatedUser = await updateUser(editingUserId, user);
//     setUsers(users.map((u) => (u.id === editingUserId ? updatedUser : u)));
//     resetForm();
//     setModalVisible(false);
//   };

//   const handleDeleteUser = (id) => {
//     Modal.confirm({
//       title: "Xác Nhận Xóa",
//       content: "Bạn có chắc chắn muốn xóa người dùng này?",
//       okText: "Có",
//       okType: "danger",
//       cancelText: "Không",
//       onOk: async () => {
//         await deleteUser(id);
//         setUsers(users.filter((user) => user.id !== id));
//       },
//     });
//   };

//   const openEditModal = (user) => {
//     Modal.confirm({
//       title: "Xác Nhận Chỉnh Sửa",
//       content: "Bạn có chắc chắn muốn chỉnh sửa thông tin người dùng này?",
//       okText: "Có",
//       cancelText: "Không",
//       onOk: () => {
//         setUser({ username: user.username, email: user.email, id: user.id });
//         setEditingUserId(user.id);
//         setModalVisible(true);
//       },
//     });
//   };

//   const resetForm = () => {
//     setUser({ username: "", email: "" });
//     setEditingUserId(null);
//   };

//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id" },
//     { title: "Tên Người Dùng", dataIndex: "username", key: "username" },
//     { title: "Email", dataIndex: "email", key: "email" },
//     {
//       title: "Vai trò",
//       dataIndex: "role",
//       // render: (role) => {
//       //   const colors = {
//       //     [USER_ROLES.ADMIN]: "red",
//       //     [USER_ROLES.EMPLOYEE]: "blue",
//       //     [USER_ROLES.CUSTOMER]: "green",
//       //   };
//       //   return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
//       // },
//       // filters: [
//       //   { text: "Admin", value: USER_ROLES.ADMIN },
//       //   { text: "Nhân viên", value: USER_ROLES.EMPLOYEE },
//       //   { text: "Khách hàng", value: USER_ROLES.CUSTOMER },
//       // ],
//     },
//     {
//       title: "Trạng Thái",
//       dataIndex: "confirmed",
//       key: "confirmed",
//       render: (confirmed) => (confirmed ? "Đã xác nhận" : "Chưa xác nhận"),
//     },
//     {
//       title: "Hành Động",
//       key: "action",
//       render: (_, record) => (
//         <>
//           <Button type="primary" onClick={() => openEditModal(record)}>
//             Sửa
//           </Button>
//           <Button
//             type="danger"
//             onClick={() => handleDeleteUser(record.id)}
//             style={{ marginLeft: "8px" }}
//           >
//             Xóa
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="admin-dashboard">
//       <Sidebar />
//       <div className="admin-content">
//         <h1>Quản Trị Người Dùng</h1>
//         <Button
//           type="primary"
//           onClick={() => {
//             resetForm();
//             setModalVisible(true);
//           }}
//         >
//           Thêm Người Dùng
//         </Button>
//         <Table dataSource={users} columns={columns} rowKey="id" />

//         <AddUserModal
//           isOpen={modalVisible}
//           onClose={resetForm}
//           onAdd={handleCreateUser} // Hàm tạo người dùng
//           onEdit={handleUpdateUser} // Truyền hàm sửa
//           user={user} // Truyền thông tin người dùng để chỉnh sửa
//           setUser={setUser} // Hàm để cập nhật thông tin người dùng
//         />
//       </div>
//     </div>
//   );
// };

// export default UserAdmin;

import React, { useEffect, useState } from "react";
import {
  fetchAllAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../api/AdminUserApi";
import Sidebar from "../components/Sidebar";
import { Table, Button, Modal, message } from "antd";
import AddUserModal from "../components/AddUserModal";

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [user, setUser] = useState({
    tenNV: "",
    description: "",
    PhoneNumber: "",
    MaNV: "",
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await fetchAllAdminUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        message.error("Không thể tải danh sách nhân viên");
      }
    };
    getUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const createdUser = await createAdminUser(user);
      setUsers([
        ...users,
        {
          id: createdUser.id,
          ...createdUser.attributes,
        },
      ]);
      resetForm();
      setModalVisible(false);
      message.success("Tạo nhân viên thành công");
    } catch (error) {
      message.error("Không thể tạo nhân viên");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const updatedUser = await updateAdminUser(editingUserId, user);
      setUsers(
        users.map((u) =>
          u.id === editingUserId
            ? { id: updatedUser.id, ...updatedUser.attributes }
            : u
        )
      );
      resetForm();
      setModalVisible(false);
      message.success("Cập nhật nhân viên thành công");
    } catch (error) {
      message.error("Không thể cập nhật nhân viên");
    }
  };

  const handleDeleteUser = (id) => {
    Modal.confirm({
      title: "Xác Nhận Xóa",
      content: "Bạn có chắc chắn muốn xóa nhân viên này?",
      onOk: async () => {
        try {
          await deleteAdminUser(id);
          setUsers(users.filter((user) => user.id !== id));
          message.success("Xóa nhân viên thành công");
        } catch (error) {
          message.error("Không thể xóa nhân viên");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã Nhân Viên",
      dataIndex: "MaNV",
      key: "MaNV",
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "tenNV",
      key: "tenNV",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },

    {
      title: "Vai trò",
      dataIndex: "type",
      key: "type",
      render: (text) => text || "Nhân viên1",
    },
    // {
    //   title: "Người Quản Trị",
    //   key: "adminUser",
    //   render: (_, record) => {
    //     const adminUser = record.attributes.admin_user?.data?.attributes;
    //     return adminUser
    //       ? `${adminUser.firstname} ${adminUser.lastname}`.trim()
    //       : "Chưa gán";
    //   },
    // },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setUser({
                tenNV: record.tenNV,
                description: record.description,
                PhoneNumber: record.PhoneNumber,
                MaNV: record.MaNV,
              });
              setEditingUserId(record.id);
              setModalVisible(true);
            }}
          >
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

  const resetForm = () => {
    setUser({ tenNV: "", description: "", PhoneNumber: "", MaNV: "" });
    setEditingUserId(null);
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản Trị Nhân Viên</h1>
        <Button
          type="primary"
          onClick={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          Thêm Nhân Viên
        </Button>
        <Table dataSource={users} columns={columns} rowKey="id" />

        <AddUserModal
          isOpen={modalVisible}
          onClose={resetForm}
          onAdd={handleCreateUser}
          onEdit={handleUpdateUser}
          user={user}
          setUser={setUser}
        />
      </div>
    </div>
  );
};

export default UserAdmin;
