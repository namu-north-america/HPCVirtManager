import React, { useEffect, useState } from "react";
import CustomModal from "../../../shared/CustomModal";
import { CustomDropDown, CustomForm } from "../../../shared/AllInputs";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { onMigrateVMAction } from "../../../store/actions/vmActions";

export default function MigrateModal({ visible, setVisible }) {
  const dispatch = useDispatch();
  let { nodes } = useSelector((state) => state.project);
  nodes = nodes.map((item) => ({ name: item.name, value: item.name }));
  let unSelected = nodes.filter((item) => item?.name !== visible?.node);
  const [data, setData] = useState({
    migratingFrom: "",
    migratingTo: "",
  });

  useEffect(() => {
    setData((prev) => ({ ...prev, migratingFrom: visible?.node }));
  }, [visible?.node]);

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    dispatch(onMigrateVMAction(visible, () => setVisible(false)));
  };

  return (
    <CustomModal
      title="Migrating Virtual Machine From Node to Node"
      visible={visible}
      onHide={() => setVisible(false)}
    >
      <p>
        <i className="pi pi-exclamation-triangle"></i>Note: The VM needs to be
        restarted in order for changes to take effect.
      </p>
      <br />
      <CustomForm>
        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="migratingFrom"
          options={nodes}
          required
          col={12}
          disabled
        />
        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="migratingTo"
          options={unSelected}
          required
          col={12}
        />
      </CustomForm>

      <Buttonlayout>
        <CustomButtonOutlined
          label="Cancel"
          severity="secondary"
          onClick={() => setVisible(false)}
        />
        <CustomButton label="Migrate" onClick={onSubmit} />
      </Buttonlayout>
    </CustomModal>
  );
}
