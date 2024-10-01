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
// import { showToastAction } from "../store/slices/commonSlice";

import { confirmDialog } from "primereact/confirmdialog";

const statusTemplate = (item) => {
  switch (item.status) {
    case "Active":
      return <span className="text-green-500">Active</span>;
    case "RUNNING":
      return <span className="text-cyan-500">Running</span>;
    case "STOPPED":
      return <span className="text-red-500">Stopped</span>;
    default:
      return <span className="text-red-500">Stopped</span>;
  }
};
const breadcrumItems = [{ label: "Users (RBAC)", url: "/#/users" }];
export default function Users() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const actionTemplate = (item) => {
    return (
      <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
        <div>
          <div className="font-semibold mb-2">Actions</div>

          {
            <>
              <div className="cursor-pointer mb-2" onClick={() => onEdit(item)}>
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
  const onEdit = (item) => {
    console.log("edit", item);
    // dispatch(
    //   showToastAction({
    //     type: "success",
    //     title: "Email or password is invalid!",
    //   })
    // )
  };
  const onDelete = (item) => {
    console.log("delete", item);
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
      console.log("user",user);
      
      if (user.metadata.name.includes("cocktail") && !user.metadata.name.includes("cocktail-super-admin-token")) {
        let item = {
          name: decoder(user.data.username),
          status: "Active",
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

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="User Management (RBAC)"
        onSearch={(e) => console.log(e)}
        onRefresh={(e) => dispatch(onGetUserALLAction())}
        onAdd={(e) => setVisible(true)}
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
