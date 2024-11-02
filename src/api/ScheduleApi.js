// src/api/ScheduleApi.js
import { apiClient } from "../services/apiservices";

export const fetchAllSchedules = async () => {
  try {
    // Sử dụng populate để lấy dữ liệu từ các relation
    const response = await apiClient.get("/schedules?populate[MaTuyen][populate]=*&populate[BienSo][populate]=*");
    return response.data;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const response = await apiClient.post("/schedules", {
      data: {
        ...scheduleData,
        MaTuyen: { connect: [scheduleData.MaTuyen] },
        BienSo: { connect: [scheduleData.BienSo] }
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const response = await apiClient.put(`/schedules/${scheduleId}`, {
      data: {
        ...scheduleData,
        MaTuyen: { connect: [scheduleData.MaTuyen] },
        BienSo: { connect: [scheduleData.BienSo] }
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await apiClient.delete(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};