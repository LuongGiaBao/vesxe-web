// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FetchDataSchedule } from "../api/Schedule";

// const SearchResults = () => {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const loadTrips = async () => {
//       setLoading(true);
//       try {
//         const data = await FetchDataSchedule();
//         console.log("data".data);
//         setTrips(data);
//       } catch (error) {
//         console.error("Failed to load trips", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTrips();
//   }, []);
//   const navigate = useNavigate();

//   const handleSelectTrip = (trip) => {
//     // Điều hướng tới trang chọn ghế và truyền dữ liệu chuyến xe
//     navigate("/seat-selection", { state: { selectedTrip: trip } });
//   };

//   return (
//     <div className="trip-results">
//       {trips.length === 0 ? (
//         <p>Không tìm thấy chuyến xe nào phù hợp.</p>
//       ) : (
//         trips.map((trip) => (
//           <div key={trip.id} className="trip">
//             <div className="trip-time-info">
//               <div className="departure-time">
//                 <h3>{trip.departureTime}</h3>
//                 <p>{trip.departureStation}</p>
//               </div>
//               <div className="duration">
//                 <p>
//                   {Math.abs(
//                     new Date(`1970-01-01T${trip.arrivalTime}`) -
//                       new Date(`1970-01-01T${trip.departureTime}`)
//                   ) / 36e5}{" "}
//                   giờ
//                 </p>
//                 <span>(Asian/Ho Chi Minh)</span>
//               </div>
//               <div className="arrival-time">
//                 <h3>{trip.arrivalTime}</h3>
//                 <p>{trip.destinationStation}</p>
//               </div>
//             </div>

//             <div className="trip-details">
//               <p>
//                 Ghế • <span>{trip.seatsLeft} chỗ trống</span>
//               </p>
//               <p className="price">{trip.price.toLocaleString()} ₫</p>
//             </div>

//             <div className="trip-actions">
//               <button onClick={() => handleSelectTrip(trip)}>
//                 Chọn chuyến
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SearchResults;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FetchDataSchedule } from "../api/Schedule";

const SearchResults = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const response = await FetchDataSchedule(); // Gọi hàm FetchDataSchedule
        console.log("Fetched data:", response); // Kiểm tra dữ liệu nhận được

        // Kiểm tra và trích xuất mảng trips từ response.data
        if (Array.isArray(response.data)) {
          setTrips(response.data); // Gán mảng trips
        } else {
          console.warn("Dữ liệu không phải là mảng:", response.data);
          setTrips([]); // Đặt trips thành mảng rỗng nếu không phải là mảng
        }
      } catch (error) {
        console.error("Failed to load trips", error);
        setTrips([]); // Đặt trips thành mảng rỗng nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const navigate = useNavigate();

  const handleSelectTrip = (trip) => {
    // Điều hướng tới trang chọn ghế và truyền dữ liệu chuyến xe
    navigate("/seat-selection", { state: { selectedTrip: trip } });
  };

  const formatTime = (timeString) => {
    const [time] = timeString.split("."); // Tách chuỗi tại dấu '.'
    return time; // Trả về chuỗi giờ phút
  };
  return (
    <div className="trip-results">
      {loading ? (
        <p>Đang tải...</p> // Hiển thị thông báo tải dữ liệu
      ) : !Array.isArray(trips) || trips.length === 0 ? ( // Kiểm tra trips là mảng
        <p>Không tìm thấy chuyến xe nào phù hợp.</p>
      ) : (
        trips.map((trip) => (
          <div key={trip.id} className="trip">
            <div className="trip-time-info">
              <div className="departure-time">
                <h3>{formatTime(trip.departureTime)}</h3>
                <p>{trip.departureStation}</p>
              </div>
              <div className="duration">
                <p>
                  {Math.abs(
                    new Date(`1970-01-01T${trip.arrivalTime}`) -
                      new Date(`1970-01-01T${trip.departureTime}`)
                  ) / 36e5}{" "}
                  giờ
                </p>
                <span>(Asian/Ho Chi Minh)</span>
              </div>
              <div className="arrival-time">
                <h3>{formatTime(trip.arrivalTime)}</h3>
                <p>{trip.destinationStation}</p>
              </div>
            </div>

            <div className="trip-details">
              <p>
                Ghế • <span>{trip.seatsLeft} chỗ trống</span>
              </p>
              <p className="price">{trip.price.toLocaleString()} ₫</p>
            </div>

            <div className="trip-actions">
              <button onClick={() => handleSelectTrip(trip)}>
                Chọn chuyến
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;