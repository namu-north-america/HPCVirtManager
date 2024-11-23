import React, { useCallback, useEffect, useRef, useState } from "react";
import { CustomForm } from "../../../shared/AllInputs";
import YamlEditor from "../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setYamlString } from "../../../store/slices/vmSlice";
import jsYaml from "js-yaml";

export default function Advanced({ data, handleChange, onValidate }) {
  const dispatch = useDispatch();
  const { updatedYamlString } = useSelector((state) => state.vm);
  const [yamlDataObject, setYamlObject] = useState();
  const initChange = useRef(true);

  const onChange = useCallback((value, yamlDataObject) => {
    if (initChange.current) {
      initChange.current = false;
    } else {
      dispatch(setYamlString(value));
    }
    setYamlObject(yamlDataObject);
  }, []);

  useEffect(() => {
    return () => {
      if (handleChange && yamlDataObject) {
        const newData = {
          name: yamlDataObject.metadata?.name,
          namespace: yamlDataObject.metadata?.namespace,
          cores: yamlDataObject.spec?.template.spec.domain.cpu.cores,
          sockets: yamlDataObject.spec?.template.spec.domain.cpu.sockets,
          threads: yamlDataObject.spec?.template.spec.domain.cpu.threads,
          memory: yamlDataObject.spec?.template.spec.domain.resources.requests.memory,
          advanced: yamlDataObject,
        };
        handleChange({ ...data, ...newData });
      }
    };
  }, [yamlDataObject]);

  useEffect(() => {
    if (updatedYamlString) {
      const objectData = jsYaml.load(updatedYamlString);

      if (data.cores) objectData.spec.template.spec.domain.cpu.cores = parseInt(data.cores);
      if (data.sockets) objectData.spec.template.spec.domain.cpu.sockets = parseInt(data.sockets);
      if (data.threads) objectData.spec.template.spec.domain.cpu.threads = parseInt(data.threads);
      if (data.name) objectData.metadata.name = data.name;
      if (data.namespace) objectData.metadata.namespace = data.namespace;
      if (data.memory)
        objectData.spec.template.spec.domain.resources.requests.memory = parseInt(data.memory) + data.memoryType;

      const yamlString = jsYaml.dump(objectData, {
        noArrayIndent: true,
        styles: { "!!str": "plain", "!!null": "empty" },
      });

      dispatch(setYamlString(yamlString));
    }
  }, []);

  return (
    <CustomForm>
      <YamlEditor
        onChange={onChange}
        name="advanced"
        defaultValue={updatedYamlString}
        value={updatedYamlString}
        objectValue={yamlDataObject}
        onValidate={onValidate}
      />
    </CustomForm>
  );
}
