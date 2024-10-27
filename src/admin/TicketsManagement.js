import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import {
  fetchAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../api/TicketApi";
import AddTicketModal from "../components/AddTicketModal";
import Sidebar from "../components/Sidebar";

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  useEffect(() => {
    const getTickets = async () => {
      try {
        const data = await fetchAllTickets();
        setTickets(data.data);
      } catch {
        message.error("Không thể lấy danh sách vé");
      } finally {
        setLoading(false);
      }
    };
    getTickets();
  }, []);

  const handleCreate = async (newTicket) => {
    try {
      const data = await createTicket(newTicket);
      setTickets([...tickets, data.data]);
      message.success("Thêm vé thành công!");
    } catch {
      message.error("Không thể tạo vé");
    }
  };

  const handleEdit = (id) => {
    const ticketToEdit = tickets.find((t) => t.id === id);
    setEditingTicket({
      id: ticketToEdit.id,
      status: ticketToEdit.attributes.status,
      // price: ticketToEdit.attributes.price,
      // seat: ticketToEdit.attributes.seat?.data
      //   ? ticketToEdit.attributes.seat.data.attributes
      //   : null,
      // user: ticketToEdit.attributes.users_permissions_user.data.attributes,
      // trips: ticketToEdit.attributes.trips.data,
    });
    setModalVisible(true);
  };

  const handleUpdate = async (updatedTicket) => {
    try {
      const data = await updateTicket(editingTicket.id, updatedTicket);
      setTickets(
        tickets.map((ticket) =>
          ticket.id === data.data.id ? data.data : ticket
        )
      );
      message.success("Cập nhật vé thành công!");
    } catch {
      message.error("Không thể cập nhật vé");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa vé này không?",
      okText: "Có",
      cancelText: "Không",
      onOk: async () => {
        try {
          await deleteTicket(id);
          setTickets(tickets.filter((ticket) => ticket.id !== id));
          message.success("Xóa vé thành công!");
        } catch {
          message.error("Không thể xóa vé");
        }
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    // { title: "Người dùng", dataIndex: "username", key: "username" },
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
        <h1>Quản lý vé</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingTicket(null);
            setModalVisible(true);
          }}
        >
          Thêm Vé
        </Button>
        <Table
          dataSource={tickets.map((ticket) => ({
            id: ticket.id, 
            status: ticket.attributes.status,
            // username:
            //   ticket.attributes.users_permissions_user.data.attributes.username,
          }))}
          columns={columns}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <AddTicketModal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate}
          ticketData={editingTicket || {}}
          setTicketData={setEditingTicket}
        />
      </div>
    </div>
  );
};

export default TicketsManagement;
