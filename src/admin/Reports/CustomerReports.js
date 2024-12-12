import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";
import { fetchAllCustomReport } from "../../api/CustomerReport";
import moment from "moment";
import { Table, Tag, Button, Space, DatePicker } from "antd";

const { RangePicker } = DatePicker;
const CustomerSalesReport = () => {
  const [reportData, setReportData] = useState([]);
  console.log("reportData", reportData);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchReportData = async () => {
  //     try {
  //       const response = await fetchAllCustomReport();

  //       const formattedData = response.data.map((item) => {
  //         const customer = item.attributes.customers?.data[0]?.attributes || {};
  //         console.log("cusstomer", customer);

  //         const promotion =
  //           item.attributes.detail_promotion?.data?.attributes || {};

  //         // Lấy các giá trị liên quan đến chiết khấu
  //         const salesBeforeDiscount = Number(
  //           item.attributes.DoanhSoTruocChietKhau || 0
  //         );
  //         const discountPercent = promotion.PhanTramChietKhau || 0;
  //         const maxDiscount = promotion.SoTienKhuyenMaiToiDa || 0;

  //         // Tính toán số tiền chiết khấu
  //         const discountAmount = Math.min(
  //           (salesBeforeDiscount * discountPercent) / 100,
  //           maxDiscount || Infinity
  //         );

  //         // Tính doanh số sau chiết khấu
  //         const salesAfterDiscount = salesBeforeDiscount - discountAmount;

  //         return {
  //           id: item.id,
  //           customerCode: customer.MaKH || "Không có",
  //           customerName: customer.TenKH || "Không có",
  //           address: customer.DiaChi || "Không có",
  //           customerGroup: customer.type || "Không có",
  //           productGroup: promotion.description || "Không có",
  //           industry: promotion.MaChiTietKhuyenMai || "Không có",
  //           salesBeforeDiscount: salesBeforeDiscount,
  //           discount: discountPercent,
  //           salesAfterDiscount: salesAfterDiscount,
  //           createdAt: item.attributes.createdAt,
  //         };
  //       });

  //       const filteredData = formattedData.filter((item) => {
  //         const saleDate = new Date(item.createdAt);
  //         const start = new Date(startDate);
  //         const end = new Date(endDate);
  //         return saleDate >= start && saleDate <= end;
  //       });

  //       setReportData(formattedData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Lỗi khi tải dữ liệu", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchReportData();
  // }, [startDate, endDate]);

  // Xuất báo cáo ra Excel
  // const exportToExcel = () => {
  //   // Tính tổng doanh số sau CK
  //   const totalSalesAfterDiscount = reportData.reduce(
  //     (sum, item) => sum + Number(item.salesAfterDiscount || 0),
  //     0
  //   );
  //   // Định dạng dữ liệu xuất ra với các cột tương ứng
  //   const formattedDataForExcel = reportData.map((item) => ({
  //     "Mã KH": item.customerCode,
  //     "Tên KH": item.customerName,
  //     "Địa chỉ": item.address,
  //     "Nhóm KH": item.customerGroup,
  //     "Ngành Hàng": item.industry,
  //     "Doanh số trước CK": item.salesBeforeDiscount,
  //     "Chiết khấu": item.discount,
  //     "Doanh số sau CK": item.salesAfterDiscount,
  //     // "Ngày tạo": moment(item.createdAt).format("DD/MM/YYYY"),
  //   }));

  //   // Chuyển đổi dữ liệu thành sheet
  //   const ws = XLSX.utils.json_to_sheet(formattedDataForExcel, {
  //     header: [
  //       "Mã KH",
  //       "Tên KH",
  //       "Địa chỉ",
  //       "Nhóm KH",
  //       "Ngành Hàng",
  //       "Doanh số trước CK",
  //       "Chiết khấu",
  //       "Doanh số sau CK",
  //       // "Ngày tạo",
  //     ],
  //     origin: "A2",
  //   });

  //   // Thêm tiêu đề "DOANH SỐ THEO KHÁCH HÀNG" vào dòng đầu tiên
  //   XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ THEO KHÁCH HÀNG"]], {
  //     origin: "E1",
  //   });

  //   // Tăng phạm vi để dữ liệu nằm dưới tiêu đề
  //   const range = XLSX.utils.decode_range(ws["!ref"]);
  //   range.e.r += 1; // Tăng số dòng để bao gồm tiêu đề
  //   ws["!ref"] = XLSX.utils.encode_range(range);

  //   // Căn giữa toàn bộ nội dung, bao gồm cả tiêu đề
  //   for (let row = range.s.r; row <= range.e.r; row++) {
  //     for (let col = range.s.c; col <= range.e.c; col++) {
  //       const cell_address = { r: row, c: col }; // Địa chỉ của ô
  //       const cell = ws[XLSX.utils.encode_cell(cell_address)];
  //       if (!cell) continue;
  //       cell.s = {
  //         alignment: {
  //           horizontal: "center",
  //           vertical: "center",
  //         },
  //       };
  //     }
  //   }

  //   // Tạo workbook và thêm sheet
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Doanh thu khách hàng");

  //   // Xuất file Excel
  //   XLSX.writeFile(wb, "doanh_thu_theo_khach_hang.xlsx");
  // };

  // useEffect(() => {
  //   const fetchReportData = async () => {
  //     try {
  //       const response = await fetchAllCustomReport();
  //       console.log("Dữ liệu từ API:", response.data);
  //       const formattedData = response.data.map((item) => {

  //         const customers = item.attributes.customers?.data || [];
  //         const customerList = customers.map((customer) => {
  //           return {
  //             id: customer.id,
  //             customerCode: customer.attributes.MaKH || "Không có",
  //             customerName: customer.attributes.TenKH || "Không có",
  //             address: customer.attributes.DiaChi || "-",
  //             customerGroup: customer.attributes.type || "Không có",
  //           };
  //         });

  //         const promotion =
  //           item.attributes.detail_promotion?.data?.attributes || {};

  //         // Lấy các giá trị liên quan đến chiết khấu
  //         const salesBeforeDiscount = Number(
  //           item.attributes.DoanhSoTruocChietKhau || 0
  //         );
  //         const discountPercent = promotion.PhanTramChietKhau || 0;
  //         const maxDiscount = promotion.SoTienKhuyenMaiToiDa || 0;

  //         // Tính toán số tiền chiết khấu
  //         const discountAmount = Math.min(
  //           (salesBeforeDiscount * discountPercent) / 100,
  //           maxDiscount || Infinity
  //         );

  //         // Tính doanh số sau chiết khấu
  //         const salesAfterDiscount = salesBeforeDiscount - discountAmount;

  //         return customerList.map((customer) => {
  //           return {
  //             ...customer,
  //             productGroup: promotion.description || "Không có",
  //             industry: promotion.MaChiTietKhuyenMai || "Không có",
  //             salesBeforeDiscount: salesBeforeDiscount,
  //             discount: discountPercent,
  //             salesAfterDiscount: salesAfterDiscount,
  //             createdAt: item.attributes.createdAt,
  //           };
  //         });
  //       });

  //       const flattenedData = formattedData.flat();

  //       // const filteredData = flattenedData.filter((item) => {
  //       //   const saleDate = moment(item.createdAt); // Lấy ngày từ trường createdAt
  //       //   // Kiểm tra xem saleDate có hợp lệ không
  //       //   if (!saleDate.isValid()) {
  //       //     console.error("Ngày không hợp lệ:", item.createdAt);
  //       //     return false; // Bỏ qua các bản ghi có ngày không hợp lệ
  //       //   }
  //       //   return saleDate.isBetween(startDate, endDate, null, "[]"); // Kiểm tra xem ngày có nằm trong khoảng không
  //       // });
  //       const sortedData = flattenedData.sort((a, b) => a.id - b.id);
  //       setReportData(sortedData);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Lỗi khi tải dữ liệu", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchReportData();
  // }, [startDate, endDate]);
  useEffect(() => {
    const fetchCustomerStatistics = async () => {
      try {
        const response = await fetchAllCustomReport();
        console.log("Dữ liệu từ API:", response.data);

        const formattedData = response.data.map((item) => {
          const customerAttributes = item.attributes || {};

          // Extract customer data
          const customer = {
            id: item.id,
            customerCode: customerAttributes.MaKH || "Không có",
            customerName: customerAttributes.TenKH || "Không có",
            address: customerAttributes.DiaChi || "-",
            phone: customerAttributes.DienThoai || "Không có",
            email: customerAttributes.Email || "-",
            customerGroup: customerAttributes.type || "Không có",
          };

          // Extract sales and promotion details
          const salesData =
            customerAttributes.customer_sale?.data?.attributes || {};
          const salesBeforeDiscount = Number(
            salesData.DoanhSoTruocChietKhau || 0
          );
          const salesAfterDiscount = Number(salesData.DoanhSoSauChietKhau || 0);

          // Extract promotion details
          const promotion =
            customerAttributes.detail_promotion?.data?.attributes || {};
          const discountPercent = promotion.PhanTramChietKhau || 0;
          const maxDiscount = promotion.SoTienKhuyenMaiToiDa || 0;
          const discountAmount = Math.min(
            (salesBeforeDiscount * discountPercent) / 100,
            maxDiscount || Infinity
          );

          // Final calculated data
          return {
            ...customer,
            productGroup: promotion.description || "Không có",
            industry: promotion.MaChiTietKhuyenMai || "Không có",
            salesBeforeDiscount,
            discount: discountPercent,
            discountAmount,
            salesAfterDiscount,
            createdAt: customerAttributes.createdAt,
          };
        });

        const sortedData = formattedData.sort((a, b) => a.id - b.id);
        setReportData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
        setLoading(false);
      }
    };

    fetchCustomerStatistics();
  }, [startDate, endDate]);

  const exportToExcel = () => {
    const filteredData = filterDataByDate();
    // Tính tổng doanh số sau CK
    const totalSalesAfterDiscount = reportData.reduce(
      (sum, item) => sum + Number(item.salesAfterDiscount || 0),
      0
    );

    // Định dạng dữ liệu xuất ra với các cột tương ứng
    const formattedDataForExcel = reportData.map((item) => ({
      "Mã KH": item.customerCode,
      "Tên KH": item.customerName,
      "Số điện thoại": item.phone,
      "Nhóm KH": item.customerGroup,
      //"Ngành Hàng": item.industry,
      "Doanh số trước CK": item.salesBeforeDiscount,
      "Chiết khấu": item.discount,
      "Doanh số sau CK": item.salesAfterDiscount,
    }));

    // Thêm dòng "Tổng cộng" vào đầu
    const totalRow = {
      "Mã KH": "",
      "Tên KH": "",
      "Số điện thoại": "",
      "Nhóm KH": "",
      // "Ngành Hàng": "",
      "Doanh số trước CK": "Tổng cộng",
      "Chiết khấu": "",
      "Doanh số sau CK": totalSalesAfterDiscount,
    };

    // Chèn dòng tổng cộng vào đầu danh sách
    const dataWithTotalRow = [totalRow, ...formattedDataForExcel];

    // Chuyển đổi dữ liệu thành sheet
    const ws = XLSX.utils.json_to_sheet(dataWithTotalRow, {
      header: [
        "Mã KH",
        "Tên KH",
        "Số điện thoại",
        "Nhóm KH",
        //"Ngành Hàng",
        "Doanh số trước CK",
        "Chiết khấu",
        "Doanh số sau CK",
      ],
      origin: "A3",
    });

    // Định dạng màu sắc cho dòng tiêu đề
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: "FF0000" },
        },
        font: {
          bold: true,
          color: { rgb: "000000" },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
    ws["!cols"] = Object.keys(ws).map(() => ({
      wch: 20, // Chiều rộng mặc định là 20 ký tự, bạn có thể điều chỉnh giá trị này
    }));
    // Thêm thời gian xuất báo cáo vào dòng A1
    const currentDate = new Date().toLocaleString("en-GB"); // Lấy thời gian hiện tại
    ws["A1"] = {
      v: `Thời gian xuất báo cáo: ${currentDate}`,
      s: {
        font: {
          bold: true,
        },
        alignment: {
          horizontal: "left",
          vertical: "center",
        },
      },
    };

    // Thêm tiêu đề "DOANH SỐ THEO KHÁCH HÀNG" vào dòng đầu tiên
    XLSX.utils.sheet_add_aoa(ws, [["DOANH SỐ THEO KHÁCH HÀNG"]], {
      origin: "E2",
    });
    XLSX.utils.sheet_add_aoa(ws, [["Tổng cộng", "", totalSalesAfterDiscount]], {
      origin: "E4",
    });
    // Tạo workbook và thêm sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Doanh thu khách hàng");

    // Xuất file Excel
    XLSX.writeFile(wb, "doanh_thu_theo_khach_hang.xlsx");
  };
  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0].startOf("day")); // Đặt ngày bắt đầu
      setEndDate(dates[1].endOf("day")); // Đặt ngày kết thúc
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };
  const filterDataByDate = () => {
    if (!startDate || !endDate) {
      return reportData; // Trả về toàn bộ dữ liệu nếu không có ngày
    }

    return reportData.filter((item) => {
      const saleDate = moment(item.createdAt);
      return saleDate.isBetween(startDate, endDate, null, "[]"); // Kiểm tra ngày
    });
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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
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
        <RangePicker
          format="DD/MM/YYYY"
          onChange={handleDateChange}
          defaultValue={[startDate, endDate]}
        />
        <Button onClick={exportToExcel} type="primary">
          Xuất Excel
        </Button>
        <Table
          columns={columns}
          dataSource={filterDataByDate()}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default CustomerSalesReport;
