import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { CustomForm } from "../../../../shared/AllInputs";
import YamlEditor from "../../../../shared/YamlEditor";
import { useDispatch, useSelector } from "react-redux";
import { setUpdatedYamlString, yamlTemplate } from "../../../../store/slices/vmSlice";
import jsYaml from "js-yaml";
import { updateYamlString } from "./helpers";

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

  const getMemoryParts = (memoryString) => {
    const match = (memoryString || "").match(/(\d+)(\D+)/);
    if (match) {
      return { size: match[1], unit: match[2] };
    }
    return { size: null, unit: null };
  };

  useEffect(() => {
    return () => {
      const yamlDataObject = yamlDataObjectRef.current;

      if (handleChange && yamlDataObject) {
        const name = yamlDataObject.metadata?.name || data.name;
        const namespace = yamlDataObject.metadata?.namespace || data.namespace;

        const newData = {
          name,
          namespace,
          cores: yamlDataObject.spec?.template?.spec?.domain?.cpu?.cores || data.cores,
          sockets: yamlDataObject.spec?.template?.spec?.domain?.cpu?.sockets || data.sockets,
          threads: yamlDataObject.spec?.template?.spec?.domain?.cpu?.threads || data.threads,
          advanced: yamlDataObject,
        };

        const memory = yamlDataObject.spec?.template?.spec?.domain?.resources?.requests?.memory;
        const memoryParts = getMemoryParts(memory);

        data.memory = memoryParts.size;
        data.memoryType = memoryParts.unit;

        const userDataAndNetwork = yamlDataObject.spec?.template?.spec?.volumes.at(-1).cloudInitNoCloud;
        const userData = jsYaml.load(userDataAndNetwork?.userData);

        if (userData) {
          data.userName = userData.user;
          data.password = userData.password;
        }
        console.log("data is ____", data);
        handleChange({ ...data, ...newData });

        if (setDisks && yamlDataObject) {
          const dataVolumeTemplates = yamlDataObject.spec.dataVolumeTemplates;

          if (dataVolumeTemplates.length) {
            const deviceDisks = yamlDataObject.spec.template.spec.domain.devices.disks;
            const volumes = yamlDataObject.spec.template.spec.volumes;

            const newOrImageDisks = dataVolumeTemplates.map((template, i) => {
              const templateName = template.metadata.name;
              const storage = template.spec.pvc;
              const storageClass = storage.storageClassName;
              const storageSize = storage.resources?.requests?.storage;
              const accessModes = storage.accessModes ? storage.accessModes[0] : "";
              const source = template.spec.source;
              const storageParts = getMemoryParts(storageSize);
              /*
               * Based on this documentation about Disks and Volumes
               * We should find a device from this path
               *  "template" -> "volumes" => "devices.disks"
               *
               * https://kubevirt.io/user-guide/storage/disks_and_volumes/
               */
              const volume = volumes.find((vol) => vol.dataVolume?.name == templateName);
              const deviceDisk = deviceDisks.find((disk) => volume?.name === disk.name);

              /**
               * We should find the createType based on images' state
               * if an image exists with this url and type then this disk is
               * using an image
               */
              let image = project.images.find((item) => {
                return item.namespace === namespace && source[item?.type] && source[item.type].url === item.url;
              });

              let sourceType;
              let url;
              if (image) {
                sourceType = "http";
                url = image.url;
              } else {
                sourceType = Object.keys(source)[0];
                url = source[sourceType]?.url;
              }

              return {
                createType: image ? "image" : "new",
                diskType: "disk",
                busType: deviceDisk?.disk?.bus,
                memoryType: storageParts.unit,
                size: storageParts.size || "",
                storageClass: storageClass,
                accessMode: accessModes || "",
                image: image ? image.name : "",
                disk: "",
                type: sourceType,
                url: url,
              };
            });

            setDisks(newOrImageDisks);
          }
        }
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
