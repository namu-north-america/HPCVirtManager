import { FormProvider, useForm } from "react-hook-form";
import { CustomForm } from "../../shared/AllInputs";
import CustomModal from "../../shared/CustomModal";
import { ServiceTypeDropdown } from "./ServiceTypeDropdown";
import { Buttonlayout } from "../../shared/CustomButton";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateNetworkAccessAction } from "../../store/actions/networkAccessActions";

export const ServiceSettingsModal = ({ isOpen, serviceItem, onHide }) => {
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      serviceType: "",
    },
  });

  const onSubmit = (data) => {
    setIsPending(true);

    const values = {
      name: serviceItem.name,
      namespace: serviceItem.namespace,
      ...data,
    };

    dispatch(
      updateNetworkAccessAction(values, () => {
        setIsPending(false);
        onHide();
        form.reset({});
      })
    );
  };

  useEffect(() => {
    form.reset({ serviceType: serviceItem.serviceType });
  }, [serviceItem, form]);

  return (
    <CustomModal visible={isOpen} title={`Edit Service(${serviceItem.name})`} onHide={onHide}>
      <FormProvider {...form}>
        <CustomForm onSubmit={form.handleSubmit(onSubmit)}>
          <ServiceTypeDropdown />
          <Buttonlayout position="end" className="w-full">
            <Button loading={isPending}>Update</Button>
          </Buttonlayout>
        </CustomForm>
      </FormProvider>
    </CustomModal>
  );
};
