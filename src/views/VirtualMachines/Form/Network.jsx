import React, { useMemo } from "react";
import { CustomDropDown, CustomForm, CustomInput } from "../../../shared/AllInputs";
import { useSelector } from "react-redux";
import formValidation from "../../../utils/validations";

export default function Network({ data, onRemove, index, setNetworks, network }) {
  const { bindingModeDropdown, networksDropdown } = useSelector((state) => state.project);
  const { useVmTemplate } = useSelector((state) => state.vm);
  const networksOption = useMemo(() => ["podNetwork", ...networksDropdown]);

  const handleChangeNetwork = ({ name, value }) => {
    let formErrors = formValidation(name, value, network);
    // Don't validate cache if it's false (Automatic)
    // if (name === "cache" && value === false) {
    //   formErrors = {};
    // }
    // Reset errors when changing create type
    // if (name === "createType") {
    //   formErrors = {};
    // }
    setNetworks((prev) => {
      let arr = [...prev];
      arr[index][name] = value;
      arr[index]["formErrors"] = formErrors;
      return arr;
    });
  };
  return (
    <CustomForm>
      <CustomDropDown
        data={data}
        onChange={handleChangeNetwork}
        name="networkType"
        options={networksOption}
        required
        col={12}
      />

      <CustomDropDown
        data={data}
        onChange={handleChangeNetwork}
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
