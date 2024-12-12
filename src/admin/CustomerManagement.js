import React, { useEffect, useState } from "react";
import {
  createCustomer,
  deleteCustomer,
  fetchAllCustomers,
  updateCustomer,
} from "../api/CustomerApi";
import Sidebar from "../components/Sidebar";
import { Table, Button, Modal, Tag, Space } from "antd";
import AddCustomerModal from "../components/AddCustomerModal"; // Bạn sẽ tạo component này

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customer, setCustomer] = useState({
    TenKH: "",
    Email: "",
    DienThoai: "",
    DiaChi: "",
  });

  useEffect(() => {
    const getCustomers = async () => {
      const fetchedCustomers = await fetchAllCustomers();
      console.log("Fetched Customers:", fetchedCustomers); // Kiểm tra dữ liệu ở đây
      setCustomers(fetchedCustomers);
    };
    getCustomers();
  }, []);

  const handleCreateCustomer = async () => {
    const createdCustomer = await createCustomer(customer);
    setCustomers([...customers, createdCustomer]);
    resetForm();
    setModalVisible(false);
  };

  const handleUpdateCustomer = async () => {
    const updatedCustomer = await updateCustomer(editingCustomerId, customer);
    setCustomers(
      customers.map((c) => (c.id === editingCustomerId ? updatedCustomer : c))
    );
    resetForm();
    setModalVisible(false);
  };

  const handleDeleteCustomer = (id) => {
    Modal.confirm({
      title: "Xác Nhận Xóa",
      content: "Bạn có chắc chắn muốn xóa khách hàng này?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id));
      },
    });
  };

  const handleEditCustomer = (customer) => {
    Modal.confirm({
      title: "Xác Nhận Chỉnh Sửa",
      content: "Bạn có chắc chắn muốn chỉnh sửa thông tin khách hàng này?",
      okText: "Có",
      cancelText: "Không",
      onOk: () => {
        setCustomer({
          TenKH: customer.TenKH,
          Email: customer.Email,
          DienThoai: customer.DienThoai,
          DiaChi: customer.DiaChi,
          id: customer.id,
        });
        setEditingCustomerId(customer.id);
        setModalVisible(true);
      },
    });
  };

  const resetForm = () => {
    setCustomer({
      TenKH: "",
      Email: "",
      DienThoai: "",
      DiaChi: "",
    });
    setEditingCustomerId(null);
  };

  // const columns = [
  //   { title: "ID", dataIndex: "id", key: "id" },
  //   { title: "Mã KH", dataIndex: "MaKH", key: "MaKH" },
  //   { title: "Tên Khách Hàng", dataIndex: "TenKH", key: "TenKH" },
  //   {
  //     title: "Loại Người Dùng",
  //     dataIndex: "type",
  //     key: "type",
  //     render: (text) => text || "Khách hàng",
  //     filters: [{ text: "Khách hàng", value: "Khách hàng" }],
  //   },
  //   {
  //     title: "Trạng Thái",
  //     dataIndex: "confirmed",
  //     key: "confirmed",
  //     render: (confirmed) => (confirmed ? "Đã xác thực" : "Chưa xác thực"),
  //   },
  //   {
  //     title: "Số Điện Thoại",
  //     dataIndex: "DienThoai",
  //     key: "DienThoai",
  //   },
  //   {
  //     title: "Hành Động",
  //     key: "action",
  //     render: (_, record) => (
  //       <>
  //         <Button type="primary" onClick={() => handleEditCustomer(record)}>
  //           Sửa
  //         </Button>
  //         <Button type="danger" onClick={() => handleDeleteCustomer(record.id)}>
  //           Xóa
  //         </Button>
  //       </>
  //     ),
  //   },
  // ];

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Mã KH", dataIndex: "MaKH", key: "MaKH" },
    { title: "Tên Khách Hàng", dataIndex: "TenKH", key: "TenKH" },
    { title: "Email", dataIndex: "Email", key: "Email" },
    // { title: "Địa Chỉ", dataIndex: "DiaChi", key: "DiaChi" },
    // { title: "Giới Tính", dataIndex: "GioiTinh", key: "GioiTinh" },
    {
      title: "Số Điện Thoại",
      dataIndex: "DienThoai",
      key: "DienThoai",
    },
    {
      title: "Vai trò",
      dataIndex: "type",
      key: "type",
      render: (text) => text || "Khách hàng1",
    },
    // {
    //   title: "Trạng Thái",
    //   dataIndex: "confirmed",
    //   key: "confirmed",
    //   render: (confirmed) => (confirmed ? "Đã xác thực" : "Chưa xác thực"),
    // },

    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEditCustomer(record.id)}>Sửa</Button>
          <Button onClick={() => handleDeleteCustomer(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản Lý Khách Hàng</h1>
        <Button
          type="primary"
          onClick={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          Thêm Khách Hàng
        </Button>
        <Table dataSource={customers} columns={columns} rowKey="id" />

        <AddCustomerModal
          isOpen={modalVisible}
          onClose={resetForm}
          onAdd={handleCreateCustomer}
          onEdit={handleUpdateCustomer}
          customer={customer}
          setCustomer={setCustomer}
        />
      </div>
    </div>
  );
};

export default CustomerManagement;
