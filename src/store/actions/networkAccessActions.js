import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { setNetworkAccess } from "../slices/networkAccessSlice";

const createNetworkAccessAction = (data, next) => async (dispatch) => {
  const { name, namespace, ports, serviceType, targetResource } = data;

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

  const url = endPoints.CREATE_SERVICE({ namespace });
  const res = await api("post", url, payload);

  if (res) {
    if (next) next(res);
  }
};

const getNetworkAccessAction = () => async (dispatch) => {
  const url = endPoints.GET_SERVICES();

  const res = await api("get", url);
  console.log("items____", res);
  const items = res?.items?.map((item) => {
    const { spec, metadata, status } = item;
    const externalIP =
      spec.type === "LoadBalancer" && status?.loadBalancer?.ingress ? status.loadBalancer?.ingress[0]?.ip : "N/A";
    return {
      name: metadata.name,
      namespace: metadata.namespace,
      targetResource: spec.selector["kubevirt.io/domain"],
      serviceType: spec.type,
      clusterIP: spec.clusterIP,
      ports: spec.ports,
      externalIP: externalIP,
    };
  });

  dispatch(setNetworkAccess(items));
};

const deleteNetworkAccessAction =
  ({ name, namespace }, next) =>
  async (dispatch) => {
    const url = endPoints.DELETE_SERVICE({ name, namespace });

    const res = await api("delete", url);

    if (res) {
      dispatch(getNetworkAccessAction());
      if (next) next(res);
    }
  };

const updateNetworkAccessAction = (data, next) => async (dispatch) => {
  const { name, namespace, serviceType } = data;

  const url = endPoints.UPDATE_SERVICE({ name, namespace });

  const payload = {
    spec: {
      type: serviceType,
    },
  };

  const res = await api(
    "patch",
    url,
    payload,
    {},
    {
      "Content-Type": "application/merge-patch+json",
    }
  );

  if (res?.kind && res.kind === "Service") {
    dispatch(getNetworkAccessAction());
    if (next) next(res);
  }
};

export { createNetworkAccessAction, getNetworkAccessAction, deleteNetworkAccessAction, updateNetworkAccessAction };
