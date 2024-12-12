import React, { useState, useMemo } from "react";
import CustomModal from "../../../shared/CustomModal";
import { CustomDropDown, CustomForm, CustomInput } from "../../../shared/AllInputs";
import { useDispatch, useSelector } from "react-redux";
import CustomButton, { Buttonlayout, CustomButtonOutlined } from "../../../shared/CustomButton";
import { onAddNetworkHotPlugVmAction } from "../../../store/actions/vmActions";

export default function NetworkHotPlugModal({
  name,
  namespace,
  isOpen,
  setVisible,
  volumes,
  networks,
  interfaces,
  ...rest
}) {
  const { networksDropdown, bindingModeDropdown } = useSelector((state) => state.project);
  console.log("networks", networksDropdown);
  const networksOption = useMemo(() => ["podNetwork", ...networksDropdown]);

  const [data, setData] = useState({
    networkType: "",
    bindingMode: "",
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onAddAction = () => {
    setLoading(true);
    dispatch(
      onAddNetworkHotPlugVmAction(namespace, name, networks, interfaces, data, (res) => {
        setLoading(false);
        setVisible(false);
      })
    );
  };

  return (
    <CustomModal
      visible={isOpen}
      setVisible={setVisible}
      onHide={() => {
        setData({
          networkType: "",
          bindingMode: "",
        });
      }}
      {...rest}
    >
      <CustomForm>
        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="networkType"
          options={networksOption}
          required
          col={12}
        />

        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="bindingMode"
          options={bindingModeDropdown}
          required
          col={12}
        />
      </CustomForm>

      <Buttonlayout>
        <CustomButtonOutlined label="Cancel" severity="secondary" onClick={() => setVisible(false)} />
        <CustomButton label="Plug" loading={loading} onClick={onAddAction} />
      </Buttonlayout>
    </CustomModal>
  );
}
