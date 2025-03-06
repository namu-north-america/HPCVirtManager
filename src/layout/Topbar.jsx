import React, { useEffect, useRef } from "react";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "../store/actions/userActions";
import { getNamespacesAction } from "../store/actions/projectActions";
import { getImageUrl } from "../utils/commonFunctions";
import { ReactComponent as Logo } from "../assets/images/svg/Logo.svg";
import { BreadCrumb } from "primereact/breadcrumb";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import keycloak from "../keycloak";

export default function Topbar({ toggleSidebar, isCollapsed }) {
  const dispatch = useDispatch();
  const { breadcrumbItems } = useBreadcrumb();
  const op = useRef(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProfileAction());
    dispatch(getNamespacesAction());
  }, [dispatch]);

  useEffect(() => {}, [breadcrumbItems]);

  const { profile } = useSelector((state) => state.user);

  let username =
    profile?.preferred_username || profile?.given_name || profile?.name || "Loading...";
  let userimage = profile?.image;

  const getFirstCharacter = (name = "") => {
    let words = name.split(" ");
    let firstLetters = words.map((word) => word?.charAt(0).toUpperCase());
    return firstLetters.slice(0, 2).join("");
  };

  const shouldShowBreadcrumbs =
    breadcrumbItems?.length > 0 && window.location.hash !== "#/dashboard";

  const topbarClass = classNames("layout-topbar", {
    collapsed: isCollapsed,
  });

  const showUserInfo = () => {
    op.current.hide();
    navigate("/users/profile");
  };

  const logoutUser = () => {
    op.current.hide();
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const handleOverlayMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (op.current) {
        op.current.hide();
      }
    }, 500);
  };

  const handleOverlayMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className={topbarClass}>
      <div className="flex align-items-center w-full">
        <div className="flex align-items-center">
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

        <div
          className="flex-grow-1 mx-3 flex align-items-center"
          style={{ minHeight: "24px" }}
        >
          {shouldShowBreadcrumbs && (
            <BreadCrumb
              model={breadcrumbItems}
              className="border-none p-0 w-full"
              pt={{
                root: { className: "bg-transparent border-none p-0" },
                separator: { className: "text-[10px]" },
              }}
            />
          )}
        </div>

        <div
          className="top-menu"
          onMouseEnter={(e) => op.current.show(e)}
          style={{ cursor: "pointer" }}
        >
          <div className="flex align-items-center">
            {userimage ? (
              <Avatar
                image={getImageUrl(userimage)}
                shape="circle"
                className="my-auto"
              />
            ) : (
              <Avatar
                style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                label={getFirstCharacter(profile?.given_name || profile?.name)}
                size="small"
                shape="circle"
                className="my-auto"
              />
            )}
            <div className="flex ml-2 my-auto">
              <span className="username">{username}</span>
            </div>
          </div>
        </div>

        <OverlayPanel
          ref={op}
          style={{ width: "150px" }}
          onMouseLeave={handleOverlayMouseLeave}
          onMouseEnter={handleOverlayMouseEnter}
        >
          <div
            className="p-d-flex p-ai-center"
            style={{ padding: "0.5rem", cursor: "pointer" }}
            onClick={showUserInfo}
          >
            <span>User Info</span>
          </div>
          <div
            className="p-d-flex p-ai-center"
            style={{ padding: "0.5rem", cursor: "pointer" }}
            onClick={logoutUser}
          >
            <span>Logout</span>
          </div>
        </OverlayPanel>
      </div>
    </div>
  );
}
