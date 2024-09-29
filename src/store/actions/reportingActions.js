
import { showToastAction } from "../slices/commonSlice";
import prometheusApi from "../../services/prometheusApi"
import endPoints from "../../services/endPoints";





const onGetStorageAction = () => async (dispatch) => {
  

  const res = await prometheusApi("get", '/api/v1/query?query=node_filesystem_avail_bytes');
  if (res?.status === "success") {
   console.log("prometheusApi",res);
   
  } else {
    console.log("delete user error", res);
    dispatch(
      showToastAction({
        type: "error",
        title: "User Not Deleted",
      })
    );
  }
};

export {
 
  onGetStorageAction,
  
};
