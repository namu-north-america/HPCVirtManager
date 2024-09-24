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
export const getUserRole = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("appUser")) {
    return JSON.parse(localStorage.getItem("appUser"));
  } else if (sessionStorage.getItem("appUser")) {
    return JSON.parse(sessionStorage.getItem("appUser"));
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
export const authenticate = (appToken, data, next) => {
  if (typeof window !== "undefined") {
    appToken = JSON.stringify(appToken);
    
    if (data.rememberMe) {
      localStorage.setItem("appToken", appToken);
      localStorage.setItem("appUser", JSON.stringify(data));
    } else {
      sessionStorage.setItem("appToken", appToken);
      sessionStorage.setItem("appUser", JSON.stringify(data));
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
