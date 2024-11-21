import React from "react";
import { CustomForm } from "../../../shared/AllInputs";
import CustomCodeEditor from "../../../shared/CustomCodeEditor";
import YamlEditor from "../../../shared/YamlEditor";

export default function Advanced({ data, handleChange, template }) {
  return (
    <CustomForm>
      <YamlEditor data={data} onChange={handleChange} name="advanced" templateData={template} />
    </CustomForm>
  );
}
