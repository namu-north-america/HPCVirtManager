import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import CustomOverlay from '../shared/CustomOverlay';
import { confirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSSHKeysAction, deleteSSHKeyAction, createSSHKeyAction } from '../store/actions/sshKeyActions';
import { showToastAction } from '../store/slices/commonSlice';
import { Dropdown } from 'primereact/dropdown';
import { getNamespacesAction } from '../store/actions/projectActions';
import Page from '../shared/Page';

const SSHKeys = () => {
  const ref = useRef();
  const [globalFilter, setGlobalFilter] = useState('');
  const [visible, setVisible] = useState(false);
  const [newSSHKey, setNewSSHKey] = useState({
    name: '',
    namespace: '',
    value: ''
  });
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.user);
  const { sshKeys, loading } = useSelector((state) => state.sshKeys);
  const { namespaces } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchAllSSHKeysAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getNamespacesAction());
  }, [dispatch]);

  const handleEdit = (record) => {
    if (profile.role !== 'admin') return showError();
    window.location.href = `/#/sshkeys/${record.name}`;
  };

  const handleDelete = (record) => {
    if (profile.role !== 'admin') return showError();
    confirmDialog({
      target: ref.current,
      header: 'Delete Confirmation',
      message: `Do you want to delete SSH Key: ${record.name}?`,
      icon: 'pi pi-info-circle',
      rejectClassName: 'p-button-outlined p-button-secondary',
      acceptClassName: 'primary-button',
      accept: () => {
        dispatch(deleteSSHKeyAction(record));
      },
    });
  };

  const showError = () => {
    dispatch(
      showToastAction({
        type: 'error',
        title: 'Sorry, you have no permission!',
      })
    );
  };

  const handleAddNew = () => {
    if (profile.role !== 'admin') return showError();
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setNewSSHKey({ name: '', namespace: '', value: '' });
  };

  const handleCreate = async () => {
    if (!newSSHKey.name || !newSSHKey.namespace || !newSSHKey.value) {
      dispatch(showToastAction({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all fields'
      }));
      return;
    }

    const success = await dispatch(createSSHKeyAction(newSSHKey));
    if (success) {
      handleClose();
    }
  };

  const renderFooter = () => {
    return (
      <div className="flex justify-content-end gap-2">
        <Button 
          label="Close" 
          className="p-button-outlined p-button-secondary" 
          onClick={handleClose} 
        />
        <Button 
          label="Create" 
          onClick={handleCreate} 
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => (
    <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
      <div>
        <div className="font-semibold mb-2">Actions</div>
        <div className="mb-2" onClick={() => handleEdit(rowData)}>
          Edit
        </div>
        <div className="cursor-pointer" onClick={() => handleDelete(rowData)}>
          Delete
        </div>
      </div>
    </CustomOverlay>
  );

  const dateBodyTemplate = (rowData) => {
    return new Date(rowData.createdAt).toLocaleString();
  };

  return (
    <Page 
      title="SSH Keys" 
      subtitle="Manage SSH keys for secure access to virtual machines"
      onSearch={setGlobalFilter}
      onRefresh={() => dispatch(fetchAllSSHKeysAction())}
      onAdd={handleAddNew}
      addText="New SSH Key"
    >
        <DataTable
          value={sshKeys}
          loading={loading}
          globalFilter={globalFilter}
          emptyMessage="No SSH keys found"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable />
          <Column field="namespace" header="Namespace" sortable />
          <Column field="createdAt" header="Created" body={dateBodyTemplate} sortable />
          <Column body={actionBodyTemplate} exportable={false} style={{ width: '8rem' }} />
        </DataTable>

      <Dialog 
        header="New SSH Key"
        visible={visible} 
        style={{ width: '600px' }}
        modal 
        footer={renderFooter}
        onHide={handleClose}
      >
        <div className="flex flex-column gap-3 mt-3">
          <div className="flex flex-column gap-2">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={newSSHKey.name}
              onChange={(e) => setNewSSHKey(prev => ({...prev, name: e.target.value}))}
              placeholder="Enter name"
            />
          </div>
          
          <div className="flex flex-column gap-2">
            <label htmlFor="namespace">Namespace</label>
            <Dropdown
              id="namespace"
              value={newSSHKey.namespace}
              onChange={(e) => setNewSSHKey(prev => ({...prev, namespace: e.value}))}
              options={namespaces.map(ns => ({
                label: ns.metadata.name,
                value: ns.metadata.name
              }))}
              placeholder="Select namespace"
              className="w-full"
            />
          </div>
          
          <div className="flex flex-column gap-2">
            <label htmlFor="value">Value</label>
            <InputTextarea
              id="value"
              value={newSSHKey.value}
              onChange={(e) => setNewSSHKey(prev => ({...prev, value: e.target.value}))}
              rows={5}
              autoResize
              placeholder="Enter SSH key value"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </Page>
  );
};

export default SSHKeys;
