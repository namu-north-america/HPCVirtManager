import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

export default function NodeOverView() {
  let { nodeDetail } = useSelector((state) => state.project);
  const [node, setNode] = useState([
    { name: "Hostname", value: "-" },
    { name: "Architecture", value: "-" },
    { name: "Status", value: "-", statusColor: "text-green-500" }, // You can add specific classes for styling
    { name: "OS", value: "-" },
    { name: "Primary IP", value: "-" },
    { name: "Role", value: "-" },
    { name: "Cluster", value: "-" },
  ]);

  function searchObjByKeyOrValue(obj, search) {
    for (const [key, value] of Object.entries(obj)) {
        if (key.includes(search) || value === search) {
            return value;
        }
    }
    return null; // Return null if not found
}

  useEffect(() => {
    if(nodeDetail.hasOwnProperty('operatingSystem')){
      
     
      let data = [
        {
          name: "Hostname",
          value: nodeDetail.labels["kubernetes.io/hostname"],
        },
        {
          name:"Architecture",
          value: nodeDetail.labels["beta.kubernetes.io/arch"],
        },
        {
          name:"Status" ,
          value:"Connected",
          statusColor: "text-green-500"
        },
        {
          name:'OS',
          value: nodeDetail.operatingSystem,
        },
        {
          name:'PrimaryIP',
          value: nodeDetail.ip,
        },
        {
          // Check if the key exists and get its value
          name:'Role',
          value:
                searchObjByKeyOrValue(nodeDetail.labels, "control-plane") !== null
              ? "Master"
              : 'Worker' 
        },
        {
          name:'Cluster',
          value: searchObjByKeyOrValue(nodeDetail.labels, "/name") !== null
          ? searchObjByKeyOrValue(nodeDetail.labels, "/name")
          : '-' 
        },
      ];
      setNode(data);
    }
   
  }, [nodeDetail]);

  
  return (
    <div className=" bg-white p-4 rounded-lg shadow-md max-w-xs">
      <div className="space-y-2">
        {node.map((item, index) => (
          <div
            key={index}
            className="grid grid-col-2 justify-content-between gap-4 py-2"
          >
            <span className="text-gray-400">{item.name}</span>
            <span className={`font-medium ${item.statusColor || ""}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
