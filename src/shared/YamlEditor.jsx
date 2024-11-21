import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import jsYaml from "js-yaml";
import { configureMonacoYaml } from "monaco-yaml";
import schema from "../assets/schemas/schema.json";

const yamlSchemaConfig = {
  schema,
  fileMatch: ["*"],
  uri: "https://github.com/remcohaszing/monaco-yaml/blob/HEAD/examples/demo/src/schema.json",
};

const yamlDefaultValue = `
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: vm-fedora
  namespace: default
spec:
  dataVolumeTemplates:
  - metadata:
     name: datavolume-iso
    spec:
      storage:
        accessModes:
        - ReadWriteOnce
        resources:
          requests:
            storage: 10Gi
        storageClassName: nfs-client
      source:
        http:
          url: https://download.fedoraproject.org/pub/fedora/linux/releases/41/Cloud/x86_64/images/Fedora-Cloud-Base-AmazonEC2-41-1.4.x86_64.raw.xz
  running: false
  template:
    metadata:
      labels:
        kubevirt.io/vm: vm-fedora
    spec:
      domain:
        cpu:
          cores: 2
        devices:
          disks:
          - disk:
              bus: virtio
            name: datavolume-iso
        machine:
          type: ""
        resources:
          requests:
            memory: 4G
      volumes:
      - dataVolume:
          name: datavolume-iso
        name: datavolume-iso
`.replace(/:$/m, ": ");

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case "editorWorkerService":
        return new Worker(
          new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url)
        );
      case "yaml":
        return new Worker(new URL("monaco-yaml/yaml.worker", import.meta.url));
      default:
        throw new Error(`Unknown label ${label}`);
    }
  },
};

function YamlEditor({ data }) {
  const monacoRef = useRef(null);
  const [yamlData, setYamlData] = useState({});
  const [yaml, setYaml] = useState("");
  // const project = useSelector((state) => state.project);

  const handleOnMount = useCallback((editor, monaco) => {
    monacoRef.current = configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [yamlSchemaConfig],
    });
  }, []);

  const yamlJsonReverse = (stringOrObject) => {};

  return (
    <div className="editor">
      <Editor
        defaultValue={yamlDefaultValue}
        onMount={handleOnMount}
        language="yaml"
        theme="vs-dark"
        value={yaml}
        options={{ tabSize: 2 }}
        onValidate={(value) => {}}
        onChange={(value, ev) => {
          try {
            const jsonObject = jsYaml.load(value, "utf8");
            setYamlData(jsonObject);
          } catch (err) {}
        }}
      />
    </div>
  );
}

export default YamlEditor;
