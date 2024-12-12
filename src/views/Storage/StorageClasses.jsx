import React, { useEffect, useMemo, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Page from "../../shared/Page";
import { useDispatch, useSelector } from "react-redux";

import { nameTemplate, timeTemplate } from "../../shared/TableHelpers";
import { getStorageClassesAction } from "../../store/actions/storageActions";

export default function StorageClasses() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getStorageClassesAction());
  }, [dispatch]);

  let { storageClasses } = useSelector((state) => state.project);
  const [search, setSearch] = useState("");
  storageClasses = useMemo(
    () =>
      storageClasses.filter((item) =>
        item?.name?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, storageClasses]
  );

  return (
    <Page
      title="Storage Classes"
      onSearch={setSearch}
      onRefresh={(e) => dispatch(getStorageClassesAction())}
    >
      <DataTable value={storageClasses} tableStyle={{ minWidth: "50rem" }}>
        <Column field="name" header="Name" body={nameTemplate}></Column>
        <Column field="cluster" header="Cluster"></Column>
        <Column field="provisioner" header="Provisioner"></Column>
        <Column field="time" header="Created" body={timeTemplate}></Column>
      </DataTable>
    </Page>
  );
}
