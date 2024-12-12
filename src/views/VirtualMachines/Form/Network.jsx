import React from "react";
import { CustomDropDown, CustomForm, CustomInput } from "../../../shared/AllInputs";
import { useSelector } from "react-redux";

export default function Network({ data, handleChange, onRemove, index }) {
  const { bindingModeDropdown, networksDropdown } = useSelector((state) => state.project);
  const { useVmTemplate } = useSelector((state) => state.vm);

  return (
    <CustomForm>
      <CustomDropDown
        data={data}
        onChange={handleChange}
        name="networkType"
        options={networksDropdown}
        required
        col={12}
      />
     
      <CustomDropDown
        data={data}
        onChange={handleChange}
        name="bindingMode"
        options={bindingModeDropdown}
        required
        col={12}
      />
      {index ? (
        <div className="flex justify-content-end">
          <span className="mr-3 cursor-pointer" onClick={() => onRemove(index)}>
            <i className="pi pi-trash"></i> Remove
          </span>
        </div>
      ) : null}
    </CustomForm>
  );
}
