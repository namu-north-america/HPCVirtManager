import axios from "axios";
import { isAuthenticated, logout } from "./auth";

const api = async (method, urlEndPoint, data = {}, params = {}, extraHeaders = {}) => {
  try {

    let headers = {
      "Content-Type": "application/json",
      ...extraHeaders,
    };

    if (isAuthenticated()) {
      headers = {
        ...headers,
        Authorization: `Bearer ${isAuthenticated()}`,
      };
    }

    let response = await axios({
      method,
      url: "/server" + urlEndPoint,
      data,
      headers,
      params,
    });

    let res = response.data;

    return res;
  } catch (error) {
    console.log("api error : ", error);
    if (error?.response?.status === 401) {
      logout();
    }
    let res = error?.response ? error.response.data : error.toString();
    return res;
  }
};

export default api;
