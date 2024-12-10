import React, { useState } from "react";
import CustomModal from "../../../shared/CustomModal";
import { CustomDropDown, CustomForm, CustomInput } from "../../../shared/AllInputs";
import { useDispatch, useSelector } from "react-redux";
import CustomButton, { Buttonlayout, CustomButtonOutlined } from "../../../shared/CustomButton";
import { cacheOptions } from "../../../constants";
import { onAddHotPlugVmAction } from "../../../store/actions/vmActions";

export default function HotPlugModal({ name, namespace, isOpen, setVisible, volumes, ...rest }) {
  const { disks } = useSelector((state) => state.project);
  const { vms } = useSelector((state) => state.project);
  const [data, setData] = useState({
    volume: "",
    type: "",
    cache: "",
    isReadOnly: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = ({ name, value }) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const volumeOptions = disks
    .map((disk) => {
      const isMatch = vms.some((vm) => {
        return vm.volumes.some((volume) => {
          return disk.name === volume?.dataVolume?.name;
        });
      });

      console.log("is match___", isMatch);

      if (!isMatch) return { name: disk.name, value: disk.name };
    })
    .filter((option) => option !== undefined);

  console.log("name namespace___", name, disks, volumeOptions, vms);
  const typesDropdown = [
    { name: "DISK", value: "disk" },
    { name: "LUN", value: "lun" },
  ];

  const isReadOnlyOptions = [
    { name: "FALSE", value: false },
    { name: "TRUE", value: true },
  ];

  const onAddAction = () => {
    setLoading(true);
    dispatch(
      onAddHotPlugVmAction(namespace, name, data, (res) => {
        setLoading(false);
        setVisible(false);
      })
    );
  };

  return (
    <CustomModal visible={isOpen} setVisible={setVisible} {...rest}>
      <CustomForm>
        <CustomDropDown
          label="Volumes"
          data={data}
          onChange={handleChange}
          name="volume"
          options={volumeOptions}
          keyfilter="pint"
          required
          col={12}
        />
        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="type"
          keyfilter="pint"
          options={typesDropdown}
          required
          col={12}
        />
        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="cache"
          options={cacheOptions}
          keyfilter="pint"
          required
          col={12}
        />
        <CustomDropDown
          data={data}
          onChange={handleChange}
          name="isReadOnly"
          typeName="memoryType"
          onTypeChange={handleChange}
          options={isReadOnlyOptions}
          label="Read Only"
          keyfilter="pint"
          required
          col={12}
        />
      </CustomForm>

      <Buttonlayout>
        <CustomButtonOutlined label="Cancel" severity="secondary" onClick={() => setVisible(null)} />
        <CustomButton label="Plug" loading={loading} onClick={onAddAction} />
      </Buttonlayout>
    </CustomModal>
  );
}
