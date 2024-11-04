// src/components/PriceFormModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Button,
  Table,
  InputNumber,
  Space,
  Tag,
} from "antd";
import moment from "moment";
import { fetchAllTrips } from "../api/TripApi";
import {
  createPriceDetail,
  getPriceDetailsByPriceId,
} from "../api/PriceDetailApi";
const { RangePicker } = DatePicker;
const { Option } = Select;
// const PriceFormModal = ({
//   visible,
//   onCancel,
//   onOk,
//   initialValues,
//   existingPrices,
// }) => {
//   const [form] = Form.useForm();
//   const [canActivate, setCanActivate] = useState(false);
//   const [detailForm] = Form.useForm();
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [priceDetails, setPriceDetails] = useState([]);
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPriceForDetails, setSelectedPriceForDetails] = useState(null);
//   useEffect(() => {
//     loadTrips();
//   }, []);

//   useEffect(() => {
//     if (initialValues && initialValues.id) {
//       loadPriceDetails(initialValues.id);
//     }
//   }, [initialValues]);

//   useEffect(() => {
//     if (visible && initialValues?.id) {
//       reloadPriceDetails();
//     }
//   }, [visible, initialValues]);

//   const loadPriceDetails = async (priceId) => {
//     try {
//       const response = await getPriceDetailsByPriceId(priceId);
//       setPriceDetails(response.data);
//     } catch (error) {
//       console.error("Error loading price details:", error);
//       message.error("Không thể tải chi tiết giá");
//     }
//   };

//   const reloadPriceDetails = async () => {
//     if (initialValues && initialValues.id) {
//       try {
//         const response = await getPriceDetailsByPriceId(initialValues.id);
//         setPriceDetails(response.data);
//       } catch (error) {
//         console.error("Error reloading price details:", error);
//       }
//     }
//   };

//   const handleCreatePriceDetail = async () => {
//     try {
//       const values = await detailForm.validateFields();
//       const selectedTrip = trips.find((trip) => trip.id === values.trip);

//       // Kiểm tra và đảm bảo Gia là một số
//       const gia = values.Gia ? Number(values.Gia) : 0;
//       const newPriceDetail = {
//         data: {
//           MaChiTietGia: values.MaChiTietGia,
//           Gia: gia,
//           trip: values.trip,
//           price: initialValues ? initialValues.id : null,
//         },
//       };

//       const response = await createPriceDetail(newPriceDetail);

//       const newPriceDetailWithTrip = {
//         ...response.data,
//         attributes: {
//           ...response.data.attributes,
//           trip: {
//             data: selectedTrip,
//           },
//         },
//       };

//       setPriceDetails((prev) => [...prev, newPriceDetailWithTrip]);
//       setIsDetailModalVisible(false);
//       detailForm.resetFields();
//       message.success("Tạo chi tiết giá thành công");
//     } catch (error) {
//       console.error("Error creating price detail:", error);
//       message.error("Có lỗi xảy ra khi tạo chi tiết giá");
//     }
//   };

//   const loadTrips = async () => {
//     setLoading(true);
//     try {
//       const response = await fetchAllTrips();
//       // Lọc chỉ lấy các tuyến đang hoạt động
//       const activeTrips = response.data.filter(
//         (trip) => trip.attributes.status === "Hoạt động"
//       );
//       setTrips(activeTrips);
//       console.log("Trips loaded:", activeTrips); // Để debug
//     } catch (error) {
//       console.error("Error loading trips:", error);
//       message.error("Không thể tải danh sách tuyến");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (initialValues) {
//       form.setFieldsValue({
//         MaGia: initialValues.attributes.MaGia,
//         Mota: initialValues.attributes.Mota,
//         status: initialValues.attributes.status,
//         startDate: moment(initialValues.attributes.startDate),
//         endDate: moment(initialValues.attributes.endDate),
//       });
//       setPriceDetails(initialValues.attributes.detai_prices?.data || []);
//     } else {
//       form.resetFields();
//       form.setFieldsValue({ status: "Không hoạt động" });
//       setPriceDetails([]);
//     }
//   }, [initialValues, form]);

//   const handleDateChange = () => {
//     const startDate = form.getFieldValue("startDate");
//     const endDate = form.getFieldValue("endDate");

//     if (startDate && endDate) {
//       const canActivate = !existingPrices.some(
//         (price) =>
//           price.attributes.status === "Hoạt động" &&
//           moment(price.attributes.endDate).isAfter(startDate)
//       );
//       setCanActivate(canActivate);

//       if (!canActivate) {
//         form.setFieldsValue({ status: "Không hoạt động" });
//         message.warning(
//           "Không thể kích hoạt bảng giá này vì đã có bảng giá hoạt động trong khoảng thời gian này."
//         );
//       }
//     }
//   };

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const startDate = values.startDate;
//       const endDate = values.endDate;

//       onOk({
//         ...values,
//         startDate: startDate.startOf("day").toISOString(),
//         endDate: endDate.endOf("day").toISOString(),
//         priceDetails,
//       });
//     } catch (error) {
//       console.error("Validation failed:", error);
//     }
//   };

//   const handleAddPriceDetail = async () => {
//     // Tạo mới chi tiết giá
//     const newPriceDetail = {
//       MaChiTietGia: `MCTG${priceDetails.length + 1}`,
//       Gia: 0,
//       trip: {
//         data: {
//           id: 1,
//           attributes: {
//             MaTuyen: "MT001",
//           },
//         },
//       },
//     };
//     setPriceDetails([...priceDetails, newPriceDetail]);
//   };

//   const handleUpdatePriceDetail = async (index, values) => {
//     // Cập nhật chi tiết giá
//     const updatedPriceDetails = [...priceDetails];
//     updatedPriceDetails[index] = { ...updatedPriceDetails[index], ...values };
//     setPriceDetails(updatedPriceDetails);
//   };

//   const handleDeletePriceDetail = async (index) => {
//     // Xóa chi tiết giá
//     const updatedPriceDetails = [...priceDetails];
//     updatedPriceDetails.splice(index, 1);
//     setPriceDetails(updatedPriceDetails);
//   };

//   return (
//     <>
//       <Modal
//         title={initialValues ? "Cập nhật Bảng Giá" : "Thêm Bảng Giá Mới"}
//         visible={visible}
//         onCancel={onCancel}
//         onOk={handleOk}
//         centered={true}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Mã Giá"
//             name="MaGia"
//             rules={[
//               { required: true, message: "Vui lòng nhập mã giá!" },
//               {
//                 pattern: /^MG\d{3}$/,
//                 message: "Mã giá phải có định dạng MG + 3 số!",
//               },
//             ]}
//           >
//             <Input placeholder="Ví dụ: MG001" />
//           </Form.Item>

//           <Form.Item
//             label="Ngày Bắt Đầu"
//             name="startDate"
//             rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
//           >
//             <DatePicker
//               format="DD-MM-YYYY"
//               style={{ width: "100%" }}
//               onChange={handleDateChange}
//               disabledDate={(current) =>
//                 current && current < moment().startOf("day")
//               }
//             />
//           </Form.Item>

//           <Form.Item
//             label="Ngày Kết Thúc"
//             name="endDate"
//             rules={[
//               { required: true, message: "Vui lòng chọn ngày kết thúc!" },
//             ]}
//           >
//             <DatePicker
//               format="DD-MM-YYYY"
//               style={{ width: "100%" }}
//               onChange={handleDateChange}
//               disabledDate={(current) =>
//                 current && current < moment().startOf("day")
//               }
//             />
//           </Form.Item>

//           <Form.Item
//             label="Mô tả"
//             name="Mota"
//             rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//           >
//             <Input.TextArea rows={4} placeholder="Nhập mô tả bảng giá" />
//           </Form.Item>

//           <Form.Item
//             label="Trạng thái"
//             name="status"
//             rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
//           >
//             <Select
//               placeholder="Chọn trạng thái"
//               disabled={!canActivate && !initialValues}
//             >
//               <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//               <Select.Option value="Không hoạt động">
//                 Không hoạt động
//               </Select.Option>
//             </Select>
//           </Form.Item>

//           <Button type="primary" onClick={handleAddPriceDetail}>
//             Thêm Chi Tiết Giá
//           </Button>

//           <Table
//             columns={[
//               {
//                 title: "Mã Chi Tiết Giá",
//                 dataIndex: ["attributes", "MaChiTietGia"],
//               },
//               {
//                 title: "Tuyến",
//                 dataIndex: ["attributes", "trip"],
//                 render: (trip) => {
//                   if (!trip?.data?.attributes) return "Không có thông tin";
//                   const departure =
//                     trip.data.attributes.departure_location_id.data.attributes
//                       .name;
//                   const arrival =
//                     trip.data.attributes.arrival_location_id.data.attributes
//                       .name;
//                   return `${departure} → ${arrival}`;
//                 },
//               },
//               {
//                 title: "Giá",
//                 dataIndex: ["attributes", "Gia"],
//                 render: (text) => `${parseInt(text).toLocaleString()} VNĐ`,
//               },
//               {
//                 title: "Trạng Thái",
//                 dataIndex: ["attributes", "status"],
//                 render: (status) => (
//                   <Tag color={status === "Hoạt động" ? "green" : "red"}>
//                     {status}
//                   </Tag>
//                 ),
//               },
//               {
//                 title: "Hành động",
//                 key: "action",
//                 render: (_, record, index) => (
//                   <Space>
//                     <Button onClick={() => handleUpdatePriceDetail(index, { /* update values */ })}>
//                       Sửa
//                     </Button>
//                     <Button type="primary" danger onClick={() => handleDeletePriceDetail(index)}>
//                       Xóa
//                     </Button>
//                   </Space>
//                 ),
//               },
//             ]}
//             dataSource={priceDetails}
//             rowKey={(record) => record.id}
//           />
//         </Form>
//       </Modal>

//       <Modal
//         title="Tạo Chi Tiết Giá"
//         visible={isDetailModalVisible}
//         onOk={handleCreatePriceDetail}
//         onCancel={() => {
//           setIsDetailModalVisible(false);
//           detailForm.resetFields();
//         }}
//       >
//         <Form form={detailForm} layout="vertical">
//           <Form.Item
//             name="MaChiTietGia"
//             label="Mã Chi Tiết Giá"
//             rules={[
//               { required: true, message: "Vui lòng nhập mã chi tiết giá!" },
//               {
//                 pattern: /^MCTG\d{3}$/,
//                 message: "Mã chi tiết giá phải có định dạng MCTG + 3 số!",
//               },
//             ]}
//           >
//             <Input placeholder="Ví dụ: MCTG001" />
//           </Form.Item>

//           <Form.Item
//             name="trip"
//             label="Tuyến"
//             rules={[{ required: true, message: "Vui lòng chọn tuyến!" }]}
//           >
//             <Select placeholder="Chọn tuyến">
//               {trips.map((trip) => (
//                 <Option key={trip.id} value={trip.id}>
//                   {`${trip.attributes.departure_location_id.data.attributes.name} →
//             ${trip.attributes.arrival_location_id.data.attributes.name}`}
//                   <Tag
//                     color={
//                       trip.attributes.status === "Hoạt động" ? "green" : "red"
//                     }
//                     style={{ marginLeft: 8 }}
//                   >
//                     {trip.attributes.status}
//                   </Tag>
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="Gia"
//             label="Giá"
//             rules={[
//               { required: true, message: "Vui lòng nhập giá!" },
//               { type: "number", min: 0, message: "Giá phải là số dương!" },
//             ]}
//           >
//             <InputNumber
//               style={{ width: "100%" }}
//               formatter={(value) =>
//                 `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//               }
//               parser={(value) => value.replace(/\D/g, "")}
//               placeholder="Nhập giá"
//             />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// PriceFormModal.js
const PriceFormModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  existingPrices,
}) => {
  const [form] = Form.useForm();
  const [canActivate, setCanActivate] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        MaGia: initialValues.attributes.MaGia,
        Mota: initialValues.attributes.Mota,
        status: initialValues.attributes.status,
        startDate: moment(initialValues.attributes.startDate),
        endDate: moment(initialValues.attributes.endDate),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "Ngưng hoạt động" });
    }
  }, [initialValues, form]);

  const handleDateChange = () => {
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");

    if (startDate && endDate) {
      const canActivate = !existingPrices.some(
        (price) =>
          price.attributes.status === "Hoạt động" &&
          moment(price.attributes.endDate).isAfter(startDate)
      );
      setCanActivate(canActivate);

      if (!canActivate) {
        form.setFieldsValue({ status: "Ngưng hoạt động" });
        message.warning(
          "Không thể kích hoạt bảng giá này vì đã có bảng giá hoạt động trong khoảng thời gian này."
        );
      }
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const startDate = values.startDate;
      const endDate = values.endDate;

      onOk({
        ...values,
        startDate: startDate.startOf("day").toISOString(),
        endDate: endDate.endOf("day").toISOString(),
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleMaGiaChange = (e) => {
    let value = e.target.value;

    // Nếu mã giá bắt đầu bằng "MGMG", chỉ giữ lại một "MG"
    if (value.startsWith("MGMG")) {
      value = "MG" + value.substring(4);
    }
    // Nếu mã giá không bắt đầu bằng "MG", thêm "MG" vào đầu
    else if (!value.startsWith("MG")) {
      value = "MG" + value;
    }

    // Cập nhật giá trị trong form
    form.setFieldsValue({ MaGia: value });
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật Bảng Giá" : "Thêm Bảng Giá Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Giá"
          name="MaGia"
          initialValue="MG"
          rules={[
            { required: true, message: "Vui lòng nhập mã giá!" },

            {
              min: 3,
              message: "Vui lòng nhập số sau MG",
            },
          ]}
        >
          <Input
            placeholder="Ví dụ: MG001"
            onChange={handleMaGiaChange}
            value={form.getFieldValue("MaGia")}
          />
        </Form.Item>

        <Form.Item
          label="Ngày Bắt Đầu"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="Ngày Kết Thúc"
          name="endDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            onChange={handleDateChange}
            disabledDate={(current) =>
              current && current < moment().startOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="Mota"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả bảng giá" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select
            placeholder="Chọn trạng thái"
            disabled={!canActivate && !initialValues}
          >
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Ngưng hoạt động">
              Ngưng hoạt động
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PriceFormModal;
