// // src/components/PriceFormModal.js
// import React, { useEffect, useState } from "react";
// import { Modal, Form, Input, DatePicker, Select, message } from "antd";
// import moment from "moment";

// const { RangePicker } = DatePicker;

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
//   useEffect(() => {
//     if (initialValues) {
//       form.setFieldsValue({
//         MaGia: initialValues.attributes.MaGia,
//         Mota: initialValues.attributes.Mota,
//         status: initialValues.attributes.status,
//         startDate: moment(initialValues.attributes.startDate),
//         endDate: moment(initialValues.attributes.endDate),
//       });
//     } else {
//       form.resetFields();
//       form.setFieldsValue({ status: "Không hoạt động" });
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
//       });
//     } catch (error) {
//       console.error("Validation failed:", error);
//     }
//   };

//   return (
//     <Modal
//       title={initialValues ? "Cập nhật Bảng Giá" : "Thêm Bảng Giá Mới"}
//       visible={visible}
//       onCancel={onCancel}
//       onOk={handleOk}
//       centered={true}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           label="Mã Giá"
//           name="MaGia"
//           rules={[
//             { required: true, message: "Vui lòng nhập mã giá!" },
//             {
//               pattern: /^MG\d{3}$/,
//               message: "Mã giá phải có định dạng MG + 3 số!",
//             },
//           ]}
//         >
//           <Input placeholder="Ví dụ: MG001" />
//         </Form.Item>

//         <Form.Item
//           label="Ngày Bắt Đầu"
//           name="startDate"
//           rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
//         >
//           <DatePicker
//             format="DD-MM-YYYY"
//             style={{ width: "100%" }}
//             onChange={handleDateChange}
//             disabledDate={(current) =>
//               current && current < moment().startOf("day")
//             }
//           />
//         </Form.Item>

//         <Form.Item
//           label="Ngày Kết Thúc"
//           name="endDate"
//           rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
//         >
//           <DatePicker
//             format="DD-MM-YYYY"
//             style={{ width: "100%" }}
//             onChange={handleDateChange}
//             disabledDate={(current) =>
//               current && current < moment().startOf("day")
//             }
//           />
//         </Form.Item>

//         <Form.Item
//           label="Mô tả"
//           name="Mota"
//           rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
//         >
//           <Input.TextArea rows={4} placeholder="Nhập mô tả bảng giá" />
//         </Form.Item>

//         <Form.Item
//           label="Trạng thái"
//           name="status"
//           rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
//         >
//           <Select
//             placeholder="Chọn trạng thái"
//             disabled={!canActivate && !initialValues}
//           >
//             <Select.Option value="Hoạt động">Hoạt động</Select.Option>
//             <Select.Option value="Không hoạt động">
//               Không hoạt động
//             </Select.Option>
//           </Select>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default PriceFormModal;

// src/components/PriceFormModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  InputNumber,
  message,
} from "antd";
import moment from "moment";
import { fetchAllTrips } from "../api/TripApi"; // Import API để lấy danh sách tuyến

const PriceFormModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  existingPrices,
}) => {
  const [form] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [canActivate, setCanActivate] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [priceDetails, setPriceDetails] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh sách tuyến khi component mount
  useEffect(() => {
    const loadTrips = async () => {
      try {
        const response = await fetchAllTrips();
        setTrips(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách tuyến");
      }
    };
    loadTrips();
  }, []);

  // Set giá trị ban đầu khi có initialValues
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        MaGia: initialValues.attributes.MaGia,
        Mota: initialValues.attributes.Mota,
        status: initialValues.attributes.status,
        startDate: moment(initialValues.attributes.startDate),
        endDate: moment(initialValues.attributes.endDate),
      });
      // Nếu có chi tiết giá, set vào state
      if (initialValues.attributes.priceDetails?.data) {
        setPriceDetails(initialValues.attributes.priceDetails.data);
      }
    } else {
      form.resetFields();
      setPriceDetails([]);
    }
  }, [initialValues, form]);

  // Kiểm tra ngày hợp lệ
  const handleDateChange = () => {
    const startDate = form.getFieldValue("startDate");
    const endDate = form.getFieldValue("endDate");

    if (startDate && endDate) {
      if (endDate.isBefore(startDate)) {
        message.error("Ngày kết thúc phải sau ngày bắt đầu");
        return;
      }

      const canActivate = !existingPrices.some(
        (price) =>
          price.attributes.status === "Hoạt động" &&
          moment(price.attributes.endDate).isAfter(startDate)
      );
      setCanActivate(canActivate);

      if (!canActivate) {
        form.setFieldsValue({ status: "Không hoạt động" });
        message.warning(
          "Không thể kích hoạt bảng giá này vì đã có bảng giá hoạt động trong khoảng thời gian này."
        );
      }
    }
  };

  // Modal chi tiết giá
  const DetailPriceModal = () => (
    <Modal
      title="Thêm Chi Tiết Giá"
      visible={isDetailModalVisible}
      onCancel={() => {
        setIsDetailModalVisible(false);
        detailForm.resetFields();
      }}
      onOk={() => {
        detailForm.validateFields().then((values) => {
          // Kiểm tra xem tuyến đã được thêm chưa
          const existingTrip = priceDetails.find(
            (detail) => detail.trip.data.id === values.trip
          );

          if (existingTrip) {
            message.error("Tuyến này đã được thêm giá!");
            return;
          }

          // Tìm thông tin tuyến được chọn
          const selectedTrip = trips.find((trip) => trip.id === values.trip);

          const newDetail = {
            MaChiTietGia: `MCTG${String(priceDetails.length + 1).padStart(
              3,
              "0"
            )}`,
            Gia: values.Gia,
            trip: {
              data: selectedTrip,
            },
          };

          setPriceDetails([...priceDetails, newDetail]);
          setIsDetailModalVisible(false);
          detailForm.resetFields();
        });
      }}
    >
      <Form form={detailForm} layout="vertical">
        <Form.Item
          label="Mã Tuyến"
          name="trip"
          rules={[{ required: true, message: "Vui lòng chọn mã tuyến!" }]}
        >
          <Select>
            {trips.map((trip) => (
              <Select.Option
                key={trip.id}
                value={trip.id}
                disabled={trip.attributes.status !== "Hoạt động"}
              >
                {trip.attributes.MaTuyen} 
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá"
          name="Gia"
          rules={[
            { required: true, message: "Vui lòng nhập giá!" },
            { type: "number", min: 0, message: "Giá không được âm!" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  // Cột cho bảng chi tiết giá
  const detailColumns = [
    {
      title: "Mã Chi Tiết Giá",
      dataIndex: "MaChiTietGia",
      key: "MaChiTietGia",
    },
    {
      title: "Mã Tuyến",
      dataIndex: ["trip", "data", "attributes", "MaTuyen"],
      key: "MaTuyen",
    },
    {
      title: "Tuyến",
      key: "tuyen",
      render: (_, record) =>
        `${record.trip.data.attributes.MaTuyen}`,
    },
    {
      title: "Giá",
      dataIndex: "Gia",
      key: "Gia",
      render: (text) => `${parseInt(text).toLocaleString()} VNĐ`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => {
            setPriceDetails(
              priceDetails.filter(
                (item) => item.MaChiTietGia !== record.MaChiTietGia
              )
            );
          }}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={initialValues ? "Cập nhật Bảng Giá" : "Thêm Bảng Giá Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          if (priceDetails.length === 0) {
            // Kiểm tra có chi tiết giá nào được thêm không
            message.error("Vui lòng thêm ít nhất một chi tiết giá!");
            return;
          }

          const newPrice = {
            ...values,
            priceDetails: priceDetails,
          };

          onOk(newPrice);
        });
      }}
      width={800}
      centered={true}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Giá"
          name="MaGia"
          rules={[{ required: true, message: "Vui lòng nhập mã giá!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="Mota"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            onChange={handleDateChange}
          />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="endDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
            onChange={handleDateChange}
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Select.Option value="Hoạt động">Hoạt động</Select.Option>
            <Select.Option value="Không hoạt động">
              Không hoạt động
            </Select.Option>
          </Select>
        </Form.Item>

        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => setIsDetailModalVisible(true)}
            style={{ marginBottom: 16 }}
          >
            Thêm Chi Tiết Giá
          </Button>

          <Table
            columns={detailColumns}
            dataSource={priceDetails}
            pagination={false}
            rowKey="MaChiTietGia"
          />
        </div>

        <DetailPriceModal />
      </Form>
    </Modal>
  );
};

export default PriceFormModal;
