const endPoints = {
  LOGIN: "/auth/login/",
  REGISTER: "/auth/signup/",
  SEND_OTP: "/auth/send-otp/",
  VERIFY_OTP: "/auth/verify-otp/",
  CHANGE_FORGOT_PASSWORD: "/auth/forgot-password/",

  ADD_USER: "/api/v1/namespaces/default/secrets",
  GET_USER_ALL: "/api/v1/namespaces/default/secrets",
  GET_USER_SECRET: ({ namespace, name }) =>
    `/api/v1/namespaces/${namespace}/secrets/${name}`,

  PROFILE: "/profile",
  VMS: "/apis/kubevirt.io/v1alpha3/virtualmachines",
  GET_VM_INSTANCE: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachineinstances/${name}`,
  NODES: "/api/v1/nodes",
  GET_NODE_INSTANCE: ({ name }) => `/api/v1/nodes/${name}`,
  NAMESPACE: "/api/v1/namespaces",
  PRIORITY_CLASSES:
    "/apis/scheduling.k8s.io/v1/priorityclasses?labelSelector=kubevirt-manager.io/managed%3Dtrue",
  STORAGE_CLASSES: "/apis/storage.k8s.io/v1/storageclasses",
  STORAGE_DISKS: "/apis/cdi.kubevirt.io/v1beta1/datavolumes",
  IMAGES: "/apis/kubevirt-manager.io/v1/images",
  ADD_IMAGE: ({ namespace }) =>
    `/apis/hpc-virt-manager.io/v1/namespaces/${namespace}/images`,
  UPDATE_IMAGE: ({ namespace, name }) =>
    `/apis/hpc-virt-manager.io/v1/namespaces/${namespace}/images/${name}`,
  DELETE_IMAGE: ({ namespace, name }) =>
    `/apis/hpc-virt-manager.io/v1/namespaces/${namespace}/images/${name}`,
  GET_STORAGE_DISK: ({ namespace, name }) =>
    `/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`,
  STORAGE_DISK_RESIZE: ({ namespace, name }) =>
    `/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`,

  ADD_STORAGE_DISK: ({ namespace, name }) =>
    `/apis/cdi.kubevirt.io/v1beta1/namespaces/${namespace}/datavolumes/${name}`,

  DELETE_STORAGE_DISK: ({ namespace, name }) =>
    `/apis/cdi.kubevirt.io/v1beta1/namespaces/${namespace}/datavolumes/${name}`,
  DELETE_PERSISTENT_VOLUME_CLAIM: ({ namespace, name }) =>
    `/api/v1/namespaces/${namespace}/persistentvolumeclaims/${name}`,

  ADD_VM: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachines/${name}`,
  EDIT_VM: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachines/${name}`,
  GET_VM: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachines/${name}?labelSelector=kubevirt-manager.io%2Fmanaged`,
  CHANGE_VM_STATUS: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachines/${name}`,
  DELETE_VM: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1alpha3/namespaces/${namespace}/virtualmachines/${name}`,
  MIGRATE_VM: ({ namespace }) =>
    `/apis/kubevirt.io/v1/namespaces/${namespace}/virtualmachineinstancemigrations`,
  RESTART_VM: ({ namespace, name }) =>
    `/apis/subresources.kubevirt.io/v1/namespaces/${namespace}/virtualmachines/${name}/restart`,
  PAUSE_VM: ({ namespace, name, type }) =>
    `/apis/subresources.kubevirt.io/v1/namespaces/${namespace}/virtualmachineinstances/${name}/${type}`,
  GET_VOLUME: ({ namespace, name }) =>
    `/apis/cdi.kubevirt.io/v1beta1/namespaces/${namespace}/datavolumes/${name}`,
  HOT_PLUG_VOLUME: ({ namespace, name }) =>
    `/apis/subresources.kubevirt.io/v1/namespaces/${namespace}/virtualmachines/${name}/addvolume`,
  GET_NETWORKS: () => 
    `/apis/k8s.cni.cncf.io/v1/network-attachment-definitions`,

  SSH_KEYS: "/api/v1/namespaces/default/secrets",
  CREATE_SSH_KEY: "/api/v1/namespaces/default/secrets",
};

export default endPoints;

