import React from "react";
import { CustomForm } from "../../../shared/AllInputs";
import CustomCodeEditor from "../../../shared/CustomCodeEditor";

export default function Advanced({ data, handleChange }) {
  return (
    <CustomForm>
      <CustomCodeEditor data={data} onChange={handleChange} name="advanced" />
    </CustomForm>
  );
}
