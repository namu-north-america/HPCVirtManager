import React, { useEffect, useMemo, useState } from "react";

import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import CustomCard, { CustomCardValue } from "../../shared/CustomCard";
import Grid, { Col } from "../../shared/Grid";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { timeTemplate } from "../../shared/TableHelpers";
import { useDispatch, useSelector } from "react-redux";
import { getLiveMigrationsAction } from "../../store/actions/vmActions";

const breadcrumItems = [
  { label: "Virtual Machines", url: "/#/virtual-machines/list" },
  { label: "Live Migrations", url: "/#/virtual-machines/live-migrations" },
];
export default function LiveMigrations() {
  const dispatch = useDispatch();

  const statusTemplate = (item) => {
    switch (item.status) {
      case "Succeeded":
      case "Running":
        return <span className="text-green-500">{item.status}</span>;
      case "Scheduling":
      case "Scheduled":
      case "PreparingTarget":
      case "TargetReady":
        return <span className="text-cyan-500">{item.status}</span>;
      case "Pending":
        return <span className="text-red-500">{item.status}</span>;
      default:
        return <span className="text-gray-500">{item.status}</span>;
    }
  };

  let { namespacesDropdown, migrations } = useSelector(
    (state) => state.project
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    onLoadMigrations();
  }, [dispatch, namespacesDropdown]);

  const onLoadMigrations = () => {
    if (namespacesDropdown?.length) {
      dispatch(getLiveMigrationsAction(namespacesDropdown));
    }
  };

  migrations = useMemo(
    () =>
      migrations.filter(
        (item) =>
          item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.vmName?.toLowerCase()?.includes(search?.toLowerCase()) ||
          item?.status?.toLowerCase()?.includes(search?.toLowerCase())
      ),
    [search, migrations]
  );

  const completedMigrations = useMemo(
    () =>
      migrations?.filter((item) =>
        ["Succeeded", "Running"].includes(item.status)
      ),
    [migrations]
  );

  const pendingMigrations = useMemo(
    () =>
      migrations?.filter((item) =>
        ["Pending", "Scheduling", "Scheduled"].includes(item.status)
      ),
    [migrations]
  );

  const activeMigrations = useMemo(
    () =>
      migrations?.filter((item) =>
        ["PreparingTarget", "TargetReady", "Running"].includes(item.status)
      ),
    [migrations]
  );

  const failedMigrations = useMemo(
    () => migrations?.filter((item) => ["Failed"].includes(item.status)),
    [migrations]
  );

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="Live Migrations"
        onSearch={setSearch}
        onRefresh={onLoadMigrations}
      >
        <Grid>
          <Col size={12}>
            <CustomCard>
              <Grid>
                <CustomCardValue
                  title="Active"
                  value={activeMigrations?.length || 0}
                />
                <CustomCardValue
                  title="Pending"
                  value={pendingMigrations?.length || 0}
                />
                <CustomCardValue
                  title="Suceeded"
                  value={completedMigrations?.length || 0}
                />
                <CustomCardValue
                  title="Failed"
                  value={failedMigrations?.length || 0}
                />
              </Grid>
            </CustomCard>
          </Col>
          <Col size={6}>
            <CustomCard title="Active Migrations">
              <DataTable
                value={activeMigrations}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                ></Column>
                <Column field="vmName" header="VM Name"></Column>

                <Column field="sourceNode" header="Source"></Column>
                <Column field="targetNode" header="Target"></Column>
                <Column
                  field="targetNodeAddress"
                  header="Target Address"
                ></Column>
                <Column
                  field="time"
                  header="Created"
                  body={timeTemplate}
                ></Column>
              </DataTable>
            </CustomCard>
          </Col>
          <Col size={6}>
            <CustomCard title="Pending Migrations">
              <DataTable
                value={pendingMigrations}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                ></Column>
                <Column field="vmName" header="VM Name"></Column>

                <Column field="sourceNode" header="Source"></Column>
                <Column field="targetNode" header="Target"></Column>
                <Column
                  field="targetNodeAddress"
                  header="Target Address"
                ></Column>
                <Column
                  field="time"
                  header="Created"
                  body={timeTemplate}
                ></Column>
              </DataTable>
            </CustomCard>
          </Col>
          <Col size={12}>
            <CustomCard title="Completed Migrations">
              <DataTable
                value={[...completedMigrations, ...failedMigrations]}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                ></Column>
                <Column field="vmName" header="VM Name"></Column>

                <Column field="sourceNode" header="Source"></Column>
                <Column field="targetNode" header="Target"></Column>
                <Column
                  field="targetNodeAddress"
                  header="Target Address"
                ></Column>
                <Column
                  field="time"
                  header="Created"
                  body={timeTemplate}
                ></Column>
              </DataTable>
            </CustomCard>
          </Col>
        </Grid>
      </Page>
    </>
  );
}
