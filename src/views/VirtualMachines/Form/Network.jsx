import React from "react";
import {
  CustomDropDown,
  CustomForm,
  CustomInput,
} from "../../../shared/AllInputs";
import { useSelector } from "react-redux";

export default function Network({ data, handleChange }) {
  const { bindingModeDropdown } = useSelector((state) => state.project);
  return (
    <CustomForm>
      <CustomInput data={data} name="networkType" required col={12} />
      <CustomDropDown
        data={data}
        onChange={handleChange}
        name="bindingMode"
        options={bindingModeDropdown}
        required
        col={12}
      />
    </CustomForm>
  );
}
