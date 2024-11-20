import React, { useEffect } from "react";
import { CustomForm, CustomInput } from "../../../shared/AllInputs";
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSSHKeysAction } from '../../../store/actions/sshKeyActions';

export default function UserData({ data, handleChange }) {
  const dispatch = useDispatch();
  const { sshKeys } = useSelector((state) => state.sshKeys);

  useEffect(() => {
    dispatch(fetchAllSSHKeysAction());
  }, [dispatch]);

  return (
    <CustomForm>
      <CustomInput
        data={data}
        onChange={handleChange}
        name="userName"
        required
        col={12}
      />
      <CustomInput
        data={data}
        onChange={handleChange}
        name="password"
        required
        col={12}
      />
      <div className="col-12">
        <label htmlFor="sshKey">SSH Key</label>
        <Dropdown
          id="sshKey"
          value={data.sshKey}
          onChange={(e) => handleChange({ name: 'sshKey', value: e.value })}
          options={sshKeys.map(key => ({
            label: `${key.name} (${key.namespace})`,
            value: key.name
          }))}
          placeholder="Select SSH Key"
          className="w-full"
        />
      </div>
    </CustomForm>
  );
}
