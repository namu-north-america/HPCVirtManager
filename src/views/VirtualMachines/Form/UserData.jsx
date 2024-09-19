import React from "react";
import { CustomForm, CustomInput } from "../../../shared/AllInputs";

export default function UserData({ data, handleChange }) {
  return (
    <CustomForm>
      <CustomInput
        data={data}
        onChange={handleChange}
        name="userName"
        required
        col={12}
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="password"
        required
        col={12}
      />
    </CustomForm>
  );
}
