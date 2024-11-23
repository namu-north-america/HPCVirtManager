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

function YamlEditor({ defaultValue, onChange, onValidate }) {
  const monacoRef = useRef(null);
  const [yamlDataObject, setYamlDataObject] = useState({});
  const [yaml, setYaml] = useState(defaultValue);
  const [errors, setErrors] = useState([]);
  // const project = useSelector((state) => state.project);

  const handleOnMount = useCallback((editor, monaco) => {
    monacoRef.current = configureMonacoYaml(monaco, {
      enableSchemaRequest: true,
      schemas: [yamlSchemaConfig],
    });
  }, []);

  const validate = (errors) => {
    setErrors(errors);
    onValidate(errors);
  };

  const parseYamlToObject = useCallback((yamlString) => {
    try {
      const jsonObject = jsYaml.load(yamlString, "utf8");
      setYamlDataObject(jsonObject);
      setYaml(yamlString);
      onChange(yamlString, jsonObject);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    parseYamlToObject(yaml);
  }, [yaml]);

  useEffect(() => {}, []);
  return (
    <div className="editor">
      <Editor
        defaultValue={defaultValue}
        onMount={handleOnMount}
        language="yaml"
        theme="vs-dark"
        value={yaml}
        options={{ tabSize: 2 }}
        onValidate={(value) => {
          validate(value);
        }}
        onChange={parseYamlToObject}
      />
      <div>{errors.length ? <small className="p-error">Fix errors of the Yaml template and go on!!</small> : null}</div>
    </div>
  );
}

export default YamlEditor;
