import React from "react";
import { capitalizeCamelCase } from "../utils/commonFunctions";

export default function InputLayout({
  label,
  name,
  required,
  col,
  extraClassName = "",
  errorMessage,
  data,
  children,
}) {
  col = parseInt(col);
  if (col > 12) {
    col = 12;
  }
  return (
    <div className={`input-layout col-12  md:col-${col} ${extraClassName}`}>
      <label htmlFor={name} className="text-sm font-semibold">
        <div className="mb-1">
          {label ? label : capitalizeCamelCase(name)}
          {required ? <span className="text-red-500">*</span> : null}
        </div>
      </label>
      {children}
      {errorMessage || data?.formErrors?.[name] ? (
        <small className="p-error">
          {errorMessage || data?.formErrors?.[name]}
        </small>
      ) : null}
    </div>
  );
}
