import Page from "../../shared/Page";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getVMPoolsAction, onStopOrStartVMPoolActions, onVmPoolsScaleAction } from "../../store/actions/vmActions";
import { useDispatch } from "react-redux";
import { StatusTemplate } from "../../shared/DataTableTemplates";
import { Link } from "react-router-dom";
import { ActionItem, ActionsOverlay } from "../../shared/ActionsOverlay";
import CustomModal from "../../shared/CustomModal";
import { CustomForm } from "../../shared/AllInputs";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Buttonlayout } from "../../shared/CustomButton";
import { CustomInput } from "../../shared/AllInputs";
import { onDeleteVmPoolAction } from "../../store/actions/vmActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  replicas: z.number({ coerce: true }).min(1, { message: 'Replicas number is required' })
})

export default function VMPools() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showScaleDialog, setShowScaleDialog] = useState(false);
  const [selectedPool, setSelectedPool] = useState({});
  const { vmPools } = useSelector(state => state.project);

  const scaleForm = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      replicas: 0
    }
  });

  const onAdd = () => {
    navigate("/virtual-machines/add", { state: { isVmPool: true } });
  }

  useEffect(() => {
    dispatch(getVMPoolsAction());
  }, []);

  const nameTemplate = (item) => {
    return (
      <Link to={`/virtual-machine-pools/${item.name}`} state={{ name: item.name, namespace: item.namespace }}>
        {item.name}
      </Link>
    )
  }

  const onStop = (item) => {
    dispatch(onStopOrStartVMPoolActions({ name: item.name, namespace: item.namespace }, () => { }))
  }

  const onRestart = () => { }
  const onStart = () => { }
  const onEdit = () => { }
  const onDelete = (item) => {
    dispatch(onDeleteVmPoolAction({ name: item.name, namespace: item.namespace }, (res) => { }))
  }

  const onScaleDownOrUp = (item) => {
    setSelectedPool(prev => {
      return item;
    })
    scaleForm.setValue('replicas', item.replicas)
    setShowScaleDialog(true)
  }

  const onPauseUnpause = (item) => {
    dispatch(onStopOrStartVMPoolActions({ name: item.name, namespace: item.namespace, action: 'unpouse' }, () => { }))
  }

  const actionTemplate = (item) => {
    return (
      <ActionsOverlay>
        {item?.status === "Running" && (
          <>
            <ActionItem onClick={() => onPauseUnpause(item, "pause")}>
              Pause
            </ActionItem>
            <ActionItem onClick={() => onStop(item)}>
              Stop
            </ActionItem>
            <ActionItem
              onClick={() => onRestart(item)}
            >
              Restart
            </ActionItem>
            <ActionItem
              onClick={() => onScaleDownOrUp(item)}
            >
              Scale
            </ActionItem>
            <ActionItem onClick={() => onDelete(item)}>
              Delete
            </ActionItem>
          </>
        )}
        {item?.status === "Paused" && (
          <>
            <ActionItem
              onClick={() => onPauseUnpause(item, "unpause")}
            >
              Unpause
            </ActionItem>
            <ActionItem onClick={() => onStop(item)}>
              Stop
            </ActionItem>
            <ActionItem
              onClick={() => onRestart(item)}
            >
              Restart
            </ActionItem>
            <ActionItem onClick={() => onDelete(item)}>
              Delete
            </ActionItem>
          </>
        )}
        {(item?.status === "Stopped" || item?.status === "Stopping") && (
          <>
            <ActionItem
              onClick={() => onStart(item)}
            >
              Start
            </ActionItem>
            <ActionItem
              onClick={() => onEdit(item)}
            >
              Edit VM
            </ActionItem>
            <ActionItem onClick={() => onDelete(item)}>
              Delete VM
            </ActionItem>
          </>
        )}

        {!["Running", "Paused", "Stopped", "Stopping"].includes(
          item?.status
        ) && (
            <>
              <ActionItem onClick={() => onStop(item)}>
                Stop
              </ActionItem>
            </>
          )}
      </ActionsOverlay>
    );
  }

  const vmPoolStatusTemplate = (item) => {
    return (
      <span>{<StatusTemplate status={item.status} />}{item.runningReplicas}</span>
    )
  }

  const onScaleSubmit = (values) => {
    dispatch(onVmPoolsScaleAction({
      name: selectedPool.name,
      namespace: selectedPool.namespace,
      replicas: values.replicas
    }, (res) => {
      setShowScaleDialog(false)
    }))
  }

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
            render={({ field, fieldState: { error } }) =>
              <CustomInput label={`Replicas(${selectedPool.replicas})`} name="replicas" col={12} {...field} errorMessage={error?.message} />
            }
          />
          <Buttonlayout position="end" className="w-full">
            <Button
              label={`Scale ${scaleForm.watch('replicas') > selectedPool.replicas ? 'Up' : 'Down'}`}
              type="submit"
            />
          </Buttonlayout>
        </CustomForm>
      </CustomModal>
    </Page>
  )
}
