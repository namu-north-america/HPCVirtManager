import React from "react";
import {
  CustomDropDown,
  CustomForm,
  CustomInput,
  CustomMemoryInput,
} from "../../../shared/AllInputs";
import { useSelector } from "react-redux";

export default function BasicDetails({ data, handleChange }) {
  const { namespacesDropdown, priorityClassesDropdown, nodesDropdown } =
    useSelector((state) => state.project);
  return (
    <CustomForm>
      <CustomDropDown
        data={data}
        onChange={handleChange}
        name="node"
        options={nodesDropdown}
        required
        col={12}
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="name"
        required
        col={12}
      />
      <CustomDropDown
        data={data}
        onChange={handleChange}
        name="namespace"
        options={namespacesDropdown}
        required
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="sockets"
        keyfilter="pint"
        required
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="cores"
        keyfilter="pint"
        required
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="threads"
        keyfilter="pint"
        required
      />
      <CustomMemoryInput
        data={data}
        onChange={handleChange}
        name="memory"
        onTypeChange={handleChange}
        typeName="memoryType"
        label="Memory"
        keyfilter="pint"
        col={12}
        required
      />
      <CustomDropDown
        data={data}
        onChange={handleChange}
        name="priorityClass"
        options={priorityClassesDropdown}
        col={12}
        required
      />
    </CustomForm>
  );
}
