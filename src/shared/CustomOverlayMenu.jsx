import React, { useRef } from "react";
import { Menu } from "primereact/menu";

export default function CustomOverlayMenu({ items = [], children }) {
  const menu = useRef(null);
  return (
    <>
      <div onClick={(e) => menu.current.toggle(e)}>{children}</div>
      <Menu
        model={items}
        popup
        ref={menu}
        id="popup_menu_right"
        popupAlignment="right"
      />
    </>
  );
}
