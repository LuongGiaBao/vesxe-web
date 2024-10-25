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

// export const API_URL = "http://192.168.1.9:1337/api";
// export const API_TOKEN_URL =
//   "141b7608eaa13ee33a5641fbd1a97e1dc2fa8ab4319b343b46934abf459ed1de2aaba177db2b007d13b88ae5323fdce4d782171765c6683e334f99205028fbf6434608d190c8b05ab072d64c7496655dd441b945bce68ea0977a42a6fbef29c3b256326cc99eaa10d8bbc4049d079598e924a6fd8c579fc67ace7e09d2f54087";
