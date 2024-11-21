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

function YamlEditor({ data, templateData = {} }) {
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
        defaultValue={templateData.template}
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
