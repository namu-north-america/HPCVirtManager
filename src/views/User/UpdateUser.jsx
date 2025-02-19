import React, { useEffect, useRef, useState } from "react";
import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";

import Grid from "../../shared/Grid";
import { useDispatch, useSelector } from "react-redux";

import { confirmDialog } from "primereact/confirmdialog";

import {
  onGetUserDetailAction,
  onUpdateUserAction,
} from "../../store/actions/userActions";
import { CustomForm, CustomInput } from "../../shared/AllInputs";
import CustomButton, { Buttonlayout } from "../../shared/CustomButton";

export default function EditUser() {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
    email: "",
    status: "",
    department: "",
    password: "",
  });

  const breadcrumItems = [
    { label: "Users", url: "/#/users" },

    { label: "Profile", url: `/#/users/profile` },
  ];

  const ref = useRef();

  const { profile } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (!profile.hasOwnProperty("email")) return;
    if (profile.email !== "user@yopmail.com") {
      onInitialLoad();
    } else {
      setData({
        name: profile?.firstName + " " + profile?.lastName,
        email: profile?.email,
        password: "",
      });
      setName(profile?.firstName + " " + profile?.lastName);
    }

    console.log("profile", profile);
    // eslint-disable-next-line
  }, [profile]);

  const onInitialLoad = () => {
    dispatch(onGetUserDetailAction({ email: profile.email })).then((res) => {
      if (!res) {
        console.error("No response received from the API");
        return;
      }
      console.log("change page", res);
      if (res.status !== "Failure") {
        console.log("user", res);
        setUser(res);
        setData({
          name: res?.username,
          email: res?.email,
          password: res?.password,
        });
        setName(res?.username);
      }
    });
  };

  const onUpdate = (e) => {
    console.log("called");

    e.preventDefault();
    confirmDialog({
      target: ref.currentTarget,
      header: "User Update Confirmation",
      message: `Do you want to update User ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: " primary-button",
      accept: () => {
        user.username = data.name;
        user.email = data.email;
        user.password = data.password;
        console.log("updated", user);

        dispatch(onUpdateUserAction(user));
        onInitialLoad();
      },
    });
  };

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page title={name}>
        <Grid>
          <CustomForm>
            <CustomInput
              data={data}
              value={data.name}
              name="name"
              col={12}
              onChange={(e) => {
                setData({
                  ...data,
                  name: e.target.value,
                });
              }}
            />

            <CustomInput data={data} name="email" value={data.email} />
            <CustomInput
              data={data}
              value={data.password}
              onChange={(e) => {
                setData({
                  ...data,
                  password: e.target.value,
                });
              }}
              name="password"
              type="password"
            />

            <Buttonlayout>
              <CustomButton label="Update Data" onClick={onUpdate} />
            </Buttonlayout>
          </CustomForm>
        </Grid>
      </Page>
    </>
  );
}
