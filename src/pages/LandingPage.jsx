import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../store/slices/userSlice";
import keycloak from "../keycloak";

await keycloak.init({ onLoad: "login-required" });

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (keycloak.authenticated) {
      const tokenParsed = keycloak.tokenParsed;
      const user = {
        ...tokenParsed,
        token: keycloak.token,
        role: "user",
      };
      dispatch(setUserProfile(user));
      navigate("/dashboard");
    } else {
      keycloak.login({
        redirectUri: `${window.location.origin}/#/dashboard`,
      });
    }
  }, [navigate, dispatch]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to HPC Virt Manager</h1>
      <p>Redirecting to KeyCloak for login ...</p>
    </div>
  );
}
