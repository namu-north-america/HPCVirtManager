import React, { useCallback, useEffect, useRef, useState } from "react";
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

window.MonacoEnvironment = {
  getWorker(moduleId, label) {
    switch (label) {
      case "editorWorkerService":
        return new Worker(new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url));
      case "yaml":
        return new Worker(new URL("monaco-yaml/yaml.worker", import.meta.url));
      default:
        throw new Error(`Unknown label ${label}`);
    }
  },
};

function YamlEditor({ data, templateData = {}, onChange }) {
  const monacoRef = useRef(null);
  const [yamlDataObject, setYamlDataObject] = useState({});
  const [yaml, setYaml] = useState(templateData.template);
  // const project = useSelector((state) => state.project);

  const handleOnMount = useCallback((editor, monaco) => {
    monacoRef.current = configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [yamlSchemaConfig],
    });
  }, []);

  const parseYamlToObject = useCallback((yamlString) => {
    try {
      const jsonObject = jsYaml.load(yamlString, "utf8");
      setYamlDataObject(jsonObject);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    parseYamlToObject(templateData.template);
  }, [templateData]);

  useEffect(() => {
    const newData = {
      name: yamlDataObject.metadata?.name,
      namespace: yamlDataObject.metadata?.namespace,
      cores: yamlDataObject.spec?.template.spec.domain.cpu.cores,
      sockets: yamlDataObject.spec?.template.spec.domain.cpu.sockets,
      threads: yamlDataObject.spec?.template.spec.domain.cpu.threads,
    };

    for (const name in newData) {
      onChange({ name, value: newData[name] });
    }
  }, [yamlDataObject]);

  return (
    <div className="editor">
      <Editor
        defaultValue={templateData.template}
        onMount={handleOnMount}
        language="yaml"
        theme="vs-dark"
        value={yaml}
        options={{ tabSize: 2 }}
        onValidate={(value) => {}}
        onChange={parseYamlToObject}
      />
    </div>
  );
}

export default YamlEditor;
