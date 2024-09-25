import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const DEV_TOKEN = process.env.REACT_APP_DEV_TOKEN;

// Create an axios instance with default settings
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${DEV_TOKEN}`,
  },
});

// Export the configured axios instance
export { apiClient };
