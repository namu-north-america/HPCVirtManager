import React from "react";
import { getImageUrl } from "../utils/commonFunctions";

export default function ImageContainer({
  src = "",
  height = "200px",
  width = "100%",
}) {
  return (
    <div className="image-container" style={{ height, width }}>
      <img src={getImageUrl(src)} alt="" />
    </div>
  );
}
