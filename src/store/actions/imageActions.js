import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { setImages } from "../slices/projectSlice";

const getImagesAction = () => async (dispatch) => {
  const res = await api("get", endPoints.IMAGES);
  let items = [];
  if (res?.items) {
    items = res.items.map((item) => ({
      id: item?.metadata?.uid,
      name: item?.metadata?.name,
      namespace: item?.metadata?.namespace,
      readableName: item?.spec?.readableName,
      readableDescription: item?.spec?.readableDescription,
      type: item?.spec?.type,
      url: item?.spec[item?.spec?.type]?.url,
      time: item?.metadata?.creationTimestamp,
    }));
  }

  dispatch(setImages(items));
};
const onAddImageAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let url = endPoints.ADD_IMAGE({
    namespace: data.namespace,
  });

  let payload = {
    apiVersion: "kubevirt-manager.io/v1",
    kind: "Image",
    metadata: {
      name: data?.name,
      namespace: data?.namespace,
    },
    spec: {
      type: data?.type,
      readableName: data?.readableName,
      readableDescription: data?.readableDescription,
      [data?.type]: {
        url: data?.url,
      },
    },
  };

  const res = await api("post", url, payload);
  if (res?.kind) {
    dispatch(getImagesAction());
    next();
  }
  setLoading(false);
};
const onEditImageAction = (data, setLoading, next) => async (dispatch) => {
  setLoading(true);
  let payload = {
    spec: {
      type: data?.type,
      readableName: data?.readableName,
      readableDescription: data?.readableDescription,
      [data?.type]: {
        url: data?.url,
      },
    },
  };
  let res = await api(
    "patch",
    endPoints.UPDATE_IMAGE(data),
    payload,
    {},
    {
      "Content-Type": "application/merge-patch+json",
    }
  );

  if (res?.kind) {
    dispatch(getImagesAction());
    next(res?.metadata);
  }
  setLoading(false);
};
const onDeleteImageAction = (data) => async (dispatch) => {
  let url = endPoints.DELETE_IMAGE({
    namespace: data.namespace,
    name: data.name,
  });
  const res = await api("delete", url);
  if (res.status) {
    dispatch(getImagesAction());
  }
};
export {
  getImagesAction,
  onAddImageAction,
  onEditImageAction,
  onDeleteImageAction,
};
