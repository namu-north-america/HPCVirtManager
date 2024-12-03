import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import jsYaml from "js-yaml";
import { configureMonacoYaml } from "monaco-yaml";
import schema from "../assets/schemas/original-virtual-machine.json";

const yamlSchemaConfig = {
  schema,
  fileMatch: ["*"],
  uri: "http://json-schema.org/schema",
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

let current;

function YamlEditor({ defaultValue, onChange, onValidate, value, options = {}, customErrors = [] }) {
  const monacoRef = useRef(null);
  const [yamlDataObject, setYamlDataObject] = useState({});
  const [yaml, setYaml] = useState(defaultValue);
  const [errors, setErrors] = useState([]);

  const handleOnMount = useCallback((editor, monaco) => {
    if (!current) {
      monacoRef.current = configureMonacoYaml(monaco, {
        enableSchemaRequest: true,
        schemas: [yamlSchemaConfig],
      });
      current = monacoRef.current;
    } else {
      monacoRef.current = current;
    }
  }, []);

  const validate = (errors) => {
    setErrors(errors);
    console.log("errors___", errors);
    onValidate && onValidate(errors);
  };

  const parseYamlToObject = useCallback((yamlString) => {
    try {
      const jsonObject = jsYaml.load(yamlString, "utf8");
      setYamlDataObject(jsonObject);
      setYaml(yamlString);
      if (onChange) {
        onChange(yamlString, jsonObject);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    parseYamlToObject(yaml);
  }, [yaml]);

  useEffect(() => {
    if (typeof value === "object") {
      const yaml = jsYaml.dump(value);
      setYaml(yaml);
    } else setYaml(value);
  }, [value]);

  useEffect(() => {
    setErrors((prev) => [...prev, ...customErrors]);
  }, [...customErrors]);
  const errorsView = errors.map((error) => {
    return (
      <li className=" w-full">
        {error.startLineNumber}:{error.startColumn}
        {" > "}
        <span className="p-error">{error.message}</span>
      </li>
    );
  });
  return (
    <div className="editor">
      <Editor
        defaultValue={defaultValue}
        onMount={handleOnMount}
        language="yaml"
        theme="vs-dark"
        value={yaml}
        options={{ tabSize: 2, fontSize: 14, ...options }}
        onValidate={(value) => {
          validate(value);
        }}
        onChange={parseYamlToObject}
      />
      <ul className="flex flex-column gap-0">{errors.length ? errorsView : null}</ul>
    </div>
    // <small className="p-error">Fix errors of the Yaml template and go on!!</small>
  );
}

export default YamlEditor;
