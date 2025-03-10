import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import Grid, { Col } from "../../../../../shared/Grid";
import { useHasAccess } from "../../../../../utils/hooks";

export default function Step1ClusterDetails({ data, onChange }) {
  const namespace = useHasAccess();

  const k8sVersions = [
    { label: "v1.26.0", value: "v1.26.0" },
    { label: "v1.25.5", value: "v1.25.5" },
    { label: "v1.24.9", value: "v1.24.9" },
    { label: "v1.23.10", value: "v1.23.10" },
    { label: "v1.22.0", value: "v1.22.0" },
  ];

  const nodeVMImages = {
    "v1.26.0": "quay.io/capk/ubuntu-2004-container-disk:v1.26.0",
    "v1.25.5": "quay.io/capk/ubuntu-2004-container-disk:v1.25.5",
    "v1.24.9": "quay.io/capk/ubuntu-2004-container-disk:v1.24.9",
    "v1.23.10": "quay.io/capk/ubuntu-2004-container-disk:v1.23.10",
    "v1.22.0": "quay.io/capk/ubuntu-2004-container-disk:v1.22.0",
  };

  const handleChange = (field, value) => {
    if (field === "k8sVersion") {
      const defaultImage = nodeVMImages[value] || "";
      onChange({ ...data, [field]: value, nodeVMImage: defaultImage });
    } else {
      onChange({ ...data, [field]: value });
    }
  };

  return (
    <div className="p-4">
      <Grid>
        <Col size={6}>
          <div className="field">
            <label htmlFor="clusterName" className="block mb-2">
              Cluster Name *
            </label>
            <InputText
              id="clusterName"
              value={data.clusterName}
              onChange={(e) => handleChange("clusterName", e.target.value)}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={6}>
          <div className="field">
            <label htmlFor="namespace" className="block mb-2">
              Namespace *
            </label>
            <Dropdown
              id="namespace"
              value={data.namespace}
              onChange={(e) => handleChange("namespace", e.value)}
              options={namespace}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <InputTextarea
              id="description"
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="k8sVersion" className="block mb-2">
              Kubernetes Version *
            </label>
            <Dropdown
              id="k8sVersion"
              value={data.k8sVersion}
              onChange={(e) => handleChange("k8sVersion", e.value)}
              options={k8sVersions}
              className="w-full"
              required
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field">
            <label htmlFor="nodeVMImage" className="block mb-2">
              Node VM Image
            </label>
            <InputText
              id="nodeVMImage"
              value={data.nodeVMImage}
              onChange={(e) => handleChange("nodeVMImage", e.target.value)}
              className="w-full"
              readOnly // Make it readonly to ensure it changes with k8sVersion
            />
          </div>
        </Col>

        <Col size={12}>
          <div className="field-checkbox">
            <Checkbox
              inputId="installDashboard"
              checked={data.installDashboard}
              onChange={(e) => handleChange("installDashboard", e.checked)}
            />
            <label htmlFor="installDashboard" className="ml-2">
              Install Kubernetes Dashboard
            </label>
          </div>
        </Col>
      </Grid>
    </div>
  );
}
