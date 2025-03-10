import React, { useState, useEffect } from "react";
import { CustomDropDown, CustomForm, CustomInput, CustomMemoryInput } from "../../../shared/AllInputs";
import { useHasAccess } from "../../../utils/hooks";
import { useSelector } from "react-redux";


export default function BasicDetails({ data, handleChange, isVmPool, ...rest }) {

  const namespace = useHasAccess();
  // const { namespacesDropdown, instanceTypes } = useSelector((state) => state.project);
  // const { profile, userNamespace } = useSelector((state) => state.user);
  const { instanceTypes } = useSelector((state) => state.project);
  const { useVmTemplate } = useSelector((state) => state.vm);
  const [virtualMachineTypes, setVirtualMachineTypes] = useState([]);

  useEffect(() => {
    setVirtualMachineTypes(["custom", ...instanceTypes.map((item) => item.name)]);
  }, [isVmPool, instanceTypes]);

  return (
    <CustomForm {...rest}>
      <CustomInput data={data} onChange={handleChange} name="name" required col={12} />
      <CustomDropDown
        data={data}
        options={virtualMachineTypes}
        onChange={handleChange}
        name="virtualMachineType"
        label="Virtual Machine Type"
        required
      />
      <CustomDropDown data={data} onChange={handleChange} name="namespace" options={namespace} required />
      {data.virtualMachineType === "custom" && (
        <>
          <CustomInput
            data={data}
            onChange={handleChange}
            name="sockets"
            keyfilter="pint"
            disabled={useVmTemplate}
            required
          />
          <CustomInput data={data} onChange={handleChange} name="cores" keyfilter="pint" required />
          <CustomInput
            data={data}
            onChange={handleChange}
            name="threads"
            keyfilter="pint"
            required
            disabled={useVmTemplate}
          />
          <CustomMemoryInput
            value={data.memory}
            onChange={handleChange}
            name="memory"
            onTypeChange={handleChange}
            typeName="memoryType"
            label="Memory"
            keyfilter="pint"
            col={12}
            required
          />
        </>
      )}
      {isVmPool && <CustomInput data={data} onChange={handleChange} name="replicas" required col={12} />}
    </CustomForm>
  );
}
