import React, { useEffect, useState } from "react";
import CustomModal from "../../../shared/CustomModal";
import {
  CustomForm,
  CustomInput,
  CustomMemoryInput,
} from "../../../shared/AllInputs";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import { useDispatch } from "react-redux";
import { onEditVMAction } from "../../../store/actions/vmActions";
import { splitMemoryString } from "../../../utils/commonFunctions";

export default function EditVmModal({ visible, setVisible }) {
  const [data, setData] = useState({
    sockets: "",
    cores: "",
    threads: "",
    memory: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) return;
    
    const { size, memoryType } = splitMemoryString(visible?.memory);
    setData({
      name: visible?.name,
      namespace: visible?.namespace,
      sockets: visible?.sockets,
      cores: visible?.cores,
      threads: visible?.threads,
      memoryType: memoryType,
      memory: size,
    });
  }, [visible]);

  if (!visible) return null;

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onUpdate = () => {
    dispatch(
      onEditVMAction(data, setLoading, () => {
        setVisible(null);
      })
    );
  };

  return (
    <CustomModal
      title="Edit Virtual Machine"
      visible={visible}
      onHide={() => setVisible(null)}
    >
      <p>
        <i className="pi pi-exclamation-triangle"></i>Note: The VM needs to be
        restarted in order for changes to take effect.
      </p>
      <br />
      <CustomForm>
        <CustomInput
          data={data}
          onChange={handleChange}
          name="sockets"
          keyfilter="pint"
          required
          col={12}
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="cores"
          keyfilter="pint"
          required
          col={12}
        />
        <CustomInput
          data={data}
          onChange={handleChange}
          name="threads"
          keyfilter="pint"
          required
          col={12}
        />
        <CustomMemoryInput
          data={data}
          onChange={handleChange}
          name="memory"
          typeName="memoryType"
          onTypeChange={handleChange}
          label="Memory"
          keyfilter="pint"
          required
          col={12}
        />
      </CustomForm>

      <Buttonlayout>
        <CustomButtonOutlined
          label="Cancel"
          severity="secondary"
          onClick={() => setVisible(null)}
        />
        <CustomButton label="Update" loading={loading} onClick={onUpdate} />
      </Buttonlayout>
    </CustomModal>
  );
}
