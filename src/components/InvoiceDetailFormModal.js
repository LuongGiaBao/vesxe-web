import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import {
  createInvoiceDetail,
  updateInvoiceDetail,
} from "../api/InvoiceDetailApi";
const { Option } = Select;

const InvoiceDetailFormModal = ({
  visible,
  onCancel,
  onOk,
  invoiceDetail,
  trips, // Dữ liệu chuyến xe
  priceDetails, // Dữ liệu chi tiết giá
  invoices, // Dữ liệu hóa đơn
  setInvoiceDetails,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    if (invoiceDetail) {
      console.log("invoiceDetail", invoiceDetail);

      form.setFieldsValue({
        detailCode: invoiceDetail?.attributes?.MaChiTietHoaDon,
        invoiceCode: invoiceDetail?.attributes?.invoice?.data?.id,
        ticketCode: invoiceDetail?.attributes?.trip?.data?.id,
        priceDetailCode: invoiceDetail?.attributes?.detai_price?.data?.id,
        quantity: invoiceDetail?.attributes?.soluong, // Lấy số lượng từ attributes
        totalAmount: invoiceDetail?.attributes?.tongTien, // Lấy tổng tiền từ attributes
        // id: invoiceDetail.id, // Lấy ID từ invoiceDetail
      });
    } else {
      form.resetFields();
    }
  }, [invoiceDetail, form]);

  const handleOk = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      let response;
      if (invoiceDetail) {
        response = await updateInvoiceDetail(invoiceDetail.id, {
          detailCode: values.detailCode,
          invoiceCode: values.invoiceCode,
          ticketCode: values.ticketCode,
          priceDetailCode: values.priceDetailCode,
          quantity: values.quantity,
          totalAmount: values.totalAmount,
        });
        console.log("API RESPONSE (Update)", response.data);
      } else {
        response = await createInvoiceDetail({
          detailCode: values.detailCode,
          invoiceCode: values.invoiceCode,
          ticketCode: values.ticketCode,
          priceDetailCode: values.priceDetailCode,
          quantity: values.quantity,
          totalAmount: values.totalAmount,
        });
        console.log("API RESPONSE (Create)", response.data);
      }

      const newInvoiceDetail = response.data;
      setInvoiceDetails((prevDetails) => {
        if (invoiceDetail) {
          return prevDetails.map((detail) =>
            detail.id === newInvoiceDetail.id ? newInvoiceDetail : detail
          );
        } else {
          return [...prevDetails, newInvoiceDetail];
        }
      });

      onOk(newInvoiceDetail);
      form.resetFields();
    } catch (error) {
      console.error("Error handling invoice detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleOk = async () => {
  //   const values = await form.validateFields();
  //   onOk(values);
  // };

  return (
    <Modal
      visible={visible}
      title={invoiceDetail ? "Sửa Chi Tiết Hóa Đơn" : "Thêm Chi Tiết Hóa Đơn"}
      onCancel={onCancel}
      centered
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {invoiceDetail ? "Cập Nhật" : "Thêm"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={invoiceDetail}>
        <Form.Item
          name="detailCode"
          label="Mã Chi Tiết Hóa Đơn"
          rules={[
            { required: true, message: "Vui lòng nhập mã chi tiết hóa đơn!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="invoiceCode"
          label="Mã Hóa Đơn"
          rules={[{ required: true, message: "Vui lòng chọn mã hóa đơn!" }]}
        >
          <Select placeholder="Chọn hóa đơn">
            {invoices?.map((invoice) => (
              <Option key={invoice.id} value={invoice.id}>
                {invoice.attributes.MaHoaDon}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ticketCode"
          label="Mã Chuyến Xe"
          rules={[{ required: true, message: "Vui lòng chọn mã chuyến xe!" }]}
        >
          <Select placeholder="Chọn chuyến xe">
            {trips.data?.map((trip) => (
              <Option key={trip.id} value={trip.id}>
                {trip.attributes.MaTuyen}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="priceDetailCode"
          label="Mã Chi Tiết Giá"
          rules={[
            { required: true, message: "Vui lòng chọn mã chi tiết giá!" },
          ]}
        >
          <Select placeholder="Chọn chi tiết giá">
            {priceDetails.data?.map((priceDetail) => (
              <Option key={priceDetail.id} value={priceDetail.id}>
                {priceDetail?.attributes.MaChiTietGia}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số Lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="totalAmount"
          label="Tổng Tiền"
          rules={[{ required: true, message: "Vui lòng nhập tổng tiền!" }]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceDetailFormModal;

// import React, { useEffect } from "react";
// import { Modal, Form, Input, Button, Select } from "antd";
// import {
//   createInvoiceDetail,
//   updateInvoiceDetail,
// } from "../api/InvoiceDetailApi";
// const { Option } = Select;

// const InvoiceDetailFormModal = ({
//   visible,
//   onCancel,
//   onOk,
//   invoiceDetail,
//   trips,
//   priceDetails,
//   invoices,
//   setInvoiceDetails,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = React.useState(false);
//   console.log("invoiceDetail", invoiceDetail);

//   useEffect(() => {
//     if (invoiceDetail) {
//       form.setFieldsValue({
//         detailCode: invoiceDetail?.attributes?.MaChiTietHoaDon,
//         invoiceCode: invoiceDetail?.attributes?.invoice?.data?.id || null,
//         ticketCode: invoiceDetail?.attributes?.trip?.data?.id || null,
//         priceDetailCode:
//           invoiceDetail?.attributes?.detai_price?.data?.id || null,
//         quantity: invoiceDetail?.attributes?.soluong,
//         totalAmount: invoiceDetail?.attributes?.tongTien,
//       });
//     } else {
//       form.resetFields();
//     }
//   }, [invoiceDetail, form]);

//   const handleOk = async () => {
//     setLoading(true);
//     try {
//       const values = await form.validateFields();
//       let response;
//       if (invoiceDetail) {
//         // Gọi API cập nhật với dữ liệu đầy đủ
//         response = await updateInvoiceDetail(invoiceDetail.id, {
//           detailCode: values.detailCode,
//           invoiceCode: values.invoiceCode,
//           ticketCode: values.ticketCode,
//           priceDetailCode: values.priceDetailCode,
//           quantity: values.quantity, // Gửi số lượng
//           totalAmount: values.totalAmount, // Gửi tổng tiền
//         });
//       } else {
//         // Gọi API tạo với dữ liệu đầy đủ
//         response = await createInvoiceDetail({
//           detailCode: values.detailCode,
//           invoiceCode: values.invoiceCode,
//           ticketCode: values.ticketCode,
//           priceDetailCode: values.priceDetailCode,
//           quantity: values.quantity, // Gửi số lượng
//           totalAmount: values.totalAmount, // Gửi tổng tiền
//         });
//       }

//       const newInvoiceDetail = response.data;
//       setInvoiceDetails((prevDetails) => {
//         if (invoiceDetail) {
//           return prevDetails.map((detail) =>
//             detail.id === newInvoiceDetail.id ? newInvoiceDetail : detail
//           );
//         } else {
//           return [...prevDetails, newInvoiceDetail];
//         }
//       });

//       onOk(newInvoiceDetail);
//       form.resetFields();
//     } catch (error) {
//       console.error("Error handling invoice detail:", error);
//       // In thêm thông báo lỗi từ phản hồi
//       if (error.response) {
//         console.error("Response data:", error.response.data);
//         console.error("Response status:", error.response.status);
//         console.error("Response headers:", error.response.headers);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       title={invoiceDetail ? "Sửa Chi Tiết Hóa Đơn" : "Thêm Chi Tiết Hóa Đơn"}
//       onCancel={onCancel}
//       centered
//       footer={[
//         <Button key="back" onClick={onCancel}>
//           Hủy
//         </Button>,
//         <Button
//           key="submit"
//           type="primary"
//           onClick={handleOk}
//           loading={loading}
//         >
//           {invoiceDetail ? "Cập Nhật" : "Thêm"}
//         </Button>,
//       ]}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="detailCode"
//           label="Mã Chi Tiết Hóa Đơn"
//           rules={[
//             { required: true, message: "Vui lòng nhập mã chi tiết hóa đơn!" },
//           ]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           name="invoiceCode"
//           label="Mã Hóa Đơn"
//           rules={[{ required: true, message: "Vui lòng chọn mã hóa đơn!" }]}
//         >
//           <Select placeholder="Chọn hóa đơn">
//             {invoices?.map((invoice) => (
//               <Option key={invoice.id} value={invoice.id}>
//                 {invoice.attributes.MaHoaDon}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="ticketCode"
//           label="Mã Chuyến Xe"
//           rules={[{ required: true, message: "Vui lòng chọn mã chuyến xe!" }]}
//         >
//           <Select placeholder="Chọn chuyến xe">
//             {trips.data?.map((trip) => (
//               <Option key={trip.id} value={trip.id}>
//                 {trip.attributes.MaTuyen}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="priceDetailCode"
//           label="Mã Chi Tiết Giá"
//           rules={[
//             { required: true, message: "Vui lòng chọn mã chi tiết giá!" },
//           ]}
//         >
//           <Select placeholder="Chọn chi tiết giá">
//             {priceDetails.data?.map((priceDetail) => (
//               <Option key={priceDetail.id} value={priceDetail.id}>
//                 {priceDetail?.attributes.MaChiTietGia}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="quantity"
//           label="Số Lượng"
//           rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
//         >
//           <Input type="number" />
//         </Form.Item>

//         <Form.Item
//           name="totalAmount"
//           label="Tổng Tiền"
//           rules={[{ required: true, message: "Vui lòng nhập tổng tiền!" }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default InvoiceDetailFormModal;
