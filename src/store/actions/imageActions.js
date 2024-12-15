import api from "../../services/api";
import endPoints from "../../services/endPoints";
import { showToastAction } from "../slices/commonSlice";
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
const onAddImageAction =
  (data, setLoading, next) => async (dispatch, getState) => {
    try {
      let { project } = getState();

      let existingImages = project.images;

      let imageNameCheck = existingImages.find(
        (item) => item.name === data?.name && item.namespace === data?.namespace
      );
      if (imageNameCheck) {
        throw new Error(
          `Image ${data?.name} with name/namespace combination already exists!`
        );
      }

      setLoading(true);
      let url = endPoints.ADD_IMAGE({
        namespace: data.namespace,
      });

      let payload = {
        apiVersion: "cocktail-virt.io/v1",
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

      if (res?.status === "Failure") {
        throw new Error(res?.message);
      } else if (res?.kind) {
        dispatch(getImagesAction());
        next();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(
        showToastAction({
          type: "error",
          title: error.message,
        })
      );
    }
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
