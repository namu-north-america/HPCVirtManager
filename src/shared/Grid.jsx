import React from "react";

export default function Grid({ children, extraClassNames }) {
  return <div className={`grid m-0 p-0 ${extraClassNames}`}>{children}</div>;
}

export function Col({ size, children, extraClassNames }) {
  return (
    <div
      className={
        size
          ? `p-0 m-0 col-${size} ${extraClassNames}`
          : `p-0 m-0 col ${extraClassNames}`
      }
    >
      {children}
    </div>
  );
}
