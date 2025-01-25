import { useLocation } from "react-router-dom";
import Page from "../../shared/Page";
import { VirtualMachinePageTitle } from "../../shared/VirtualMachines";
import { StatusTemplate } from "../../shared/DataTableTemplates";
import { TabPanel, TabView } from "primereact/tabview";
import Grid, { Col } from "../../shared/Grid";


export const ViewVMPool = () => {
  const { state } = useLocation();

  return (
    <>
      <Page
        title={
          <VirtualMachinePageTitle name={state.vmPoolName} status={<StatusTemplate status="Running" />} />
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
              <Col size></Col>
            </Grid>
          </TabPanel>
        </TabView>
      </Page>
    </>
  )
}