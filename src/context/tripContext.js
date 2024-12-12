import React, { createContext, useContext, useState } from "react";

// Tạo context
const TripContext = createContext(undefined);

// Provider component
export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null); // State cho chuyến đi được chọn

  return (
    <TripContext.Provider
      value={{ trips, setTrips, selectedTrip, setSelectedTrip }}
    >
      {children}
    </TripContext.Provider>
  );
};

// Custom hook để sử dụng TripContext
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
};
