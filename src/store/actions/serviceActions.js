import api from "../../services/api";
import endPoints from "../../services/endPoints";

const createServiceAction = (data, next) => async (dispatch) => {
  const { name, namespace, ports, serviceType, targetResource } = data;
  console.log("data for services____", data);
  const payload = {
    apiVersion: "v1",
    kind: "Service",
    metadata: {
      name,
      namespace,
      labels: {
        "kubevirt.io/domain": targetResource,
        "kubevirt-manager.io/managed": "true",
      },
      annotations: {},
    },
    spec: {
      type: serviceType,
      ports,
      selector: {
        "kubevirt.io/domain": targetResource,
      },
    },
  };

  console.log("payload for the new service>>>>>", payload);
  const url = endPoints.CREATE_SERVICE({ namespace });
  const res = await api("post", url, payload);

  console.log("response", res);
  if (res) {
    if (next) next(res);
  }
};

export { createServiceAction };
