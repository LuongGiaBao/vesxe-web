const express = require("express");
const app = express();
const axios = require("axios");
const CryptoJS = require("crypto-js");
const qs = require("qs");
const moment = require("moment");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Lưu trữ tạm thời thông tin đặt vé
const pendingBookings = new Map();
const paymentStatusMap = new Map();

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

app.post("/payment", async (req, res) => {
  const { amount, userId, description, bookingDetails } = req.body;

  if (!amount || !userId || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Tạo appTransID
    const transID = Math.floor(Math.random() * 1000000);
    const appTransID = `${moment().format("YYMMDD")}_${transID}`;

    // Lưu booking details vào Map với key là appTransID
    pendingBookings.set(appTransID, bookingDetails);
    paymentStatusMap.set(appTransID, "pending");
    console.log("Saved booking details for appTransID:", appTransID);
    console.log("Booking details:", bookingDetails);

    const embed_data = {
      redirecturl: `http://localhost:3000/booking-success`,
      appTransID: appTransID,
    };

    const order = {
      app_id: config.app_id,
      app_trans_id: appTransID,
      app_user: userId,
      app_time: Date.now(),
      item: JSON.stringify([{}]),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: description,
      bank_code: "zalopayapp",
    };

    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const result = await axios.post(config.endpoint, null, { params: order });
    console.log("ZaloPay response:", result.data);

    if (result.data.return_code === 1) {
      res.json({
        ...result.data,
        appTransID: appTransID,
        status: "success",
      });
    } else {
      throw new Error(result.data.return_message);
    }
  } catch (error) {
    console.error("Payment error:", error);
    return res.status(500).json({ error: "Payment request failed" });
  }
});

app.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

// Endpoint để kiểm tra trạng thái thanh toán
app.get("/payment/status/:appTransID", async (req, res) => {
  const { appTransID } = req.params;

  try {
    // Kiểm tra trạng thái thanh toán từ ZaloPay
    const postData = {
      app_id: config.app_id,
      app_trans_id: appTransID,
    };

    const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, {
      params: postData,
    });

    // Cập nhật trạng thái dựa trên phản hồi từ ZaloPay
    const status = response.data.return_code === 1 ? "completed" : "pending";
    paymentStatusMap.set(appTransID, status);

    const bookingDetails = pendingBookings.get(appTransID);
    if (bookingDetails) {
      bookingDetails.paymentStatus = status;
      pendingBookings.set(appTransID, bookingDetails);

      res.json({
        status: status,
        bookingDetails: bookingDetails,
      });
    } else {
      res.status(404).json({
        status: "not_found",
        message: "Không tìm thấy thông tin đặt vé",
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi khi kiểm tra trạng thái thanh toán",
    });
  }
});

// Endpoint callback từ ZaloPay
app.post("/payment/callback", (req, res) => {
  const { app_trans_id, status } = req.body;
  console.log("Payment callback received:", req.body);

  if (app_trans_id) {
    // Cập nhật trạng thái thanh toán
    const newStatus = status === 1 ? "completed" : "failed";
    paymentStatusMap.set(app_trans_id, newStatus);

    // Cập nhật booking details với trạng thái mới
    const bookingDetails = pendingBookings.get(app_trans_id);
    if (bookingDetails) {
      bookingDetails.paymentStatus = newStatus;
      pendingBookings.set(app_trans_id, bookingDetails);
      console.log(
        "Updated payment status for:",
        app_trans_id,
        "to:",
        newStatus
      );
    }

    res.json({ return_code: 1, return_message: "success" });
  } else {
    res
      .status(404)
      .json({ return_code: 0, return_message: "Transaction not found" });
  }
});

// Endpoint để lấy danh sách vé của người dùng
app.get("/tickets/:userId", (req, res) => {
  const { userId } = req.params;
  // Giả lập việc lấy danh sách vé từ cơ sở dữ liệu
  const userTickets = Array.from(pendingBookings.entries())
    .filter(([_, booking]) => booking.customerInfo.email === userId)
    .map(([appTransID, booking]) => ({
      id: appTransID,
      ...booking,
      paymentStatus: paymentStatusMap.get(appTransID) || "pending",
    }));

  res.json(userTickets);
});

const checkPaymentStatus = async (appTransId) => {
  let postData = {
    app_id: config.app_id,
    app_trans_id: appTransId, // Nhập app_trans_id
  };

  // Tạo MAC
  let data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: config.endpoint,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const response = await axios(postConfig);
    console.log("Payment Status Response:", JSON.stringify(response.data));
    return response.data; // Trả về dữ liệu phản hồi
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error; // Ném lỗi để xử lý bên ngoài nếu cần
  }
};

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
