import CustomModal from "../../shared/CustomModal";
import { CustomForm, CustomInput } from "../../shared/AllInputs";
import { Controller, useForm } from "react-hook-form";
import { Buttonlayout } from "../../shared/CustomButton";
import { Button } from "primereact/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { onAddInstanceTypeAction } from "../../store/actions/vmActions";


const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  cpu: z.number({ coerce: true }).min(1, { message: "CPU is required" }),
  memory: z.number({ coerce: true }).min(1, { message: "Memory is required" }),
});

export default function NewInstaceDialog({ isOpen, setVisible }) {
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", cpu: 0, memory: 0 }
  });
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(onAddInstanceTypeAction(data, (res) => {
      console.log("res for instance type___", res);
      if (res?.kind) {
        setVisible(false);
      }
    }));
  }

  return (
    <CustomModal visible={isOpen} setVisible={setVisible} title="New Instance Type">
      <CustomForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) =>
            <CustomInput label="Name" name="name" col={12} {...field} errorMessage={error?.message} />
          }
        />
        <Controller
          control={control}
          name="cpu"
          render={({ field, fieldState: { error } }) =>
            <CustomInput label="CPU" name="cpu" col={12} {...field} errorMessage={error?.message} />
          }
        />
        <Controller control={control} name="memory"
          render={({ field, fieldState: { error } }) =>
            <CustomInput label="Memory" name="memory" col={12} {...field} errorMessage={error?.message} />}
        />

        <Buttonlayout position="end" className="w-full">
          <Button label="Create" />
        </Buttonlayout>
      </CustomForm>

    </CustomModal>
  );
}
