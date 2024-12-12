// import React from "react";
// import { Modal } from "antd";

// const TicketPriceDetail = ({ visible, onClose, priceDetail }) => {
//   // Kiểm tra nếu `priceDetail` tồn tại trước khi truy cập thuộc tính
//   if (!priceDetail || !priceDetail.attributes) {
//     return null;
//   }

//   // Hàm format thời gian để hiển thị theo múi giờ Việt Nam
//   const formatVietnamTime = (isoString) => {
//     const date = new Date(isoString);
//     const vietnamTime = new Date(date.getTime() - 12 * 60 * 60 * 1000);

//     const hours = vietnamTime.getHours();
//     const minutes = vietnamTime.getMinutes();
//     const amPm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;

//     return `${vietnamTime.toLocaleDateString(
//       "vi-VN"
//     )} ${formattedHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
//   };

//   return (
//     <Modal
//       title="Chi Tiết Giá Vé"
//       visible={visible}
//       onCancel={onClose}
//       footer={null}
//     >
//       <div>
//         <p>
//           <strong>ID:</strong> {priceDetail.id}
//         </p>
//         <p>
//           <strong>Giá:</strong> {priceDetail.attributes.price} VND
//         </p>
//         <p>
//           <strong>Khuyến mãi:</strong>{" "}
//           {priceDetail.attributes.promotion?.data
//             ? priceDetail.attributes.promotion.data.attributes.promotionName
//             : "Không có"}
//         </p>
//         <p>
//           <strong>Ngày bắt đầu:</strong>{" "}
//           {formatVietnamTime(priceDetail.attributes.startDate)}
//         </p>
//         <p>
//           <strong>Ngày kết thúc:</strong>{" "}
//           {formatVietnamTime(priceDetail.attributes.endDate)}
//         </p>
//         <p>
//           <strong>Trạng thái:</strong> {priceDetail.attributes.status}
//         </p>
//       </div>
//     </Modal>
//   );
// };

// export default TicketPriceDetail;
