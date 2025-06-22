import axios from "axios";
import Cookies from "js-cookie";

const getToken = () => {
  return Cookies.get("access_token");
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

//Adding request interceptor
api.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `BEARER ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default api;
