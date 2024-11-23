import React, { useEffect } from "react";
import { CustomForm } from "../../../shared/AllInputs";
import YamlEditor from "../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setYamlString } from "../../../store/slices/vmSlice";

export default function Advanced({ data, handleChange, onValidate }) {
  const dispatch = useDispatch();
  const { updatedYamlString } = useSelector((state) => state.vm);

  const onChange = (value, yamlDataObject) => {
    dispatch(setYamlString(value));
    if (onChange && yamlDataObject) {
      const newData = {
        name: yamlDataObject.metadata?.name,
        namespace: yamlDataObject.metadata?.namespace,
        cores: yamlDataObject.spec?.template.spec.domain.cpu.cores,
        sockets: yamlDataObject.spec?.template.spec.domain.cpu.sockets,
        threads: yamlDataObject.spec?.template.spec.domain.cpu.threads,
        memory: yamlDataObject.spec?.template.spec.domain.resources.requests.memory,
        advanced: yamlDataObject,
      };
      for (const name in newData) {
        handleChange({ name, value: newData[name] });
      }
    }
  };

  return (
    <CustomForm>
      <YamlEditor
        onChange={onChange}
        name="advanced"
        defaultValue={updatedYamlString}
        value={updatedYamlString}
        onValidate={onValidate}
      />
    </CustomForm>
  );
}
