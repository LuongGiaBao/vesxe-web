import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Space,
  Tag,
  Button,
  Divider,
  Typography,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  CarOutlined,
  InfoCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Banner from "../components/Banner";
import { fetchAllPromotionDetails } from "../api/PromotionDetailApi";
const { Title, Text } = Typography;

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const schedules = location.state?.schedules || [];

  const handleSelectTrip = (schedule) => {
    navigate("/seat-selection", {
      state: {
        selectedTrip: {
          id: schedule.scheduleId,
          departureStation: schedule.departureName,
          destinationStation: schedule.arrivalName,
          departureTime: schedule.formattedTime,
          price: schedule.price,
          totalSeats: schedule.totalSeats,
          pickupPoint: schedule.pickupPoint,
          dropOffPoint: schedule.dropOffPoint,
          expectedTime: schedule.expectedTime,
          status: schedule.status,
        },
      },
    });
  };

  const formatToDateTimeVN = (dateString) => {
    const date = new Date(dateString);

    // Lấy giờ và phút dưới dạng số
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Định dạng thành chuỗi "X giờ Y phút"
    return `${hours} giờ ${minutes} phút`;
  };

  const calculateArrivalTime = (departureTime, expectedTime) => {
    if (!expectedTime) {
      console.error("Expected time is undefined.");
      return new Date(departureTime); // Trả về thời gian khởi hành nếu không có expectedTime
    }

    const departureDate = new Date(departureTime);
    const [hours, minutes] = expectedTime.split(":").map(Number);
    departureDate.setHours(departureDate.getHours() + hours);
    departureDate.setMinutes(departureDate.getMinutes() + minutes);
    return departureDate;
  };

  const formatExpectedTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${parseInt(hours, 10)} giờ ${minutes} phút`;
  };
  return (
    <div className="trip-results">
      <Banner />
      <Title level={3} style={{ margin: "20px 0" }}>
        Kết quả chuyến đi
      </Title>

      {schedules.length === 0 ? (
        <Text>Không tìm thấy chuyến xe nào phù hợp.</Text>
      ) : (
        <Row gutter={[16, 16]}>
          {schedules.map((schedule) => (
            <Col xs={24} sm={24} md={12} lg={8} key={schedule.scheduleId}>
              <Card
                hoverable
                title={
                  <Space>
                    <EnvironmentOutlined />
                    {schedule.departureName}
                    <ArrowRightOutlined />
                    {schedule.arrivalName}
                  </Space>
                }
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {/* Timeline section */}
                  <div
                    className="flex flex-col"
                    style={{ position: "relative" }}
                  >
                    {/* Vertical line */}
                    <div
                      style={{
                        position: "absolute",
                        left: "7px",
                        top: "20px",
                        bottom: "24px",
                        width: "4px",
                        background: "#e8e8e8",
                      }}
                    />

                    {/* Departure */}
                    <Space align="start">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <EnvironmentOutlined
                          style={{
                            color: "orange",
                            fontSize: "20px",
                            background: "#fff",
                          }}
                        />
                        <div
                          style={{
                            width: "2px",
                            height: "20px",
                            background: "#e8e8e8",
                          }}
                        />
                      </div>
                      <div>
                        {formatToDateTimeVN(schedule.formattedTime)}
                        <br />
                      </div>
                    </Space>

                    {/* Expected time */}
                    <Space
                      align="center"
                      style={{ marginLeft: "29px"}}
                    >
                      <Text type="secondary">
                        {/* Thời gian dự kiến:{" "} */}
                        {formatExpectedTime(schedule.expectedTime)}
                      </Text>
                    </Space>

                    {/* Arrival */}
                    <Space align="start">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "2px",
                            height: "20px",
                            background: "#e8e8e8",
                          }}
                        />
                        <EnvironmentOutlined
                          style={{
                            color: "green",
                            fontSize: "20px",
                            background: "#fff",
                          }}
                        />
                      </div>
                      <div>
                        {/* <Text strong>Đến:</Text> */}
                        <br />
                        <Text>
                          {(() => {
                            const departureTime = schedule.formattedTime;
                            const expectedTime = schedule.expectedTime;
                            const arrivalTime = calculateArrivalTime(
                              departureTime,
                              expectedTime
                            );
                            return formatToDateTimeVN(arrivalTime);
                          })()}
                        </Text>
                      </div>
                    </Space>
                  </div>

                  <Divider style={{ margin: "12px 0" }} />

                  {/* Station Information */}
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <CarOutlined />
                      <Text strong>Bến xe khởi hành:</Text>
                      <Text>{schedule.pickupPoint || "N/A"}</Text>
                    </Space>

                    <Space>
                      <CarOutlined />
                      <Text strong>Bến xe đến:</Text>
                      <Text>{schedule.dropOffPoint || "N/A"}</Text>
                    </Space>

                    <Space>
                      <InfoCircleOutlined />
                      <Text strong>Ghế trống:</Text>
                      <Text>{schedule.totalSeats || "N/A"}</Text>
                    </Space>

                    <Space>
                      <DollarOutlined />
                      <Text strong>Giá vé:</Text>
                      {schedule.price ? (
                        <Tag color="blue">
                          {parseInt(schedule.price, 10).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </Tag>
                      ) : (
                        <Text>Không có giá vé</Text>
                      )}
                    </Space>
                  </Space>

                  <Button
                    type="primary"
                    block
                    onClick={() => handleSelectTrip(schedule)}
                  >
                    Chọn chuyến
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SearchResults;
