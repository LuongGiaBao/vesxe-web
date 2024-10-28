// src/utils/timeUtils.js
import { format, parseISO } from "date-fns";

export const formatVietnamTime = (isoString) => {
  const date = parseISO(isoString); // Chuyển đổi chuỗi ISO thành đối tượng Date
  const vietnamTime = new Date(date.getTime() - 7 * 60 * 60 * 1000); // Cộng 7 giờ cho giờ Việt Nam
  return format(vietnamTime, "dd/MM/yyyy hh:mm a"); // Định dạng thời gian
};
const sampleTime = "2024-10-27T09:13:12.368Z";
console.log(formatVietnamTime(sampleTime)); // Kết quả mong đợi: 28/10/2024 03:11 PM
