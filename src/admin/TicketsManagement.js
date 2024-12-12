import React, { useEffect, useState } from "react";
import { Button, Table, Modal, message, Space } from "antd";
import {
  fetchAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../api/TicketApi";
import AddTicketModal from "../components/AddTicketModal";
import Sidebar from "../components/Sidebar";
import { fetchAllPrices } from "../api/PricesApi";
import { render } from "@testing-library/react";
import { formatVietnamTime } from "../utils/timeUtils";

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketPrices, setTicketPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  useEffect(() => {
    loadTickets();
    loadPrices();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTickets();
      const ticketsWithPrices = data.data.map((ticket) => ({
        id: ticket.id,
        status: ticket.attributes.status,
        createdAt: ticket.attributes.createdAt,
        ticketPrices:
          ticket.attributes.ticket_prices.data.map((price) => ({
            id: price.id,
            price: price.attributes.price,
          })) || [],
      }));
      setTickets(ticketsWithPrices);
    } catch (error) {
      message.error("Không thể lấy danh sách vé");
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    try {
      const data = await fetchAllPrices();
      setTicketPrices(data.data);
    } catch (error) {
      message.error("Không thể lấy danh sách giá vé");
      console.error("Error fetching ticket prices:", error);
    }
  };

  const handleCreate = async (newTicket) => {
    try {
      await createTicket(newTicket);
      loadTickets(); // Reload the tickets after adding
      message.success("Thêm vé thành công!");
    } catch (error) {
      message.error("Không thể tạo vé");
      console.error("Error creating ticket:", error);
    }
  };

  const handleUpdate = async (updatedTicket) => {
    try {
      await updateTicket(editingTicket.id, updatedTicket);
      loadTickets(); // Reload the tickets after updating
      message.success("Cập nhật vé thành công!");
      setModalVisible(false); // Close modal after updating
      setEditingTicket(null); // Reset editingTicket after update
    } catch (error) {
      message.error("Không thể cập nhật vé");
      console.error("Error updating ticket:", error);
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
          loadTickets(); // Reload the tickets after deletion
          message.success("Xóa vé thành công!");
        } catch (error) {
          message.error("Không thể xóa vé");
          console.error("Error deleting ticket:", error);
        }
      },
    });
  };

  const openEditModal = (ticket) => {
   
    setEditingTicket(ticket); // Set the ticket being edited
    setModalVisible(true); // Open the edit modal
  };

  const openDetailModal = (ticket) => {
    setSelectedTicket(ticket); // Set the ticket being viewed
    setDetailModalVisible(true); // Open the detail modal
  };
  const formatVietnamTime = (isoString) => {
    // Chuyển đổi ISO string thành đối tượng Date
    const date = new Date(isoString);
    // Cộng thêm 7 giờ để chuyển sang giờ Việt Nam
    const vietnamTime = new Date(date.getTime() - 12 * 60 * 60 * 1000); // Sửa lại để cộng 7 giờ

    // Lấy giờ và phút
    const hours = vietnamTime.getHours();
    const minutes = vietnamTime.getMinutes();

    // Xác định AM hoặc PM
    const amPm = hours >= 12 ? "PM" : "AM";

    // Chuyển đổi giờ về định dạng 12 giờ
    const formattedHours = hours % 24 || 24; // Nếu giờ = 0 thì chuyển thành 12

    // Định dạng thời gian theo kiểu Việt Nam (ngày/tháng/năm giờ:phút:giây AM/PM)
    return `${vietnamTime.toLocaleDateString(
      "vi-VN"
    )} ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Giá Vé",
      dataIndex: "ticketPrices",
      key: "prices",
      render: (ticketPrices) => {
        if (Array.isArray(ticketPrices) && ticketPrices.length > 0) {
          return ticketPrices
            .map((price) => `ID: ${price.id}, Giá: ${price.price} VND`)
            .join(", ");
        }
        return "Không có giá";
      },
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{formatVietnamTime(text)}</span>, // Định dạng thời gian theo kiểu Việt Nam
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Space>
            <Button type="primary" onClick={() => openEditModal(record)}>
              Sửa
            </Button>
            <Button danger onClick={() => handleDelete(record.id)}>
              Xóa
            </Button>
            <Button
              onClick={() => openDetailModal(record)}
              style={{ marginLeft: 8 }}
            >
              Xem Chi Tiết
            </Button>
          </Space>
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
            setEditingTicket(null); // Reset editing ticket for adding a new ticket
            setModalVisible(true);
          }}
        >
          Thêm Vé
        </Button>
        <Table
          dataSource={tickets}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
        <AddTicketModal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleCreate}
          onEdit={handleUpdate}
          ticketData={editingTicket || {}} // Pass the editing ticket or an empty object
          ticketPrices={ticketPrices}
        />
        {/* Modal xem chi tiết vé */}
        <Modal
          title="Chi tiết Vé"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null} // Không cần footer cho modal này
        >
          {selectedTicket && (
            <div>
              <p>
                <strong>ID:</strong> {selectedTicket.id}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedTicket.status}
              </p>
              <p>
                <strong>Ngày Tạo:</strong>{" "}
                {formatVietnamTime(selectedTicket.createdAt)}
              </p>
              <p>
                <strong>Giá Vé:</strong>{" "}
                {selectedTicket.ticketPrices
                  .map((price) => `ID: ${price.id}, Giá: ${price.price} VND`)
                  .join(", ")}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TicketsManagement;
