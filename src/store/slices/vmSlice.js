import { createSlice } from "@reduxjs/toolkit";
import template from "./vm-template.yaml";
import vmPoolTemplateCustomOption from "./vm-pool-template-custom-option.yaml";
import vmPoolTemplateInstanceType from "./vm-pool-template-instance-type.yaml";
import FedoraLogo from "../../assets/images/svg/fedora-logo.svg";
import UbuntuLogo from "../../assets/images/svg/ubuntu-logo.svg";
import WindowsLogo from "../../assets/images/svg/windows-logo.svg";
import RedHatLogo from "../../assets/images/svg/redhat-logo.svg";

export const yamlTemplate = template.replace(/:$/m, ": ");
export const yamlVmPoolTemplateCustomOption = vmPoolTemplateCustomOption.replace(/:$/m, ": ");
export const yamlVmPoolTemplateInstanceType = vmPoolTemplateInstanceType.replace(/:$/m, ": ");

const prebuiltTemplates = [
  { id: 1, name: "Fedora", logo: FedoraLogo, subtitle: "Linux Distribution", template: yamlTemplate },
  { id: 2, name: "Ubuntu", logo: UbuntuLogo, subtitle: "Linux Distribution", template: yamlTemplate },
  { id: 3, name: "Windows", logo: WindowsLogo, subtitle: "Windows Server", template: yamlTemplate },
  { id: 4, name: "RHEL", logo: RedHatLogo, subtitle: "Enterprise Linux", template: yamlTemplate },
];

const vmPoolTemplates = [
  { id: 1, name: "Custom", template: vmPoolTemplateCustomOption },
  { id: 2, name: "Instance Type", template: vmPoolTemplateInstanceType },
];

const initialState = {
  templates: prebuiltTemplates,
  selectedTemplate: {},
  useVmTemplate: false,
  updatedYamlString: "", // we are using this to store the last updated yaml data from the form
  vmPoolTemplates: vmPoolTemplates,
};

const vmSlice = createSlice({
  name: "vm",
  initialState,
  reducers: {
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
      state.updatedYamlString = action.payload.template;
      state.useVmTemplate = action.payload.template ? true : false;
    },
    setUpdatedYamlString: (state, action) => {
      state.updatedYamlString = action.payload;
    },
  },
});

export const { setTemplates, setSelectedTemplate, setUpdatedYamlString } = vmSlice.actions;

export const selectTemplates = (state) => state.vm.templates;
export const selectSelectedTemplate = (state) => state.vm.selectedTemplate;

export default vmSlice.reducer;
