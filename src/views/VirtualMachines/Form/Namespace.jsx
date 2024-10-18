import React, { useEffect, useRef, useState } from "react";
import {
  CustomDropDown,
  CustomCheckbox,
  CustomForm,
  CustomInput,
  CustomMemoryInput,
} from "../../../shared/AllInputs";
import { useSelector } from "react-redux";
import formValidation from "../../../utils/validations";
import { confirmPopup } from "primereact/confirmpopup";

export default function Namespace({
  nameSpace,
  setNameSpace,
  index,
}) {
  const { namespacesDropdown } = useSelector((state) => state.project);

  const handleChangeDisk = ({ name, value }) => {
    console.log(name, value);
    console.log("log",nameSpace);

    let formErrors = formValidation(name, value, nameSpace);
    if (name === "userManagement" && value) {
      formErrors = {};
    }
    
    setNameSpace((prev) => {
      let arr = [...prev];
       if(name === "userManagement" && value === true){
        arr[index]["userCustom"] = false;
      }else if(name === "userCustom" && value === true){
        arr[index]["userManagement"] = false;
      }
      
      arr[index][name] = value;
      arr[index]["formErrors"] = formErrors;
      return arr;
    });
  };

  

  return (
    <>
      <CustomDropDown
        onChange={handleChangeDisk}
        data={nameSpace}
        name="namespace"
        options={namespacesDropdown}
        required
        col={12}
      />
      <CustomCheckbox
        data={nameSpace}
        name="userManagement"
        col={12}
        label="Grant All Permissions"
        onChange={handleChangeDisk}
      />
      <CustomCheckbox
        data={nameSpace}
        name="userCustom"
        col={12}
        label="Customize Permission"
        onChange={handleChangeDisk}
      />
      {(nameSpace.userCustom)&&(<div className="ml-3">
        <CustomCheckbox
          data={nameSpace}
          name="viewVMs"
          col={12}
          label="View VMs"
          onChange={handleChangeDisk}
        />
        <CustomCheckbox
          data={nameSpace}
          name="crudVMS"
          col={12}
          label="Create/Edit/Migrate/Delete VMs"
          onChange={handleChangeDisk}
        />
        <CustomCheckbox
          data={nameSpace}
          name="viewDataVolume"
          col={12}
          label=" View Data Volumes"
          onChange={handleChangeDisk}
        />
        <CustomCheckbox
          data={nameSpace}
          name="crudDataVolume"
          col={12}
          label="Create/Resize/Delete Data Volumes"
          onChange={handleChangeDisk}
        />
        <CustomCheckbox
          data={nameSpace}
          name="crudImage"
          col={12}
          label="Create/Edit/Delete Image"
          onChange={handleChangeDisk}
        />
      </div>)}
    </>
  );
}
