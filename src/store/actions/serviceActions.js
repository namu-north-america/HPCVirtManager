import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { setServices } from "../slices/servicesSlice";

const createServiceAction = (data, next) => async (dispatch) => {
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

const getServicesAction = () => async (dispatch) => {
  const url = endPoints.GET_SERVICES();

  const res = await api("get", url);

  const items = res.items.map((item) => {
    return {
      name: item.metadata.name,
      namespace: item.metadata.namespace,
      targetResource: item.spec.selector["kubevirt.io/domain"],
      serviceType: item.spec.type,
      clusterIP: item.spec.clusterIP,
      ports: item.spec.ports,
    };
  });

  dispatch(setServices(items));
};

const deleteServiceAction =
  ({ name, namespace }, next) =>
  async (dispatch) => {
    const url = endPoints.DELETE_SERVICE({ name, namespace });

    const res = await api("delete", url);

    if (res) {
      dispatch(getServicesAction());
      if (next) next(res);
    }
  };

const updateServiceAction = (data, next) => async (dispatch) => {
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
    dispatch(getServicesAction());
    if (next) next(res);
  }
};

export { createServiceAction, getServicesAction, deleteServiceAction, updateServiceAction };
