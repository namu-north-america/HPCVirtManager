import { Controller, useFormContext } from "react-hook-form";
import { CustomDropDown } from "../../shared/AllInputs";

export const ServiceTypeDropdown = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="serviceType"
      render={({ field, fieldState: { error } }) => {
        return (
          <CustomDropDown
            value={field.value}
            options={["ClusterIP", "LoadBalancer", "NodePort"]}
            onChange={field.onChange}
            name="serviceType"
            label="Service Type"
            required
            extraClassName="w-full"
            errorMessage={error?.message}
          />
        );
      }}
    />
  );
};
