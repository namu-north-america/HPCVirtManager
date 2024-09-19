// import api from "../../services/api";
import { authenticate, isAuthenticated } from "../../services/auth";
// import endPoints from "../../services/endPoints";
import { showToastAction } from "../slices/commonSlice";
import { setUserProfile } from "../slices/userSlice";

const onUserLoginAction = (data, loading, navigate) => async (dispatch) => {
  loading(true);
  // const res = await api("post", endPoints.LOGIN, data);
  const res = {
    email: "user@yopmail.com",
    password: "User@1234",
    firstName: "John",
    lastName: "Doe",
    token: "qwertyu",
  };

  if (data.email === res.email && data.password === res.password) {
    let user = {
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email,
    };
    let token = res.token;
    authenticate(token, data.rememberMe, () => {
      dispatch(setUserProfile(user));
      if (isAuthenticated()) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    });
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
  const res = {
    email: "user@yopmail.com",
    firstName: "John",
    lastName: "Doe",
  };

  dispatch(setUserProfile(res));
};

export { onUserLoginAction, getProfileAction };
