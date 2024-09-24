// import api from "../../services/api";
import { authenticate, isAuthenticated } from "../../services/auth";
// import endPoints from "../../services/endPoints";
import { showToastAction } from "../slices/commonSlice";
import {
  setUserProfile,
  getUserProfile,
  setUserList,
} from "../slices/userSlice";
import api from "../../services/api";
import endPoints from "../../services/endPoints";

const onUserLoginAction = (data, loading, navigate) => async (dispatch) => {
  loading(true);

  // const res = await api("post", endPoints.LOGIN, data);
  const res = {
    email: "user@yopmail.com",
    password: "User@1234",
    firstName: "John",
    lastName: "Doe",
    token: "qwertyu",
    role: "admin",
    rememberMe: data.rememberMe,
  };

  if (data.email === res.email && data.password === res.password) {
    let user = {
      email: data.email,
      password: data.password,
      firstName: "John",
      lastName: "Doe",
      token: "qwertyu",
      role: "admin",
      rememberMe: data.rememberMe,
    };
    let token = res.token;
    authenticate(token, user, () => {
      dispatch(setUserProfile(user));
      if (isAuthenticated()) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    });
  } else if (data.email !== res.email) {
    // Call onGetUserSecretsAction here
    dispatch(onGetUserSecretsAction(data, loading, navigate));
  } else {
    dispatch(
      showToastAction({
        type: "error",
        title: "Email or password is invalid!",
      })
    );
  }
  loading(false);
};

const getProfileAction = () => async (dispatch) => {
  // const res = await api("get", endPoints.PROFILE);
  // data is store in local storage at login
  dispatch(getUserProfile());
};

const onGetUserSecretsAction =
  (data, loading, navigate) => async (dispatch) => {
    loading(true);
    let secretName = data.email.replace(/[@.]/g, "-");
    let url = endPoints.GET_USER_SECRET({
      namespace: "default",
      name: 'cocktail-'+secretName,
    });

    const res = await api("get", url);
    if (res?.status!=='Failure') {
      const decodeFromBase64 = Object.fromEntries(
        Object.entries(res.data).map(([key, value]) => [
          key,
          decodeURIComponent(atob(value)),
        ])
      );
      if (
        decodeFromBase64?.email === data.email &&
        decodeFromBase64?.password === data.password
      ) {
        const parts = decodeFromBase64.username.split(" ");
        const firstName = parts[0];
        const lastName = parts.length > 1 ? parts[1] : "";

        decodeFromBase64.firstName = firstName;
        decodeFromBase64.lastName = lastName;
        decodeFromBase64.token = "qwertyu";
        decodeFromBase64.rememberMe = data.rememberMe;
        let user = decodeFromBase64;

        let token = user.token;
        
        
        authenticate(token, decodeFromBase64, () => {
          dispatch(setUserProfile(user));
          if (isAuthenticated()) {
            navigate("dashboard");
          } else {
            navigate("/");
          }
        });
      }
    } else {
      dispatch(
        showToastAction({
          type: "error",
          title: "Email or password is invalid!",
        })
      );
    }
    loading(false);
  };

const onAddUserAction = (data) => async (dispatch) => {
  let url = endPoints.ADD_USER;
  let secretName = data.email.replace(/[@.]/g, "-");
  // Convert each value to Base64
  const base64Data = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      btoa(encodeURIComponent(value)),
    ])
  );
  let payload = {
    apiVersion: "v1",
    kind: "Secret",
    metadata: {
      name: "cocktail-"+secretName, // set on the base of last user
      namespace: "default", // always default namespace don`t change
    },
    data: base64Data,
  };
  const res = await api("post", url, payload);
  if (res?.kind === "Secret") {
    console.log("add user response", res);
    dispatch(
      showToastAction({
        type: "success",
        title: "User Created Successfully",
      })
    );
    dispatch(onGetUserALLAction());
  } else {
    console.log("add user error", res.message);
    dispatch(
      showToastAction({
        type: "error",
        title: "User Not Created! " + res.message,
      })
    );
  }
};

const onGetUserALLAction = () => async (dispatch) => {
  let url = endPoints.GET_USER_ALL;

  const res = await api("get", url);

  if (res?.kind === "SecretList") {
    console.log("all user list response", res);
    dispatch(setUserList(res.items));
  } else {
    console.log("all user list", res.message);
  }
};

const onDeleteUserAction = (data) => async (dispatch) => {
  let secretName = data.email.replace(/[@.]/g, "-");
  let url = endPoints.GET_USER_SECRET({
    namespace: "default",
    name: "cocktail-"+secretName,
  });

  const res = await api("delete", url);
  if (res?.kind === "Status") {
    console.log("delete user response", res);
    dispatch(
      showToastAction({
        type: "success",
        title: "User Deleted Successfully",
      })
    );
    dispatch(onGetUserALLAction());
  } else {
    console.log("delete user error", res.message);
    dispatch(
      showToastAction({
        type: "error",
        title: "User Not Deleted",
      })
    );
  }
};

export {
  onUserLoginAction,
  getProfileAction,
  onGetUserSecretsAction,
  onAddUserAction,
  onGetUserALLAction,
  onDeleteUserAction,
};
