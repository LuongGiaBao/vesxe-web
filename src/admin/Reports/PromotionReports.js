import React, { useEffect, useState } from "react";
import { Table, Spin, Button, DatePicker } from "antd";
import Sidebar from "../../components/Sidebar";
import { fetchAllPromotionReport } from "../../api/PromotionReport";
import * as XLSX from "xlsx";
import moment from "moment";
import { fetchAllPromotionDetails } from "../../api/PromotionDetailApi";

const { RangePicker } = DatePicker;
const PromotionReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  // Fetch data từ API
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchAllPromotionReport();
  //       console.log("response", response);

  //       const flattenedData = response.data.map((item) => {
  //         return (
  //           item.attributes.detail_promotions?.data.map((detail) => ({
  //             //id: detail.id,
  //             MaChiTietKhuyenMai: detail.attributes.MaChiTietKhuyenMai,
  //             description: detail.attributes.description,
  //             startDate:
  //               detail.attributes.promotion?.data?.attributes?.startDate || "-",
  //             endDate:
  //               detail.attributes.promotion?.data?.attributes?.endDate || "-",
  //             LoaiKhuyenMai: detail.attributes.LoaiKhuyenMai,
  //             TongTienHoaDon: detail.attributes.TongTienHoaDon,
  //             SoTienTang: detail.attributes.SoTienTang,
  //             PhanTramChietKhau: detail.attributes.PhanTramChietKhau,
  //             SoTienKhuyenMaiToiDa: detail.attributes.SoTienKhuyenMaiToiDa,
  //           })) || []
  //         );
  //       });
  //       setData(flattenedData); // Gán dữ liệu đã phẳng hóa
  //       setFilteredData(flattenedData);
  //     } catch (error) {
  //       console.error("Error fetching data: ", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllPromotionReport(); // Lấy dữ liệu từ API chi tiết khuyến mãi
        const flattenedData = response.data.map((detail) => ({
          MaChiTietKhuyenMai: detail.attributes.MaChiTietKhuyenMai,
          description: detail.attributes.description,
          startDate: detail.attributes.promotion?.data?.attributes?.startDate
            ? new Date(
                detail.attributes.promotion.data.attributes.startDate
              ).toLocaleDateString()
            : "-",
          endDate: detail.attributes.promotion?.data?.attributes?.endDate
            ? new Date(
                detail.attributes.promotion.data.attributes.endDate
              ).toLocaleDateString()
            : "-",
          LoaiKhuyenMai: detail.attributes.LoaiKhuyenMai,
          TongTienHoaDon: detail.attributes.TongTienHoaDon,
          SoTienTang: detail.attributes.SoTienTang,
          PhanTramChietKhau: detail.attributes.PhanTramChietKhau,
          SoTienKhuyenMaiToiDa: detail.attributes.SoTienKhuyenMaiToiDa,
        }));
        setData(flattenedData);
        console.log("flattenedData", flattenedData);

        setFilteredData(flattenedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const adminName = localStorage.getItem("adminName") || "Không xác định";
    // 1. Tạo tiêu đề chính
    const titleRow = [["Báo Cáo Tổng Kết Chi Tiết Khuyến Mãi"]];

    // 2. Tạo thời gian xuất báo cáo
    const timeRow = [
      [`Thời gian xuất báo cáo: ${new Date().toLocaleString("vi-VN")}`],
    ];

    // 3. Thông tin người xuất báo cáo
    const userRow = [[`Người xuất báo cáo: ${adminName}`]];

    // 4. Tạo tiêu đề cho bảng dữ liệu
    const headerRow = [
      [
        "Mã CTKM",
        "Tên CTKM",
        "Ngày Bắt Đầu",
        "Ngày Kết Thúc",
        "Loại Khuyến Mãi",
        "Tổng Tiền Hóa Đơn (VNĐ)",
        "Số Tiền Tặng (VNĐ)",
        "Phần Trăm Chiết Khấu (%)",
        "Số Tiền KM Tối Đa (VNĐ)",
      ],
    ];
    const formattedData = data.map((item) => ({
      ...item,
      startDate: item.startDate
        ? moment(item.startDate).format("DD/MM/YYYY")
        : "-", // Định dạng ngày bắt đầu
      endDate: item.endDate ? moment(item.endDate).format("DD/MM/YYYY") : "-", // Định dạng ngày kết thúc
    }));
    // 5. Tạo worksheet từ JSON data
    const ws = XLSX.utils.json_to_sheet([], { skipHeader: true });

    // 6. Thêm các hàng tiêu đề, thời gian và thông tin người dùng
    XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "E1" }); // Thêm tiêu đề chính
    XLSX.utils.sheet_add_aoa(ws, timeRow, { origin: "A2" }); // Thêm thời gian xuất báo cáo
    XLSX.utils.sheet_add_aoa(ws, userRow, { origin: "A3" }); // Thêm thông tin người xuất báo cáo
    XLSX.utils.sheet_add_aoa(ws, headerRow, { origin: "A5" }); // Thêm tiêu đề bảng dữ liệu

    // 7. Thêm dữ liệu JSON vào sau dòng tiêu đề
    XLSX.utils.sheet_add_json(ws, formattedData, {
      header: Object.keys(formattedData[0]),
      skipHeader: true,
      origin: "A6",
    });

    // 8. Gộp ô tiêu đề chính
    // ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]; // Gộp từ A1 đến I1
    // ws["E1"].s = {
    //   alignment: {
    //     horizontal: "center", // Căn giữa ngang
    //     vertical: "center", // Căn giữa dọc
    //   },
    //   font: {
    //     bold: true,
    //     size: 16, // Kích thước font chữ
    //   },
    // };
    ws["!cols"] = [
      { wch: 20 },
      { wch: 40 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
    ]; // Định nghĩa chiều rộng các cột
    // 9. Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo khuyến mãi");

    // 10. Ghi file Excel
    XLSX.writeFile(wb, "Bao_cao_khuyen_mai.xlsx");
  };
  const handleDateChange = (dates) => {
    setDateRange(dates);

    if (dates && dates.length === 2) {
      // Lấy ngày bắt đầu và kết thúc, chuyển sang UTC
      const [start, end] = dates.map((date) =>
        moment(date).utcOffset("+07:00").startOf("day")
      );

      const filtered = data.filter((item) => {
        const promotions = item?.attributes?.detail_promotions?.data || [];

        return promotions.some((detail) => {
          const promotion = detail?.attributes?.promotion?.data?.attributes;
          if (!promotion) return false;

          // Lấy ngày bắt đầu và kết thúc từ API, chuyển sang múi giờ GMT+7
          const promotionStartDate = moment(promotion.startDate).utc();
          const promotionEndDate = moment(promotion.endDate).utc();

          // So sánh ngày đã chọn với ngày khuyến mãi
          return (
            promotionStartDate.isBetween(start, end, null, "[]") || // Ngày bắt đầu trong khoảng
            promotionEndDate.isBetween(start, end, null, "[]") || // Ngày kết thúc trong khoảng
            (promotionStartDate.isBefore(start) &&
              promotionEndDate.isAfter(end)) // Bao phủ toàn bộ khoảng thời gian
          );
        });
      });

      console.log("Filtered Data:", filtered);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const columns = [
    {
      title: "Mã CTKM",
      dataIndex: "MaChiTietKhuyenMai",
      key: "MaChiTietKhuyenMai",
    },
    {
      title: "Tên CTKM",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      title: "Loại khuyến mãi",
      dataIndex: "LoaiKhuyenMai",
      key: "LoaiKhuyenMai",
    },
    {
      title: "Tổng tiền hóa đơn (VNĐ)",
      dataIndex: "TongTienHoaDon",
      key: "TongTienHoaDon",
      render: (value) => value?.toLocaleString() || "-", // Hiển thị định dạng số
    },
    {
      title: "Số tiền tặng (VNĐ)",
      dataIndex: "SoTienTang",
      key: "SoTienTang",
      render: (value) => (value ? value.toLocaleString() : "-"),
    },
    {
      title: "Phần trăm chiết khấu (%)",
      dataIndex: "PhanTramChietKhau",
      key: "PhanTramChietKhau",
    },
    {
      title: "Số tiền KM tối đa (VNĐ)",
      dataIndex: "SoTienKhuyenMaiToiDa",
      key: "SoTienKhuyenMaiToiDa",
      render: (value) => value?.toLocaleString() || "-",
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Báo cáo tổng kết chi tiết khuyến mãi</h1>
        <RangePicker onChange={handleDateChange} style={{ marginBottom: 16 }} />
        <Button
          type="primary"
          onClick={exportToExcel}
          style={{ marginBottom: 16 }}
        >
          Xuất Excel
        </Button>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="MaChiTietKhuyenMai"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    </div>
  );
};

export default PromotionReports;
