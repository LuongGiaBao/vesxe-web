// src/api/fakeApi.js

export const fetchTrips = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            departure: "TP. Hồ Chí Minh",
            destination: "Bà Rịa - Vũng Tàu",
            departureStation: "Bến Xe Miền Tây",
            destinationStation: "Bến Xe Vũng Tàu",
            departureTime: "11:30",
            arrivalTime: "14:30", // Thêm giờ đến
            seatsLeft: 28,
            price: 135000,
            type: "regular",
            seatClass: "VIP",
          },
          {
            id: 2,
            departure: "TP. Hồ Chí Minh",
            destination: "Bà Rịa - Vũng Tàu",
            departureStation: "Bến Xe Miền Tây",
            destinationStation: "Bến Xe Vũng Tàu",
            departureTime: "13:00",
            arrivalTime: "16:00", // Thêm giờ đến
            seatsLeft: 15,
            price: 145000,
            type: "luxury",
            seatClass: "Thường",
          },
          {
            id: 3,
            departure: "TP. Hồ Chí Minh",
            destination: "Đà Lạt",
            departureStation: "Bến Xe Miền Đông",
            destinationStation: "Bến Xe Đà Lạt",
            departureTime: "14:00",
            arrivalTime: "20:00", // Thêm giờ đến
            seatsLeft: 5,
            price: 175000,
            type: "regular",
            seatClass: "Thường",
          },
        ]);
      }, 1000); // Giả lập trễ 1 giây
    });
  };
  
  // src/api/fakeApi.js

export const fetchTripSeats = (tripId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          tripId,
          seats: [
            { number: 1, status: 'sold' },
            { number: 2, status: 'sold' },
            { number: 3, status: 'sold' },
            { number: 4, status: 'sold' },
            { number: 5, status: 'available' },
            { number: 6, status: 'available' },
            { number: 7, status: 'available' },
            { number: 8, status: 'available' },
            { number: 9, status: 'available' },
            { number: 10, status: 'available' },
            { number: 11, status: 'available' },
            { number: 12, status: 'available' },
            { number: 13, status: 'available' },
            { number: 14, status: 'sold' },
            { number: 15, status: 'available' },
            { number: 16, status: 'sold' },
            { number: 17, status: 'available' },
            { number: 18, status: 'sold' },
            { number: 19, status: 'available' },
            { number: 20, status: 'sold' },
            { number: 21, status: 'sold' },
            { number: 22, status: 'available' },
            { number: 23, status: 'available' },
            { number: 24, status: 'available' },
            { number: 25, status: 'available' },
            { number: 26, status: 'available' },
            { number: 27, status: 'sold' },
            { number: 28, status: 'available' },
          ],
        });
      }, 1000); // Giả lập trễ 1 giây
    });
  };
  
  // src/api/schedule.js
export const FetchScheduleData = async () => {
  // Dữ liệu giả lập
  return [
    {
      diemdi: "TP. Hồ Chí Minh",
      diemden: "Bà Rịa - Vũng Tàu",
      thoigiankhoihanh: "08:00 AM, 05/09/2024",
      thoigiandukien: "10:00 AM, 05/09/2024",
      giave: 150000,
    },
    {
      diemdi: "TP. Hồ Chí Minh",
      diemden: "Nha Trang",
      thoigiankhoihanh: "06:00 AM, 06/09/2024",
      thoigiandukien: "12:00 PM, 06/09/2024",
      giave: 250000,
    },
    // Thêm nhiều lịch trình khác nếu cần
  ];
};
