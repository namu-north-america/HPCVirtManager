import React from "react";

export default function CustomCard({
  children,
  header,
  className,
  title,
  col = 12,
}) {
  return (
    <div className={`col-12 md:col-${col} p-2` }>
      <div className={`card ${className}`}>
        <div className="flex justify-content-between flex-wrap">
          {title ? <div className="title  mb-2">{title}</div> : null}
          {header}
        </div>
        {children}
      </div>
    </div>
  );
}

export function CustomCardSecondary({ children, className }) {
  return <div className={`secondary-card p-2 ${className}`}>{children}</div>;
}

export function CustomCardValue({ size, extraClassNames, title, value }) {
  return (
    <div
      className={
        size
          ? `value-card col-${size} ${extraClassNames}`
          : `value-card col ${extraClassNames}`
      }
    >
      <div className="title">{title}</div>
      <div className="value my-3">{value}</div>
    </div>
  );
}
export function CustomCardField({ extraClassNames, title, value, template }) {
  return (
    <div className={`value-field my-2 ${extraClassNames}`}>
      <div className="title">{title}</div>
      <div className="value">{template ? template : value ? value : "-"}</div>
    </div>
  );
}

export function CustomChip({ extraClassNames, value }) {
  return (
    <div className={`custom-chip my-3 ${extraClassNames}`}>
      <span className="value px-2 py-1">{value}</span>
    </div>
  );
}
