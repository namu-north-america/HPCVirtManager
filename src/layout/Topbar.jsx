import React, { useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "../store/actions/userActions";
import { getImageUrl } from "../utils/commonFunctions";
import { ReactComponent as Logo } from "../assets/images/svg/Logo.svg";

export default function Topbar({ toggleSidebar }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  const { profile } = useSelector((state) => state.user);
  
  
  let username = profile?.firstName || "Loading...";
  let userimage = profile?.image;

  const getFirstCharacter = (name = "") => {
    let words = name.split(" ");
    let firstLetters = words.map((word) => word?.charAt(0).toUpperCase());
    firstLetters = firstLetters.slice(0, 2);
    return firstLetters;
  };
  return (
    <div className="layout-topbar px-4">
      <div className="flex w-6 ">
        <div
          className="my-auto cursor-pointer mr-2 lg:hidden"
          onClick={toggleSidebar}
        >
          <i className="pi pi-bars text-2xl"></i>
        </div>
        <div className="lg:hidden">
          <Logo style={{ width: "180px" }} />
        </div>
      </div>
      <div className="top-menu w-6">
        <div className="flex">
          {userimage ? (
            <Avatar
              image={getImageUrl(userimage)}
              shape="circle"
              className="my-auto"
            />
          ) : (
            <Avatar
              label={getFirstCharacter(profile?.firstName)}
              size="small"
              shape="circle"
              className="my-auto"
            />
          )}
          <div className="flex ml-2 my-auto ">
            <span className="username">{username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
