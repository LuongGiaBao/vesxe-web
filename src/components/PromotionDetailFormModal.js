import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { fetchAllTrips } from "../api/TripApi";

const { Option } = Select;

const PromotionDetailFormModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  promotionId,
}) => {
  const [form] = Form.useForm();
  const [promotionType, setPromotionType] = useState(null);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        MaChiTietKhuyenMai: initialValues.MaChiTietKhuyenMai,
        LoaiKhuyenMai: initialValues.LoaiKhuyenMai,
        description: initialValues.description,
        TongTienHoaDon: initialValues.TongTienHoaDon,
        SoTienTang: initialValues.SoTienTang,
        PhanTramChietKhau: initialValues.PhanTramChietKhau,
        SoTienKhuyenMaiToiDa: initialValues.SoTienKhuyenMaiToiDa,
      });
      setPromotionType(initialValues.LoaiKhuyenMai);
    } else {
      form.setFieldsValue({ MaChiTietKhuyenMai: "MCTKM" });
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (!values.MaChiTietKhuyenMai.startsWith("MCTKM")) {
          values.MaChiTietKhuyenMai = "MCTKM" + values.MaChiTietKhuyenMai;
        }
        onOk({ ...values, promotionId });
        form.resetFields();
        setPromotionType(null);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePromotionTypeChange = (value) => {
    setPromotionType(value);
    form.setFieldsValue({
      TongTienHoaDon: null,
      SoTienTang: null,
      PhanTramChietKhau: null,
      SoTienKhuyenMaiToiDa: null,
    });
  };

  const handleMaKhuyenMaiChange = (e) => {
    let value = e.target.value;

    // Nếu mã khuyến mãi không bắt đầu bằng "MCTKM", thêm "MCTKM" vào đầu
    if (!value.startsWith("MCTKM")) {
      value = "MCTKM" + value;
    }

    // Cập nhật giá trị trong form
    form.setFieldsValue({ MaChiTietKhuyenMai: value });
  };
  return (
    <Modal
      visible={visible}
      title={
        initialValues
          ? "Cập nhật Chi Tiết Khuyến Mãi"
          : "Thêm Chi Tiết Khuyến Mãi"
      }
      okText={initialValues ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      onCancel={() => {
        onCancel();
        setPromotionType(null);
        form.resetFields();
      }}
      onOk={handleOk}
      centered
    >
      <Form form={form} layout="vertical" name="promotion_detail_form">
        <Form.Item
          name="MaChiTietKhuyenMai"
          label="Mã Chi Tiết"
          initialValue="MCTKM"
          rules={[
            { required: true, message: "Vui lòng nhập mã chi tiết!" },
            {
              min: 4,
              message: "Vui lòng nhập số sau MCTKM",
            },
          ]}
        >
          <Input
            placeholder="Ví dụ: MCTKM001"
            onChange={handleMaKhuyenMaiChange}
            value={form.getFieldValue("MaChiTietKhuyenMai")}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô Tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="LoaiKhuyenMai"
          label="Loại Khuyến Mãi"
          rules={[
            { required: true, message: "Vui lòng chọn loại khuyến mãi!" },
          ]}
        >
          <Select onChange={handlePromotionTypeChange}>
            <Option value="Tặng tiền">Tặng tiền</Option>
            <Option value="Chiết khấu hóa đơn">Chiết khấu hóa đơn</Option>
          </Select>
        </Form.Item>
        {promotionType && (
          <Form.Item
            name="TongTienHoaDon"
            label="Tổng Tiền Hóa Đơn"
            rules={[
              { required: true, message: "Vui lòng nhập tổng tiền hóa đơn!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}

        {promotionType === "Tặng tiền" && (
          <Form.Item
            name="SoTienTang"
            label="Số Tiền Tặng"
            rules={[{ required: true, message: "Vui lòng nhập số tiền tặng!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        )}

        {promotionType === "Chiết khấu hóa đơn" && (
          <>
            <Form.Item
              name="PhanTramChietKhau"
              label="% Chiết Khấu"
              rules={[
                { required: true, message: "Vui lòng nhập % chiết khấu!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace("%", "")}
              />
            </Form.Item>

            <Form.Item
              name="SoTienKhuyenMaiToiDa"
              label="Số Tiền Khuyến Mãi Tối Đa"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền khuyến mãi tối đa!",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default PromotionDetailFormModal;
