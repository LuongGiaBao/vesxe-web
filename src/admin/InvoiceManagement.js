// // // src/admin/InvoiceManagement.js
// // import React, { useState, useEffect } from 'react';
// // import Sidebar from '../components/Sidebar';

// // const InvoiceManagement = () => {
// //   const [invoices, setInvoices] = useState([]);

// //   useEffect(() => {
// //     // Giả lập API call để lấy danh sách vé
// //     const fetchInvoices = async () => {
// //       const invoiceData = [
// //         { id: 1, userId: 1, tripId: 1, amount: 150000, status: 'Đã thanh toán', bookedAt: '2024-09-28 12:00' },
// //         { id: 2, userId: 2, tripId: 2, amount: 200000, status: 'Chưa thanh toán', bookedAt: '2024-09-28 13:00' },
// //         // Thêm nhiều vé khác
// //       ];
// //       setInvoices(invoiceData);
// //     };
// //     fetchInvoices();
// //   }, []);

// //   return (
// //     <div className="invoice-management">
// //       <Sidebar />
// //       <div className="admin-content">
// //         <h1>Quản lý hóa đơn</h1>
// //         <table className="admin-table">
// //           <thead>
// //             <tr>
// //               <th>ID</th>
// //               <th>ID Người dùng</th>
// //               <th>ID Chuyến xe</th>
// //               <th>Tổng tiền</th>
// //               <th>Trạng thái</th>
// //               <th>Ngày giờ đặt</th>
// //               <th>Hành động</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {invoices.map(invoice => (
// //               <tr key={invoice.id}>
// //                 <td>{invoice.id}</td>
// //                 <td>{invoice.userId}</td>
// //                 <td>{invoice.tripId}</td>
// //                 <td>{invoice.amount} VND</td>
// //                 <td>{invoice.status}</td>
// //                 <td>{invoice.bookedAt}</td>
// //                 <td>
// //                   <button className="edit-btn">Chỉnh sửa</button>
// //                   <button className="delete-btn">Xóa</button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InvoiceManagement;

// // src/admin/InvoiceManagement.js
// // import React, { useState, useEffect } from "react";
// // import {
// //   Table,
// //   Tag,
// //   Space,
// //   Button,
// //   Modal,
// //   Typography,
// //   Form,
// //   Input,
// //   message,
// // } from "antd";
// // import {
// //   EyeOutlined,
// //   EditOutlined,
// //   DeleteOutlined,
// //   PlusOutlined,
// // } from "@ant-design/icons";
// // import {
// //   createInvoice,
// //   deleteInvoice,
// //   fetchAllInvoices,
// //   updateInvoice,
// // } from "../api/InvoicesApi";
// // import Sidebar from "../components/Sidebar";
// // import InvoiceDetailModal from "../components/InvoiceDetailModal";

// // const { Title, Text } = Typography;

// // const InvoiceManagement = () => {
// //   const [invoices, setInvoices] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [formModalVisible, setFormModalVisible] = useState(false);
// //   const [detailModalVisible, setDetailModalVisible] = useState(false);
// //   const [editModalVisible, setEditModalVisible] = useState(false);
// //   const [selectedInvoice, setSelectedInvoice] = useState(null);
// //   const [form] = Form.useForm();

// //   useEffect(() => {
// //     fetchInvoices();
// //   }, []);

// //   const fetchInvoices = async () => {
// //     setLoading(true);
// //     try {
// //       const data = await fetchAllInvoices();
// //       setInvoices(data.data);
// //     } catch (error) {
// //       message.error("Không thể tải danh sách hóa đơn");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const showInvoiceDetail = (record) => {
// //     setSelectedInvoice(record);
// //     setDetailModalVisible(true);
// //   };

// //   const showEditModal = (record) => {
// //     setSelectedInvoice(record);
// //     form.setFieldsValue({
// //       invoiceNumber: record.attributes.invoiceNumber,
// //       totalAmount: record.attributes.totalAmount,
// //       status: record.attributes.status,
// //     });
// //     setEditModalVisible(true);
// //   };

// //   const handleCancelFormModal = () => {
// //     setFormModalVisible(false);
// //   };

// //   const handleCancelDetailModal = () => {
// //     setDetailModalVisible(false);
// //   };

// //   const handleCreate = async (values) => {
// //     try {
// //       await createInvoice(values);
// //       message.success("Hóa đơn đã được tạo thành công");
// //       setEditModalVisible(false);
// //       fetchInvoices();
// //     } catch (error) {
// //       message.error("Không thể tạo hóa đơn");
// //     }
// //   };

// //   const handleUpdate = async (values) => {
// //     try {
// //       await updateInvoice(selectedInvoice.id, values);
// //       message.success("Hóa đơn đã được cập nhật thành công");
// //       setEditModalVisible(false);
// //       fetchInvoices();
// //     } catch (error) {
// //       message.error("Không thể cập nhật hóa đơn");
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       await deleteInvoice(id);
// //       message.success("Hóa đơn đã được xóa thành công");
// //       fetchInvoices();
// //     } catch (error) {
// //       message.error("Không thể xóa hóa đơn");
// //     }
// //   };

// //   const formatDateTime = (dateString) => {
// //     return new Date(dateString).toLocaleString("vi-VN");
// //   };

// //   const columns = [
// //     {
// //       title: "Mã hóa đơn",
// //       dataIndex: ["attributes", "invoiceNumber"],
// //       key: "invoiceNumber",
// //       render: (text) => <span>{text}</span>,
// //     },
// //     {
// //       title: "Khách hàng",
// //       dataIndex: ["attributes", "users_permissions_user", "data", "attributes"],
// //       key: "customer",
// //       render: (user) => (
// //         <span>
// //           {user.fullName || user.username}
// //           <br />
// //           {/* <small>{user.email}</small> */}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: "Chuyến đi",
// //       dataIndex: ["attributes", "trip", "data", "attributes"],
// //       key: "trip",
// //       render: (trip) => (
// //         <span>
// //           <div>Khởi hành: {formatDateTime(trip.departureTime)}</div>
// //           <div>Đến: {formatDateTime(trip.arrivalTime)}</div>
// //           <div>Thời gian: {trip.travelTime}</div>
// //         </span>
// //       ),
// //     },
// //     {
// //       title: "Ghế đã đặt",
// //       dataIndex: ["attributes", "seats", "data"],
// //       key: "seats",
// //       render: (seats) => (
// //         <span>
// //           {seats.map((seat) => (
// //             <Tag
// //               key={seat.id}
// //               color={seat.attributes.status === "đã bán" ? "red" : "green"}
// //             >
// //               Ghế {seat.attributes.seatNumber}
// //             </Tag>
// //           ))}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: "Thanh toán",
// //       dataIndex: ["attributes", "payment", "data", "attributes"],
// //       key: "payment",
// //       render: (payment) => (
// //         <span>
// //           <div> {payment?.paymentMethod || "N/A"}</div>
// //           {/* <Tag color={payment?.status === "completed" ? "green" : "orange"}>
// //             {payment?.status}
// //           </Tag> */}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: "Ngày tạo",
// //       dataIndex: ["attributes", "createdAt"],
// //       key: "createdAt",
// //       render: (date) => formatDateTime(date),
// //     },
// //     {
// //       title: "Trạng thái",
// //       dataIndex: ["attributes", "status"],
// //       key: "status",
// //       render: (status) => (
// //         <Tag color={status === "hoàn thành" ? "green" : "orange"}>{status}</Tag>
// //       ),
// //     },
// //     {
// //       title: "Tổng tiền",
// //       dataIndex: ["attributes", "totalAmount"],
// //       key: "totalAmount",
// //       render: (amount) => <span>{amount?.toLocaleString("vi-VN")} VNĐ</span>,
// //     },
// //     {
// //       title: "Thao tác",
// //       key: "action",
// //       render: (_, record) => (
// //         <Space size="middle">
// //           <Button
// //             type="primary"
// //             icon={<EyeOutlined />}
// //             onClick={() => showInvoiceDetail(record)}
// //           >
// //             Chi tiết
// //           </Button>
// //           <Button
// //             type="default"
// //             icon={<EditOutlined />}
// //             onClick={() => showEditModal(record)}
// //           >
// //             Sửa
// //           </Button>
// //           <Button
// //             type="danger"
// //             icon={<DeleteOutlined />}
// //             onClick={() => handleDelete(record.id)}
// //           >
// //             Xóa
// //           </Button>
// //         </Space>
// //       ),
// //     },
// //   ];

// //   // const InvoiceDetailModal = () => (
// //   //   // ... (giữ nguyên modal chi tiết)
// //   // );

// //   const InvoiceFormModal = () => (
// //     <Modal
// //       title={selectedInvoice ? "Sửa hóa đơn" : "Tạo hóa đơn mới"}
// //       visible={editModalVisible}
// //       onCancel={() => setEditModalVisible(false)}
// //       footer={null}
// //     >
// //       <Form
// //         form={form}
// //         onFinish={selectedInvoice ? handleUpdate : handleCreate}
// //         layout="vertical"
// //       >
// //         <Form.Item
// //           name="invoiceNumber"
// //           label="Mã hóa đơn"
// //           rules={[{ required: true, message: "Vui lòng nhập mã hóa đơn" }]}
// //         >
// //           <Input />
// //         </Form.Item>
// //         <Form.Item
// //           name="totalAmount"
// //           label="Tổng tiền"
// //           rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
// //         >
// //           <Input type="number" />
// //         </Form.Item>
// //         <Form.Item
// //           name="status"
// //           label="Trạng thái"
// //           rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
// //         >
// //           <Input />
// //         </Form.Item>
// //         <Form.Item>
// //           <Button type="primary" htmlType="submit">
// //             {selectedInvoice ? "Cập nhật" : "Tạo mới"}
// //           </Button>
// //         </Form.Item>
// //       </Form>
// //     </Modal>
// //   );

// //   return (
// //     <div className="admin-dashboard">
// //       <Sidebar />
// //       <div className="admin-content">
// //         <div className="invoice-management">
// //           <div className="page-header">
// //             <Title level={2}>Quản lý hóa đơn</Title>
// //             <Button
// //               type="primary"
// //               icon={<PlusOutlined />}
// //               onClick={() => {
// //                 setSelectedInvoice(null);
// //                 form.resetFields();
// //                 setEditModalVisible(true);
// //               }}
// //             >
// //               Tạo hóa đơn mới
// //             </Button>
// //           </div>

// //           <Table
// //             columns={columns}
// //             dataSource={invoices}
// //             loading={loading}
// //             rowKey={(record) => record.id}
// //             pagination={{
// //               pageSize: 10,
// //               showTotal: (total, range) =>
// //                 `${range[0]}-${range[1]} của ${total} hóa đơn`,
// //             }}
// //           />
// //           <InvoiceFormModal
// //             visible={formModalVisible}
// //             onCancel={handleCancelFormModal}
// //             onSubmit={handleCreate}
// //             title="Tạo hóa đơn mới"
// //           />
// //           <InvoiceDetailModal
// //             visible={detailModalVisible}
// //             onCancel={handleCancelDetailModal}
// //             invoice={selectedInvoice}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default InvoiceManagement;

// import React, { useState, useEffect } from "react";
// import { Table, Button, message, Tag, Space } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   EyeOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import {
//   createInvoice,
//   deleteInvoice,
//   fetchAllInvoices,
//   updateInvoice,
// } from "../api/InvoicesApi";
// import InvoiceDetailModal from "../components/InvoiceDetailModal";
// import InvoiceFormModal from "../components/InvoiceFormModal";

// const InvoiceManagement = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formModalVisible, setFormModalVisible] = useState(false);
//   const [detailModalVisible, setDetailModalVisible] = useState(false);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   useEffect(() => {
//     fetchAllInvoices()
//       .then((response) => {
//         setInvoices(response.data);
//       })
//       .catch((error) => {
//         message.error("Lỗi tải dữ liệu hóa đơn!");
//       });
//   }, []);

//   const handleCreateInvoice = (values) => {
//     createInvoice(values)
//       .then((response) => {
//         setInvoices([...invoices, response.data]);
//         message.success("Tạo hóa đơn thành công!");
//       })
//       .catch((error) => {
//         message.error("Lỗi tạo hóa đơn!");
//       });
//   };

//   const handleUpdateInvoice = (values) => {
//     updateInvoice(values)
//       .then((response) => {
//         const updatedInvoices = invoices.map((invoice) => {
//           if (invoice.id === values.id) {
//             return response.data;
//           }
//           return invoice;
//         });
//         setInvoices(updatedInvoices);
//         message.success("Cập nhật hóa đơn thành công!");
//       })
//       .catch((error) => {
//         message.error("Lỗi cập nhật hóa đơn!");
//       });
//   };

//   const handleDeleteInvoice = (id) => {
//     deleteInvoice(id)
//       .then((response) => {
//         const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
//         setInvoices(updatedInvoices);
//         message.success("Xóa hóa đơn thành công!");
//       })
//       .catch((error) => {
//         message.error("Lỗi xóa hóa đơn!");
//       });
//   };

//   const handleShowFormModal = () => {
//     setSelectedInvoice(null); // Reset selected invoice khi tạo mới
//     setIsEditing(false);
//     setFormModalVisible(true);
//   };
//   const showEditModal = (record) => {
//     setSelectedInvoice(record);
//     setIsEditing(true);
//     setFormModalVisible(true);
//   };

//   const handleFormSubmit = (values) => {
//     if (isEditing) {
//       // Nếu đang chỉnh sửa
//       handleUpdateInvoice({
//         id: selectedInvoice.id,
//         ...values,
//       });
//     } else {
//       // Nếu đang tạo mới
//       handleCreateInvoice(values);
//     }
//     setFormModalVisible(false);
//   };

//   const handleShowDetailModal = (invoice) => {
//     setSelectedInvoice(invoice);
//     setDetailModalVisible(true);
//   };

//   const handleCancelFormModal = () => {
//     setFormModalVisible(false);
//     setSelectedInvoice(null);
//     setIsEditing(false);
//   };

//   const handleCancelDetailModal = () => {
//     setDetailModalVisible(false);
//   };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString("vi-VN");
//   };
//   const columns = [
//     {
//       title: "Mã hóa đơn",
//       dataIndex: ["attributes", "invoiceNumber"],
//       key: "invoiceNumber",
//       render: (text) => <span>{text}</span>,
//     },
//     {
//       title: "Khách hàng",
//       dataIndex: ["attributes", "users_permissions_user", "data", "attributes"],
//       key: "customer",
//       render: (user) => {
//         // Kiểm tra nếu user không tồn tại
//         if (!user) return <span>N/A</span>;

//         return (
//           <span>
//             {user.fullName || user.username || "Không có tên"}
//             <br />
//             <small>{user.email || "Không có email"}</small>
//           </span>
//         );
//       },
//     },
//     {
//       title: "Chuyến đi",
//       dataIndex: ["attributes", "trip", "data", "attributes"],
//       key: "trip",
//       render: (trip) => {
//         // Kiểm tra nếu trip không tồn tại
//         if (!trip) return <span>N/A</span>;

//         return (
//           <span>
//             <div>
//               Khởi hành:{" "}
//               {trip.departureTime ? formatDateTime(trip.departureTime) : "N/A"}
//             </div>
//             <div>
//               Đến: {trip.arrivalTime ? formatDateTime(trip.arrivalTime) : "N/A"}
//             </div>
//             <div>Thời gian: {trip.travelTime || "N/A"}</div>
//           </span>
//         );
//       },
//     },
//     {
//       title: "Ghế đã đặt",
//       dataIndex: ["attributes", "seats", "data"],
//       key: "seats",
//       render: (seats) => (
//         <span>
//           {seats.map((seat) => (
//             <Tag
//               key={seat.id}
//               color={seat.attributes.status === "đã bán" ? "red" : "green"}
//             >
//               Ghế {seat.attributes.seatNumber}
//             </Tag>
//           ))}
//         </span>
//       ),
//     },
//     {
//       title: "Thanh toán",
//       dataIndex: ["attributes", "payment", "data", "attributes"],
//       key: "payment",
//       render: (payment) => (
//         <span>
//           <div> {payment?.paymentMethod || "N/A"}</div>
//           {/* <Tag color={payment?.status === "completed" ? "green" : "orange"}>
//             {payment?.status}
//           </Tag> */}
//         </span>
//       ),
//     },
//     {
//       title: "Ngày tạo",
//       dataIndex: ["attributes", "createdAt"],
//       key: "createdAt",
//       render: (date) => formatDateTime(date),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: ["attributes", "status"],
//       key: "status",
//       render: (status) => (
//         <Tag color={status === "hoàn thành" ? "green" : "orange"}>{status}</Tag>
//       ),
//     },
//     {
//       title: "Tổng tiền",
//       dataIndex: ["attributes", "totalAmount"],
//       key: "totalAmount",
//       render: (amount) => <span>{amount?.toLocaleString("vi-VN")} VNĐ</span>,
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       render: (_, record) => (
//         <Space size="middle">
//           <Button
//             type="primary"
//             icon={<EyeOutlined />}
//             onClick={() => handleShowDetailModal(record)}
//           >
//             Chi tiết
//           </Button>
//           <Button
//             type="default"
//             icon={<EditOutlined />}
//             onClick={() => showEditModal(record)}
//           >
//             Sửa
//           </Button>
//           <Button
//             type="danger"
//             icon={<DeleteOutlined />}
//             onClick={() => handleDeleteInvoice(record.id)}
//           >
//             Xóa
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={handleShowFormModal}
//       >
//         Tạo hóa đơn mới
//       </Button>
//       <Table columns={columns} dataSource={invoices} loading={loading} />
//       <InvoiceFormModal
//         visible={formModalVisible}
//         onCancel={handleCancelFormModal}
//         onSubmit={handleFormSubmit}
//         title={isEditing ? "Chỉnh sửa hóa đơn" : "Tạo hóa đơn mới"}
//         initialValues={selectedInvoice?.attributes} // Truyền giá trị ban đầu khi chỉnh sửa
//         isEditing={isEditing}
//       />
//       <InvoiceDetailModal
//         visible={detailModalVisible}
//         onCancel={handleCancelDetailModal}
//         invoice={selectedInvoice}
//       />
//     </div>
//   );
// };

// export default InvoiceManagement;


import React from 'react'

const InvoiceManagement = () => {
  return (
    <div>InvoiceManagement</div>
  )
}

export default InvoiceManagement