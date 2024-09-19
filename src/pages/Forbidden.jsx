import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="w-10 text-center pt-5 mx-auto">
      <h2>Forbidden</h2>

      <Link to="/">
        <Button label="Go To Home" className="w-3 mx-auto" />
      </Link>
    </div>
  );
}
