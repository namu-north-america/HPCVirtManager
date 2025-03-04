import { jwtDecode } from "jwt-decode";
import keycloak from "../keycloak";

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (keycloak.authenticated) {
    // console.log("isAuthenticated : ", true)
    return true;
  } else {
    // console.log("isAuthenticated : ", false)
    return false;
  }
};


export const getUserRole = () => {
  if (typeof window == "undefined") {
    return false;
  }
  let user = null;
  if (localStorage.getItem("appUser")) {
    user = JSON.parse(localStorage.getItem("appUser"));
  } else if (sessionStorage.getItem("appUser")) {
    user = JSON.parse(sessionStorage.getItem("appUser"));
  } else {
    console.log("getUserRole : appUser not found in localStorage and sessionStorage")
    return false;
  }
  if (!user.role && user.realm_access && user.realm_access.roles) {
    user.role = user.realm_access.roles.includes("admin") ? "admin" : "user";
  }
  return user;
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
