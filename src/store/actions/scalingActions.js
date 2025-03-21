import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { showToastAction } from "../slices/commonSlice";
import { setAutoScalings } from "../slices/projectSlice";

const createAutoScalingAction = (data, next) => async (dispatch) => {
  const { name, namespace, min, max, threshold, vmpool } = data;

  const payload = {
    apiVersion: "autoscaling/v2",
    kind: "HorizontalPodAutoscaler",
    metadata: {
      name: name,
      namespace: namespace,
      labels: {
        "kubevirt-manager.io/managed": "true",
      },
    },
    spec: {
      scaleTargetRef: {
        apiVersion: "pool.kubevirt.io/v1alpha1",
        kind: "VirtualMachinePool",
        name: vmpool,
      },
      minReplicas: min,
      maxReplicas: max,
      metrics: [
        {
          type: "Resource",
          resource: {
            name: "cpu",
            target: {
              type: "Utilization",
              averageUtilization: threshold,
            },
          },
        },
      ],
    },
  };

  const url = endPoints.CREATE_AUTO_SCALE({ namespace });

  const res = await api("post", url, payload);

  if (res?.kind) {
    if (res?.reason && res.reason === "AlreadyExists") {
      dispatch(
        showToastAction({
          type: "error",
          title: res.message,
        })
      );
    }
    next(res);
  }
};

const getAutoScalingGroups = () => async (dispatch) => {
  const url = endPoints.GET_AUTO_SCALES();
  const res = await api("get", url);
  console.log("items of scaling group____", res);
  if (res.kind === "HorizontalPodAutoscalerList") {
    const items = res.items.map((item) => {
      const metrics = item.status.currentMetrics;
      return {
        name: item.metadata.name,
        namespace: item.metadata.namespace,
        max: item.spec.maxReplicas,
        min: item.spec.minReplicas,
        vmpool: item.spec.scaleTargetRef.name,
        desired: item.status.desiredReplicas,
        current: item.status.currentReplicas,
        metric: metrics[0]?.resource?.name,
        threshold: item.spec.metrics[0].resource.target.averageUtilization,
        utilization: metrics == null ? 0 : metrics[0]?.resource?.current.averageUtilization,
      };
    });
    dispatch(setAutoScalings(items));
  }
};

const updateAutoScaleItemAction = (data, next) => async () => {
  const { name, namespace, min, max, threshold } = data;
  const url = endPoints.UPDATE_AUTO_SCALE({ name, namespace });

  const payload = {
    spec: {
      maxReplicas: max,
      metrics: [
        {
          resource: {
            name: "cpu",
            target: {
              averageUtilization: threshold,
              type: "Utilization",
            },
          },
          type: "Resource",
        },
      ],
      minReplicas: min,
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

  if (res?.kind && res.kind === "HorizontalPodAutoscaler") {
    if (next) next(res);
  }
};

const deleteAutoScaleItemAction =
  ({ name, namespace }, next) =>
  async (dispatch) => {
    const url = endPoints.UPDATE_AUTO_SCALE({ name, namespace });
    const res = await api("delete", url);

    console.log("Delete auto-scale item", res);
    if (next) next();
  };

export { createAutoScalingAction, getAutoScalingGroups, updateAutoScaleItemAction, deleteAutoScaleItemAction };
