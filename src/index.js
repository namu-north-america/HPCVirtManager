import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";

import "/node_modules/primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeflex/themes/primeone-light.css";
import "primeicons/primeicons.css";

import "./style.scss";

import { store } from "./store/index";
import ToastContainer from "./shared/ToastContainer";
import LoaderContainer from "./shared/LoaderContainer";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer />
    <LoaderContainer />
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
