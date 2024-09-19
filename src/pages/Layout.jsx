import React from "react";
import { ReactComponent as Logo } from "../assets/images/svg/Logo.svg";

export default function Layout({ children, title, signup }) {
  return (
    <div className="auth-page-layout">
      <div className="grid m-0 p-0">
        <div className="side-img-div col-12 md:col-6 p-0 m-0 login-img"></div>
        <div className="col-12 md:col-6 flex flex-column justify-content-center ">
          <div className="auth-form">
            <div className="logo">
              <Logo />
            </div>
            {title && (
              <>
                <div className="form-title">{title}</div>
                <div className="line"></div>
              </>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
