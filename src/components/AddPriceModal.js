// import React, { useState, useEffect } from "react";
// import { Modal, Form, Input, Button, DatePicker, message, Select } from "antd";
// import moment from "moment";

// const AddPriceModal = ({
//   isOpen,
//   onClose,
//   onAdd,
//   onEdit,
//   priceData,
//   setPriceData,
//   promotions,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     form.setFieldsValue({
//       price: priceData.price,
//       startDate: priceData.startDate ? moment(priceData.startDate) : null,
//       endDate: priceData.endDate ? moment(priceData.endDate) : null,
//       status: priceData.status,
//       promotionId: priceData.promotion,
//     });
//   }, [priceData, form]);

//   const resetForm = () => {
//     setPriceData({
//       price: 0,
//       startDate: null,
//       endDate: null,
//       status: "ACTIVE",
//       promotion: null,
//     });
//     // form.resetFields();
//     onClose();
//   };

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       const payload = {
//         ...values,
//         promotion: values.promotionId
//           ? { connect: [values.promotionId] }
//           : null,
//       };
//       if (priceData.id) {
//         await onEdit(payload);
//       } else {
//         await onAdd(payload);
//       }
//       resetForm();
//     } catch (error) {
//       message.error("Có lỗi xảy ra, vui lòng thử lại.");
//       console.error("Error:", error); // Log chi tiết lỗi
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title={priceData.id ? "Chỉnh Sửa Giá" : "Thêm Giá"}
//       open={isOpen}
//       onCancel={resetForm}
//       footer={null}
//     >
//       <Form form={form} onFinish={handleSubmit} layout="vertical">
//         <Form.Item
//           label="Giá"
//           name="price"
//           rules={[{ required: true, message: "Vui lòng nhập giá" }]}
//         >
//           <Input
//             type="number"
//             onChange={(e) =>
//               setPriceData({ ...priceData, price: e.target.value })
//             }
//           />
//         </Form.Item>
//         <Form.Item
//           label="Khuyến mãi"
//           name="promotionId"
//           rules={[{ required: false, message: "Vui lòng chọn khuyến mãi" }]}
//         >
//           <Select placeholder="Chọn khuyến mãi">
//             {promotions.map((promo) => (
//               <Select.Option key={promo.id} value={promo.id}>
//                 {promo.attributes.promotionName}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           label="Ngày bắt đầu"
//           name="startDate"
//           rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
//         >
//           <DatePicker showTime format="DD/MM/YYYY HH:mm" />
//         </Form.Item>
//         <Form.Item
//           label="Ngày kết thúc"
//           name="endDate"
//           rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
//         >
//           <DatePicker showTime format="DD/MM/YYYY HH:mm" />
//         </Form.Item>
//         <Form.Item
//           label="Trạng thái"
//           name="status"
//           rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
//         >
//           <Select>
//             <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//             <Select.Option value="Không hoạt động">
//               Không hoạt động
//             </Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             {priceData.id ? "Cập Nhật" : "Thêm"}
//           </Button>
//           <Button style={{ marginLeft: "8px" }} onClick={resetForm}>
//             Đóng
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default AddPriceModal;
