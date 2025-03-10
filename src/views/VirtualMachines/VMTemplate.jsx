import React, { useEffect, useMemo, useState } from "react";
import Page from "../../shared/Page";
import { timeAgo } from "../../utils/date";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const timeTemplate = (item) => {
  return <>{timeAgo(item.time)}</>;
};

const osTemplate = (item) => {
  return (
    <>
      <span
        data-pr-tooltip={item.os ? undefined : "Operating system of the template"}
        data-pr-position="top"
        data-pr-at="center+2 top-2"
        className="cursor-help"
      >
        {item.os || '-'}
      </span>
      <Tooltip target={`[data-pr-tooltip]`} />
    </>
  );
};

const nameTemplate = (item) => {
  return (
    <Link to={`/virtual-machines/templates/${item.namespace}/${item.name}`}>
      {item.name}
    </Link>
  );
};

export default function VMTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [templates] = useState([]);
  const { breadcrumb } = useBreadcrumb();
  
  // Filter templates based on search
  const filteredTemplates = useMemo(
    () =>
      templates.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, templates]
  );

  const onAdd = () => {
      navigate("/virtual-machines/templates/add");
  };

  // TODO: Add template fetching logic
  useEffect(() => {
    // Fetch templates data
  }, [dispatch]);

  return (
    <Page
      title="VM Templates"
      onSearch={setSearch}
      onRefresh={() => {
        // Refresh templates data
      }}
      onAdd={onAdd}
      addText="New VM Template"
      breadcrumb={<CustomBreadcrum items={breadcrumb} />}
    >
      <DataTable value={filteredTemplates} tableStyle={{ minWidth: "50rem" }}>
        <Column field="os" header="OS" body={osTemplate}></Column>
        <Column field="name" header="Name" body={nameTemplate}></Column>
        <Column field="source" header="Source"></Column>
        <Column field="namespace" header="Namespace"></Column>
        <Column field="time" header="Created" body={timeTemplate}></Column>
      </DataTable>
    </Page>
  );
}
