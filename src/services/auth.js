import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("appToken")) {
    return JSON.parse(localStorage.getItem("appToken"));
  } else if (sessionStorage.getItem("appToken")) {
    return JSON.parse(sessionStorage.getItem("appToken"));
  } else {
    return false;
  }
};

export const getMyId = () => {
  let token = "";
  if (localStorage.getItem("appToken")) {
    token = JSON.parse(localStorage.getItem("appToken"));
  } else if (sessionStorage.getItem("appToken")) {
    token = JSON.parse(sessionStorage.getItem("appToken"));
  }
  const decoded = jwtDecode(token);
  return decoded.userId;
};
export const authenticate = (appToken, rememberMe, next) => {
  if (typeof window !== "undefined") {
    appToken = JSON.stringify(appToken);
    if (rememberMe) {
      localStorage.setItem("appToken", appToken);
    } else {
      sessionStorage.setItem("appToken", appToken);
    }
    next();
  }
};

export const logout = (next) => {
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
    if (next) {
      next();
    }
  }
};
