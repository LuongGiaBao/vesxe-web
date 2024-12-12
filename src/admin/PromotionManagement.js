import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Space,
  Tag,
  Modal,
  Card,
  Descriptions,
} from "antd";
import {
  fetchAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../api/PromotionApi";
import AddPromotionModal from "../components/AddPromotionModal";
import Sidebar from "../components/Sidebar";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  createPromotionDetail,
  deletePromotionDetail,
  fetchAllPromotionDetails,
  updatePromotionDetail,
} from "../api/PromotionDetailApi";
import PromotionDetailFormModal from "../components/PromotionDetailFormModal";
import PromotionDetailModal from "../components/PromotionDetailModal";
const { confirm } = Modal;

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [isPromotionDetailModalVisible, setIsPromotionDetailModalVisible] =
    useState(false);
  const [editingPromotionDetail, setEditingPromotionDetail] = useState(null);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetchAllPromotions();
      setPromotions(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async (values) => {
    try {
      await createPromotion(values);
      message.success("Tạo khuyến mãi thành công");
      loadPromotions();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo khuyến mãi");
    }
  };

  const handleUpdatePromotion = async (values) => {
    try {
      await updatePromotion(editingPromotion.id, values);
      message.success("Cập nhật khuyến mãi thành công");
      loadPromotions();
      setIsModalVisible(false);
      setEditingPromotion(null);
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật khuyến mãi");
    }
  };

  const handleDeletePromotion = async (id, status) => {
    if (status === "Hoạt động") {
      message.warning("Không thể xóa khuyến mãi đang hoạt động.");
      return;
    }
    confirm({
      title: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePromotion(id);
          message.success("Xóa khuyến mãi thành công");
          loadPromotions();
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa khuyến mãi");
        }
      },
    });
  };

  const handleAddPromotionDetail = (promotionId) => {
    setSelectedPromotionId(promotionId);
    setEditingPromotionDetail(null);
    setIsPromotionDetailModalVisible(true);
  };

  // const handleDeletePromotionDetail = async (id, status) => {
  //   const promotion = promotions.find((promo) => promo.id === id);

  //   if (promotion?.attributes?.status === "Hoạt động") {
  //     message.warning(
  //       "Không thể xóa chi tiết khuyến mãi khi khuyến mãi đang hoạt động."
  //     );
  //     return;
  //   }
  //   confirm({
  //     title: "Bạn có chắc chắn muốn xóa chi tiết khuyến mãi này?",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Hành động này không thể hoàn tác.",
  //     okText: "Xóa",
  //     okType: "danger",
  //     cancelText: "Hủy",
  //     onOk: async () => {
  //       try {
  //         await deletePromotionDetail(id);
  //         message.success("Xóa chi tiết khuyến mãi thành công");
  //         loadPromotions();
  //       } catch (error) {
  //         message.error("Có lỗi xảy ra khi xóa chi tiết khuyến mãi");
  //       }
  //     },
  //   });
  // };
  const handleDeletePromotionDetail = async (detailId, promotionId) => {
    const promotion = promotions.find((promo) => promo.id === promotionId);

    if (promotion?.attributes?.status === "Hoạt động") {
      message.warning(
        "Không thể xóa chi tiết khuyến mãi khi khuyến mãi đang hoạt động."
      );
      return;
    }

    confirm({
      title: "Bạn có chắc chắn muốn xóa chi tiết khuyến mãi này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deletePromotionDetail(detailId);
          message.success("Xóa chi tiết khuyến mãi thành công");
          loadPromotions();
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa chi tiết khuyến mãi");
        }
      },
    });
  };

  const handleCreatePromotionDetail = async (values) => {
    setLoading(true);
    try {
      // Đảm bảo rằng API của bạn đang xử lý trường 'promotion' đúng cách
      await createPromotionDetail({
        ...values,
        promotionId: selectedPromotionId, /// Hoặc có thể là { id: values.promotion } tùy thuộc vào API của bạn
      });
      message.success("Thêm chi tiết khuyến mãi thành công");
      loadPromotions(); // Reload promotions to update the list
    } catch (error) {
      message.error(
        "Có lỗi xảy ra khi thêm chi tiết khuyến mãi: " + error.message
      );
    } finally {
      setIsPromotionDetailModalVisible(false);
      setLoading(false);
    }
  };

  const handleUpdatePromotionDetail = async (values) => {
    setLoading(true);
    try {
      await updatePromotionDetail(editingPromotionDetail.id, values);
      message.success("Cập nhật chi tiết khuyến mãi thành công");
      loadPromotions(); // Reload promotions to update the list
    } catch (error) {
      message.error(
        "Có lỗi xảy ra khi cập nhật chi tiết khuyến mãi: " + error.message
      );
    } finally {
      setIsPromotionDetailModalVisible(false);
      setEditingPromotionDetail(null);
      setLoading(false);
    }
  };

  const handlePromotionDetailModalOk = async (values) => {
    if (editingPromotionDetail) {
      await handleUpdatePromotionDetail(values);
    } else {
      await handleCreatePromotionDetail(values);
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: ["id"],
      key: "id",
    },
    {
      title: "Mã Khuyến Mãi",
      dataIndex: ["attributes", "IDPromotion"],
      key: "IDPromotion",
    },
    {
      title: "Mô tả",
      dataIndex: ["attributes", "description"],
      key: "description",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: ["attributes", "startDate"],
      key: "startDate",
      render: (text) => moment(text).format("DD/MM/YYYY "),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: ["attributes", "endDate"],
      key: "endDate",
      render: (text) => moment(text).format("DD/MM/YYYY "),
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
              setEditingPromotion(record);
              setIsModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() =>
              handleDeletePromotion(record.id, record.attributes.status)
            }
          >
            Xóa
          </Button>
          {/* <Button
            onClick={() => {
              setSelectedPromotion(record);
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
        title: "Mã Chi Tiết Khuyến Mãi",
        dataIndex: ["attributes", "MaChiTietKhuyenMai"],
        key: "MaChiTietKhuyenMai",
      },
      {
        title: "Mô tả",
        dataIndex: ["attributes", "description"],
        key: "description",
      },
      {
        title: "Loại Khuyến Mãi",
        dataIndex: ["attributes", "LoaiKhuyenMai"],
        key: "LoaiKhuyenMai",
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, detail) => (
          <Space>
            <Button
              onClick={() => {
                setEditingPromotionDetail(detail);
                setIsPromotionDetailModalVisible(true);
              }}
            >
              Sửa
            </Button>
            <Button
              danger
              onClick={() => handleDeletePromotionDetail(detail.id, record.id)}
            >
              Xóa
            </Button>
          </Space>
        ),
      },
    ];

    const currentPromotion = promotions.find((promo) => promo.id === record.id);
    const detailPromotions =
      currentPromotion?.attributes?.detail_promotions?.data || [];

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
          onClick={() => handleAddPromotionDetail(record.id)}
          style={{ marginBottom: 16 }}
        >
          Thêm Chi Tiết Khuyến Mãi
        </Button>

        <Table
          columns={detailColumns}
          dataSource={detailPromotions}
          pagination={false}
          rowKey={(item) => item.id}
          bordered
          style={{ marginTop: 16, backgroundColor: "#fff" }}
          expandable={{
            expandedRowRender: (detailRecord) => {
              const detailDataSource = [];
              const { attributes } = detailRecord;
              if (attributes.LoaiKhuyenMai === "Tặng tiền") {
                detailDataSource.push(
                  {
                    key: "Tổng tiền hóa đơn",
                    value: `${attributes.TongTienHoaDon?.toLocaleString()} VNĐ`,
                  },
                  {
                    key: "Số tiền tặng",
                    value: `${attributes.SoTienTang?.toLocaleString()} VNĐ`,
                  }
                );
              } else if (attributes.LoaiKhuyenMai === "Chiết khấu hóa đơn") {
                detailDataSource.push(
                  {
                    key: "Tổng tiền hóa đơn",
                    value: `${attributes.TongTienHoaDon?.toLocaleString()} VNĐ`,
                  },
                  {
                    key: "% Chiết khấu",
                    value: `${attributes.PhanTramChietKhau}%`,
                  },
                  {
                    key: "Số tiền KM tối đa",
                    value: `${attributes.SoTienKhuyenMaiToiDa?.toLocaleString()} VNĐ`,
                  }
                );
              }

              return (
                <Card title="Chi tiết khuyến mãi">
                  <Descriptions column={1}>
                    {detailDataSource.map((item) => (
                      <Descriptions.Item label={item.key} key={item.key}>
                        {item.value}
                      </Descriptions.Item>
                    ))}
                  </Descriptions>
                </Card>
              );
            },
            rowExpandable: (record) => true,
          }}
        />
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Quản lý khuyến mãi</h1>
        <Button
          style={{ marginBottom: 20 }}
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setEditingPromotion(null);
          }}
        >
          Thêm khuyến mãi mới
        </Button>

        <Table
          columns={columns}
          dataSource={promotions}
          pagination={{ pageSize: 5 }}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => {
              const detailPromotions =
                record.attributes.detail_promotions?.data || [];
              if (detailPromotions.length === 0) {
                return (
                  <div>
                    <p>Chưa có chi tiết khuyến mãi.</p>
                    <Button onClick={() => handleAddPromotionDetail(record.id)}>
                      Thêm Chi Tiết Khuyến Mãi
                    </Button>
                  </div>
                );
              }
              return expandedRowRender(record);
            },
            rowExpandable: () => true,
          }}
          rowKey={(record) => record.id}
        />
        {/* modal khuyến mãi */}
        <AddPromotionModal
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingPromotion(null);
          }}
          onOk={
            editingPromotion ? handleUpdatePromotion : handleCreatePromotion
          }
          initialValues={editingPromotion}
          existingPromotions={promotions}
        />

        {/* button nút chi tiết */}
        <PromotionDetailModal
          visible={isDetailModalVisible}
          onCancel={() => {
            setIsDetailModalVisible(false);
            setSelectedPromotion(null);
          }}
          promotion={selectedPromotion}
        />

        {/* modal chi tiét khuyến mãi */}
        <PromotionDetailFormModal
          visible={isPromotionDetailModalVisible}
          onCancel={() => {
            setIsPromotionDetailModalVisible(false);
            setEditingPromotionDetail(null);
          }}
          onOk={handlePromotionDetailModalOk}
          initialValues={editingPromotionDetail?.attributes}
          promotionId={selectedPromotionId}
        />
      </div>
    </div>
  );
};

export default PromotionManagement;
