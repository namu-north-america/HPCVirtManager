import React, { useEffect, useRef, useState } from "react";
import Page from "../shared/Page";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomBreadcrum from "../shared/CustomBreadcrum";
import CustomOverlay from "../shared/CustomOverlay";
import { nameTemplate, timeTemplate } from "../shared/TableHelpers";
import AddUserModal from "./VirtualMachines/Form/AddUserModal";
import { useDispatch, useSelector } from "react-redux";
import { onGetUserALLAction ,onDeleteUserAction} from "../store/actions/userActions";
 import { showToastAction } from "../store/slices/commonSlice";


import { confirmDialog } from "primereact/confirmdialog";

const statusTemplate = (item) => {
  switch (item.status) {
    case "active":
      return <span className="text-green-500">Active</span>;
    case "RUNNING":
      return <span className="text-cyan-500">Running</span>;
    case "in-active":
      return <span className="text-red-500">In-active</span>;
    default:
      return <span className="text-red-500">In-active</span>;
  }
};
const breadcrumItems = [{ label: "Users (RBAC)", url: "/#/users" }];
export default function Users() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const { profile } = useSelector((state) => state.user);
  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const actionTemplate = (item) => {
    return (
      <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
        <div>
          <div className="font-semibold mb-2">Actions</div>

          {
            <>
              <div className=" mb-2" onClick={() => onEdit(item)} >
              
          Edit
       
                
              </div>
              <div className="cursor-pointer" onClick={() => onDelete(item)}>
                Delete
              </div>
            </>
          }
        </div>
      </CustomOverlay>
    );
  };
 
  const onDelete = (item) => {
    if(profile.role !== "admin")return showError()
    confirmDialog({
      target: ref.currentTarget,
      header: "Delete Confirmation",
      message: `Do you want to delete ${item.name} - ${item.email} ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: " primary-button",
      accept: () => {
        dispatch(onDeleteUserAction(item));
      },
    });
  };
  const onEdit = (item) => {
    if(profile.role !== "admin")return showError()
    window.location.href = `/#/users/${item.email}`;
  };

  useEffect(() => {
    const onInitialLoad = () => {
      dispatch(onGetUserALLAction());
    };
  
    onInitialLoad();
  }, [dispatch]);

 

  const { userList } = useSelector((state) => state.user);
  useEffect(() => {
    let allUser = [];
    userList.forEach((user) => {
      console.log("user list",user);
      
      if (user.metadata.name.includes("cocktail") && !user.metadata.name.includes("cocktail-super-admin-token")) {
        let item = {
          name: decoder(user.data.username),
          status: (user.data.hasOwnProperty('status')
        )?decoder(user.data.status):'in-active',
          role: decoder(user.data.role),
          email: decoder(user.data.email),
          department:
            "department" in user.data
              ? decoder(user.data.department)
              : "No Department",
          date: user.metadata.creationTimestamp,
        };
        allUser.push(item);
      }
    });
    setUser(allUser);
  }, [userList]);

  const decoder = (value) => {
    return decodeURIComponent(atob(value));
  };

  const addNewUser = () => {
    if(profile.role !== "admin")return showError()
    setVisible(true);
  };
  const showError = () => {
    dispatch(
      showToastAction({
        type: "error",
        title: "Sorry You have no permission!",
      })
    );
  };

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="User Management (RBAC)"
        onSearch={(e) => console.log(e)}
        onRefresh={(e) => dispatch(onGetUserALLAction())}
        onAdd={addNewUser}
        addText="Register New User"
      >
        <DataTable value={user} tableStyle={{ minWidth: "50rem" }}>
          <Column
            field="username"
            header="Username"
            body={nameTemplate}
          ></Column>
          <Column field="role" header="Role"></Column>
          <Column field="email" header="Id (Email)"></Column>
          <Column field="status" header="Status" body={statusTemplate}></Column>
          <Column field="department" header="Department"></Column>
          <Column field="date" header="Last Login" body={timeTemplate}></Column>
          <Column body={actionTemplate}></Column>
        </DataTable>
        <AddUserModal visible={visible} setVisible={setVisible} />
      </Page>
    </>
  );
}
