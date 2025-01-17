import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { CustomForm } from "../../../../shared/AllInputs";
import YamlEditor from "../../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatedYamlString, yamlTemplate } from "../../../../store/slices/vmSlice";
import jsYaml from "js-yaml";
import { updateYamlString, syncYamlStringToForms } from "./helpers";

export default function Advanced({ data, setDisks, disks, handleChange, onValidate, networks, isVmPool }) {
  const dispatch = useDispatch();
  const { updatedYamlString, useVmTemplate } = useSelector((state) => state.vm);
  const project = useSelector((state) => state.project);
  const yamlDataObjectRef = useRef();
  const [errors, setErrors] = useState([]);
  const initChange = useRef(true);

  const onChange = useCallback((value, yamlDataObject) => {
    if (initChange.current) {
      initChange.current = false;
    } else {
      dispatch(setUpdatedYamlString(value));
    }
    yamlDataObjectRef.current = yamlDataObject;
  }, []);



  useEffect(() => {
    return () => {
      const yamlDataObject = yamlDataObjectRef.current;

      if (handleChange && yamlDataObject) {
        syncYamlStringToForms({ yamlDataObject, project, data, setDisks, handleChange });
      }
    };
  }, [setDisks, handleChange]);

  // Here we fill the Yaml template with values from `data` and `disks`
  useEffect(() => {
    let yaml = "";
    // !updatedYamlString && !useVmTemplate ? yamlTemplate: updatedYamlString;
    if (!updatedYamlString && !useVmTemplate) {
      yaml = yamlTemplate;
    } else {
      yaml = updatedYamlString;
    }

    const objectData = jsYaml.load(yaml);

    // Basic settings form values
    const yamlString = updateYamlString({
      data,
      objectData,
      useVmTemplate,
      networks,
      disks,
      project,
      setErrors,
      errors,
    });

    dispatch(setUpdatedYamlString(yamlString));
  }, []);

  return (
    <CustomForm>
      {updatedYamlString && (
        <YamlEditor
          onChange={onChange}
          name="advanced"
          defaultValue={updatedYamlString}
          value={updatedYamlString}
          objectValue={yamlDataObjectRef.current}
          onValidate={onValidate}
          customErrors={errors}
        />
      )}
      {/* <div style={{ padding: 10 }}>somet</div> */}
    </CustomForm>
  );
}
