import { z } from "zod";
import CustomModal from "../../shared/CustomModal";
import { CustomDropDown, CustomForm, CustomInput } from "../../shared/AllInputs";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getVMPoolsAction } from "../../store/actions/projectActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAutoScalingAction } from "../../store/actions/scalingActions";
import { Buttonlayout } from "../../shared/CustomButton";
import { Button } from "primereact/button";

const schema = z.object({
  min: z.number({ coerce: true }).min(1, { message: "Minimum replicas is required" }),
  max: z.number({ coerce: true }).min(1, { message: "Maximum replicas is required" }),
  threshold: z.number({ coerce: true }).min(1, { message: "Threshold is required" }).lte(100),
});

export const CreateScalingGroupModal = ({ isOpen, onHide }) => {
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      namespace: "",
      vmpool: "",
      min: "",
      max: "",
      threshold: "",
    },
  });

  const onSubmit = (data) => {
    setIsPending(true);
    dispatch(
      createAutoScalingAction(data, (res) => {
        setIsPending(false);
        if (res?.status !== "Failure") {
          reset({});
          onHide();
        }
      })
    );
  };

  return (
    <CustomModal
      title="New Auto Scaling Group"
      visible={isOpen}
      onHide={() => {
        reset();
        onHide();
      }}
    >
      <CustomForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="min"
          render={({ field, fieldState: { error } }) => (
            <CustomInput label="Min Replicas" name="min" col={12} {...field} errorMessage={error?.message} />
          )}
        />
        <Controller
          control={control}
          name="max"
          render={({ field, fieldState: { error } }) => (
            <CustomInput label="Max Replicas" name="max" col={12} {...field} errorMessage={error?.message} />
          )}
        />
        <Controller
          control={control}
          name="threshold"
          render={({ field, fieldState: { error } }) => (
            <CustomInput
              label="Target CPU Utilization Threshold (%)"
              name="threshold"
              col={12}
              {...field}
              errorMessage={error?.message}
            />
          )}
        />
        <Buttonlayout position="end" className="w-full">
          <Button loading={isPending}>Save</Button>
        </Buttonlayout>
      </CustomForm>
    </CustomModal>
  );
};
