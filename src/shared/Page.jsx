import React from "react";
import CustomButton, { CustomButtonOutlined } from "./CustomButton";
import { CustomSearch } from "./AllInputs";

export default function Page({
  title,
  description,
  children,
  search = "",
  onSearch,
  onRefresh,
  onAdd,
  addText = "Add",
  headers,
}) {
  return (
    <div className="page">
      <div className="mb-4">
        <div className="flex justify-content-between flex-wrap">
          {title && <div className="page-title">{title}</div>}
          <div className="flex flex-wrap">
            {onAdd && (
              <CustomButton label={addText} icon="pi pi-plus" onClick={onAdd} />
            )}
            {onRefresh && (
              <CustomButtonOutlined
                label="Refresh"
                severity="secondary"
                icon="pi pi-sync"
                onClick={onRefresh}
              />
            )}
            {onSearch && <CustomSearch value={search} onChange={onSearch} />}
            {headers}
          </div>
        </div>
        {description && <div className="mt-2">{description}</div>}
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
