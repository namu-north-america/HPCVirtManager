import { z } from "zod";
import CustomModal from "../../shared/CustomModal";
import { Controller, useForm } from "react-hook-form";
import { CustomForm, CustomInput } from "../../shared/AllInputs";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAutoScalingGroups, updateAutoScaleItemAction } from "../../store/actions/scalingActions";
import { Buttonlayout } from "../../shared/CustomButton";
import { Button } from "primereact/button";

const schema = z.object({
  min: z.number({ coerce: true }).min(1, { message: "Minimum replicas is required" }),
  max: z.number({ coerce: true }).min(1, { message: "Maximum replicas is required" }),
  threshold: z.number({ coerce: true }).min(1, { message: "Threshold is required" }).lte(100),
});

export const UpdateScalingGroupModal = ({ isOpen, onHide, defaultValues }) => {
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      min: "",
      max: "",
      threshold: "",
    },
  });

  const onSubmit = (data) => {
    const { name, namespace } = defaultValues;
    setIsPending(true);
    dispatch(
      updateAutoScaleItemAction({ ...data, name, namespace }, (res) => {
        setIsPending(false);
        if (res?.status !== "Failure") {
          dispatch(getAutoScalingGroups());
          reset({});
          onHide();
        } else {
        }
      })
    );
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <CustomModal
      title={`Edit Auto Scaling Group(${defaultValues?.name})`}
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
