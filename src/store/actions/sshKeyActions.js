import { setSSHKeys, setLoading, setError } from '../slices/sshKeySlice';
import api from '../../services/api';
import endPoints from "../../services/endPoints";
import { showToastAction } from '../slices/commonSlice';


export const fetchAllSSHKeysAction = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetchSSHKeys();
    if (response?.kind === "SecretList" && response.items) {
      const sshKeys = response.items
        // .filter((secret) => secret.type === "kubernetes.io/ssh-auth")
        .filter(
          (secret) =>
            secret.metadata?.labels?.["kubevirt-manager.io/type"] === "ssh-publickey"
        )
        .map((secret) => ({
          name: secret.metadata.name,
          namespace: secret.metadata.namespace,
          createdAt: secret.metadata.creationTimestamp,
          createdBy: secret.metadata.annotations?.["kubevirt-manager.io/created-by"] || "Unknown",
          sshPublicKey: secret.data["ssh-publickey"] ? atob(secret.data["ssh-publickey"]) : null,
        }));
      dispatch(setSSHKeys(sshKeys));
    } else {
      dispatch(setError('Invalid response format'));
      dispatch(showToastAction({
        type: 'error',
        title: 'Failed to fetch SSH keys',
        message: 'Invalid response format from server'
      }));
    }
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(showToastAction({
      type: 'error',
      title: 'Error',
      message: error.message
    }));
  } finally {
    dispatch(setLoading(false));
  }
};


export const deleteSSHKeyAction = (sshKey) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    // TODO : delete API call
    dispatch(fetchAllSSHKeysAction());
    dispatch(showToastAction({
      type: 'success',
      title: 'Success',
      message: 'SSH Key deleted successfully'
    }));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(showToastAction({
      type: 'error',
      title: 'Error',
      message: error.message
    }));
  } finally {
    dispatch(setLoading(false));
  }
};


export const createSSHKeyAction = (sshKeyData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const formattedData = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: sshKeyData.name,
        namespace: sshKeyData.namespace,
        labels: {
          'kubevirt-manager.io/type': 'ssh-publickey'
        }
      },
      type: 'opaque',
      data: {
        'ssh-publickey': btoa(sshKeyData.value)
      }
    };

    const response = await createSSHKey(formattedData);
    console.log('formattedData : ', formattedData);
    if (response?.kind === 'Secret' && response.metadata) {
      dispatch(showToastAction({
        type: 'success',
        title: 'Success',
        message: 'SSH Key created successfully'
      }));
      dispatch(fetchAllSSHKeysAction());
      return true;
    } else {
      dispatch(setError('Invalid response from server'));
      dispatch(showToastAction({
        type: 'error',
        title: 'Failed to create SSH key',
        message: 'Invalid response from server'
      }));
      return false;
    }
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(showToastAction({
      type: 'error',
      title: 'Error',
      message: error.message || 'Failed to create SSH key'
    }));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};


export const fetchSSHKeys = async () => {
  try {
    const response = await api('GET', endPoints.SSH_KEYS);
    return response;
  } catch (error) {
    console.error('Error fetching SSH keys:', error);
    throw error;
  }
};


export const createSSHKey = async (sshKeyData) => {
  try {
    const response = await api('POST', endPoints.CREATE_SSH_KEY, sshKeyData);
    return response;
  } catch (error) {
    console.error('Error creating SSH key:', error);
    throw error;
  }
};
