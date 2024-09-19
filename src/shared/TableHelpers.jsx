import React from "react";
import CustomOverlay from "./CustomOverlay";
import { timeAgo } from "../utils/date";
import { Link } from "react-router-dom";

export const longOverlayText = (obj, key, size = 20) => {
  let _longText = obj?.[key];
  let _text = "";
  if (_longText?.length > size) {
    _text = _longText.slice(0, size) + "...";
  } else {
    _text = _longText;
  }
  return (
    <CustomOverlay template={<span className="cursor-pointer">{_text}</span>}>
      <p className="p-2">{_longText}</p>
    </CustomOverlay>
  );
};

export const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
};
export const nameTemplate = (item) => {
  return <Link className="link">{item.name}</Link>;
};
