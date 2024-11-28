import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { fetchAllCustomers } from "../api/CustomerApi";
import { fetchAllInvoices } from "../api/InvoicesApi";

const { Option } = Select;

const InvoiceFormModal = ({
  visible,
  onCancel,
  onCreate,
  onUpdate,
  customers,
  employees,
  schedules,
  invoiceId,
}) => {
  const [form] = Form.useForm();
  const [customerList, setCustomerList] = useState([]);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    loadCustomers();

    if (invoiceId) {
      loadInvoiceById();
    } else {
      form.resetFields(); // Reset form nếu không có invoiceId
    }
  }, [invoiceId]);

  const loadInvoiceById = async () => {
    try {
      const response = await fetchAllInvoices();
      const invoiceData = response.data?.find((inv) => inv.id === invoiceId);
      if (invoiceData) {
        setInvoice(invoiceData);
        form.setFieldsValue({
          MaHoaDon: invoiceData.attributes.MaHoaDon,
          customerId: invoiceData.attributes.customerId?.data?.id || null, // Lấy ID khách hàng
          employeeId: invoiceData.attributes.employeeId?.data?.id || null, // Lấy ID nhân viên
          scheduleId: invoiceData.attributes.scheduleId?.data?.id || null, // Lấy ID lịch
          PhuongThucThanhToan: invoiceData.attributes.PhuongThucThanhToan,
          status: invoiceData.attributes.status,
        });
      }
    } catch (error) {
      console.error("Lỗi tải hóa đơn:", error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetchAllCustomers();
      const customerData = response.data?.data || [];
      setCustomerList(customerData);
    } catch (error) {
      console.error("Lỗi tải danh sách khách hàng:", error);
    }
  };

  useEffect(() => {
    if (invoice) {
      form.setFieldsValue({
        MaHoaDon: invoice.attributes.MaHoaDon,
        customerId: invoice.attributes.customerId?.data?.id || null, // Lấy ID khách hàng
        employeeId: invoice.attributes.employeeId?.data?.id || null, // Lấy ID nhân viên
        scheduleId: invoice.attributes.scheduleId?.data?.id || null,
        PhuongThucThanhToan: invoice.attributes.PhuongThucThanhToan,
        status: invoice.attributes.status,
      });
    } else {
      form.resetFields();
    }
  }, [invoice, form]);

  const handleFinish = (values) => {
    if (invoice) {
      onUpdate(values);
    } else {
      onCreate(values);
    }
  };

  return (
    <Modal
      visible={visible}
      title={invoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn"}
      okText={invoice ? "Cập nhật" : "Thêm"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="MaHoaDon"
          label="Mã Hóa Đơn"
          rules={[{ required: true, message: "Vui lòng nhập mã hóa đơn!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="customerId" label="Mã Khách Hàng">
          <Select placeholder="Chọn khách hàng">
            {customers?.map((customer) => (
              <Select.Option key={customer.id} value={customer.id}>
                {customer.MaKH}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="employeeId"
          label="Nhân viên"
          rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
        >
          <Select placeholder="Chọn nhân viên">
            {employees?.map((employee) => (
              <Option key={employee.id} value={employee.id}>
                {employee.MaNV}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="scheduleId"
          label="Mã Lịch"
          rules={[{ required: true, message: "Vui lòng chọn mã lịch!" }]}
        >
          <Select placeholder="Chọn lịch">
            {schedules?.data?.map((schedule) => (
              <Option key={schedule.id} value={schedule.id}>
                {schedule.attributes?.IDSchedule}{" "}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="PhuongThucThanhToan"
          label="Phương Thức Thanh Toán"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phương thức thanh toán!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value="Thành công">Thành công</Option>
            <Option value="Không thành công">Không thành công</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InvoiceFormModal;
