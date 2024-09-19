import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formValidation from "../utils/validations";
import { useDispatch } from "react-redux";
import { showFormErrors } from "../utils/commonFunctions";
import { isAuthenticated } from "../services/auth";
import { onUserLoginAction } from "../store/actions/userActions";
import Layout from "./Layout";
import {
  CustomForm,
  CustomInput,
  CustomPassword,
  CustomSwitch,
} from "../shared/AllInputs";
import CustomButton from "../shared/CustomButton";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "user@yopmail.com",
    password: "User@1234",
    rememberMe: true,
  });

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(onUserLoginAction(data, setLoading, navigate));
    }
  };

  return (
    <Layout title="Login Here ">
      <CustomForm onSubmit={onSubmit} className="form">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="email"
          required
          col="12"
        />
        <CustomPassword
          data={data}
          onChange={handleChange}
          name="password"
          required
          col="12"
        />
        <CustomSwitch
          data={data}
          onChange={handleChange}
          name="rememberMe"
          label="Remember Me"
        />
        <div className="col-6 flex justify-content-end my-auto">
          <span className="link" to="/forget-password">
            Forgot password?
          </span>
        </div>
        <CustomButton
          onClick={onSubmit}
          loading={loading}
          extraClassNames="w-full my-4"
          label="Sign in"
        />

        <div className="w-full text-center">
          Don’t have an account?{" "}
          <span className="link" to="/register">
            Sign up now
          </span>
        </div>
      </CustomForm>
    </Layout>
  );
}
