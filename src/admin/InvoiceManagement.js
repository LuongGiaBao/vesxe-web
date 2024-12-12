import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Space } from "antd";
import {
  fetchAllInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../api/InvoicesApi";
import InvoiceFormModal from "../components/InvoiceFormModal"; // Modal để thêm/sửa hóa đơn
import Sidebar from "../components/Sidebar";
import confirm from "antd/es/modal/confirm";
import InvoiceDetailFormModal from "../components/InvoiceDetailFormModal";
import moment from "moment";
import {
  createInvoiceDetail,
  deleteInvoiceDetail,
  fetchAllInvoiceDetails,
  updateInvoiceDetail,
} from "../api/InvoiceDetailApi";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { fetchAllCustomers } from "../api/CustomerApi";
import { fetchAllAdminUsers } from "../api/AdminUserApi";
import { fetchAllSchedules } from "../api/ScheduleApi";
import { fetchAllTrips } from "../api/TripApi";
import { fetchAllPriceDetails } from "../api/PriceDetailApi";
import InvoiceDetailModal from "../components/InvoiceDetailModal";
const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingInvoiceDetail, setEditingInvoiceDetail] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [employees, setEmployees] = useState([]); // Dữ liệu nhân viên
  const [schedules, setSchedules] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [priceDetails, setPriceDetails] = useState([]);

  const [isInvoiceDetailModalVisible, setIsInvoiceDetailModalVisible] =
    useState(false);
  useEffect(() => {
    loadInvoices();
    loadInvoiceDetails();
    loadCustomers();
    loadEmployees();
    loadSchedules();
    loadTrips();
    loadPriceDetail();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await fetchAllInvoices();
      setInvoices(data.data);
    } catch (error) {
      message.error("Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  const loadInvoiceDetails = async () => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const data = await fetchAllInvoiceDetails(); // Gọi hàm fetch

      setInvoiceDetails(data.data); // Lưu dữ liệu vào state (giả sử dữ liệu trả về có cấu trúc { data: [...] })
    } catch (error) {
      message.error("Không thể tải danh sách chi tiết hóa đơn"); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Kết thúc trạng thái tải dữ liệu
    }
  };

  const loadCustomers = async () => {
    try {
      const customersData = await fetchAllCustomers();
      setCustomers(customersData);
    } catch (error) {
      message.error("Không thể tải danh sách khách hàng");
    }
  };
  const loadEmployees = async () => {
    try {
      const employeesData = await fetchAllAdminUsers();

      setEmployees(employeesData);
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên");
    }
  };
  const loadSchedules = async () => {
    try {
      const schedulesData = await fetchAllSchedules();

      setSchedules(schedulesData);
    } catch (error) {
      message.error("Không thể tải danh sách lịch trình");
    }
  };
  const loadTrips = async () => {
    try {
      const tripsData = await fetchAllTrips();

      setTrips(tripsData);
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên");
    }
  };
  const loadPriceDetail = async () => {
    try {
      const tripsData = await fetchAllPriceDetails();

      setPriceDetails(tripsData);
    } catch (error) {
      message.error("Không thể tải danh sách nhân viên");
    }
  };
  const handleCreate = async (values) => {
    try {
      await createInvoice(values);
      message.success("Thêm hóa đơn thành công!");
      loadInvoices();
      setModalVisible(false);
    } catch (error) {
      message.error("Không thể tạo hóa đơn");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateInvoice(editingInvoice.id, values);
      message.success("Cập nhật hóa đơn thành công!");
      loadInvoices();
      setModalVisible(false);
      setEditingInvoice(null);
    } catch (error) {
      message.error("Không thể cập nhật hóa đơn");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa hóa đơn này không?",
      onOk: async () => {
        try {
          await deleteInvoice(id);
          message.success("Xóa hóa đơn thành công!");
          loadInvoices();
        } catch (error) {
          message.error("Không thể xóa hóa đơn");
        }
      },
    });
  };
  const handleCreateInvoiceDetail = async (values) => {
    try {
      await createInvoiceDetail({
        values,
        // invoiceCode: selectedInvoiceId, // Đảm bảo truyền đúng ID hóa đơn
      });
      message.success("Thêm chi tiết hóa đơn thành công!");
      loadInvoiceDetails(); // Tải lại danh sách chi tiết hóa đơn
      setIsInvoiceDetailModalVisible(false);
    } catch (error) {
      message.error("Không thể tạo chi tiết hóa đơn");
    }
  };
  const handleUpdateInvoiceDetail = async (values) => {
    try {
      await updateInvoiceDetail(editingInvoiceDetail.id, {
        ...values,
      });
      message.success("Cập nhật chi tiết hóa đơn thành công!");
      loadInvoiceDetails(); // Tải lại danh sách chi tiết hóa đơn
      setIsInvoiceDetailModalVisible(false);
      setEditingInvoiceDetail(null);
    } catch (error) {
      message.error("Không thể cập nhật chi tiết hóa đơn");
    }
  };
  // Hàm xử lý thêm chi tiết hóa đơn
  const handleAddInvoiceDetail = async (invoiceId) => {
    console.log("invoiceId", invoiceId);

    setSelectedInvoiceId(invoiceId);
    setEditingInvoiceDetail(null);
    setIsInvoiceDetailModalVisible(true);
  };

  const handleDeleteInvoiceDetail = async (id) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteInvoiceDetail(id); // Gọi API để xóa chi tiết hóa đơn
          message.success("Xóa chi tiết hóa đơn thành công");
          loadInvoices(); // Tải lại danh sách hóa đơn
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa chi tiết hóa đơn");
        }
      },
    });
  };
  const handleViewDetails = (invoice) => {
    setEditingInvoice(invoice);
    // Lọc chi tiết hóa đơn liên quan
    const details = invoiceDetails.filter(
      (detail) => detail.invoiceId === invoice.id
    );
    setInvoiceDetails(details);
    setIsDetailModalVisible(true); // Mở modal
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Mã Hóa Đơn",
      dataIndex: ["attributes", "MaHoaDon"], // Lấy mã hóa đơn
      key: "MaHoaDon",
    },
    {
      title: "Mã Khách hàng",
      dataIndex: ["attributes", "customerId", "data", "attributes", "MaKH"], // Lấy tên khách hàng
      key: "MaKH",
    },
    {
      title: "Mã Nhân viên",
      dataIndex: ["attributes", "employeeId", "data", "attributes", "MaNV"], // Lấy tên khách hàng
      key: "MaNV",
    },
    {
      title: "Mã Lịch",
      dataIndex: [
        "attributes",
        "scheduleId",
        "data",
        "attributes",
        "IDSchedule",
      ], // Lấy tên khách hàng
      key: "IDSchedule",
    },
    // {
    //   title: "type",
    //   dataIndex: ["attributes", "type"], // Lấy mã hóa đơn
    //   key: "type",
    // },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: ["attributes", "PhuongThucThanhToan"], // Lấy phương thức thanh toán
      key: "PhuongThucThanhToan",
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "status"], // Lấy trạng thái
      key: "status",
    },
    {
      title: "Ngày tạo",
      dataIndex: ["attributes", "createdAt"], // Lấy ngày tạo
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"), // Định dạng ngày
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Space>
            <Button
              onClick={() => {
                setEditingInvoice(record);
                setModalVisible(true);
              }}
            >
              Sửa
            </Button>
            {/* <Button danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button> */}
            {/* <Button
              onClick={() => handleViewDetails(record)} // Gọi hàm để xem chi tiết hóa đơn
              style={{ marginLeft: 8 }}
            >
              Xem Chi Tiết
            </Button> */}
          </Space>
        </>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const detailColumns = [
      {
        title: "Mã Chi Tiết Hóa Đơn",
        dataIndex: ["attributes", "MaChiTietHoaDon"],
        key: "detailCode",
      },
      {
        title: "Mã Hóa Đơn",
        dataIndex: ["attributes", "invoice", "data", "attributes", "MaHoaDon"],
        key: "invoiceCode",
        render: (text, record) =>
          record.attributes.invoice?.data?.attributes?.MaHoaDon || "N/A",
      },
      {
        title: "Mã chuyến xe ",
        dataIndex: ["attributes", "trip", "data", "MaTuyen"],
        key: "ticketCode",
        render: (text, record) =>
          record.attributes.trip?.data?.attributes?.MaTuyen || "N/A",
      },
      {
        title: "Mã Chi Tiết Giá",
        dataIndex: [
          "attributes",
          "detai_price",
          "data",
          "attributes",
          "MaChiTietGia",
        ],
        key: "priceDetailCode",
        render: (text, record) =>
          record.attributes.detai_price?.data?.attributes?.MaChiTietGia ||
          "N/A",
      },
      {
        title: "Số Lượng",
        dataIndex: ["attributes", "soluong"],
        key: "quantity",
      },
      {
        title: "Tổng Tiền",
        dataIndex: ["attributes", "tongTien"],
        key: "totalAmount",
        render: (text) => `${parseInt(text).toLocaleString()} VNĐ`,
      },
      {
        title: "Hành Động",
        key: "action",
        render: (_, detail) => (
          <Space>
            <Button
              onClick={() => {
                setEditingInvoiceDetail(detail);
                setIsInvoiceDetailModalVisible(true);
              }}
            >
              Sửa
            </Button>
            {/* <Button danger onClick={() => handleDeleteInvoiceDetail(detail.id)}>
              Xóa
            </Button> */}
          </Space>
        ),
      },
    ];

    // Tìm hóa đơn hiện tại dựa trên ID
    const currentInvoice = invoices.find((invoice) => invoice.id === record.id);

    // Kiểm tra nếu currentInvoice không tồn tại
    if (!currentInvoice) {
      console.error(`Không tìm thấy hóa đơn với ID: ${record.id}`);
      return <p>Không tìm thấy hóa đơn.</p>; // Hoặc một thông báo khác
    }

    // Lấy danh sách chi tiết hóa đơn
    const detailInvoices =
      currentInvoice.attributes?.detail_invoices?.data || [];

    // Nếu không có chi tiết hóa đơn, hiển thị thông báo
    // if (detailInvoices.length === 0) {
    //   return (
    //     <div>
    //       <p>Chưa có chi tiết hóa đơn.</p>
    //       <Button onClick={() => handleAddInvoiceDetail(record.id)}>
    //         Thêm Chi Tiết Hóa Đơn
    //       </Button>
    //     </div>
    //   );
    // }

    return (
      <div
        style={{
          margin: 16,
          backgroundColor: "#f0f0f0",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Button
          type="primary"
          onClick={() => handleAddInvoiceDetail(record.id)}
          style={{ marginBottom: 16 }}
        >
          Thêm Chi Tiết Hóa Đơn
        </Button>

        <Table
          columns={detailColumns}
          dataSource={detailInvoices}
          pagination={false}
          rowKey={(item) => item.id}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          }
          bordered
          style={{ marginTop: 16, backgroundColor: "#fff" }}
        />
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý hóa đơn</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingInvoice(null);
            setModalVisible(true);
          }}
        >
          Thêm hóa đơn
        </Button>
        <Table
          columns={columns}
          dataSource={invoices}
          loading={loading}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender: (record) => {
              const detailinvoices =
                record.attributes.detail_invoices?.data || [];
              if (detailinvoices.length === 0) {
                return (
                  <div>
                    <p>Chưa có chi tiết hóa đơn.</p>
                    <Button onClick={() => handleAddInvoiceDetail(record.id)}>
                      Thêm Chi Tiết hóa đơn
                    </Button>
                  </div>
                );
              }
              return expandedRowRender(record);
            },
            rowExpandable: () => true,
          }}
        />
        <InvoiceFormModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          invoiceId={editingInvoice?.id} // Đảm bảo truyền invoiceId đúng
          employees={employees}
          schedules={schedules}
          customers={customers}
        />

        <InvoiceDetailFormModal
          visible={isInvoiceDetailModalVisible}
          onCancel={() => setIsInvoiceDetailModalVisible(false)}
          onOk={
            editingInvoiceDetail
              ? handleUpdateInvoiceDetail
              : handleCreateInvoiceDetail
          } // Gọi hàm tạo chi tiết hóa đơn
          invoiceDetail={editingInvoiceDetail}
          trips={trips}
          priceDetails={priceDetails}
          invoices={invoices}
          setInvoiceDetails={setInvoiceDetails} // Truyền prop này
        />
        {/* button chi tiet  */}
        <InvoiceDetailModal
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          invoices={invoices}
          invoiceDetails={invoiceDetails}
        />
      </div>
    </div>
  );
};

export default InvoiceManagement;

// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, message, Space } from "antd";
// import {
//   fetchAllInvoices,
//   createInvoice,
//   updateInvoice,
//   deleteInvoice,
// } from "../api/InvoicesApi";
// import InvoiceFormModal from "../components/InvoiceFormModal";
// import Sidebar from "../components/Sidebar";
// import confirm from "antd/es/modal/confirm";
// import InvoiceDetailFormModal from "../components/InvoiceDetailFormModal";
// import moment from "moment";
// import {
//   createInvoiceDetail,
//   deleteInvoiceDetail,
//   fetchAllInvoiceDetails,
//   updateInvoiceDetail,
// } from "../api/InvoiceDetailApi";
// import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { fetchAllCustomers } from "../api/CustomerApi";
// import { fetchAllAdminUsers } from "../api/AdminUserApi";
// import { fetchAllSchedules } from "../api/ScheduleApi";
// import { fetchAllTrips } from "../api/TripApi";
// import { fetchAllPriceDetails } from "../api/PriceDetailApi";
// import InvoiceDetailModal from "../components/InvoiceDetailModal";

// const InvoiceManagement = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [invoiceDetails, setInvoiceDetails] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingInvoice, setEditingInvoice] = useState(null);

//   const [editingInvoiceDetail, setEditingInvoiceDetail] = useState(null);

//   const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [trips, setTrips] = useState([]);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [priceDetails, setPriceDetails] = useState([]);

//   const [isInvoiceDetailModalVisible, setIsInvoiceDetailModalVisible] =
//     useState(false);

//   useEffect(() => {
//     loadInvoices();
//     loadInvoiceDetails();
//     loadCustomers();
//     loadEmployees();
//     loadSchedules();
//     loadTrips();
//     loadPriceDetail();
//   }, []);

//   const loadInvoices = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchAllInvoices();
//       setInvoices(data.data);
//     } catch (error) {
//       message.error("Không thể tải danh sách hóa đơn");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadInvoiceDetails = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchAllInvoiceDetails();
//       console.log("Phản hồi từ API:", data);
//       setInvoiceDetails(data.data);
//       console.log("Chi tiết hóa đơn:", data.data);
//     } catch (error) {
//       message.error("Không thể tải danh sách chi tiết hóa đơn");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadCustomers = async () => {
//     try {
//       const customersData = await fetchAllCustomers();
//       setCustomers(customersData);
//     } catch (error) {
//       message.error("Không thể tải danh sách khách hàng");
//     }
//   };

//   const loadEmployees = async () => {
//     try {
//       const employeesData = await fetchAllAdminUsers();
//       setEmployees(employeesData);
//     } catch (error) {
//       message.error("Không thể tải danh sách nhân viên");
//     }
//   };

//   const loadSchedules = async () => {
//     try {
//       const schedulesData = await fetchAllSchedules();
//       setSchedules(schedulesData);
//     } catch (error) {
//       message.error("Không thể tải danh sách lịch trình");
//     }
//   };

//   const loadTrips = async () => {
//     try {
//       const tripsData = await fetchAllTrips();
//       setTrips(tripsData);
//     } catch (error) {
//       message.error("Không thể tải danh sách chuyến xe");
//     }
//   };

//   const loadPriceDetail = async () => {
//     try {
//       const priceDetailsData = await fetchAllPriceDetails();
//       setPriceDetails(priceDetailsData);
//     } catch (error) {
//       message.error("Không thể tải danh sách chi tiết giá");
//     }
//   };

//   const handleCreate = async (values) => {
//     try {
//       await createInvoice(values);
//       message.success("Thêm hóa đơn thành công!");
//       loadInvoices();
//       setModalVisible(false);
//     } catch (error) {
//       message.error("Không thể tạo hóa đơn");
//     }
//   };

//   const handleUpdate = async (values) => {
//     try {
//       await updateInvoice(editingInvoice.id, values);
//       message.success("Cập nhật hóa đơn thành công!");
//       loadInvoices();
//       setModalVisible(false);
//       setEditingInvoice(null);
//     } catch (error) {
//       message.error("Không thể cập nhật hóa đơn");
//     }
//   };

//   const handleDelete = (id) => {
//     Modal.confirm({
//       title: "Xác nhận xóa",
//       content: "Bạn có chắc chắn muốn xóa hóa đơn này không?",
//       onOk: async () => {
//         try {
//           await deleteInvoice(id);
//           message.success("Xóa hóa đơn thành công!");
//           loadInvoices();
//         } catch (error) {
//           message.error("Không thể xóa hóa đơn");
//         }
//       },
//     });
//   };
//   const handleCreateInvoiceDetail = async (values) => {
//     console.log("Selected Invoice ID:", selectedInvoiceId);
//     try {
//       await createInvoiceDetail({
//         detailCode: values.detailCode,
//         invoiceCode: selectedInvoiceId, // Đảm bảo bạn đang sử dụng đúng ID hóa đơn
//         ticketCode: values.ticketCode,
//         priceDetailCode: values.priceDetailCode,
//         quantity: values.quantity,
//         totalAmount: values.totalAmount,
//       });
//       message.success("Thêm chi tiết hóa đơn thành công!");
//       loadInvoices(); // Tải lại danh sách hóa đơn
//       setIsInvoiceDetailModalVisible(false);
//     } catch (error) {
//       message.error("Không thể tạo chi tiết hóa đơn");
//     }
//   };
//   // const handleCreateInvoiceDetail = async (values) => {
//   //   try {
//   //     await createInvoiceDetail({
//   //       ...values,
//   //       invoiceCode: selectedInvoiceId,
//   //     });
//   //     message.success("Thêm chi tiết hóa đơn thành công!");
//   //     loadInvoiceDetails();
//   //     setIsInvoiceDetailModalVisible(false);
//   //   } catch (error) {
//   //     message.error("Không thể tạo chi tiết hóa đơn");
//   //   }
//   // };

//   const handleUpdateInvoiceDetail = async (values) => {
//     try {
//       await updateInvoiceDetail(editingInvoiceDetail.id, {
//         ...values,
//       });
//       message.success("Cập nhật chi tiết hóa đơn thành công!");
//       loadInvoiceDetails();
//       setIsInvoiceDetailModalVisible(false);
//       setEditingInvoiceDetail(null);
//     } catch (error) {
//       message.error("Không thể cập nhật chi tiết hóa đơn");
//     }
//   };

//   const handleAddInvoiceDetail = async (invoiceId) => {
//     setSelectedInvoiceId(invoiceId);
//     setEditingInvoiceDetail(null);
//     setIsInvoiceDetailModalVisible(true);
//   };

//   const handleDeleteInvoiceDetail = async (id) => {
//     confirm({
//       title: "Bạn có chắc chắn muốn xóa chi tiết hóa đơn này?",
//       icon: <ExclamationCircleOutlined />,
//       content: "Hành động này không thể hoàn tác.",
//       okText: "Xóa",
//       okType: "danger",
//       cancelText: "Hủy",
//       onOk: async () => {
//         try {
//           await deleteInvoiceDetail(id);
//           message.success("Xóa chi tiết hóa đơn thành công");
//           loadInvoiceDetails();
//         } catch (error) {
//           message.error("Có lỗi xảy ra khi xóa chi tiết hóa đơn");
//         }
//       },
//     });
//   };

//   const handleViewDetails = (invoice) => {
//     setEditingInvoice(invoice);
//     const details = invoiceDetails.filter(
//       (detail) => detail.invoiceId === invoice.id
//     );
//     setInvoiceDetails(details);
//     setIsDetailModalVisible(true);
//   };
//   const handleEditInvoiceDetail = (detail) => {
//     if (detail) {
//       setEditingInvoiceDetail(detail);
//       setIsInvoiceDetailModalVisible(true);
//     } else {
//       console.error("Không tìm thấy chi tiết hóa đơn để chỉnh sửa");
//     }
//   };
//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id" },
//     {
//       title: "Mã Hóa Đơn",
//       dataIndex: ["attributes", "MaHoaDon"],
//       key: "MaHoaDon",
//     },
//     {
//       title: "Mã Khách hàng",
//       dataIndex: ["attributes", "customerId", "data", "attributes", "MaKH"],
//       key: "MaKH",
//     },
//     {
//       title: "Mã Nhân viên",
//       dataIndex: ["attributes", "employeeId", "data", "attributes", "MaNV"],
//       key: "MaNV",
//     },
//     {
//       title: "Mã Lịch",
//       dataIndex: [
//         "attributes",
//         "scheduleId",
//         "data",
//         "attributes",
//         "IDSchedule",
//       ],
//       key: "IDSchedule",
//     },
//     {
//       title: "Phương Thức Thanh Toán",
//       dataIndex: ["attributes", "PhuongThucThanhToan"],
//       key: "PhuongThucThanhToan",
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: ["attributes", "status"],
//       key: "status",
//     },
//     {
//       title: "Ngày tạo",
//       dataIndex: ["attributes", "createdAt"],
//       key: "createdAt",
//       render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
//     },
//     {
//       title: "Hành động",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Button
//             onClick={() => {
//               setEditingInvoice(record);
//               setModalVisible(true);
//             }}
//           >
//             Sửa
//           </Button>
//           <Button danger onClick={() => handleDelete(record.id)}>
//             Xóa
//           </Button>
//           <Button
//             onClick={() => handleViewDetails(record)}
//             style={{ marginLeft: 8 }}
//           >
//             Xem Chi Tiết
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   const expandedRowRender = (record) => {
//     const detailColumns = [
//       { title: "ID", dataIndex: "id", key: "id" },

//       {
//         title: "Mã Chi Tiết Hóa Đơn",
//         dataIndex: ["attributes", "MaChiTietHoaDon"],
//         key: "detailCode",
//       },
//       {
//         title: "Mã Hóa Đơn",
//         dataIndex: ["attributes", "invoice", "data", "attributes", "MaHoaDon"],
//         key: "invoiceCode",
//         render: (text, record) =>
//           record.attributes.invoice?.data?.attributes?.MaHoaDon || "N/A",
//       },
//       {
//         title: "Mã chuyến xe ",
//         dataIndex: ["attributes", "trip", "data", "MaTuyen"],
//         key: "ticketCode",
//         render: (text, record) =>
//           record.attributes.trip?.data?.attributes?.MaTuyen || "N/A",
//       },
//       {
//         title: "Mã Chi Tiết Giá",
//         dataIndex: [
//           "attributes",
//           "detai_price",
//           "data",
//           "attributes",
//           "MaChiTietGia",
//         ],
//         key: "priceDetailCode",
//         render: (text, record) =>
//           record.attributes.detai_price?.data?.attributes?.MaChiTietGia ||
//           "N/A",
//       },
//       {
//         title: "Số Lượng",
//         dataIndex: ["attributes", "soluong"],
//         key: "quantity",
//       },
//       {
//         title: "Tổng Tiền",
//         dataIndex: ["attributes", "tongTien"],
//         key: "totalAmount",
//         render: (text) => `${parseInt(text).toLocaleString()} VNĐ`,
//       },
//       {
//         title: "Hành Động",
//         key: "action",
//         render: (_, detail) => (
//           <Space>
//             <Button onClick={() => handleEditInvoiceDetail(detail)}>Sửa</Button>
//             <Button danger onClick={() => handleDeleteInvoiceDetail(detail.id)}>
//               Xóa
//             </Button>
//           </Space>
//         ),
//       },
//     ];

//     const currentInvoice = invoices.find((invoice) => invoice.id === record.id);
//     if (!currentInvoice) {
//       console.error(`Không tìm thấy hóa đơn với ID: ${record.id}`);
//       return <p>Không tìm thấy hóa đơn.</p>;
//     }

//     const detailInvoices =
//       currentInvoice.attributes?.detail_invoices?.data || [];

//     return (
//       <div
//         style={{
//           margin: 16,
//           backgroundColor: "#f0f0f0",
//           padding: 16,
//           borderRadius: 8,
//         }}
//       >
//         <Button
//           type="primary"
//           onClick={() => handleAddInvoiceDetail(record.id)}
//           style={{ marginBottom: 16 }}
//         >
//           Thêm Chi Tiết Hóa Đơn
//         </Button>

//         <Table
//           columns={detailColumns}
//           dataSource={detailInvoices}
//           pagination={false}
//           rowKey={(item) => item.id}
//           rowClassName={(record, index) =>
//             index % 2 === 0 ? "even-row" : "odd-row"
//           }
//           bordered
//           style={{ marginTop: 16, backgroundColor: "#fff" }}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="admin-dashboard">
//       <Sidebar />
//       <div className="admin-content">
//         <h1>Quản lý hóa đơn</h1>
//         <Button
//           type="primary"
//           onClick={() => {
//             setEditingInvoice(null);
//             setModalVisible(true);
//           }}
//         >
//           Thêm hóa đơn
//         </Button>
//         <Table
//           columns={columns}
//           dataSource={invoices}
//           loading={loading}
//           rowKey={(record) => record.id}
//           expandable={{
//             expandedRowRender: (record) => expandedRowRender(record),
//             rowExpandable: () => true,
//           }}
//         />
//         <InvoiceFormModal
//           visible={modalVisible}
//           onCancel={() => setModalVisible(false)}
//           onCreate={handleCreate}
//           onUpdate={handleUpdate}
//           invoiceId={editingInvoice?.id}
//           employees={employees}
//           schedules={schedules}
//           customers={customers}
//         />

//         <InvoiceDetailFormModal
//           visible={isInvoiceDetailModalVisible}
//           onCancel={() => setIsInvoiceDetailModalVisible(false)}
//           onOk={
//             editingInvoiceDetail
//               ? handleUpdateInvoiceDetail
//               : handleCreateInvoiceDetail
//           }
//           invoiceDetail={editingInvoiceDetail}
//           trips={trips}
//           priceDetails={priceDetails}
//           invoices={invoices}
//           setInvoiceDetails={setInvoiceDetails}
//         />
//         <InvoiceDetailModal
//           visible={isDetailModalVisible}
//           onCancel={() => setIsDetailModalVisible(false)}
//           invoices={invoices}
//           invoiceDetails={invoiceDetails}
//         />
//       </div>
//     </div>
//   );
// };

// export default InvoiceManagement;
