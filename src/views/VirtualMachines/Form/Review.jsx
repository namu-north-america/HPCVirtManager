import React from "react";
import { CustomField, CustomForm } from "../../../shared/AllInputs";

export default function Review({ data, disks }) {
  return (
    <>
      <CustomForm>
        <CustomField label="VM Name" name="name" data={data} />
        <CustomField name="namespace" data={data} />
        {data.virtualMachineType === 'custom' ? (
          <>
            <CustomField name="sockets" data={data} />
            <CustomField name="cores" data={data} />
            <CustomField name="threads" data={data} />
            <CustomField name="memory" data={data} />
          </>
        ) : 
          <CustomField label="Virtual Machine Type" name="virtualMachineType" data={data}/>
        }
      </CustomForm>
      <br />
      <CustomForm>
        {disks?.map((disk, i) => (
          <>
            {i ? <div className=" col-6 border-200 border-top-1"></div> : null}
            {disk?.type === "existing" ? (
              <>
                <CustomField
                  label={`Disk(${i + 1})  Name`}
                  name="disk"
                  data={disk}
                />
              </>
            ) : (
              <>
                <CustomField
                  label={`Disk(${i + 1})  Name`}
                  value={`${data?.name}-disk${i + 1} (After Creation)`}
                />
                <CustomField label="Disk Size (GiB)" name="size" data={disk} />
                <CustomField name="storageClass" data={disk} />
                <CustomField name="accessMode" data={disk} />
                <CustomField label="Image URL" name="url" data={disk} />
              </>
            )}
          </>
        ))}
      </CustomForm>
      <br />
      <CustomForm>
        <CustomField name="networkType" data={data} />
        <CustomField name="bindingMode" data={data} />
      </CustomForm>
      <br />
      <CustomForm>
        <CustomField name="userName" data={data} />
        <CustomField name="password" data={data} />
      </CustomForm>
    </>
  );
}
