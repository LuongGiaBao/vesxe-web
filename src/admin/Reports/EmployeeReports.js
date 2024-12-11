import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";
import moment from "moment";
import { Table, Button } from "antd";
import { fetchAllEmployeeReport } from "../../api/EmployeeReport";

const EmployeeReports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Gọi API để lấy dữ liệu
        const response = await fetchAllEmployeeReport();

        // Xử lý dữ liệu nhận về
        const formattedData = response.data.map((item) => {
          const employee = item.attributes.employee?.data?.attributes || {};
          const promotion =
            item.attributes.detail_promotion?.data?.attributes || {};
          // Lấy giá trị cần thiết
          const salesBeforeDiscount =
            item.attributes.DoanhSoTruocChietKhau || 0;
          const discountRate = promotion.PhanTramChietKhau
            ? promotion.PhanTramChietKhau / 100
            : 0;

          // Tính doanh số sau chiết khấu
          const salesAfterDiscount = salesBeforeDiscount * (1 - discountRate);
          return {
            id: item.id,
            employeeCode: employee.MaNV || "Không có",
            employeeName: employee.tenNV || "Không có",
            phoneNumber: employee.PhoneNumber || "Không có",
            type: employee.type || "Không có",
            discount: promotion.PhanTramChietKhau || "0",
            salesBeforeDiscount,
            salesAfterDiscount,
            saleDate: item.attributes.NgayBan || "-",
          };
        });

        setReportData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu doanh thu nhân viên:", error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Xuất báo cáo ra Excel
  // const exportToExcel = () => {
  //   // Định dạng dữ liệu xuất ra với các cột tương ứng
  //   const formattedDataForExcel = reportData.map((item) => ({
  //     "STT": item.id,
  //     "NVNH": item.employeeCode,
  //     "Tên NVBH": item.employeeName,
  //     "Ngày bán": item.saleDate,
  //     "Doanh số trước CK": item.salesBeforeDiscount,
  //     "Chiết khấu": item.discount,
  //     "Doanh số sau CK": item.salesAfterDiscount,
  //     // "Ngày tạo": moment(item.createdAt).format("DD/MM/YYYY"),
  //   }));

  //   // Chuyển đổi dữ liệu thành sheet
  //   const ws = XLSX.utils.json_to_sheet(formattedDataForExcel, {
  //     header: [
  //       "STT",
  //       "NVNH",
  //       "Tên NVBH",
  //       "Ngày bán",
  //       "Chiết khấu",
  //       "Doanh số trước CK",
  //       "Doanh số sau CK",
  //       // "Ngày tạo",
  //     ],
  //     origin: "A2", // Dữ liệu bắt đầu từ dòng 2
  //   });

  //   // Thêm tiêu đề "DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN" vào dòng đầu tiên
  //   XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN"]], {
  //     origin: "E1", // Đặt tiêu đề tại dòng 1, cột A
  //   });

  //   // Tăng phạm vi để bao gồm tiêu đề
  //   const range = XLSX.utils.decode_range(ws["!ref"]);
  //   range.e.r += 1; // Tăng phạm vi để dữ liệu không ghi đè lên tiêu đề
  //   ws["!ref"] = XLSX.utils.encode_range(range);

  //   // Tạo workbook và thêm sheet
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Doanh số nhân viên");

  //   // Xuất file Excel
  //   XLSX.writeFile(wb, "doanh_so_nhan_vien.xlsx");
  // };

  // Xuất báo cáo ra Excel
  // const exportToExcel = () => {
  //   // Group data by employee (NVBH)
  //   const groupedData = reportData.reduce((acc, item) => {
  //     const key = item.employeeCode; // Group by employee code
  //     if (!acc[key]) {
  //       acc[key] = {
  //         employeeCode: item.employeeCode,
  //         employeeName: item.employeeName,
  //         totalSalesBeforeDiscount: 0,
  //         totalSalesAfterDiscount: 0,
  //         rows: [],
  //       };
  //     }

  //     // Add the row for the employee
  //     acc[key].rows.push({
  //       STT: item.id,
  //       NVBH: item.employeeCode,
  //       "Tên NVBH": item.employeeName,
  //       "Ngày bán": item.saleDate,
  //       "Chiết khấu": item.discount,
  //       "Doanh số trước CK": item.salesBeforeDiscount,
  //       "Doanh số sau CK": item.salesAfterDiscount,
  //     });

  //     // Accumulate total sales before and after discount
  //     acc[key].totalSalesBeforeDiscount += item.salesBeforeDiscount;
  //     acc[key].totalSalesAfterDiscount += item.salesAfterDiscount;

  //     return acc;
  //   }, {});

  //   // Flatten the data and add the total row for each employee
  //   const formattedDataForExcel = [];
  //   let grandTotalSalesBeforeDiscount = 0;
  //   let grandTotalSalesAfterDiscount = 0;

  //   Object.values(groupedData).forEach((employeeData) => {
  //     // Add the employee rows
  //     formattedDataForExcel.push(...employeeData.rows);

  //     // Add the total row for the employee
  //     formattedDataForExcel.push({
  //       STT: "",
  //       NVBH: "",
  //       "Tên NVBH": "Tổng cộng",
  //       "Ngày bán": "",
  //       "Chiết khấu": "",
  //       "Doanh số trước CK": employeeData.totalSalesBeforeDiscount,
  //       "Doanh số sau CK": employeeData.totalSalesAfterDiscount,
  //     });

  //     // Update grand totals
  //     grandTotalSalesBeforeDiscount += employeeData.totalSalesBeforeDiscount;
  //     grandTotalSalesAfterDiscount += employeeData.totalSalesAfterDiscount;
  //   });

  //   // Add the grand total row
  //   formattedDataForExcel.push({
  //     STT: "",
  //     NVBH: "",
  //     "Tên NVBH": "Tổng cộng",
  //     "Ngày bán": "",
  //     "Chiết khấu": "",
  //     "Doanh số trước CK": grandTotalSalesBeforeDiscount,
  //     "Doanh số sau CK": grandTotalSalesAfterDiscount,
  //   });

  //   // Chuyển đổi dữ liệu thành sheet
  //   const ws = XLSX.utils.json_to_sheet(formattedDataForExcel, {
  //     header: [
  //       "STT",
  //       "NVBH",
  //       "Tên NVBH",
  //       "Ngày bán",
  //       "Chiết khấu",
  //       "Doanh số trước CK",
  //       "Doanh số sau CK",
  //     ],
  //     origin: "A2", // Dữ liệu bắt đầu từ dòng 2
  //   });

  //   // Thêm tiêu đề "DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN" vào dòng đầu tiên
  //   XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN"]], {
  //     origin: "E1", // Đặt tiêu đề tại dòng 1, cột A
  //   });

  //   // Tăng phạm vi để bao gồm tiêu đề
  //   const range = XLSX.utils.decode_range(ws["!ref"]);
  //   range.e.r += 1; // Tăng phạm vi để dữ liệu không ghi đè lên tiêu đề
  //   ws["!ref"] = XLSX.utils.encode_range(range);

  //   // Tạo workbook và thêm sheet
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Doanh số nhân viên");

  //   // Xuất file Excel
  //   XLSX.writeFile(wb, "doanh_so_nhan_vien.xlsx");
  // };

  // const exportToExcel = () => {
  //   // Nhóm dữ liệu theo mã nhân viên để tính tổng cho mỗi nhân viên
  //   const groupedData = reportData.reduce((acc, item) => {
  //     const key = item.employeeCode;
  //     if (!acc[key]) {
  //       acc[key] = {
  //         ...item,
  //         salesBeforeDiscount: 0,
  //         salesAfterDiscount: 0,
  //         totalDiscount: 0,
  //       };
  //     }

  //     // Đảm bảo các giá trị doanh số được xử lý như số
  //     acc[key].salesBeforeDiscount += parseFloat(item.salesBeforeDiscount);
  //     acc[key].salesAfterDiscount += parseFloat(item.salesAfterDiscount);
  //     acc[key].totalDiscount += parseFloat(item.discount);
  //     return acc;
  //   }, {});

  //   // Chuyển dữ liệu đã nhóm thành dạng mảng và thêm các dòng tổng
  //   const formattedDataForExcel = Object.values(groupedData).map(
  //     (item, index) => {
  //       const totalRow = {
  //         STT: index + 1,
  //         NVBH: item.employeeCode,
  //         "Tên NVBH": item.employeeName,
  //         "Ngày bán": "", // Dòng tổng không có ngày bán
  //         "Chiết khấu": item.totalDiscount,
  //         "Doanh số trước CK": item.salesBeforeDiscount,
  //         "Doanh số sau CK": item.salesAfterDiscount,
  //       };

  //       return totalRow;
  //     }
  //   );

  //   // Thêm dòng tổng cộng vào cuối bảng
  //   const grandTotal = formattedDataForExcel.reduce(
  //     (acc, item) => {
  //       acc["Doanh số trước CK"] += item["Doanh số trước CK"];
  //       acc["Doanh số sau CK"] += item["Doanh số sau CK"];
  //       return acc;
  //     },
  //     { "Doanh số trước CK": 0, "Doanh số sau CK": 0 }
  //   );

  //   const grandTotalRow = {
  //     STT: "Tổng cộng (150)", // Dòng tổng cộng
  //     NVBH: "",
  //     "Tên NVBH": "",
  //     "Ngày bán": "",
  //     "Chiết khấu": "",
  //     "Doanh số trước CK": grandTotal["Doanh số trước CK"].toFixed(0), // Đảm bảo hiển thị đúng
  //     "Doanh số sau CK": grandTotal["Doanh số sau CK"].toFixed(0),
  //   };

  //   formattedDataForExcel.push(grandTotalRow);

  //   // Chuyển dữ liệu thành định dạng Excel
  //   const ws = XLSX.utils.json_to_sheet(formattedDataForExcel, {
  //     header: [
  //       "STT",
  //       "NVBH",
  //       "Tên NVBH",
  //       "Ngày bán",
  //       "Chiết khấu",
  //       "Doanh số trước CK",
  //       "Doanh số sau CK",
  //     ],
  //     origin: "A2", // Dữ liệu bắt đầu từ dòng 2
  //   });

  //   // Thêm tiêu đề vào dòng đầu tiên
  //   XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN"]], {
  //     origin: "A1", // Tiêu đề ở dòng 1
  //   });

  //   // Điều chỉnh phạm vi ô tính để bao gồm tiêu đề
  //   const range = XLSX.utils.decode_range(ws["!ref"]);
  //   range.e.r += 1; // Tăng phạm vi để bao gồm dòng tiêu đề
  //   ws["!ref"] = XLSX.utils.encode_range(range);

  //   // Tạo workbook và thêm sheet
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Doanh số nhân viên");

  //   // Xuất file Excel
  //   XLSX.writeFile(wb, "doanh_so_nhan_vien.xlsx");
  // };

  const exportToExcel = () => {
    // Group data by employee (NVBH)
    const groupedData = reportData.reduce((acc, item) => {
      const key = item.employeeCode; // Group by employee code
      if (!acc[key]) {
        acc[key] = {
          employeeCode: item.employeeCode,
          employeeName: item.employeeName,
          totalSalesBeforeDiscount: 0,
          totalSalesAfterDiscount: 0,
          rows: [],
        };
      }

      // Make sure to convert sales to number before adding
      const salesBeforeDiscount = parseFloat(item.salesBeforeDiscount);
      const salesAfterDiscount = parseFloat(item.salesAfterDiscount);

      // Add the row for the employee
      acc[key].rows.push({
        STT: item.id,
        NVBH: item.employeeCode,
        "Tên NVBH": item.employeeName,
        "Ngày bán": item.saleDate,
        "Chiết khấu": item.discount,
        "Doanh số trước CK": salesBeforeDiscount,
        "Doanh số sau CK": salesAfterDiscount,
      });

      // Accumulate total sales before and after discount
      acc[key].totalSalesBeforeDiscount += salesBeforeDiscount;
      acc[key].totalSalesAfterDiscount += salesAfterDiscount;

      return acc;
    }, {});

    // Flatten the data and add the total row for each employee
    const formattedDataForExcel = [];
    let grandTotalSalesBeforeDiscount = 0;
    let grandTotalSalesAfterDiscount = 0;

    Object.values(groupedData).forEach((employeeData) => {
      // Add the employee rows
      formattedDataForExcel.push(...employeeData.rows);

      // Add the total row for the employee
      formattedDataForExcel.push({
        STT: "",
        NVBH: "",
        "Tên NVBH": "Tổng cộng",
        "Ngày bán": "",
        "Chiết khấu": "",
        "Doanh số trước CK": employeeData.totalSalesBeforeDiscount,
        "Doanh số sau CK": employeeData.totalSalesAfterDiscount,
      });

      // Update grand totals
      grandTotalSalesBeforeDiscount += employeeData.totalSalesBeforeDiscount;
      grandTotalSalesAfterDiscount += employeeData.totalSalesAfterDiscount;
    });

    // // Add the grand total row
    // formattedDataForExcel.push({
    //   STT: "",
    //   NVBH: "",
    //   "Tên NVBH": "",
    //   "Ngày bán": "",
    //   "Chiết khấu": "",
    //   "Doanh số trước CK": grandTotalSalesBeforeDiscount,
    //   "Doanh số sau CK": grandTotalSalesAfterDiscount,
    // });

    // Convert data to Excel sheet
    const ws = XLSX.utils.json_to_sheet(formattedDataForExcel, {
      header: [
        "STT",
        "NVBH",
        "Tên NVBH",
        "Ngày bán",
        "Chiết khấu",
        "Doanh số trước CK",
        "Doanh số sau CK",
      ],
      origin: "A3", // Dữ liệu bắt đầu từ dòng 2
    });
    // Add report generation date at row 1
    const currentDateTime = new Date().toLocaleString("vi-VN");
    XLSX.utils.sheet_add_aoa(ws, [[`Ngày xuất báo cáo: ${currentDateTime}`]], {
      origin: "A1", // Đặt thời gian xuất báo cáo tại dòng 1
    });

    // Add title "DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN" at row 1
    XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ BÁN HÀNG THEO NHÂN VIÊN"]], {
      origin: "D2", // Đặt tiêu đề tại dòng 1, cột A
    });

    // Adjust the range to include the title row
    const range = XLSX.utils.decode_range(ws["!ref"]);
    range.e.r += 1; // Increase the range to include the title
    ws["!ref"] = XLSX.utils.encode_range(range);
    ws["!cols"] = Object.keys(ws).map(() => ({
      wch: 20, // Chiều rộng mặc định là 20 ký tự, bạn có thể điều chỉnh giá trị này
    }));
    // Create the workbook and add the sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh số nhân viên");

    // Export the Excel file
    XLSX.writeFile(wb, "doanh_so_nhan_vien.xlsx");
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã NV",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Tên NV",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Ngày bán",
      dataIndex: "saleDate",
      key: "saleDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    // {
    //   title: "Số điện thoại",
    //   dataIndex: "phoneNumber",
    //   key: "phoneNumber",
    // },
    // {
    //   title: "Loại nhân viên",
    //   dataIndex: "type",
    //   key: "type",
    // },
    {
      title: "Chiết khấu",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Doanh số trước CK",
      dataIndex: "salesBeforeDiscount",
      key: "salesBeforeDiscount",
      render: (text) => `${Number(text).toLocaleString()} VND`,
    },
    {
      title: "Doanh số sau CK",
      dataIndex: "salesAfterDiscount",
      key: "salesAfterDiscount",
      render: (text) => `${Number(text).toLocaleString()} VND`,
    },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="admin-content">
        <h1>Báo Cáo Doanh Thu Theo Nhân Viên</h1>

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

export default EmployeeReports;
