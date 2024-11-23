import { createSlice } from "@reduxjs/toolkit";
import FedoraLogo from "../../assets/images/svg/fedora-logo.svg";
import UbuntuLogo from "../../assets/images/svg/ubuntu-logo.svg";
import WindowsLogo from "../../assets/images/svg/windows-logo.svg";
import RedHatLogo from "../../assets/images/svg/redhat-logo.svg";

export const yamlTemplate = `
apiVersion: kubevirt.io/v1alpha3
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
          sockets: 1
          threads: 3
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
      nodeSelector:
        kubernetes.io/hostname:
`.replace(/:$/m, ": ");

const prebuiltTemplates = [
  { id: 1, name: "Fedora", logo: FedoraLogo, subtitle: "Linux Distribution", template: yamlTemplate },
  { id: 2, name: "Ubuntu", logo: UbuntuLogo, subtitle: "Linux Distribution", template: yamlTemplate },
  { id: 3, name: "Windows", logo: WindowsLogo, subtitle: "Windows Server", template: yamlTemplate },
  { id: 4, name: "RHEL", logo: RedHatLogo, subtitle: "Enterprise Linux", template: yamlTemplate },
];

const initialState = {
  templates: prebuiltTemplates,
  selectedTemplate: {},
  updatedYamlString: "",
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
    },
    setYamlString: (state, action) => {
      state.updatedYamlString = action.payload;
    },
  },
});

export const { setTemplates, setSelectedTemplate, setYamlString } = vmSlice.actions;

export const selectTemplates = (state) => state.vm.templates;
export const selectSelectedTemplate = (state) => state.vm.selectedTemplate;

export default vmSlice.reducer;
