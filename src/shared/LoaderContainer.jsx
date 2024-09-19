import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { useSelector } from "react-redux";

export default function LoaderContainer() {
  let { isLoading } = useSelector((state) => state.common);
  return (
    <>
      {isLoading ? (
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="8"
          animationDuration="1s"
        />
      ) : null}
    </>
  );
}
