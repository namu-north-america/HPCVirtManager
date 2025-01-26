import { useLocation } from "react-router-dom";
import Page from "../../shared/Page";
import { VirtualMachinePageTitle } from "../../shared/VirtualMachines";
import { StatusTemplate } from "../../shared/DataTableTemplates";
import { TabPanel, TabView } from "primereact/tabview";
import Grid, { Col } from "../../shared/Grid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVmsByVMPoolAction } from "../../store/actions/projectActions";
import { VMListTable } from "../../shared/VMListTable";

export const ViewVMPool = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { vmPoolInstances } = useSelector(state => state.project)
  const { profile, userNamespace } = useSelector((state) => state.user);
  const { name, namespace } = state || {};

  useEffect(() => {
    dispatch(getVmsByVMPoolAction({ name, namespace }))
  }, [])


  return (
    <>
      <Page
        title={
          <VirtualMachinePageTitle name={state.name} status={<StatusTemplate status="Running" />} />
        }
      >
        <TabView>
          <TabPanel header="Overview">
            <Grid>
              <Col size></Col>
            </Grid>
          </TabPanel>
          <TabPanel header="Yaml Template">
            <Grid>
              <Col size></Col>
            </Grid>
          </TabPanel>
          <TabPanel header="Instances">
            <Grid>
              <Col size={12}>
                <VMListTable vms={vmPoolInstances} userNamespace={userNamespace} />
                {/* <DataTable value={vmPoolInstances} tableStyle={{ minWidth: "50rem" }}>
                  <Column body={<IconTemplate />} style={{ width: '2rem' }}></Column>
                  <Column field="name" header="Name" body={(item) => <VmName item={item} user={{ userNamespace, profile }} />}></Column>
                  <Column field="status" header="Status" body={(item) => <StatusTemplate status={item.status} />}></Column>
                  <Column field="guestOS" header="OS" body={osTemplate}></Column>
                  <Column field="time" header="Created" body={timeTemplate}></Column>
                  <Column field="node" header="Node"></Column>
                  <Column field="namespace" header="Namespace"></Column>
                  <Column field="cluster" header="Cluster"></Column>
                  <Column body={actionTemplate}></Column>
                </DataTable> */}
              </Col>
            </Grid>
          </TabPanel>
        </TabView>
      </Page>
    </>
  )
}