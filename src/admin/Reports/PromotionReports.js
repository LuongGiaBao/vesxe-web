import React, { useEffect, useState } from "react";
import { Table, Spin, Button, DatePicker } from "antd";
import Sidebar from "../../components/Sidebar";
import { fetchAllPromotionReport } from "../../api/PromotionReport";
import * as XLSX from "xlsx";
import moment from "moment";

const { RangePicker } = DatePicker;
const PromotionReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  // Fetch data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllPromotionReport();
        const flattenedData = response.data.flatMap((item) => {
          return (
            item.attributes.detail_promotions?.data.map((detail) => ({
              //id: detail.id,
              MaChiTietKhuyenMai: detail.attributes.MaChiTietKhuyenMai,
              description: detail.attributes.description,
              startDate:
                detail.attributes.promotion?.data?.attributes?.startDate || "-",
              endDate:
                detail.attributes.promotion?.data?.attributes?.endDate || "-",
              LoaiKhuyenMai: detail.attributes.LoaiKhuyenMai,
              TongTienHoaDon: detail.attributes.TongTienHoaDon,
              SoTienTang: detail.attributes.SoTienTang,
              PhanTramChietKhau: detail.attributes.PhanTramChietKhau,
              SoTienKhuyenMaiToiDa: detail.attributes.SoTienKhuyenMaiToiDa,
            })) || []
          );
        });
        setData(flattenedData); // Gán dữ liệu đã phẳng hóa
        setFilteredData(flattenedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const exportToExcel = () => {
  //   const wb = XLSX.utils.book_new();

  //   // Create a title row
  //   const titleRow = [[" Báo Cáo Tổng Kết Chi tiết khuyến mãi"]];

  //   // Create a time row
  //   const timeRow = [
  //     [`Thời gian xuất báo cáo: ${new Date().toLocaleString("vi-VN")}`],
  //   ];

  //   // Create a user row
  //   const userRow = [[`Người xuất báo cáo: [Tên người dùng]`]]; // Replace [Tên người dùng] with actual user info

  //   // Create a header for the data table
  //   const headerRow = [
  //     [
  //       "Mã CTKM",
  //       "Tên CTKM",
  //       "Ngày Bắt Đầu",
  //       "Ngày Kết Thúc",
  //       "Loại Khuyến Mãi",
  //       "Tổng Tiền Hóa Đơn (VNĐ)",
  //       "Số Tiền Tặng (VNĐ)",
  //       "Phần Trăm Chiết Khấu (%)",
  //       "Số Tiền KM Tối Đa (VNĐ)",
  //     ],
  //   ];

  //   // Create a worksheet from the data
  //   const ws = XLSX.utils.json_to_sheet(data, {
  //     header: Object.keys(data[0]),
  //     skipHeader: true, // Skip headers in the json_to_sheet
  //   });

  //   // Add the title, time, user rows to the worksheet
  //   XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "E1" }); // Adjust origin for title
  //   XLSX.utils.sheet_add_aoa(ws, timeRow, { origin: "A2" }); // Adjust origin for time
  //   XLSX.utils.sheet_add_aoa(ws, userRow, { origin: "A3" }); // Adjust origin for user
  //   XLSX.utils.sheet_add_aoa(ws, headerRow, { origin: "A5" }); // Add header row starting at A5

  //   // Append the data to the worksheet starting from A6 (after header)
  //   XLSX.utils.sheet_add_json(ws, data, {
  //     header: Object.keys(data[0]),
  //     skipHeader: true,
  //     origin: "A6",
  //   });

  //   // Merge the title cell to span multiple columns
  //   ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]; // Merge A1 to I1

  //   // Add the worksheet to the workbook
  //   XLSX.utils.book_append_sheet(wb, ws, "Báo cáo khuyến mãi");

  //   // Write the file
  //   XLSX.writeFile(wb, "Bao_cao_khuyen_mai.xlsx");
  // };
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

    // 5. Tạo worksheet từ JSON data
    const ws = XLSX.utils.json_to_sheet([], { skipHeader: true });

    // 6. Thêm các hàng tiêu đề, thời gian và thông tin người dùng
    XLSX.utils.sheet_add_aoa(ws, titleRow, { origin: "A1" }); // Thêm tiêu đề chính
    XLSX.utils.sheet_add_aoa(ws, timeRow, { origin: "A2" }); // Thêm thời gian xuất báo cáo
    XLSX.utils.sheet_add_aoa(ws, userRow, { origin: "A3" }); // Thêm thông tin người xuất báo cáo
    XLSX.utils.sheet_add_aoa(ws, headerRow, { origin: "A5" }); // Thêm tiêu đề bảng dữ liệu

    // 7. Thêm dữ liệu JSON vào sau dòng tiêu đề
    XLSX.utils.sheet_add_json(ws, data, {
      header: Object.keys(data[0]),
      skipHeader: true,
      origin: "A6",
    });

    // 8. Gộp ô tiêu đề chính
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }]; // Gộp từ A1 đến I1
    ws["A1"].s = {
      alignment: {
        horizontal: "center", // Căn giữa ngang
        vertical: "center", // Căn giữa dọc
      },
      font: {
        bold: true,
        size: 16, // Kích thước font chữ
      },
    };
    ws["!cols"] = Object.keys(ws).map(() => ({
      wch: 20, // Chiều rộng mặc định là 20 ký tự, bạn có thể điều chỉnh giá trị này
    }));
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
