import React from "react";
import { Dialog } from "primereact/dialog";

export default function CustomModal({
  title,
  visible,
  setVisible,
  onHide,
  children,
}) {
  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (setVisible) {
          if (!visible) return;
          setVisible(false);
        }
        if (onHide) {
          onHide();
        }
      }}
      draggable={false}
      resizable={false}
    >
      {children}
    </Dialog>
  );
}
