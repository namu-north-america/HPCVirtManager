import React from "react";
import { CustomField, CustomForm } from "../../../shared/AllInputs";

export default function UserReview({ data, role, namespace }) {
  






  const getPermission = (item) => {
    let str = "";
   
      if (item.viewVMs) {
        str += "View VMs, ";
      }
      if (item.crudVMS) {
        str += "Create/Edit/Migrate/Delete VMs, ";
      }
      if (item.viewDataVolume) {
        str += "View Data Volumes, ";
      }
      if (item.crudDataVolume) {
        str += "Create/Resize/Delete Data Volumes, ";
      }
    
    return str;
  };
  return (
    <>
      <CustomForm>
        <CustomField
          label="Username"
          name="name"
          data={data}
          value={data.userName}
        />
        <CustomField name="Email (Id)" data={data} value={data.email} />
        <CustomField name="Password" data={data} value={data.password} />
        <CustomField name="Department" data={data} value={data.department} />
      </CustomForm>
      <br />
      <CustomForm>
        <CustomField name="Role" data={role} value={role.role} />
        <CustomField
          name="ClusterPermission"
          data={data}
          value={"cluster-01"}
        />
        <CustomField
          name="Namespace"
          data={data}
          value={role.role==='user'?"Permission":"All Permission"}
        />
        {role.role==='user'&& (namespace?.map((item, i) => (
          <  >
            {i ? <div className=" col-6 border-200 border-top-1"></div> : null}
            {item?.userManagement ? (
              <>
                <CustomField
                
                  name={item.namespace}
                  data={item}
                  value={`All Permissions`}
                />
              </>
            ) :
             (
              <>
                <CustomField
                  name={item.namespace}
                  value={getPermission(item)}
                />
               
              </>
            )}
          </>
        ))) }
      
      </CustomForm>
    </>
  );
}
