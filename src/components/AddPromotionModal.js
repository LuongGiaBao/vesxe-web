import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import moment from "moment";

const { Option } = Select;

const PromotionFormModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  existingPromotions,
}) => {
  const [form] = Form.useForm();
  const [canActivate, setCanActivate] = useState(true);
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        IDPromotion: initialValues.attributes.IDPromotion,
        description: initialValues.attributes.description,
        startDate: moment(initialValues.attributes.startDate),
        endDate: moment(initialValues.attributes.endDate),
        status: initialValues.attributes.status,
      });
    } else {
      form.setFieldsValue({
        IDPromotion: "MKM", // Đặt giá trị mặc định cho Mã Khuyến Mãi
        status: "Ngưng hoạt động",
        startDate: moment(),
        endDate: moment().add(1, "month"),
      });
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Nếu là thêm mới (không có initialValues), set status mặc định
        if (!initialValues) {
          values.status = "Ngưng hoạt động";
        }

        // // Bỏ kiểm tra ngày
        // if (values.status === "Hoạt động") {
        //   message.error(
        //     "Không thể kích hoạt khuyến mãi này do trùng thời gian với khuyến mãi khác đang hoạt động."
        //   );
        //   return;
        // }

        onOk(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleMaKhuyenMaiChange = (e) => {
    let value = e.target.value;

    // Nếu mã khuyến mãi bắt đầu bằng "MKKMKK", chỉ giữ lại một "MKK"
    if (value.startsWith("MKMMKM")) {
      value = "MKM" + value.substring(6);
    }
    // Nếu mã khuyến mãi không bắt đầu bằng "MKK", thêm "MKK" vào đầu
    else if (!value.startsWith("MKM")) {
      value = "MKM" + value;
    }

    // Cập nhật giá trị trong form
    form.setFieldsValue({ IDPromotion: value });
  };

  // const handleDateChange = () => {
  //   const startDate = form.getFieldValue("startDate");
  //   const endDate = form.getFieldValue("endDate");

  //   if (startDate && endDate) {
  //     const isOverlapping = !existingPromotions.some(
  //       (promo) =>
  //         promo.attributes.status === "Hoạt động" &&
  //         moment(promo.attributes.startDate).isSameOrBefore(endDate) &&
  //         moment(promo.attributes.endDate).isSameOrAfter(startDate) &&
  //         (!initialValues || promo.id !== initialValues.id)
  //     );

  //     setCanActivate(!isOverlapping);

  //     if (isOverlapping) {
  //       form.setFieldsValue({ status: "Ngưng hoạt động" });
  //       message.warning(
  //         "Không thể kích hoạt khuyến mãi này vì đã có khuyến mãi hoạt động trong khoảng thời gian này."
  //       );
  //     } else {
  //       // Nếu không có trùng lặp, có thể đặt trạng thái thành "Hoạt động"
  //       form.setFieldsValue({ status: "Hoạt động" });
  //     }
  //   }
  // };

  return (
    <Modal
      title={initialValues ? "Cập nhật Khuyến Mãi" : "Thêm Khuyến Mãi Mới"}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="IDPromotion"
          label="Mã Khuyến Mãi"
          initialValue="MKM"
          rules={[
            { required: true, message: "Vui lòng nhập mã khuyến mãi!" },
            {
              min: 4,
              message: "Vui lòng nhập số sau MKK",
            },
          ]}
        >
          <Input
            placeholder="Ví dụ: MKK001"
            onChange={handleMaKhuyenMaiChange}
            value={form.getFieldValue("IDPromotion")}
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
          name="startDate"
          label="Ngày Bắt Đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            // onChange={handleDateChange}
          />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Ngày Kết Thúc"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
        >
          <DatePicker
            format="DD-MM-YYYY"
            style={{ width: "100%" }}
            // onChange={handleDateChange}
          />
        </Form.Item>
        {initialValues && (
          <Form.Item
            name="status"
            label="Trạng Thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Ngưng hoạt động">Ngưng hoạt động</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default PromotionFormModal;
