import React, { useEffect, useRef, useState } from "react";
import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { Link, useParams } from "react-router-dom";
import {
  CustomButtonOutlined,
  CustomSplitButton,
} from "../../shared/CustomButton";
import CustomCard, { CustomCardField } from "../../shared/CustomCard";

import Grid, { Col } from "../../shared/Grid";
import { useDispatch } from "react-redux";

import { confirmDialog } from "primereact/confirmdialog";

import EditVmModal from "../VirtualMachines/Form/EditVmModal";
import MigrateModal from "../VirtualMachines/Form/MigrateModal";

import {
  onGetUserDetailAction,
  onUpdateUserAction,
  onDeleteUserAction
} from "../../store/actions/userActions";

export default function EditUser() {
  const dispatch = useDispatch();
  let { name, namespace } = useParams();

  const breadcrumItems = [
    { label: "Users", url: "/#/users" },

    { label: name, url: `/#/users/${name}` },
  ];

  const ref = useRef();
  const onDelete = (item) => {
    confirmDialog({
      target: ref.currentTarget,
      header: "Delete Confirmation",
      message: `Do you want to delete  ${item.name} ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: "primary-button",
      accept: () => {
        dispatch(onDeleteUserAction({email:item.name}));
      },
    });
  };
  const [onOpenMigrate, setOpenMigrate] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [namespacePermission, setNamespacePermission] = useState([]);

  const moreActions = [
    {
      label: "Delete User",
      command: () => {
        onDelete({ name });
      },
    },
  ];

  useEffect(() => {
    onInitialLoad();
    // eslint-disable-next-line
  }, [name, namespace]);

  const onInitialLoad = () => {
    dispatch(onGetUserDetailAction({ email: name })).then((res) => {
      console.log("edit page", res);
      if (res.status !== "Failure") {
        console.log("user", res);
        setUser(res);
        setData({
          name: res?.username,
          email: res?.email,
          status: res?.status,
          department: res?.department,
          role: res?.role,
        });
      }
    });
  };

  const [data, setData] = useState({
    name: "",
    email: "",
    status: "",
    department: "",
  });
  const checkKeyValue = (object, keySuffix) => {
    if (data.role === "admin") {
      return true;
    }
    for (let key in object) {
      const keyParts = key.split("-");
      const suffix = keyParts[keyParts.length - 1];

      if (suffix === keySuffix && object[key] === "yes") {
        return true;
      }
    }
    return false;
  };
  const [permission, setPermission] = useState({
    viewCluster: true,
    crudNode: checkKeyValue(user, "crudNode"),
    configNet: checkKeyValue(user, "crudNode"),

    viewVMS: true,
    crudVMS: checkKeyValue(user, "crudVMS"),

    viewDataVolume: true,
    crudDataVolume: checkKeyValue(user, "crudDataVolume"),
    attachDataVolume: checkKeyValue(user, "crudDataVolume"),

    viewUser: true,
    crudUser: checkKeyValue(user, "crudUser"),
    assignUser: checkKeyValue(user, "assignUser"),
    manageUser: checkKeyValue(user, "manageUser"),
  });

  useEffect(() => {
  

  if (user && user.role === "user") {
        
        
    const result = [];

    // Loop through the object to find all namespaces
    for (const key in user) {
      if (key.startsWith('namespace')) {
        const namespaceValue = user[key];
  
        // Collect all keys that start with this namespaceValue, remove the prefix
        const relatedData = { namespace: namespaceValue };
        for (const relatedKey in user) {
          if (relatedKey.startsWith(namespaceValue)) {
            const strippedKey = relatedKey.replace(`${namespaceValue}-`, ''); // Strip prefix
            relatedData[strippedKey] = user[relatedKey];
          }
        }   
        result.push(relatedData);
      }
    }
    
    
    setNamespacePermission(result)
    
  }
  
    setPermission({
      viewCluster: true,
      crudNode: checkKeyValue(user, "crudNode"),
      configNet: checkKeyValue(user, "crudNode"),

      viewVMS: true,
      crudVMS: checkKeyValue(user, "crudVMS"),

      viewDataVolume: true,
      crudDataVolume: checkKeyValue(user, "crudDataVolume"),
      attachDataVolume: checkKeyValue(user, "crudDataVolume"),

      viewUser: true,
      crudUser: checkKeyValue(user, "crudUser"),
      assignUser: checkKeyValue(user, "assignUser"),
      manageUser: checkKeyValue(user, "manageUser"),
    });
    // eslint-disable-next-line
  }, [user]);

  const checkPermission =(permissionObj, key) =>{
    
    
    // Ensure the key exists in the object and return true if the value is "yes"
    console.log("permissionObj", permissionObj, permissionObj[key] === "yes");
    return permissionObj[key] === "yes" ;
  }

  const statusTemplate = (item) => {
    switch (item.status) {
      case "active":
        return (
          <span className="text-cyan-500" onClick={onUpdate}>
            <i className="pi pi-check-circle text-sm mr-1"></i>Active
          </span>
        );

      case "in-active":
        return (
          <span className="text-red-500" onClick={onUpdate}>
            <i className="pi pi-ban text-sm mr-1"></i>In-active
          </span>
        );

      default:
        return (
          <span className="text-red-500" onClick={onUpdate}>
            <i className="pi pi-ban text-sm mr-1"></i>In-active
          </span>
        );
    }
  };

  const headers = (
    <>
      <CustomButtonOutlined
        label="Refresh"
        severity="secondary"
        icon="pi pi-sync"
        onClick={onInitialLoad}
      />

      <CustomSplitButton
        label="More Actions"
        model={moreActions}
        severity="secondary"
      />
    </>
  );

  const onUpdate = () => {
    confirmDialog({
      target: ref.currentTarget,
      header: "Status Update Confirmation",
      message: `Do you want to update status ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: " primary-button",
      accept: () => {
        if (user.hasOwnProperty("status")) {
        
          user.status = user.status === "active" ? "in-active" : "active";
        } else {
          user.status = "active";
        }

        dispatch(onUpdateUserAction(user));
        onInitialLoad();
      },
    });
  };

  return (
    <>
      <EditVmModal visible={editInfo} setVisible={setEditInfo} />
      <MigrateModal visible={onOpenMigrate} setVisible={setOpenMigrate} />
      <CustomBreadcrum items={breadcrumItems} />
      <Page title={data.name} headers={headers}>
        <Grid>
          <Col size={4}>
            <CustomCard title="Name">
              <CustomCardField title="Name" value={data.name} />
              <CustomCardField title="Email (Id)" value={name} />
              <CustomCardField
                title="Password"
                template={<Link onClick={onUpdate}>Reset Password</Link>}
              />
              <CustomCardField
                title="Status"
                value={data?.status}
                template={statusTemplate(data)}
              />

              <CustomCardField title="Department" value={data.department} />
            </CustomCard>
          </Col>
          <Col size={8}>
            <CustomCard title={"Role ( " + data.role + " )"}>
              <div className="">
                <label className="title">General Permissions</label>
                <ul  style={{ listStyle: "none", padding: 0 ,marginLeft:5}}>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        checked
                        type="checkbox"
                        name="userManagement"
                        disabled
                      />
                      View Cluster Resourses
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        checked={permission.crudNode}
                        type="checkbox"
                        disabled
                        name="manageCluster"
                      />
                      Add/Remove Nodes
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        disabled
                        type="checkbox"
                        checked={permission.configNet}
                      />
                      Configure network settings.
                    </label>
                  </li>
                  <hr />

                  

                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked
                      />
                      View Users list.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked={permission.crudUser}
                      />
                      Create/Edit/Delete Users.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked={permission.assignUser}
                      />
                      Assign roles and permissions to other users.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked={permission.manageUser}
                      />
                      Mange Users profiles.
                    </label>
                  </li>
                  {user && user.role === "admin" &&(
                    <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked={true}
                      />
                      Mange All Namespaces.
                    </label>
                  </li>
                  )

                  }
                 
                 
                </ul>
              </div>

              {
                namespacePermission.map((perm, index) => (
                  <div className="" key={index}>
                <label className="title">{perm.namespace+ " namespace"}</label>
                <ul style={{ listStyle: "none", padding: 0 ,marginLeft:5}}>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="vmOperations"
                        disabled
                        checked
                      />
                      View VMs.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="vmOperations"
                        disabled
                        checked={checkPermission(perm,"crudVMS")}
                      />
                      Create/Edit/Migrate/Delete VMs.
                    </label>
                  </li>
                  <hr />

                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="dataVolumes"
                        disabled
                        checked
                      />
                      View Data Volumes.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="dataVolumes"
                        disabled
                        
                        checked={checkPermission(perm,"crudDataVolume")}
                      />
                      Create/Resize/Delete Data Volumes.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked={checkPermission(perm,"crudDataVolume")}
                      />
                      AttachDetach Data Volumes to/from VMs.
                    </label>
                  </li>
                  <li>
                    <label
                      style={{
                        color: "black",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="assignRoles"
                        disabled
                        checked={checkPermission(perm,"crudImage")}
                      />
                      Create/Edit/Delete Images.
                    </label>
                  </li>
                 
                </ul>
              </div>
                ))
              }

              
            </CustomCard>
          </Col>
        </Grid>
      </Page>
    </>
  );
}
