const express = require("express");
const app = express();
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Lưu trữ tạm thời thông tin đặt vé
const pendingBookings = new Map();
const paymentStatusMap = new Map();

const config = {
  app_id: "2554",
  key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
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

// Endpoint để kiểm tra trạng thái thanh toán
app.get("/payment/status/:appTransID", async (req, res) => {
  const { appTransID } = req.params;

  const bookingDetails = pendingBookings.get(appTransID);
  const status = paymentStatusMap.get(appTransID);

  if (bookingDetails) {
    res.json({
      status: status || "pending",
      bookingDetails: {
        ...bookingDetails,
        paymentStatus: status || "pending"
      }
    });
  } else {
    res.status(404).json({
      status: "not_found",
      message: "Không tìm thấy thông tin đặt vé",
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
    }

    res.json({ return_code: 1, return_message: "success" });
  } else {
    res.status(404).json({ return_code: 0, return_message: "Transaction not found" });
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
      paymentStatus: paymentStatusMap.get(appTransID) || "pending"
    }));

  res.json(userTickets);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});