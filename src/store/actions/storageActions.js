import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { setStorageClasses, setDisks } from "../slices/projectSlice";
import { showToastAction } from "../../store/slices/commonSlice";

const getStorageClassesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.STORAGE_CLASSES);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  items = items.map((item) => ({
    id: 1,
    name: item?.metadata?.name,
    cluster: "-",
    provisioner: "-",
    time: item?.metadata?.creationTimestamp,
  }));
  dispatch(setStorageClasses(items));
};
const getDisksAction = () => async (dispatch) => {
  const res = await api("get", endPoints.STORAGE_DISKS);
  let items = [];
  if (res?.items) {
    items = res.items;
  }
  items = await Promise.all(
    items.map(async (item) => {
      let storage = await api(
        "get",
        endPoints.GET_STORAGE_DISK({
          namespace: item?.metadata?.namespace,
          name: item?.metadata?.name,
        })
      );

      return {
        id: item?.metadata?.uid,
        name: item?.metadata?.name,
        size: storage?.spec?.resources?.requests?.storage,
        namespace: item?.metadata?.namespace,
        status: item?.status?.phase,
        conditions:
          item?.status?.conditions[item?.status?.conditions?.length - 1]
            ?.message,
        storageClass: item?.spec?.pvc?.storageClassName,
        OSImageURL:
          item?.spec?.source?.http?.url ||
          item?.spec?.source?.registry?.url ||
          item?.spec?.source?.gcs?.url ||
          item?.spec?.source?.s3?.url,
        accessMode: item?.spec?.pvc?.accessModes[0],
        time: item?.metadata?.creationTimestamp,
      };
    })
  );
  dispatch(setDisks(items));
};

const onDiskResizeAction =
  ({ namespace, name, size, memoryType }, next) =>
  async (dispatch) => {
    let payload = {
      spec: {
        resources: {
          requests: {
            storage: `${size}${memoryType}`,
          },
        },
      },
    };
    let res = await api(
      "patch",
      endPoints.STORAGE_DISK_RESIZE({ namespace, name }),
      payload,
      {},
      {
        "Content-Type": "application/merge-patch+json",
      }
    );
    if (res?.status === "Failure") {
      if (res?.details?.causes) {
        res?.details?.causes?.forEach((element) => {
          dispatch(
            showToastAction({
              type: "error",
              title: element?.message,
            })
          );
        });
      }
    } else if (res?.kind) {
      dispatch(getDisksAction());
      next(res?.metadata);
    }
  };

const onAddDiskAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let url = endPoints.ADD_STORAGE_DISK({
    namespace: data.namespace,
    name: data.name,
  });

  let source = {
    [data?.type]: {},
  };

  if (data?.url) {
    source[data?.type]["url"] = data?.url;
  }

  let payload = {
    apiVersion: "cdi.kubevirt.io/v1beta1",
    kind: "DataVolume",
    metadata: {
      name: data.name,
      namespace: data.namespace,
      annotations: {
        "cdi.kubevirt.io/storage.deleteAfterCompletion": "false",
      },
      labels: {},
    },
    spec: {
      pvc: {
        storageClassName: data.storageClass,
        accessModes: [data.accessMode],
        resources: {
          requests: {
            storage: `${data.size}${data?.memoryType}`,
          },
        },
      },
      source,
    },
  };
  const res = await api("post", url, payload);

  if (res?.status === "Failure") {
    if (res?.details?.causes) {
      res?.details?.causes?.forEach((element) => {
        dispatch(
          showToastAction({
            type: "error",
            title: element?.message,
          })
        );
      });
    }
  } else if (res?.kind) {
    dispatch(getDisksAction());
    next(res?.metadata);
  }

  setLoading(false);
};

const onDeleteDiskAction = (data) => async (dispatch) => {
  let url = endPoints.DELETE_PERSISTENT_VOLUME_CLAIM({
    namespace: data.namespace,
    name: data.name,
  });
  await api("delete", url);
  let url1 = endPoints.DELETE_STORAGE_DISK({
    namespace: data.namespace,
    name: data.name,
  });
  const res1 = await api("delete", url1);
  if (res1.status) {
    dispatch(getDisksAction());
  }
};

export {
  getDisksAction,
  onDiskResizeAction,
  onAddDiskAction,
  onDeleteDiskAction,
  getStorageClassesAction,
};
