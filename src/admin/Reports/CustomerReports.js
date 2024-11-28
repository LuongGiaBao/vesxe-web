import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";
import { fetchAllCustomReport } from "../../api/CustomerReport";
import moment from "moment";
import { Table, Tag, Button, Space } from "antd";
const CustomerSalesReport = () => {
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState("01/08/2019");
  const [endDate, setEndDate] = useState("22/10/2019");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Gọi API thông qua hàm fetchAllCustomReport
        const response = await fetchAllCustomReport();

        // Xử lý dữ liệu nhận về
        const formattedData = response.data.map((item) => {
          const customer = item.attributes.customer?.data?.attributes || {};
          const promotion = item.attributes.detail_promotion?.data?.attributes || {};

          return {
            id: item.id,
            customerCode: customer.MaKH || "Không có",
            customerName: customer.TenKH || "Không có",
            address: customer.DiaChi || "Không có",
            customerGroup: customer.type || "Không có",
            productGroup: promotion.description || "Không có",
            industry: promotion.IDPromotion || "Không có",
            salesBeforeDiscount: item.attributes.DoanhSoTruocChietKhau || 0,
            discount: promotion.description || "-",
            salesAfterDiscount: item.attributes.DoanhSoSauChietKhau || 0,
            createdAt: item.attributes.createdAt,
          };
        });

        // Lọc dữ liệu theo khoảng thời gian (startDate và endDate)
        const filteredData = formattedData.filter((item) => {
          const saleDate = new Date(item.createdAt); // Đảm bảo trường `createdAt` tồn tại
          const start = new Date(startDate);
          const end = new Date(endDate);
          return saleDate >= start && saleDate <= end;
        });

        setReportData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [startDate, endDate]); // Khi startDate hoặc endDate thay đổi, gọi lại API

  // Xuất báo cáo ra Excel
  const exportToExcel = () => {
    // Định dạng dữ liệu xuất ra với các cột tương ứng
    const formattedDataForExcel = reportData.map((item) => ({
      "Mã KH": item.customerCode,
      "Tên KH": item.customerName,
      "Địa chỉ": item.address,
      "Nhóm KH": item.customerGroup,
      "Ngành Hàng": item.industry,
      "Doanh số trước CK": item.salesBeforeDiscount,
      "Chiết khấu": item.discount,
      "Doanh số sau CK": item.salesAfterDiscount,
      // "Ngày tạo": moment(item.createdAt).format("DD/MM/YYYY"),
    }));

    // Chuyển đổi dữ liệu thành sheet
    const ws = XLSX.utils.json_to_sheet(formattedDataForExcel, {
      header: [
        "Mã KH",
        "Tên KH",
        "Địa chỉ",
        "Nhóm KH",
        "Ngành Hàng",
        "Doanh số trước CK",
        "Chiết khấu",
        "Doanh số sau CK",
        // "Ngày tạo",
      ],
      origin: "A2",
    });

    // Thêm tiêu đề "DOANH SỐ THEO KHÁCH HÀNG" vào dòng đầu tiên
    XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ THEO KHÁCH HÀNG"]], {
      origin: "E1",
    });

    // Tăng phạm vi để dữ liệu nằm dưới tiêu đề
    const range = XLSX.utils.decode_range(ws["!ref"]);
    range.e.r += 1; // Tăng số dòng để bao gồm tiêu đề
    ws["!ref"] = XLSX.utils.encode_range(range);

    // Căn giữa toàn bộ nội dung, bao gồm cả tiêu đề
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cell_address = { r: row, c: col }; // Địa chỉ của ô
        const cell = ws[XLSX.utils.encode_cell(cell_address)];
        if (!cell) continue;
        cell.s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        };
      }
    }

    // Tạo workbook và thêm sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh thu khách hàng");

    // Xuất file Excel
    XLSX.writeFile(wb, "doanh_thu_theo_khach_hang.xlsx");
  };

  const columns = [
    {
      title: "STT", // Tiêu đề cột
      dataIndex: "id", // Truy cập trực tiếp thuộc tính `id`
      key: "id",
    },
    {
      title: "Mã KH",
      dataIndex: "customerCode",
      key: "customerCode",
    },
    {
      title: "Tên KH",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Nhóm KH",
      dataIndex: "customerGroup",
      key: "customerGroup",
    },
    // {
    //   title: "Nhóm SP",
    //   dataIndex: "productGroup",
    //   key: "productGroup",
    // },
    // {
    //   title: "Ngành Hàng",
    //   dataIndex: "industry",
    //   key: "industry",
    // },
    {
      title: "Doanh số trước CK",
      dataIndex: "salesBeforeDiscount",
      key: "salesBeforeDiscount",
      render: (text) => `${Number(text).toLocaleString()} VND`,
    },
    {
      title: "Chiết khấu",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Doanh số sau CK",
      dataIndex: "salesAfterDiscount",
      key: "salesAfterDiscount",
      render: (text) => `${Number(text).toLocaleString()} VND`,
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (text) => moment(text).format("DD/MM/YYYY"),
    // },
    // {
    //   title: "Hành động",
    //   key: "actions",
    //   render: (text, record) => (
    //     <Space>
    //       <Button
    //         onClick={() => {
    //           console.log("Edit", record);
    //         }}
    //       >
    //         Sửa
    //       </Button>
    //       <Button danger onClick={() => console.log("Delete", record.id)}>
    //         Xóa
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];
  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="admin-content">
        <h1>Báo Cáo Doanh Thu Theo Khách Hàng</h1>
       
        <Button onClick={exportToExcel} type="primary">
          Xuất Excel
        </Button>
        <Table
          columns={columns}
          dataSource={reportData}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default CustomerSalesReport;
