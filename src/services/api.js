import axios from "axios";
// import constants from "../constants";
import { isAuthenticated, logout } from "./auth";

const api = async (
  method,
  urlEndPoint,
  data = {},
  params = {},
  extraHeaders = {}
) => {
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
    console.log(error);
    if (error?.response?.status === 401) {
      logout();
    }

    console.log("qwertyuio==>", error);
    
    let res = error?.response ? error.response.data : error.toString();
    return res;
  }
};

export default api;
