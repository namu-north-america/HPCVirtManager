import React, { useEffect, useMemo,  useState } from "react";
import Page from "../../shared/Page";
import { timeAgo } from "../../utils/date";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { useDispatch, useSelector } from "react-redux";
import { getVMsAction } from "../../store/actions/projectActions";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  
  checkNamespaceValue,
} from "../../utils/commonFunctions";

const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
};

const statusTemplate = (item) => {
  switch (item.status) {
    case "Starting":
      return <span className="text-pink-400">Starting</span>;
    case "Ready":
      return <span className="text-green-500">Ready</span>;
    case "Running":
      return <span className="text-cyan-500">Running</span>;
    case "Stopping":
      return <span className="text-red-400">Stopping</span>;
    case "Stopped":
      return <span className="text-red-500">Stopped</span>;
    case "Paused":
      return <span className="text-yellow-500">Paused</span>;
    default:
      return <span>{item.status}</span>;
  }
};


export default function NodeVMList() {
  const dispatch = useDispatch();
  const { profile, userNamespace } = useSelector((state) => state.user);
  let { vms } = useSelector((state) => state.project);
  
  

  const { name } = useParams();
 
  



  useEffect(() => {
    dispatch(getVMsAction());
  }, [dispatch]);

  const vmname = (item) => {

    if (checkNamespaceValue(userNamespace, item.namespace, "crudVMS") || profile?.role === "admin") {
      return (
        <Link to={`/virtual-machines/details/${item.namespace}/${item.name}`}>
          {item.name}
        </Link>
      );
    } else {
      return <>{item.name}</>;
    }
    
  };


 

  const filterByNode = (data, nodeName) => {
    return data.filter(item => item.node === nodeName);
  };



  const [search, setSearch] = useState("");
  

  

  vms = useMemo(
    () =>
      vms.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, vms]
  );

  return (
    < >
     
      <Page
        title="Virtual Machines"
        onSearch={setSearch}
        onRefresh={() => {
          dispatch(getVMsAction());
        }}
      
      >
       
        <DataTable value={filterByNode(vms,name)} tableStyle={{ minWidth: "50rem" }}>
          <Column field="name" header="Name" body={vmname}></Column>
          <Column field="status" header="Status" body={statusTemplate}></Column>
          <Column field="conditions" header="Conditions"></Column>
          <Column field="time" header="Created" body={timeTemplate}></Column>
          <Column field="ipAddress" header="IP Address"></Column>
          
          <Column field="node" header="Node"></Column>
          <Column field="namespace" header="Namespace"></Column>
          <Column field="cluster" header="Cluster"></Column>
          
        </DataTable>
    
      </Page>
    </>
  );
}
