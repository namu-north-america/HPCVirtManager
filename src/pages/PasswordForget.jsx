import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formValidation from "../utils/validations";
import { useDispatch } from "react-redux";
import { showFormErrors } from "../utils/commonFunctions";
import { isAuthenticated } from "../services/auth";
import { onForgetPasswordAction } from "../store/actions/userActions";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import {
  CustomForm,
  CustomInput,
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
    email: "",
  });

  const handleChange = ({ name, value }) => {
    const formErrors = formValidation(name, value, data);
    setData((prev) => ({ ...prev, [name]: value, formErrors }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (showFormErrors(data, setData)) {
      dispatch(onForgetPasswordAction(data, setLoading, navigate));
    }
  };

  return (
    <Layout title="Forget Password ">
      <CustomForm onSubmit={onSubmit} className="form">
        <CustomInput
          data={data}
          onChange={handleChange}
          name="email"
          required
          col="12"
        />
       
       
        <CustomButton
          onClick={onSubmit}
          loading={loading}
          extraClassNames="w-full my-4"
          label="Reset"
        />

        <div className="w-full text-center">
        Remember password?{" "}
          <Link className="link" to="/">
          Login here
          </Link>
        </div>
      </CustomForm>
    </Layout>
  );
}
