import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Col, Row, Typography, Button } from "antd";
import Banner from "../components/Banner";
import { apiClient } from "../services/apiservices";
const { Title, Text } = Typography;

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [trips, setTrips] = useState(location.state?.trips || []); // Extract trips from state, defaulting to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trips.length > 0) {
      fetchTicketPrices();
    }
  }, [trips]);

  useEffect(() => {
    // Cập nhật trips mỗi khi location.state thay đổi
    if (location.state?.trips) {
      setTrips(location.state.trips);
    }
  }, [location.state?.trips]);

  const fetchTicketPrices = async () => {
    try {
      const response = await apiClient.get(
        "/trips?populate=ticket.ticket_prices"
      );

      if (!response.data) {
        throw new Error("No data received");
      }

      const tripsWithPrices = response.data.data.map((trip) => {
        const tripId = trip.id;
        const ticket = trip.attributes.ticket?.data;
        let ticketPrices = [];
        if (ticket && ticket.attributes.ticket_prices?.data) {
          ticketPrices = ticket.attributes.ticket_prices.data.map((price) => ({
            id: price.id,
            price: price.attributes.price,
            status: price.attributes.status,
            startDate: price.attributes.startDate,
            endDate: price.attributes.endDate,
          }));
        }

        return {
          tripId,
          attributes: {
            ...trip.attributes,
            ticketPrices,
            totalSeats: trip.attributes.totalSeats,
            seatCount: trip.attributes.seatCount,
          },
        };
      });

      setTrips((prevTrips) =>
        prevTrips.map((existingTrip) => {
          const matchedTrip = tripsWithPrices.find(
            (t) => t.tripId === existingTrip.id
          );
          return matchedTrip
            ? {
                ...existingTrip,
                attributes: {
                  ...existingTrip.attributes,
                  ticketPrices: matchedTrip.attributes.ticketPrices || [],
                  totalSeats: matchedTrip.attributes.totalSeats,
                  seatCount: matchedTrip.attributes.seatCount,
                },
              }
            : existingTrip;
        })
      );
    } catch (error) {
      console.error("Error fetching ticket prices:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    // Implement your time formatting logic here
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSelectTrip = (trip) => {
    navigate("/seat-selection", {
      state: {
        selectedTrip: {
          ...trip,
          totalSeats: trip.attributes.totalSeats,
          availableSeats:
            trip.attributes.totalSeats - trip.attributes.seatCount,
          id: trip.id,
          departureStation:
            trip.attributes.departure_location_id?.data?.attributes?.name,
          destinationStation:
            trip.attributes.arrival_location_id?.data?.attributes?.name,
          departureTime: trip.attributes.departureTime,
          price: trip.attributes.ticketPrices?.[0]?.price,
        },
      },
    });
  };

  const calculateTravelTime = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    // Tính toán chênh lệch thời gian tính theo phút
    const diffMs = arrival - departure;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours} giờ ${diffMinutes} phút`;
  };

  return (
    <div className="trip-results">
      <Banner />

      <div className="trip-card">
        <h4 className="trip-title">Kết quả chuyến đi</h4>

        {trips.length === 0 ? (
          <div className="no-results">
            Không tìm thấy chuyến xe nào phù hợp.
          </div>
        ) : (
          <Row gutter={[16, 24]}>
            {trips.map((trip) => (
              <Col xs={24} sm={24} md={12} lg={12} key={trip.id}>
                <div className="trip-card">
                  <h4 className="trip-title">Thông tin chuyến đi</h4>

                  <div className="location-info">
                    <span className="location-label">Điểm khởi hành:</span>
                    <span>
                      {
                        trip.attributes.departure_location_id?.data?.attributes
                          ?.name
                      }
                    </span>
                    <span className="location-label">Điểm đến:</span>
                    <span>
                      {
                        trip.attributes.arrival_location_id?.data?.attributes
                          ?.name
                      }
                    </span>
                  </div>

                  <div className="time-container">
                    {/* Thời gian đi */}
                    <div className="time-block">
                      <div className="time-label">Thời gian khởi hành:</div>
                      <div className="time-value">
                        {formatTime(trip.attributes.departureTime)}
                      </div>
                    </div>

                    <div className="duration">
                      {calculateTravelTime(
                        trip.attributes.departureTime,
                        trip.attributes.arrivalTime
                      )}
                    </div>

                    <div className="time-block">
                      <div className="time-label">Thời gian đến:</div>
                      <div className="time-value">
                        {formatTime(trip.attributes.arrivalTime)}
                      </div>
                    </div>
                  </div>

                  <div className="station-info">{/* Thông tin bến xe */}</div>
                  <div style={{ marginBottom: "10px" }}>
                      <Text strong>Bến xe khởi hành:</Text>
                      <Text style={{ marginLeft: "10px", color: "#333" }}>
                        {trip.attributes.pickup_point?.data?.attributes
                          ?.location || "N/A"}
                      </Text>
                      <Text strong style={{ marginLeft: "15px" }}>
                        Bến xe đến:
                      </Text>
                      <Text style={{ marginLeft: "10px", color: "#333" }}>
                        {trip.attributes.drop_off_point?.data?.attributes
                          ?.location || "N/A"}
                      </Text>
                    </div>
                  <div className="additional-info">
                    {/* Khoảng cách và ghế trống */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="p-2">
                        <Text strong style={{ marginRight: 9 }}>
                          Khoảng cách:
                        </Text>
                        <Text>{trip.attributes.distance || "N/A"}</Text>
                      </div>

                      <div>
                        <Text strong style={{ marginRight: 9 }}>
                          Ghế trống:
                        </Text>
                        <Text>
                          {trip.attributes.totalSeats &&
                          trip.attributes.seatCount !== undefined
                            ? trip.attributes.totalSeats -
                              trip.attributes.seatCount
                            : "Không có ghế trống"}
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div className="price-info"> <div key={trip.id}>
                      {trip.attributes.ticketPrices &&
                      trip.attributes.ticketPrices.length > 0 ? (
                        trip.attributes.ticketPrices.map((price) => (
                          <Text strong key={price.id}>
                            Giá: {price.price} VNĐ
                          </Text>
                        ))
                      ) : (
                        <Text style={{ color: "red" }}>
                          Không có giá vé nào.
                        </Text>
                      )}
                    </div></div>

                  <div className="status">
                    {trip.attributes.status || "N/A"}
                  </div>

                  <button
                    className="select-button"
                    onClick={() => handleSelectTrip(trip)}
                  >
                    Chọn chuyến
                  </button>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
