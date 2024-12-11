import React, { useEffect, useRef, useState } from "react";
import Page from "../../shared/Page";
import { Link, useParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import {
  CustomButtonOutlined,
  CustomSplitButton,
} from "../../shared/CustomButton";
import CustomCard, { CustomCardField } from "../../shared/CustomCard";
import InfoCircle from "./Form/InfoCircle";
import Grid, { Col } from "../../shared/Grid";
import { useDispatch, useSelector } from "react-redux";
import {
  getVolumesAction,
  onChangeVmStatusAction,
  onDeleteVMAction,
  onGetVMAction,
  onPauseVMAction,
} from "../../store/actions/vmActions";
import { timeAgo } from "../../utils/date";
import CustomCodeEditor from "../../shared/CustomCodeEditor";
import { longOverlayText } from "../../shared/TableHelpers";
import { confirmDialog } from "primereact/confirmdialog";
import moment from "moment";
import constants from "../../constants";
import EditVmModal from "./Form/EditVmModal";
import MigrateModal from "./Form/MigrateModal";
import { findByLabelText } from "@testing-library/react";
import { getVmCpuStats, getVmMemoryStats, getVmStorageStats } from "../../store/actions/reportingActions";
import { VncScreen } from 'react-vnc';
import { Dialog } from 'primereact/dialog';
import { showToastAction } from '../../store/slices/commonSlice';
import YamlEditor from "../../shared/YamlEditor";
import { yamlTemplate } from "./Form/TemplateSelectionModal";
import { Tooltip } from 'primereact/tooltip';
import SemiCircleGauge from "../../shared/SemiCircle";

export default function ViewVM() {
  const dispatch = useDispatch();
  let { name, namespace } = useParams();

  const [showVncDialog, setShowVncDialog] = useState(false);

  const onOpenConsole = () => {
    setShowVncDialog(true);
  };

  const onCloseConsole = () => {
    setShowVncDialog(false);
  };

  const breadcrumItems = [
    { label: "Virtual Machines", url: "/#/virtual-machines/list" },
    { label: "All VMs", url: "/#/virtual-machines/list" },
    { label: name, url: `/#/virtual-machines/details/${namespace}/${name}` },
  ];

  const ref = useRef();
  const onDelete = (item) => {
    confirmDialog({
      target: ref.currentTarget,
      header: "Delete Confirmation",
      message: `Do you want to delete ${item.namespace} - ${item.name} ?`,
      icon: "pi pi-info-circle",
      rejectClassName: "p-button-outlined p-button-secondary",
      acceptClassName: "primary-button",
      accept: () => {
        dispatch(onDeleteVMAction(item));
      },
    });
  };
  const [onOpenMigrate, setOpenMigrate] = useState(false);
  const [editInfo, setEditInfo] = useState(null);
  const onEdit = () => {
    setEditInfo(data);
  };
  const moreActions = [
    {
      label: "Open Console",
      command: () => {
        onOpenConsole();
      },
    },
    {
      label: "Migrate",
      command: () => {
        setOpenMigrate(data);
      },
    },
    {
      label: "Edit VM",
      command: () => {
        onEdit();
      },
    },
    {
      label: "Delete VM",
      command: () => {
        onDelete({ name, namespace });
      },
    },
  ];

  const vmStats = useSelector((state) => state.reporting.vmStats[name] || {
    cpu: { used: 0, total: 0 },
    memory: { used: 0, total: 0 },
    storage: { used: 0, total: 0 }
  });

  useEffect(() => {
    if (name) {
      dispatch(getVmCpuStats(name));
      dispatch(getVmMemoryStats(name));
      dispatch(getVmStorageStats(name));
      
      const interval = setInterval(() => {
        dispatch(getVmCpuStats(name));
        dispatch(getVmMemoryStats(name));
        dispatch(getVmStorageStats(name));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [name, dispatch]);

  const onInitialLoad = () => {
    dispatch(
      onGetVMAction({ name, namespace }, (res, instance) => {
        setData((prev) => ({
          ...prev,
          created: res?.metadata?.creationTimestamp,
          name: res?.metadata?.name,
          namespace: res?.metadata?.namespace,
          labels: res?.metadata?.labels,
          status: res?.status?.printableStatus,

          cores: res?.spec?.template?.spec?.domain?.cpu?.cores,
          sockets: res?.spec?.template?.spec?.domain?.cpu?.sockets,
          threads: res?.spec?.template?.spec?.domain?.cpu?.threads,
          memory:
            res?.spec?.template?.spec?.domain?.resources?.requests?.memory,

          storageDisks: res?.spec?.template?.spec?.volumes,

          interfaces: res?.spec?.template?.spec?.domain?.devices?.interfaces,
          networks: res?.spec?.template?.spec?.networks,

          conditions: instance?.status?.conditions?.[0],
          ipAddress: instance?.status?.interfaces?.map(
            (item) => item?.ipAddress
          ),
          guestOS: instance?.status?.guestOSInfo?.name,
          node: instance?.status?.nodeName,
        }));
      })
    );
  };

  const [data, setData] = useState({
    status: "",
    conditions: {},
    created: "",
    uptime: "",
    labels: {},
    node: "",
    cluster: "",
    ipAddress: "",
    storageDisks: "",
    networks: [],
    interfaces: [],
    cores: "",
    model: "",
    sockets: "",
    threads: "",
    memory: "",
    yaml: yamlTemplate,
  });

  const [volumes, setVolumes] = useState([]);

  useEffect(() => {
    if (data?.storageDisks?.length) {
      dispatch(
        getVolumesAction(namespace, data?.storageDisks, (res) => {
          setVolumes(res);
        })
      );
    } // eslint-disable-next-line
  }, [data?.storageDisks]);

  const statusTemplate = (item) => {
    switch (item.status) {
      case "Starting":
        return (
          <span className="text-pink-400">
            <i className="pi pi-play-circle text-sm mr-1"></i>Starting
          </span>
        );
      case "Ready":
        return (
          <span className="text-green-500">
            <i className="pi pi-check-circle text-sm mr-1"></i>Ready
          </span>
        );
      case "Running":
        return (
          <span className="text-cyan-500">
            <i className="pi pi-check-circle text-sm mr-1"></i>Running
          </span>
        );
      case "Stopping":
        return (
          <span className="text-red-400">
            {" "}
            <i className="pi pi-ban text-sm mr-1"></i>Stopping
          </span>
        );
      case "Stopped":
        return (
          <span className="text-red-500">
            <i className="pi pi-ban text-sm mr-1"></i>Stopped
          </span>
        );
      case "Paused":
        return (
          <span className="text-yellow-500">
            <i className="pi pi-pause-circle text-sm mr-1"></i>Paused
          </span>
        );
      default:
        return <span>{item.status}</span>;
    }
  };

  const onStart = () => {
    dispatch(
      onChangeVmStatusAction(
        { name, namespace },
        {
          running: true,
        },
        () => {
          onInitialLoad();
        }
      )
    );
  };
  const onStop = () => {
    dispatch(
      onChangeVmStatusAction(
        { name, namespace },
        {
          running: false,
        },
        () => {
          onInitialLoad();
        }
      )
    );
  };
  const actions = [
    {
      label: "Reboot",
      disabled: data.status !== "Running",
    },
    {
      label: data.status === "Paused" ? "Unpause" : "Pause",
      command: () => {
        dispatch(
          onPauseVMAction({
            name,
            namespace,
            type: data.status === "Paused" ? "unpause" : "pause",
          })
        );
      },
      disabled: !["Running", "Paused"].includes(data.status),
    },
    {
      label: "Stop",
      command: () => {
        dispatch(
          onChangeVmStatusAction(
            { name, namespace },
            {
              running: false,
            }
          )
        );
      },
      disabled: data.status !== "Running",
    },
  ];
  const renderButtons = () => (
    <>
      <div className="flex justify-between items-center mb-4 w-full">
        <div className="flex items-center gap-2 w-full">
          <CustomButtonOutlined
            label="Start"
            severity="success"
            icon="pi pi-play"
            className="refresh-button"
            onClick={data.status === "Stopped" ? () => onStart() : null}
          />
          <CustomButtonOutlined
            label="Shutdown"
            icon="pi pi-power-off"
            model={actions}
            className="refresh-button"
            severity="danger"
            onClick={data.status === "Running" ? () => onStop() : null}
          />
        </div>
        
        <div className="flex items-right gap-2">
          <CustomButtonOutlined
            label="Refresh"
            severity="secondary"
            icon="pi pi-refresh"
            className="refresh-button"
            onClick={() => onInitialLoad()}
          />
          <CustomButtonOutlined
            label="Console"
            severity="secondary"
            className="refresh-button"
            icon="pi pi-code"
            onClick={() => setShowVncDialog(true)}
          />
          <CustomSplitButton
            label="More Actions"
            model={moreActions}
            className="refresh-button"
            severity="secondary"
          />
        </div>
      </div>
    </>
  );

  const calculatePercentage = (used, total) => {
    if (!total || total === 0) return 0;
    const percentage = (used / total) * 100;
    return isFinite(percentage) ? percentage.toFixed(1) : 0;
  };

  const getSource = (item) => {
    let source = item?.spec?.source;
    return source?.http || source?.registry || source?.gcs || source?.s3;
  };

  useEffect(() => {
    console.log('VM CPU Stats:', {
      used: vmStats?.cpu?.used,
      total: vmStats?.cpu?.total,
      available: vmStats?.cpu?.total - vmStats?.cpu?.used
    });
    
    console.log('VM Memory Stats:', {
      used: vmStats?.memory?.used,
      total: vmStats?.memory?.total,
      available: vmStats?.memory?.total - vmStats?.memory?.used
    });
    
    console.log('VM Storage Stats:', {
      used: vmStats?.storage?.used,
      total: vmStats?.storage?.total,
      available: vmStats?.storage?.total - vmStats?.storage?.used
    });
  }, [vmStats]);

  return (
    <>
      <Tooltip target=".vm-status-icon" />
      <EditVmModal visible={editInfo} setVisible={setEditInfo} />
      <MigrateModal visible={onOpenMigrate} setVisible={setOpenMigrate} />
      <Page title={name}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{name}</h1>
            <span className="ml-2">{statusTemplate({ status: data.status })}</span>
          </div>
        </div>
        
        {renderButtons()}
        
        <TabView>
          <TabPanel header="Overview">
            <Grid>
              <Col size={4}>
                <CustomCard title="Status">
                  <CustomCardField title="Name" value={name} />
                  <CustomCardField
                    title="Status"
                    value={data?.status}
                    template={statusTemplate(data)}
                  />
                  <CustomCardField
                    title="Conditions"
                    value={data?.conditions?.type}
                  />
                  <CustomCardField
                    title="Created"
                    value={data.created && timeAgo(data.created)}
                  />
                  <CustomCardField
                    title="Uptime"
                    value={
                      data?.conditions?.lastTransitionTime &&
                      moment(data?.conditions?.lastTransitionTime).fromNow()
                    }
                  />
                </CustomCard>
                <CustomCard title="Resource Utilization">
                  <Grid>
                    <Col size={4}>
                      <div className="py-4 px-3">
                        <div className="space-y-2">
                          <div className="grid grid-col-2 justify-content-center gap-4">
                            <SemiCircleGauge
                              title="CPU"
                              percentage={Number((vmStats?.cpu?.used || 0).toFixed(2))}
                              used={(vmStats?.cpu?.used || 0).toFixed(2)}
                              available={100}
                            />
                          </div>
                          <div className="grid grid-col-2 justify-content-center gap-4">
                            <div className="">
                              <span className="text-black font-semibold">{(vmStats?.cpu?.used || 0).toFixed(2)}%</span>
                              <span className="text-gray-500"> used</span>
                              <br />
                              <span className="text-black font-semibold">100%</span>
                              <span className="text-gray-500"> available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col size={4}>
                      <div className="py-4 px-3">
                        <div className="space-y-2">
                          <div className="grid grid-col-2 justify-content-center gap-4">
                            <SemiCircleGauge
                              title="Memory"
                              percentage={Number(((vmStats?.memory?.used || 0) / (vmStats?.memory?.total || 1) * 100).toFixed(2))}
                              used={(vmStats?.memory?.used || 0).toFixed(2)}
                              available={(vmStats?.memory?.total || 0).toFixed(2)}
                            />
                          </div>
                          <div className="grid grid-col-2 justify-content-center gap-4">
                            <div className="">
                              <span className="text-black font-semibold">{(vmStats?.memory?.used || 0).toFixed(2)} GB</span>
                              <span className="text-gray-500"> used</span>
                              <br />
                              <span className="text-black font-semibold">{(vmStats?.memory?.total || 0).toFixed(2)} GB</span>
                              <span className="text-gray-500"> available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col size={4}>
                      <div className="py-4 px-3">
                        <div className="space-y-2">
                          <div className="grid grid-col-2 justify-content-center gap-4">
                            <SemiCircleGauge
                              title="Storage"
                              percentage={Number(((vmStats?.storage?.used || 0) / (vmStats?.storage?.total || 1) * 100).toFixed(2))}
                              used={(vmStats?.storage?.used || 0).toFixed(2)}
                              available={(vmStats?.storage?.total || 0).toFixed(2)}
                            />
                          </div>
                          <div className="grid grid-col-2 justify-content-center gap-4">
                            <div className="">
                              <span className="text-black font-semibold">{(vmStats?.storage?.used || 0).toFixed(2)} GB</span>
                              <span className="text-gray-500"> used</span>
                              <br />
                              <span className="text-black font-semibold">{(vmStats?.storage?.total || 0).toFixed(2)} GB</span>
                              <span className="text-gray-500"> available</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Grid>
                </CustomCard>
              </Col>
              
              <Col size={4}>
                <CustomCard title="Details">
                  <CustomCardField title="Namespace" value={namespace} />
                  <CustomCardField
                    title="Node"
                    template={<Link>{data?.node}</Link>}
                  />
                  <CustomCardField
                    title="Cluster"
                    value={data?.cluster}
                    template={<Link>{data?.cluster}</Link>}
                  />
                  <CustomCardField
                    title="IP Address"
                    value={data?.ipAddress}
                  />
                </CustomCard>
                <CustomCard title="Mounted Components">
                  <CustomCardField
                    title="Storage Disks"
                    value={volumes?.length}
                  />
                  <CustomCardField
                    title="Networking (NIC)"
                    value={data?.networks?.length}
                  />
                </CustomCard>
                <CustomCard title="Allocated Resources">
                  <CustomCardField title="Cores" value={data?.cores} />
                  <CustomCardField title="Sockets" value={data?.sockets} />
                  <CustomCardField title="Threads" value={data?.threads} />
                  <CustomCardField title="Memory" value={data?.memory} />
                </CustomCard>
              </Col>

              <Col size={4}>
                <CustomCard title="Events">
                  <div className="p-4 text-gray-500 text-center">
                    No events to display
                  </div>
                </CustomCard>
                <CustomCard title="Notes">
                  <div className="p-4 text-gray-500 text-center">
                    No notes available
                  </div>
                </CustomCard>
              </Col>
            </Grid>
          </TabPanel>
          <TabPanel header="YAML">
            <YamlEditor value={data?.yaml} templateData={{ template: data.yaml }}/>
          </TabPanel>
          <TabPanel header="Disk">
            <Grid>
              {volumes &&
                volumes?.map((item) => (
                  <Col size={6}>
                    <CustomCard title={item.name}>
                      <CustomCardField
                        title="Name"
                        value={item?.metadata?.name}
                      />
                      <CustomCardField title="Type" value={item?.kind} />
                      <CustomCardField
                        title="Size"
                        value={item?.spec?.pvc?.resources?.requests?.storage}
                      />
                      <CustomCardField
                        title="Status"
                        value={item?.status?.phase}
                      />
                      <CustomCardField
                        title="Storage Class"
                        value={item?.spec?.pvc?.storageClassName}
                      />
                      <CustomCardField
                        title="Source"
                        value={longOverlayText(getSource(item), "url", 40)}
                      />
                      <CustomCardField
                        title="Access Mode"
                        value={item?.spec?.pvc?.accessModes}
                      />
                      <CustomCardField title="PVC" />
                    </CustomCard>
                  </Col>
                ))}
            </Grid>
          </TabPanel>
          <TabPanel header="Network Interfaces">
            <Grid>
              {data?.networks?.map((item) => (
                <Col size={4}>
                  <CustomCard title={item?.name}>
                    <CustomCardField
                      title="Network Type"
                      value={item?.pod && "podNetwork"}
                    />
                    <CustomCardField
                      title="Network Mode"
                      value={
                        data.interfaces.find((int) => int.name === item.name)
                          ?.masquerade
                          ? "masquerade"
                          : "bridge"
                      }
                    />
                  </CustomCard>
                </Col>
              ))}
            </Grid>
          </TabPanel>
        </TabView>
      </Page>

      <Dialog
        header={`Console: ${name}`}
        visible={showVncDialog}
        style={{ width: '80vw' }}
        modal
        onHide={onCloseConsole}
        maximizable
      >
        <div style={{ height: '70vh', width: '100%' }}>
          <div style={{ color: 'white', padding: '10px', backgroundColor: 'black' }}>
            <strong>VNC URL :</strong> {`/server/apis/subresources.kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachineinstances/${name}/vnc`}
          </div>
          <VncScreen
            url={`/server/apis/subresources.kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachineinstances/${name}/vnc`}
            scaleViewport
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000'
            }}
            onConnect={() => console.log('VNC Connected')}
            onDisconnect={() => console.log('VNC Disconnected')}
            onError={(error) => {
              console.error('VNC Error:', error);
              dispatch(showToastAction({
                type: 'error',
                title: 'Console Error',
                message: 'Failed to connect to VM console'
              }));
            }}
            wsProtocols={['binary']}
          />
        </div>
      </Dialog>
    </>
  );
}
