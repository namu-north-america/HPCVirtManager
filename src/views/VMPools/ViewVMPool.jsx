import { useLocation } from "react-router-dom";
import Page from "../../shared/Page";
import { VirtualMachinePageTitle } from "../../shared/VirtualMachines";
import { StatusTemplate } from "../../shared/DataTableTemplates";
import { TabPanel, TabView } from "primereact/tabview";
import Grid, { Col } from "../../shared/Grid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVMsAction } from "../../store/actions/projectActions";
import { VMListTable } from "../../shared/VMListTable";
import CustomCard, { CustomCardField } from "../../shared/CustomCard";
import { onGetVMPoolAction } from "../../store/actions/vmActions";
import YamlEditor from "../../shared/YamlEditor";
import { VncDialog } from "../../shared/VncDialog";

export const ViewVMPool = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { vmPoolInstances } = useSelector((state) => state.project);
  const { profile, userNamespace } = useSelector((state) => state.user);
  const [showVncDialog, setShowVncDialog] = useState(false);
  const [selectedVM, setSelectedVM] = useState(null);

  const { name, namespace } = state || {};
  const [poolData, setPoolData] = useState({
    name: "",
    namespace: "",
    yaml: "",
    replicas: "",
    instanceType: "",
  });

  const onCloseConsole = () => {
    setShowVncDialog(false);
    setSelectedVM(null);
  };

  const onOpenConsole = (vm) => {
    setSelectedVM(vm);
    setShowVncDialog(true);
  };

  useEffect(() => {
    dispatch(getVMsAction({ name, namespace, isVmPool: true }));
    dispatch(
      onGetVMPoolAction({ name, namespace }, (res) => {
        console.log("response of vm ppooooo", res);
        setPoolData({
          yaml: res,
          replicas: res.status.replicas,
          instanceType: res.spec?.virtualMachineTemplate.spec?.instancetype?.name || "custom",
        });
      })
    );
  }, []);

  return (
    <>
      <Page title={<VirtualMachinePageTitle name={state.name} status={<StatusTemplate status="Running" />} />}>
        <TabView>
          <TabPanel header="Overview">
            <Grid>
              <Col size={4}>
                <CustomCard title="Details">
                  <CustomCardField title="Name" value={name} />
                  <CustomCardField title="Namespace" value={namespace} />
                  <CustomCardField title="Replicas" value={poolData.replicas} />
                  <CustomCardField title="Instance Type" value={poolData.instanceType} />
                </CustomCard>
              </Col>
            </Grid>
          </TabPanel>
          <TabPanel header="Yaml Template">
            <Grid>
              <Col size={12}>
                <YamlEditor value={poolData?.yaml} options={{ readOnly: true }} />
              </Col>
            </Grid>
          </TabPanel>
          <TabPanel header="Instances">
            <Grid>
              <Col size={12}>
                <VMListTable
                  vms={vmPoolInstances}
                  user={{ userNamespace, profile }}
                  skipActions={["onMigrate"]}
                  onOpenConsole={onOpenConsole}
                />
              </Col>
            </Grid>
          </TabPanel>
        </TabView>
        <VncDialog isOpen={showVncDialog} selectedVM={selectedVM} onCloseConsole={onCloseConsole} />
      </Page>
    </>
  );
};
