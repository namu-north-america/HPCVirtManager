import React, { useEffect } from "react";
import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import Grid from "../../shared/Grid";
import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "../../store/actions/userActions";

export default function ViewUser() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  const breadcrumItems = [
    { label: "Users", url: "/#/users" },
    { label: "Profile", url: "/#/users/profile" },
  ];

  if (!profile || Object.keys(profile).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page title={profile.preferred_username || `${profile.given_name || ""} ${profile.family_name || ""}`} >
        <Grid>
          <div style={{ padding: "1rem" }}>
            {Object.entries(profile).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "1rem" }}>
                <strong>{key}: </strong>
                <span>
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : String(value ?? "N/A")}
                </span>
              </div>
            ))}
          </div>
        </Grid>
      </Page>
    </>
  );

}
