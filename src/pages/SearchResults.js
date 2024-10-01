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
import { useLocation, useNavigate } from "react-router-dom";
import { FetchDataSchedule } from "../api/Schedule";

const SearchResults = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { departure, destination, date, returnDate, tickets, oneWay } =
    location.state || {};
  // Fetch trips based on search criteria
  useEffect(() => {
    const loadTrips = async () => {
      try {
        if (!departure || !destination || !date) {
          throw new Error("Missing search parameters.");
        }

        const fetchedTrips = await FetchDataSchedule({
          departure,
          destination,
          date,
        });

        if (Array.isArray(fetchedTrips)) {
          setTrips(fetchedTrips);
        } else {
          console.warn("Fetched trips is not an array:", fetchedTrips);
          setTrips([]);
        }
      } catch (err) {
        console.error("Failed to load trips:", err);
        setTrips([]);
      }
    };

    loadTrips();
  }, [departure, destination, date]);

  useEffect(() => {
    if (!departure || !destination || !date) {
      // Optionally, navigate back to search page after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [departure, destination, date, navigate]);
  const handleSelectTrip = (trip) => {
    // Navigate to seat selection page with selected trip details
    navigate("/seat-selection", {
      state: {
        selectedTrip: trip,
        tickets,
        departure,
        destination,
        date,
        returnDate,
        oneWay,
      },
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Calculate duration in hours between departure and arrival times
  const calculateDuration = (departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return "0";

    const depDate = new Date(`1970-01-01T${departureTime}`);
    const arrDate = new Date(`1970-01-01T${arrivalTime}`);
    let diff = (arrDate - depDate) / 36e5; // Difference in hours

    // Handle trips that arrive the next day
    if (diff < 0) diff += 24;

    return diff.toFixed(1);
  };

  return (
    <div className="trip-results">
      <h2>Kết quả tìm kiếm</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : trips.length === 0 ? (
        <p>Không tìm thấy chuyến xe nào phù hợp.</p>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => (
            <div key={trip.id} className="trip">
              <div className="trip-time-info">
                <div className="departure-time">
                  <h3>{formatTime(trip.departureTime)}</h3>
                  <p>{trip.departureStation}</p>
                </div>
                <div className="duration">
                  <p>
                    {calculateDuration(trip.departureTime, trip.arrivalTime)}{" "}
                    giờ
                  </p>
                  {/* You can replace the hardcoded text with dynamic data if available */}
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
                <button
                  onClick={() => handleSelectTrip(trip)}
                  disabled={trip.seatsLeft < tickets}
                  className={trip.seatsLeft < tickets ? "disabled" : ""}
                >
                  {trip.seatsLeft >= tickets ? "Chọn chuyến" : "Không còn vé"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
