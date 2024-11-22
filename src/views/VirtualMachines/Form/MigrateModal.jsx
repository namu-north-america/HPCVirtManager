import React, { useEffect, useState } from "react";
import CustomModal from "../../../shared/CustomModal";
import { CustomDropDown, CustomForm } from "../../../shared/AllInputs";
import CustomButton, {
  Buttonlayout,
  CustomButtonOutlined,
} from "../../../shared/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { onMigrateVMAction } from "../../../store/actions/vmActions";

export default function MigrateModal({ visible, setVisible, onHide, vm }) {
  const dispatch = useDispatch();
  let { nodes } = useSelector((state) => state.project);
  nodes = nodes.map((item) => ({ name: item.name, value: item.name }));
  const currentVM = vm || visible; // Support both vm prop and visible object
  let unSelected = nodes.filter((item) => item?.name !== currentVM?.node);
  const [data, setData] = useState({
    migratingFrom: "",
    migratingTo: "",
  });

  useEffect(() => {
    setData((prev) => ({ ...prev, migratingFrom: currentVM?.node }));
  }, [currentVM?.node]);

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHide = () => {
    if (onHide) {
      onHide();
    } else if (setVisible) {
      setVisible(false);
    }
  };

  const onSubmit = () => {
    dispatch(onMigrateVMAction(currentVM, handleHide));
  };

  return (
    <CustomModal
      title="Migrating Virtual Machine From Node to Node"
      visible={visible}
      onHide={handleHide}
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
          onClick={handleHide}
        />
        <CustomButton label="Migrate" onClick={onSubmit} />
      </Buttonlayout>
    </CustomModal>
  );
}
