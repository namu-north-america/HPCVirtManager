import { useLocation } from "react-router-dom";
import Page from "../../shared/Page";
import { VirtualMachinePageTitle } from "../../shared/VirtualMachines";
import { StatusTemplate } from "../../shared/DataTableTemplates";
import { TabPanel, TabView } from "primereact/tabview";
import Grid, { Col } from "../../shared/Grid";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVMsAction } from "../../store/actions/projectActions";
import { VMListTable } from "../../shared/VMListTable";

export const ViewVMPool = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { vmPoolInstances } = useSelector(state => state.project)
  const { profile, userNamespace } = useSelector((state) => state.user);
  const { name, namespace } = state || {};

  useEffect(() => {
    dispatch(getVMsAction({ name, namespace, isVmPool: true }))
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
                <VMListTable vms={vmPoolInstances} user={{ userNamespace, profile }} />
              </Col>
            </Grid>
          </TabPanel>
        </TabView>
      </Page>
    </>
  )
}