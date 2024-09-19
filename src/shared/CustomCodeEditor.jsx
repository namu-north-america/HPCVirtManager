import React from "react";
import Editor from "@monaco-editor/react";
import InputLayout from "./InputLayout";

export default function CustomCodeEditor({
  name,
  data,
  value,
  onChange,
  col = 12,
  height = "400px",
}) {
  return (
    <InputLayout col={col}>
      <Editor
        height={height}
        defaultValue={value || data?.[name] || ""}
        defaultLanguage="json"
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
        }}
        onChange={(value) => {
          onChange && onChange({ name, value });
        }}
      />
    </InputLayout>
  );
}
