import React from "react";

import Page from "../../shared/Page";
import CustomBreadcrum from "../../shared/CustomBreadcrum";
import CustomCard, { CustomCardValue } from "../../shared/CustomCard";
import Grid, { Col } from "../../shared/Grid";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { nameTemplate, timeTemplate } from "../../shared/TableHelpers";
const breadcrumItems = [
  { label: "Virtual Machines", url: "/#/virtual-machines/list" },
  { label: "Live Migrations", url: "/#/virtual-machines/live-migrations" },
];
export default function LiveMigrations() {
  const allNodes = [
    {
      name: "vm-1",
      status: "ACTIVE",
      target: "10.128.122.344",
      time: "2024-07-28T10:14:57.665Z",
    },
    {
      name: "vm-2",
      status: "PENDING",
      target: "10.128.122.344",
      time: "2024-07-23T10:14:57.665Z",
    },
    {
      name: "vm-3",
      status: "STOPPED",
      target: "10.128.122.344",
      time: "2024-07-22T10:14:57.665Z",
    },
    {
      name: "vm-4",
      status: "SUCCEEDED",
      target: "10.128.122.344",
      time: "2024-07-22T10:14:57.665Z",
    },
  ];

  const statusTemplate = (item) => {
    switch (item.status) {
      case "ACTIVE":
        return <span className="text-green-500">Ready</span>;
      case "RUNNING":
        return <span className="text-cyan-500">Running</span>;
      case "STOPPED":
        return <span className="text-red-500">Stopped</span>;
      default:
        return <span className="text-gray-500">Pending</span>;
    }
  };

  return (
    <>
      <CustomBreadcrum items={breadcrumItems} />
      <Page
        title="Live Migrations"
        onSearch={(e) => console.log(e)}
        onRefresh={() => {}}
      >
        <Grid>
          <Col size={12}>
            <CustomCard>
              <Grid>
                <CustomCardValue title="Active" value="1" />
                <CustomCardValue title="Pending" value="2" />
                <CustomCardValue title="Suceeded" value="1" />
                <CustomCardValue title="Failed" value="1" />
              </Grid>
            </CustomCard>
          </Col>
          <Col size={6}>
            <CustomCard title="Active Migrations">
              <DataTable value={allNodes} tableStyle={{ minWidth: "50rem" }}>
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                ></Column>
                <Column
                  field="name"
                  header="VM Name"
                  body={nameTemplate}
                ></Column>

                <Column field="target" header="Target"></Column>
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
              <DataTable value={allNodes} tableStyle={{ minWidth: "50rem" }}>
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                ></Column>
                <Column
                  field="name"
                  header="VM Name"
                  body={nameTemplate}
                ></Column>

                <Column field="target" header="Target"></Column>
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
              <DataTable value={allNodes} tableStyle={{ minWidth: "50rem" }}>
                <Column
                  field="status"
                  header="Status"
                  body={statusTemplate}
                ></Column>
                <Column
                  field="name"
                  header="VM Name"
                  body={nameTemplate}
                ></Column>

                <Column field="target" header="Target"></Column>
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
