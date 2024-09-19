import React, { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";

export default function CustomOverlay({ template, children }) {
  const ol = useRef(null);
  return (
    <>
      <span onClick={(e) => ol.current.toggle(e)}>{template}</span>
      <div className="custom-overlay">
        <OverlayPanel ref={ol} onClick={(e) => ol.current.toggle(e)}>
          {children}
        </OverlayPanel>
      </div>
    </>
  );
}
