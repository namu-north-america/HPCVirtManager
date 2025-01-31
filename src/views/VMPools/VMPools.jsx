import Page from "../../shared/Page";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getInstanceTypesAction,
  onEditVmPoolAction,
  onStopOrStartVMPoolActions,
  onVmPoolsScaleAction,
} from "../../store/actions/vmActions";
import { useDispatch } from "react-redux";
import { StatusTemplate } from "../../shared/DataTableTemplates";
import { Link } from "react-router-dom";
import { ActionItem, ActionsOverlay } from "../../shared/ActionsOverlay";
import CustomModal from "../../shared/CustomModal";
import { CustomDropDown, CustomForm } from "../../shared/AllInputs";
import { Controller, set } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Buttonlayout } from "../../shared/CustomButton";
import { CustomInput } from "../../shared/AllInputs";
import { onDeleteVmPoolAction } from "../../store/actions/vmActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getVMPoolsAction } from "../../store/actions/projectActions";
import { confirmDialog } from "primereact/confirmdialog";
import { checkNamespaceValue, showFormErrors } from "../../utils/commonFunctions";
import { showToastAction } from "../../store/slices/commonSlice";

const schema = z.object({
  replicas: z.number({ coerce: true }).min(1, { message: "Replicas number is required" }),
});

export default function VMPools() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const { profile, userNamespace } = useSelector((state) => state.user);
  const instanceTypes = useSelector((state) => state.project.instanceTypes.map((item) => item.name));
  const [showEditDialog, setShowEditDialog] = useState(false);
  // const [instanceType, setInstanceType] = useState({});
  const [selectedPool, setSelectedPool] = useState({});
  const { vmPools } = useSelector((state) => state.project);

  const scaleForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      replicas: 0,
    },
  });

  const editForm = useForm({
    defaultValues: {
      instanceType: selectedPool.instancetype,
    },
  });

  const onAdd = () => {
    navigate("/virtual-machines/add", { state: { isVmPool: true } });
  };

  useEffect(() => {
    dispatch(getVMPoolsAction());
    dispatch(getInstanceTypesAction());
  }, []);

  const nameTemplate = (item) => {
    return (
      <Link to={`/virtual-machine-pools/${item.name}`} state={{ name: item.name, namespace: item.namespace }}>
        {item.name}
      </Link>
    );
  };

  const showError = () => {
    dispatch(
      showToastAction({
        type: "error",
        title: "Sorry You have no permission!",
      })
    );
  };

  const onStop = (item) => {
    dispatch(onStopOrStartVMPoolActions({ name: item.name, namespace: item.namespace }, () => {}));
  };

  const onRestart = () => {};

  const onStart = (item) => {
    dispatch(onStopOrStartVMPoolActions({ name: item.name, namespace: item.namespace, action: "unpouse" }, () => {}));
  };

  const onEdit = (item) => {
    setShowEditDialog(true);
    setSelectedPool(item);
    editForm.reset({ instanceType: item.instancetype });
  };

  const onDelete = (item) => {
    if (checkNamespaceValue(userNamespace, item.namespace, "crudVMS") || profile?.role === "admin") {
      confirmDialog({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        position: "top",
        accept: () => {
          dispatch(onDeleteVmPoolAction({ name: item.name, namespace: item.namespace }, (res) => {}));
        },
      });
    } else {
      showError();
    }
  };

  const onScaleDownOrUp = (item) => {
    setSelectedPool((prev) => {
      return item;
    });
    scaleForm.setValue("replicas", item.replicas);
    setShowScaleDialog(true);
  };

  const actionTemplate = (item) => {
    const { status } = item;
    return (
      <ActionsOverlay>
        {status.running > 0 && (
          <>
            <ActionItem onClick={() => onStop(item)}>Stop</ActionItem>
            <ActionItem onClick={() => onRestart(item)}>Restart</ActionItem>
            <ActionItem onClick={() => onScaleDownOrUp(item)}>Scale</ActionItem>
          </>
        )}
        {status.paused > 0 && (
          <>
            <ActionItem onClick={() => onStop(item)}>Stop</ActionItem>
            <ActionItem onClick={() => onRestart(item)}>Restart</ActionItem>
            <ActionItem onClick={() => onDelete(item)}>Delete</ActionItem>
          </>
        )}
        {(status.stopped > 0 || item?.status === "Stopping") && (
          <>
            <ActionItem onClick={() => onStart(item)}>Start</ActionItem>
          </>
        )}

        <ActionItem onClick={() => onDelete(item)}>Delete</ActionItem>
        <ActionItem onClick={() => onEdit(item)}>Edit VM</ActionItem>
      </ActionsOverlay>
    );
  };

  const vmPoolStatusTemplate = (item) => {
    const { status } = item;

    return (
      <div className="flex">
        {status.running > 0 && (
          <span className="px-1">
            <StatusTemplate status={"Running"} />({item.runningReplicas})
          </span>
        )}
        {status.stopped > 0 && (
          <span>
            <StatusTemplate status={"Stopped"} />({status.stopped})
          </span>
        )}
        {status.provisioning > 0 && (
          <span>
            <StatusTemplate status={"Provisioning"} />({status.provisioning})
          </span>
        )}
      </div>
    );
  };

  const onScaleSubmit = (values) => {
    dispatch(
      onVmPoolsScaleAction(
        {
          name: selectedPool.name,
          namespace: selectedPool.namespace,
          replicas: values.replicas,
        },
        (res) => {
          setShowScaleDialog(false);
        }
      )
    );
  };

  const onEditSubmit = (values) => {
    const data = { instancetype: values.instanceType };
    dispatch(
      onEditVmPoolAction({ name: selectedPool.name, namespace: selectedPool.namespace, data }, (res) => {
        setShowEditDialog(false);
      })
    );
  };

  return (
    <Page
      title="VM Pools"
      onAdd={onAdd}
      onRefresh={() => {
        dispatch(getVMPoolsAction());
      }}
      addText="Add VM Pool"
    >
      <DataTable value={vmPools}>
        <Column field="name" header="Name" body={nameTemplate}></Column>
        <Column field="namespace" header="Namespace"></Column>
        <Column field="status" header="Status" body={vmPoolStatusTemplate}></Column>
        <Column field="instancetype" header="Instance Type"></Column>
        <Column field="replicas" header="Replicas"></Column>
        <Column body={actionTemplate}></Column>
      </DataTable>
      <CustomModal title="Scale down/up" visible={showScaleDialog} onHide={setShowScaleDialog}>
        <CustomForm onSubmit={scaleForm.handleSubmit(onScaleSubmit)}>
          <Controller
            control={scaleForm.control}
            name="replicas"
            render={({ field, fieldState: { error } }) => (
              <CustomInput
                label={`Replicas(${selectedPool.replicas})`}
                name="replicas"
                col={12}
                {...field}
                errorMessage={error?.message}
              />
            )}
          />
          <Buttonlayout position="end" className="w-full">
            <Button
              label={`Scale ${scaleForm.watch("replicas") > selectedPool.replicas ? "Up" : "Down"}`}
              type="submit"
            />
          </Buttonlayout>
        </CustomForm>
      </CustomModal>

      <CustomModal title="Change Instance Type" visible={showEditDialog} setVisible={setShowEditDialog}>
        <CustomForm onSubmit={editForm.handleSubmit(onEditSubmit)}>
          <Controller
            control={editForm.control}
            name="instanceType"
            render={({ field }) => {
              return (
                <CustomDropDown
                  value={field.value}
                  options={instanceTypes}
                  onChange={field.onChange}
                  name="virtualMachineType"
                  label="Virtual Machine Type"
                  required
                />
              );
            }}
          />
          <Buttonlayout position="end" className="w-full">
            <Button label={`Submit`} type="submit" />
          </Buttonlayout>
        </CustomForm>
      </CustomModal>
    </Page>
  );
}
