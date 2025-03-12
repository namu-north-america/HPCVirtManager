import { z } from "zod";
import CustomModal from "../../shared/CustomModal";
import { CustomDropDown, CustomForm, CustomInput } from "../../shared/AllInputs";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getNamespacesAction, getVMPoolsAction, getVMsAction } from "../../store/actions/projectActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Buttonlayout } from "../../shared/CustomButton";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { createServiceAction, getServicesAction } from "../../store/actions/serviceActions";
import { ServiceTypeDropdown } from "./ServiceTypeDropdown";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  namespace: z.string().min(1, { message: "Namespace is required" }),
  serviceType: z.string().min(1, { message: "Service type is required" }),
  targetVmType: z.string().min(1, { message: "You need to select one target vm" }),
  targetResource: z.string().min(1, { message: "You need to select a resource from that target vm" }),
  ports: z
    .array(
      z.object({
        name: z.string({ required_error: "Name is required" }).min(1, { message: "Name is required" }),
        port: z
          .number({ coerce: true, required_error: "Is required", message: "Port is not valid" })
          .min(1, { message: "Is required" }),
        targetPort: z
          .number({ coerce: true, required_error: "Is required", message: "Target Port is not valid" })
          .min(1, { message: "Is required" }),
      })
    )
    .min(1, { message: "" }),
});

export const CreateServiceModal = ({ isOpen, onHide }) => {
  let { namespacesDropdown } = useSelector((state) => state.project);
  const { vmPools, vms } = useSelector((state) => state.project);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      namespace: "",
      serviceType: "",
      targetResource: "",
      targetVmType: "",
      ports: [
        {
          name: "",
          port: "",
          targetPort: "",
          protocol: "",
        },
      ],
    },
  });

  const { control, handleSubmit, reset, watch } = form;

  const ports = useFieldArray({ control, name: "ports" });
  const vmType = watch("targetVmType");

  const onSubmit = (data) => {
    setIsPending(true);
    dispatch(
      createServiceAction(data, (res) => {
        setIsPending(false);
        if (res?.status !== "Failure") {
          dispatch(getServicesAction());
          reset({});
          onHide();
        }
      })
    );
  };

  useEffect(() => {
    dispatch(getVMPoolsAction());
    dispatch(getVMsAction());
    if (!namespacesDropdown.length) {
      dispatch(getNamespacesAction());
    }
  }, [namespacesDropdown, dispatch]);

  const vmPoolOptions = useMemo(() => {
    return vmPools.map((vmpool) => vmpool.name);
  }, [vmPools]);

  const vmOptions = useMemo(() => {
    return vms.map((vm) => vm.name);
  }, [vms]);

  return (
    <CustomModal
      title="New Service"
      visible={isOpen}
      onHide={() => {
        reset();
        onHide();
      }}
    >
      <FormProvider {...form}>
        <CustomForm onSubmit={handleSubmit(onSubmit)}>
          <Fieldset legend="Basic" className="w-full" toggleable>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <CustomInput label="Name" name="name" col={12} {...field} errorMessage={error?.message} />
              )}
            />
            <Controller
              control={control}
              name="namespace"
              render={({ field, fieldState: { error } }) => {
                return (
                  <CustomDropDown
                    value={field.value}
                    options={namespacesDropdown}
                    onChange={field.onChange}
                    name="namespace"
                    label="Namespace"
                    required
                    extraClassName="w-full"
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <ServiceTypeDropdown />

            <Controller
              control={control}
              name="targetVmType"
              render={({ field, fieldState: { error } }) => {
                const options = [
                  { name: "vm-instance", label: "VM Instance" },
                  { name: "vm-pool", label: "VM Pool" },
                ];
                const val = options.find((option) => option.name === field.value);
                return (
                  <CustomDropDown
                    value={val}
                    options={options}
                    onChange={(e) => {
                      field.onChange(e.value.name);
                    }}
                    name="targetVmType"
                    label="Target VM Type"
                    required
                    extraClassName="w-full"
                    optionLabel="label"
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="targetResource"
              render={({ field, fieldState: { error } }) => {
                return (
                  <CustomDropDown
                    value={field.value}
                    options={vmType === "vm-instance" ? vmOptions : vmPoolOptions}
                    onChange={field.onChange}
                    name="targetResource"
                    label="Target Resource"
                    required
                    extraClassName="w-full"
                    errorMessage={error?.message}
                  />
                );
              }}
            />
          </Fieldset>
          <Fieldset legend="Ports" className="w-full mt-2" toggleable>
            {ports.fields.map((port, index) => {
              return (
                <div className="flex">
                  <div className="formgrid grid align-center flex-shrink-1" key={port.id}>
                    <Controller
                      control={control}
                      name={`ports.${index}.name`}
                      render={({ field, fieldState: { error } }) => (
                        <CustomInput
                          extraClassName="field"
                          col="3"
                          label="Name"
                          {...field}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`ports.${index}.port`}
                      render={({ field, fieldState: { error } }) => (
                        <CustomInput
                          extraClassName="field"
                          label="Port"
                          name={`ports.${index}.port`}
                          col={3}
                          {...field}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`ports.${index}.targetPort`}
                      render={({ field, fieldState: { error } }) => (
                        <CustomInput
                          extraClassName="field"
                          label="Target Port"
                          name="targetPort"
                          col={3}
                          {...field}
                          errorMessage={error?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`ports.${index}.protocol`}
                      render={({ field, fieldState: { error } }) => {
                        console.log("vms____", vms, vmPools);
                        return (
                          <CustomDropDown
                            value={field.value}
                            options={[
                              { name: "tcp", label: "TCP" },
                              { name: "udp", label: "UDP" },
                            ]}
                            onChange={field.onChange}
                            name={`ports.${index}.protocol`}
                            label="Protocol"
                            required
                            col={3}
                            errorMessage={error?.message}
                            extraClassName="field"
                          />
                        );
                      }}
                    />
                  </div>
                  <div className="flex-shrink-0 align-items-center flex ustify-content-center">
                    <Button
                      icon="pi pi-trash"
                      rounded
                      text
                      severity="danger"
                      aria-label="Cancel"
                      onClick={(e) => {
                        e.preventDefault();
                        // const newPorts = [...ports.fields];
                        // newPorts.splice(index, 1);
                        ports.remove(index);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <Button
              label="Add"
              icon="pi pi-plus-circle"
              severity="secondary"
              onClick={(e) => {
                e.preventDefault();
                ports.append({ name: "", port: "" });
              }}
            />
          </Fieldset>

          <Buttonlayout position="end" className="w-full">
            <Button loading={isPending}>Create</Button>
          </Buttonlayout>
        </CustomForm>
      </FormProvider>
    </CustomModal>
  );
};
