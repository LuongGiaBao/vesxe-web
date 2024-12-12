// src/admin/PriceManagement.js
import React, { useEffect, useState } from "react";
import { Table, Button, message, Space, Modal, Tag, Typography } from "antd";
import {
  fetchAllPrices,
  createPrice,
  updatePrice,
  deletePrice,
} from "../api/PricesApi";
import {
  createPriceDetail,
  deletePriceDetail,
  getPriceDetailsByPriceId,
  updatePriceDetail,
} from "../api/PriceDetailApi";
import Sidebar from "../components/Sidebar";
import PriceFormModal from "../components/PriceFormModal";
import PriceDetailModal from "../components/PriceDetailModal";
import moment from "moment";
import { fetchAllPriceDetails } from "../api/PriceDetailApi";
import PriceDetailFormModal from "../components/PriceDetailFormModal";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { confirm } = Modal;
const PriceManagement = () => {
  const [prices, setPrices] = useState([]);
  const [priceDetails, setPriceDetails] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPriceDetailModalVisible, setIsPriceDetailModalVisible] =
    useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [editingPriceDetail, setEditingPriceDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPriceForDetails, setSelectedPriceForDetails] = useState(null);
  const [selectedPriceId, setSelectedPriceId] = useState(null);

  useEffect(() => {
    loadPrices();
    loadPriceDetails();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [pricesResponse, priceDetailsResponse] = await Promise.all([
        fetchAllPrices(),
        fetchAllPriceDetails(),
      ]);
      setPrices(pricesResponse.data);
      setPriceDetails(priceDetailsResponse.data);
    } catch (error) {
      message.error("Không thể tải lại dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const loadPrices = async () => {
    setLoading(true);
    try {
      const response = await fetchAllPrices();
      setPrices(response.data);
      return response.data; // Trả về dữ liệu đã tải
    } catch (error) {
      message.error("Không thể tải danh sách bảng giá");
      return []; // Trả về mảng rỗng nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  const loadPriceDetails = async () => {
    setLoading(true);
    try {
      const response = await fetchAllPriceDetails();

      setPriceDetails(response.data);

      // Xử lý dữ liệu ở đây
    } catch (error) {
      console.error("Không thể tải chi tiết giá:", error);
    }
  };

  const handleCreatePrice = async (values) => {
    try {
      await createPrice(values);
      message.success("Tạo bảng giá thành công");
      loadPrices();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo bảng giá");
    }
  };

  const handleUpdatePrice = async (values) => {
    try {
      await updatePrice(editingPrice.id, values);
      message.success("Cập nhật bảng giá thành công");
      loadPrices();
      setIsModalVisible(false);
      setEditingPrice(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật bảng giá");
    }
  };

  const handleDeletePrice = async (id) => {
    const priceToDelete = prices.find((price) => price.id === id);

    // Kiểm tra trạng thái trước khi xác nhận xóa
    if (priceToDelete && priceToDelete.attributes.status === "Hoạt động") {
      message.error("Không thể xóa bảng giá đang hoạt động.");
      return;
    }

    confirm({
      title: "Bạn có chắc chắn muốn xóa bảng giá này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePrice(id);
          message.success("Xóa bảng giá thành công");
          loadPrices();
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa bảng giá");
        }
      },
    });
  };

  const handleCreatePriceDetail = async (values) => {
    try {
      const newDetail = await createPriceDetail(values.data);

      // Kiểm tra xem newDetail có giá trị hợp lệ không
      if (newDetail) {
        message.success("Thêm chi tiết giá thành công");
        setPriceDetails((prevDetails) => [...prevDetails, newDetail]); // Cập nhật state trực tiếp
        setIsPriceDetailModalVisible(false);
      } else {
        throw new Error("Không có dữ liệu trả về từ server.");
      }
    } catch (error) {
      console.error("Error adding price detail:", error);
      message.error("Có lỗi xảy ra khi thêm chi tiết giá");
    }
  };

  const handleUpdatePriceDetail = async (id, values) => {
    try {
      await updatePriceDetail(id, values);
      message.success("Cập nhật chi tiết giá thành công");
      setIsPriceDetailModalVisible(false);
      setEditingPriceDetail(null);
      await reloadData();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật chi tiết giá");
    }
  };

  // const handleDeletePriceDetail = async (id, record) => {
  //   const detailPrices = currentPrice?.attributes?.detai_prices?.data || [];
  //   const priceDetailToDelete = detailPrices.find((detail) => detail.id === id);

  //   // Kiểm tra xem chi tiết giá có tồn tại không
  //   if (!priceDetailToDelete) {
  //     message.error("Chi tiết giá không tồn tại.");
  //     return;
  //   }

  //   const currentPrice = prices.find((price) => price.id === record.id);

  //   // Kiểm tra trạng thái bảng giá trước khi xác nhận xóa chi tiết
  //   if (currentPrice && currentPrice.attributes.status === "Hoạt động") {
  //     message.error("Không thể xóa chi tiết giá vì bảng giá đang hoạt động.");
  //     return;
  //   }

  //   // Tiến hành xóa chi tiết giá
  //   confirm({
  //     title: "Bạn có chắc chắn muốn xóa chi tiết giá này?",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Hành động này không thể hoàn tác.",
  //     okText: "Xóa",
  //     okType: "danger",
  //     cancelText: "Hủy",
  //     onOk: async () => {
  //       try {
  //         await deletePriceDetail(id);
  //         message.success("Xóa chi tiết giá thành công");
  //         loadPriceDetails();
  //         loadPrices();
  //       } catch (error) {
  //         message.error("Có lỗi xảy ra khi xóa chi tiết giá");
  //       }
  //     },
  //   });
  // };
  const handleDeletePriceDetail = async (id, record) => {
    // Corrected order of variable usage
    const currentPrice = prices.find((price) => price.id === record);

    // const detailPrices = currentPrice?.attributes?.detai_prices?.data || [];
    // const priceDetailToDelete = detailPrices.find((detail) => detail.id === id);
    // console.log("currentPrice", currentPrice);

    // // Kiểm tra xem chi tiết giá có tồn tại không
    // if (!priceDetailToDelete) {
    //   message.error("Chi tiết giá không tồn tại.");
    //   return;
    // }

    // Kiểm tra trạng thái bảng giá trước khi xác nhận xóa chi tiết
    if (currentPrice && currentPrice.attributes.status === "Hoạt động") {
      message.error("Không thể xóa chi tiết giá vì bảng giá đang hoạt động.");
      return;
    }

    // Tiến hành xóa chi tiết giá
    confirm({
      title: "Bạn có chắc chắn muốn xóa chi tiết giá này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePriceDetail(id);
          message.success("Xóa chi tiết giá thành công");
          loadPriceDetails();
          loadPrices();
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa chi tiết giá");
        }
      },
    });
  };

  const handleAddPriceDetail = (priceId) => {
    setSelectedPriceId(priceId);
    setEditingPriceDetail(null); // Reset editing state
    setIsPriceDetailModalVisible(true); // Mở modal chi tiết giá
  };

  const handleViewPriceDetails = (record) => {
    setSelectedPrice(record); // Ensure record includes the trip data
    setIsDetailModalVisible(true); // Show the modal
  };

  const handleOpenModal = (price) => {
    setSelectedPrice(price); // Set the selected price details
    setIsModalVisible(true); // Show the modal
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedPrice(null); // Clear the selected price details
  };

  const columns = [
    {
      title: "ID", // Thay đổi từ "ID" thành "ID"
      dataIndex: ["id"], // Đây là nơi bạn lấy ID từ dữ liệu
      key: "id",
    },
    {
      title: "Mã Giá",
      dataIndex: ["attributes", "MaGia"],
      key: "MaGia",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: ["attributes", "startDate"],
      key: "startDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"), // Format date
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: ["attributes", "endDate"],
      key: "endDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"), // Format date
    },
    {
      title: "Mô tả",
      dataIndex: ["attributes", "Mota"],
      key: "Mota",
    },
    {
      title: "Trạng thái",
      dataIndex: ["attributes", "status"],
      key: "status",
      render: (text) => (
        <Tag color={text === "Hoạt động" ? "green" : "red"}>{text}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingPrice(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => handleDeletePrice(record.id)}>
            Xóa
          </Button>
          {/* <Button
            onClick={() => {
              setSelectedPrice(record);
              setIsDetailModalVisible(true);
            }}
          >
            Chi tiết
          </Button> */}
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const detailColumns = [
      {
        title: "ID",
        dataIndex: ["id"],
        key: "id",
      },
      {
        title: "Mã Chi Tiết Giá",
        dataIndex: ["attributes", "MaChiTietGia"],
        key: "MaChiTietGia",
      },
      {
        title: "Tuyến",
        dataIndex: ["attributes", "trip"],
        key: "trip",
        render: (trip) => {
          if (!trip || !trip.data || !trip.data.attributes) {
            return "Không có thông tin";
          }
          const departure =
            trip.data.attributes.departure_location_id?.data?.attributes
              ?.name || "N/A";
          const arrival =
            trip.data.attributes.arrival_location_id?.data?.attributes?.name ||
            "N/A";
          return `${departure} → ${arrival}`;
        },
      },
      {
        title: "Giá",
        dataIndex: ["attributes", "Gia"],
        key: "Gia",
        render: (text) => `${parseInt(text).toLocaleString()} VNĐ`,
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, detail) => {
          const currentPrice = prices.find((price) => price.id === record.id);

          // Kiểm tra trạng thái của bảng giá
          const isPriceActive =
            currentPrice && currentPrice.attributes.status === "Hoạt động";

          return (
            <Space>
              <Button
                onClick={() => {
                  setEditingPriceDetail(detail);
                  setIsPriceDetailModalVisible(true);
                }}
              >
                Sửa
              </Button>
              <Button
                danger
                onClick={() => {
                  if (isPriceActive) {
                    message.error(
                      "Không thể xóa chi tiết giá vì bảng giá đang hoạt động."
                    );
                  } else {
                    handleDeletePriceDetail(detail.id, record.id);
                  }
                }}
              >
                Xóa
              </Button>
            </Space>
          );
        },
      },
    ];

    const currentPrice = prices.find((price) => price.id === record.id);
    const detailPrices = currentPrice?.attributes?.detai_prices?.data || [];

    return (
      <div
        style={{
          margin: 16,
          backgroundColor: "#ccc",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Button
          type="primary"
          onClick={() => handleAddPriceDetail(record.id)}
          style={{ marginBottom: 16 }}
        >
          Thêm Chi Tiết Giá
        </Button>

        <Table
          columns={detailColumns}
          dataSource={detailPrices}
          pagination={false}
          rowKey={(item) => item.id}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "even-row" : "odd-row"
          } // Phân biệt hàng chẵn và lẻ
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
        <h1>Quản lý bảng giá</h1>
        <Button
          style={{ marginBottom: 20 }}
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          Thêm bảng giá mới
        </Button>

        <Table
          columns={columns}
          dataSource={prices}
          expandable={{
            expandedRowRender: (record) => {
              const detailPrices = record.attributes.detai_prices?.data || [];
              if (detailPrices.length === 0) {
                return (
                  <div>
                    <p>Chưa có chi tiết giá.</p>
                    <Button onClick={() => handleAddPriceDetail(record.id)}>
                      Thêm Chi Tiết Giá
                    </Button>
                  </div>
                );
              }
              return expandedRowRender(record);
            },
            rowExpandable: () => true, // Luôn cho phép mở rộng
          }}
          loading={loading}
          //  dataSource={prices} expandedRowRender={expandedRowRender}
          rowKey={(record) => record.id}
        />
        <PriceFormModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingPrice(null);
          }}
          onOk={editingPrice ? handleUpdatePrice : handleCreatePrice}
          initialValues={editingPrice}
          existingPrices={prices}
          // onAddPriceDetail={handleAddPriceDetail}
        />

        <PriceDetailFormModal
          visible={isPriceDetailModalVisible}
          onCancel={() => {
            setIsPriceDetailModalVisible(false);
            setEditingPriceDetail(null);
          }}
          onOk={async (values) => {
            if (editingPriceDetail) {
              await handleUpdatePriceDetail(editingPriceDetail.id, values);
            } else {
              await handleCreatePriceDetail(values);
            }
            await reloadData(); // Gọi reloadData sau khi thêm hoặc cập nhật
          }}
          priceId={selectedPriceId}
          editingPriceDetail={editingPriceDetail}
          reloadData={reloadData} // Truyền reloadData vào modal
        />

        <PriceDetailModal
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          price={selectedPrice} // Pass the selected price details to the modal
        />
      </div>
    </div>
  );
};

export default PriceManagement;
