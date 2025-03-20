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
  IMAGES: "/apis/cocktail-virt.io/v1/images",
  ADD_IMAGE: ({ namespace }) =>
    `/apis/cocktail-virt.io/v1/namespaces/${namespace}/images`,
  UPDATE_IMAGE: ({ namespace, name }) =>
    `/apis/cocktail-virt.io/v1/namespaces/${namespace}/images/${name}`,
  DELETE_IMAGE: ({ namespace, name }) =>
    `/apis/cocktail-virt.io/v1/namespaces/${namespace}/images/${name}`,
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
  ADD_VM_POOL: ({ namespace, name }) =>
    `/apis/pool.kubevirt.io/v1alpha1/namespaces/${namespace}/virtualmachinepools/${name}`,
  GET_VM_POOL: ({ name, namespace }) =>
    `/apis/pool.kubevirt.io/v1alpha1/namespaces/${namespace}/virtualmachinepools/${name}`,
  GET_VM_POOLS: () =>
    `/apis/pool.kubevirt.io/v1alpha1/virtualmachinepools`,
  GET_VM_POOL_VMS: ({ name, namespace }) =>
    `/apis/kubevirt.io/v1/namespaces/${namespace}/virtualmachines?labelSelector=kubevirt.io%2Fvmpool%3D${name}&limit=500`,
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
  HOT_PLUG_NETWORK: ({ namespace, name }) =>
    `/apis/kubevirt.io/v1/namespaces/${namespace}/virtualmachines/${name}`,
  GET_NETWORKS: () =>
    `/apis/k8s.cni.cncf.io/v1/network-attachment-definitions`,
  GET_VM_EVENTS: ({ namespace, name }) =>
    `/api/v1/namespaces/${namespace}/events?fieldSelector=involvedObject.kind=VirtualMachineInstance,involvedObject.name=${name}&limit=500`,
  INSTANCE_TYPE: ({ name }) =>
    `/apis/instancetype.kubevirt.io/v1beta1/virtualmachineclusterinstancetypes/${name}`,
  GET_INSTANCE_TYPES: () =>
    `/apis/instancetype.kubevirt.io/v1beta1/virtualmachineclusterinstancetypes`,
  PATCH_VM_POOL: ({ namespace, name }) =>
    `/apis/pool.kubevirt.io/v1alpha1/namespaces/${namespace}/virtualmachinepools/${name}`,
  DELETE_VM_POOL: ({ namespace, name }) =>
    `/apis/pool.kubevirt.io/v1alpha1/namespaces/${namespace}/virtualmachinepools/${name}`,
  CREATE_AUTO_SCALE: ({ namespace }) =>
    `/apis/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers`,
  UPDATE_AUTO_SCALE: ({ namespace, name }) =>
    `/apis/autoscaling/v2/namespaces/${namespace}/horizontalpodautoscalers/${name}`,
  CREATE_SERVICE: ({ namespace }) =>
    `/api/v1/namespaces/${namespace}/services`,
  GET_SERVICES: () =>
    `/api/v1/services?labelSelector=kubevirt-manager.io%2Fmanaged`,
  DELETE_SERVICE: ({name, namespace}) =>
    `/api/v1/namespaces/${namespace}/services/${name}`,
  UPDATE_SERVICE: ({ name, namespace }) =>
    `/api/v1/namespaces/${namespace}/services/${name}`,

  SSH_KEYS: "/api/v1/namespaces/default/secrets",
  CREATE_SSH_KEY: "/api/v1/namespaces/default/secrets",

  // cluster-api resource APIs

  // required to create cluster
  CREATE_CLUSTER: ({ namespace, name }) =>
    `/apis/cluster.x-k8s.io/v1beta1/namespaces/${namespace}/clusters/${name}`,
  CREATE_KUBEVIRT_CLUSTER: ({ namespace, name }) =>
    `/apis/infrastructure.cluster.x-k8s.io/v1alpha1/namespaces/${namespace}/kubevirtclusters/${name}`,
  CREATE_KUBEVIRT_MACHINE_TEMPLATE: ({ namespace, name }) =>
    `/apis/infrastructure.cluster.x-k8s.io/v1alpha1/namespaces/${namespace}/kubevirtmachinetemplates/${name}`,
  CREATE_KUBEADM_CONTROL_PLANE: ({ namespace, name }) =>
    `/apis/controlplane.cluster.x-k8s.io/v1beta1/namespaces/${namespace}/kubeadmcontrolplanes/${name}`,
  CREATE_KUBEADM_CONFIG_TEMPLATE: ({ namespace, name }) =>
    `/apis/bootstrap.cluster.x-k8s.io/v1beta1/namespaces/${namespace}/kubeadmconfigtemplates/${name}`,
  CREATE_MACHINE_DEPLOYMENT: ({ namespace, name }) =>
    `/apis/cluster.x-k8s.io/v1beta1/namespaces/${namespace}/machinedeployments/${name}`,

  // required to update cluster
  UPDATE_CLUSTER: ({ namespace, name }) =>
    `/apis/cluster.x-k8s.io/v1beta1/namespaces/${namespace}/clusters/${name}`,
  GET_CLUSTER: ({ namespace, name }) =>
    `/apis/cluster.x-k8s.io/v1beta1/namespaces/${namespace}/clusters/${name}`,
  GET_AUTO_SCALES: () =>
    `/apis/autoscaling/v2/horizontalpodautoscalers`,

  // others API
  LIST_CLUSTERS: "/apis/cluster.x-k8s.io/v1beta1/clusters"
};

export default endPoints;

