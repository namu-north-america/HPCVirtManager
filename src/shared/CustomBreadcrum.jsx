import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";
export default function CustomBreadcrum({ items }) {
  const home = { icon: "pi pi-home", url: "/#/dashboard" };
  return <BreadCrumb model={items} home={home} />;
}
