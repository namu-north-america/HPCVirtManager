import React from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import classNames from "classnames";

export default function CustomButton({
  label = "Submit",
  extraClassNames,
  ...props
}) {
  return (
    <Button
      className={`primary-button align-center ${extraClassNames}`}
      label={label}
      style={{ alignSelf: "center" }}
      size="small"
      {...props}
    />
  );
}

export function CustomButtonOutlined({ label = "Submit", className, ...props }) {
  const isRefreshButton = label === "Refresh";
  return (
    <Button
      className={classNames(`align-center ${isRefreshButton ? 'refresh-button' : ''}`, className)}
      label={label}
      style={{ alignSelf: "center" }}
      outlined={!isRefreshButton}
      size="small"
      {...props}
    />
  );
}

export function CustomSplitButton({ label = "Submit", ...props }) {
  return (
    <SplitButton
      className="align-center"
      label={label}
      outlined
      size="small"
      {...props}
    />
  );
}

export function Buttonlayout({ className, position = "end", children }) {
  return (
    <div className={`flex my-2 justify-content-${position} ${className}`}>
      {children}
    </div>
  );
}
