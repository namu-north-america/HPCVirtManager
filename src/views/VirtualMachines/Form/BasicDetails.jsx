import React,{useState,useEffect,useCallback} from "react";
import {
  CustomDropDown,
  CustomForm,
  CustomInput,
  CustomMemoryInput,
} from "../../../shared/AllInputs";
import { filterNamespacesByCrudVMS } from "../../../utils/commonFunctions";
import {  useSelector } from "react-redux";

export default function BasicDetails({ data, handleChange, ...rest }) {
  
  const [namespace,setNamespace]= useState([])
  const { namespacesDropdown, priorityClassesDropdown, nodesDropdown } =
    useSelector((state) => state.project);
  const { profile,userNamespace } = useSelector((state) => state.user);
  const { useVmTemplate } = useSelector(state => state.vm);

  const hasAccess = useCallback(() => {
    if (profile?.role === "admin") {
      setNamespace(namespacesDropdown);
    } else {
      const filteredNamespaces = filterNamespacesByCrudVMS(namespacesDropdown, userNamespace);
      const namespaceArray = filteredNamespaces.map(item => item.namespace);
      setNamespace(namespaceArray);
    }
  }, [profile, namespacesDropdown, userNamespace]);
    // create hasAccess dispatch
  useEffect(() => {
    hasAccess()
  }, [hasAccess]);
    
  return (
    <CustomForm {...rest}>
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
        options={namespace}
        required
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="sockets"
        keyfilter="pint"
        disabled={useVmTemplate}
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
        disabled={useVmTemplate}
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
        disabled={useVmTemplate}
      />
    </CustomForm>
  );
}
