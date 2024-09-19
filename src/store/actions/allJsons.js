const nodes = {
  kind: "NodeList",
  apiVersion: "v1",
  metadata: {
    resourceVersion: "54978",
  },
  items: [
    {
      metadata: {
        name: "minikube",
        uid: "84ba3ecb-28e6-4c6c-a912-093435fe5f5a",
        resourceVersion: "54977",
        creationTimestamp: "2024-08-08T07:36:03Z",
        labels: {
          "beta.kubernetes.io/arch": "amd64",
          "beta.kubernetes.io/os": "linux",
          "cpu-feature.node.kubevirt.io/3dnowprefetch": "true",
          "cpu-feature.node.kubevirt.io/abm": "true",
          "cpu-feature.node.kubevirt.io/adx": "true",
          "cpu-feature.node.kubevirt.io/aes": "true",
          "cpu-feature.node.kubevirt.io/amd-ssbd": "true",
          "cpu-feature.node.kubevirt.io/amd-stibp": "true",
          "cpu-feature.node.kubevirt.io/apic": "true",
          "cpu-feature.node.kubevirt.io/arat": "true",
          "cpu-feature.node.kubevirt.io/arch-capabilities": "true",
          "cpu-feature.node.kubevirt.io/avx": "true",
          "cpu-feature.node.kubevirt.io/avx2": "true",
          "cpu-feature.node.kubevirt.io/bmi1": "true",
          "cpu-feature.node.kubevirt.io/bmi2": "true",
          "cpu-feature.node.kubevirt.io/clflush": "true",
          "cpu-feature.node.kubevirt.io/clflushopt": "true",
          "cpu-feature.node.kubevirt.io/cmov": "true",
          "cpu-feature.node.kubevirt.io/cx16": "true",
          "cpu-feature.node.kubevirt.io/cx8": "true",
          "cpu-feature.node.kubevirt.io/de": "true",
          "cpu-feature.node.kubevirt.io/erms": "true",
          "cpu-feature.node.kubevirt.io/f16c": "true",
          "cpu-feature.node.kubevirt.io/fma": "true",
          "cpu-feature.node.kubevirt.io/fpu": "true",
          "cpu-feature.node.kubevirt.io/fsgsbase": "true",
          "cpu-feature.node.kubevirt.io/fxsr": "true",
          "cpu-feature.node.kubevirt.io/hle": "true",
          "cpu-feature.node.kubevirt.io/hypervisor": "true",
          "cpu-feature.node.kubevirt.io/ibpb": "true",
          "cpu-feature.node.kubevirt.io/ibrs": "true",
          "cpu-feature.node.kubevirt.io/invpcid": "true",
          "cpu-feature.node.kubevirt.io/lahf_lm": "true",
          "cpu-feature.node.kubevirt.io/lm": "true",
          "cpu-feature.node.kubevirt.io/mca": "true",
          "cpu-feature.node.kubevirt.io/mce": "true",
          "cpu-feature.node.kubevirt.io/md-clear": "true",
          "cpu-feature.node.kubevirt.io/mmx": "true",
          "cpu-feature.node.kubevirt.io/movbe": "true",
          "cpu-feature.node.kubevirt.io/msr": "true",
          "cpu-feature.node.kubevirt.io/mtrr": "true",
          "cpu-feature.node.kubevirt.io/nx": "true",
          "cpu-feature.node.kubevirt.io/pae": "true",
          "cpu-feature.node.kubevirt.io/pat": "true",
          "cpu-feature.node.kubevirt.io/pcid": "true",
          "cpu-feature.node.kubevirt.io/pclmuldq": "true",
          "cpu-feature.node.kubevirt.io/pdcm": "true",
          "cpu-feature.node.kubevirt.io/pdpe1gb": "true",
          "cpu-feature.node.kubevirt.io/pge": "true",
          "cpu-feature.node.kubevirt.io/pni": "true",
          "cpu-feature.node.kubevirt.io/popcnt": "true",
          "cpu-feature.node.kubevirt.io/pschange-mc-no": "true",
          "cpu-feature.node.kubevirt.io/pse": "true",
          "cpu-feature.node.kubevirt.io/pse36": "true",
          "cpu-feature.node.kubevirt.io/rdrand": "true",
          "cpu-feature.node.kubevirt.io/rdseed": "true",
          "cpu-feature.node.kubevirt.io/rdtscp": "true",
          "cpu-feature.node.kubevirt.io/rsba": "true",
          "cpu-feature.node.kubevirt.io/rtm": "true",
          "cpu-feature.node.kubevirt.io/sep": "true",
          "cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": "true",
          "cpu-feature.node.kubevirt.io/smap": "true",
          "cpu-feature.node.kubevirt.io/smep": "true",
          "cpu-feature.node.kubevirt.io/spec-ctrl": "true",
          "cpu-feature.node.kubevirt.io/ss": "true",
          "cpu-feature.node.kubevirt.io/ssbd": "true",
          "cpu-feature.node.kubevirt.io/sse": "true",
          "cpu-feature.node.kubevirt.io/sse2": "true",
          "cpu-feature.node.kubevirt.io/sse4.1": "true",
          "cpu-feature.node.kubevirt.io/sse4.2": "true",
          "cpu-feature.node.kubevirt.io/ssse3": "true",
          "cpu-feature.node.kubevirt.io/stibp": "true",
          "cpu-feature.node.kubevirt.io/syscall": "true",
          "cpu-feature.node.kubevirt.io/tsc": "true",
          "cpu-feature.node.kubevirt.io/tsc-deadline": "true",
          "cpu-feature.node.kubevirt.io/tsc_adjust": "true",
          "cpu-feature.node.kubevirt.io/umip": "true",
          "cpu-feature.node.kubevirt.io/vme": "true",
          "cpu-feature.node.kubevirt.io/vmx": "true",
          "cpu-feature.node.kubevirt.io/vmx-activity-hlt": "true",
          "cpu-feature.node.kubevirt.io/vmx-activity-wait-sipi": "true",
          "cpu-feature.node.kubevirt.io/vmx-cr3-load-noexit": "true",
          "cpu-feature.node.kubevirt.io/vmx-cr3-store-noexit": "true",
          "cpu-feature.node.kubevirt.io/vmx-cr8-load-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-cr8-store-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-desc-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-entry-ia32e-mode": "true",
          "cpu-feature.node.kubevirt.io/vmx-entry-load-efer": "true",
          "cpu-feature.node.kubevirt.io/vmx-entry-load-pat": "true",
          "cpu-feature.node.kubevirt.io/vmx-entry-load-perf-global-ctrl":
            "true",
          "cpu-feature.node.kubevirt.io/vmx-entry-noload-debugctl": "true",
          "cpu-feature.node.kubevirt.io/vmx-ept": "true",
          "cpu-feature.node.kubevirt.io/vmx-ept-1gb": "true",
          "cpu-feature.node.kubevirt.io/vmx-ept-2mb": "true",
          "cpu-feature.node.kubevirt.io/vmx-ept-execonly": "true",
          "cpu-feature.node.kubevirt.io/vmx-eptad": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-ack-intr": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-load-efer": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-load-pat": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-load-perf-global-ctrl": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-nosave-debugctl": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-save-efer": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-save-pat": "true",
          "cpu-feature.node.kubevirt.io/vmx-exit-save-preemption-timer": "true",
          "cpu-feature.node.kubevirt.io/vmx-flexpriority": "true",
          "cpu-feature.node.kubevirt.io/vmx-hlt-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-ins-outs": "true",
          "cpu-feature.node.kubevirt.io/vmx-intr-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-invept": "true",
          "cpu-feature.node.kubevirt.io/vmx-invept-all-context": "true",
          "cpu-feature.node.kubevirt.io/vmx-invept-single-context": "true",
          "cpu-feature.node.kubevirt.io/vmx-invlpg-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-invpcid-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-invvpid": "true",
          "cpu-feature.node.kubevirt.io/vmx-invvpid-all-context": "true",
          "cpu-feature.node.kubevirt.io/vmx-invvpid-single-addr": "true",
          "cpu-feature.node.kubevirt.io/vmx-io-bitmap": "true",
          "cpu-feature.node.kubevirt.io/vmx-io-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-monitor-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-movdr-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-msr-bitmap": "true",
          "cpu-feature.node.kubevirt.io/vmx-mwait-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-nmi-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-page-walk-4": "true",
          "cpu-feature.node.kubevirt.io/vmx-pause-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-pml": "true",
          "cpu-feature.node.kubevirt.io/vmx-preemption-timer": "true",
          "cpu-feature.node.kubevirt.io/vmx-rdpmc-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-rdrand-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-rdtsc-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-rdtscp-exit": "true",
          "cpu-feature.node.kubevirt.io/vmx-secondary-ctls": "true",
          "cpu-feature.node.kubevirt.io/vmx-shadow-vmcs": "true",
          "cpu-feature.node.kubevirt.io/vmx-store-lma": "true",
          "cpu-feature.node.kubevirt.io/vmx-true-ctls": "true",
          "cpu-feature.node.kubevirt.io/vmx-tsc-offset": "true",
          "cpu-feature.node.kubevirt.io/vmx-unrestricted-guest": "true",
          "cpu-feature.node.kubevirt.io/vmx-vintr-pending": "true",
          "cpu-feature.node.kubevirt.io/vmx-vmwrite-vmexit-fields": "true",
          "cpu-feature.node.kubevirt.io/vmx-vnmi": "true",
          "cpu-feature.node.kubevirt.io/vmx-vnmi-pending": "true",
          "cpu-feature.node.kubevirt.io/vmx-vpid": "true",
          "cpu-feature.node.kubevirt.io/vmx-xsaves": "true",
          "cpu-feature.node.kubevirt.io/x2apic": "true",
          "cpu-feature.node.kubevirt.io/xgetbv1": "true",
          "cpu-feature.node.kubevirt.io/xsave": "true",
          "cpu-feature.node.kubevirt.io/xsavec": "true",
          "cpu-feature.node.kubevirt.io/xsaveopt": "true",
          "cpu-feature.node.kubevirt.io/xsaves": "true",
          "cpu-model-migration.node.kubevirt.io/Broadwell": "true",
          "cpu-model-migration.node.kubevirt.io/Broadwell-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Broadwell-noTSX": "true",
          "cpu-model-migration.node.kubevirt.io/Broadwell-noTSX-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Haswell": "true",
          "cpu-model-migration.node.kubevirt.io/Haswell-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Haswell-noTSX": "true",
          "cpu-model-migration.node.kubevirt.io/Haswell-noTSX-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/IvyBridge": "true",
          "cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Nehalem": "true",
          "cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Penryn": "true",
          "cpu-model-migration.node.kubevirt.io/SandyBridge": "true",
          "cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Skylake-Client": "true",
          "cpu-model-migration.node.kubevirt.io/Skylake-Client-IBRS": "true",
          "cpu-model-migration.node.kubevirt.io/Skylake-Client-noTSX-IBRS":
            "true",
          "cpu-model-migration.node.kubevirt.io/Westmere": "true",
          "cpu-model-migration.node.kubevirt.io/Westmere-IBRS": "true",
          "cpu-model.node.kubevirt.io/Broadwell": "true",
          "cpu-model.node.kubevirt.io/Broadwell-IBRS": "true",
          "cpu-model.node.kubevirt.io/Broadwell-noTSX": "true",
          "cpu-model.node.kubevirt.io/Broadwell-noTSX-IBRS": "true",
          "cpu-model.node.kubevirt.io/Haswell": "true",
          "cpu-model.node.kubevirt.io/Haswell-IBRS": "true",
          "cpu-model.node.kubevirt.io/Haswell-noTSX": "true",
          "cpu-model.node.kubevirt.io/Haswell-noTSX-IBRS": "true",
          "cpu-model.node.kubevirt.io/IvyBridge": "true",
          "cpu-model.node.kubevirt.io/IvyBridge-IBRS": "true",
          "cpu-model.node.kubevirt.io/Nehalem": "true",
          "cpu-model.node.kubevirt.io/Nehalem-IBRS": "true",
          "cpu-model.node.kubevirt.io/Penryn": "true",
          "cpu-model.node.kubevirt.io/SandyBridge": "true",
          "cpu-model.node.kubevirt.io/SandyBridge-IBRS": "true",
          "cpu-model.node.kubevirt.io/Skylake-Client": "true",
          "cpu-model.node.kubevirt.io/Skylake-Client-IBRS": "true",
          "cpu-model.node.kubevirt.io/Skylake-Client-noTSX-IBRS": "true",
          "cpu-model.node.kubevirt.io/Westmere": "true",
          "cpu-model.node.kubevirt.io/Westmere-IBRS": "true",
          "cpu-vendor.node.kubevirt.io/Intel": "true",
          cpumanager: "false",
          "host-model-cpu.node.kubevirt.io/Skylake-Client-IBRS": "true",
          "host-model-required-features.node.kubevirt.io/amd-ssbd": "true",
          "host-model-required-features.node.kubevirt.io/amd-stibp": "true",
          "host-model-required-features.node.kubevirt.io/arch-capabilities":
            "true",
          "host-model-required-features.node.kubevirt.io/clflushopt": "true",
          "host-model-required-features.node.kubevirt.io/hypervisor": "true",
          "host-model-required-features.node.kubevirt.io/ibpb": "true",
          "host-model-required-features.node.kubevirt.io/ibrs": "true",
          "host-model-required-features.node.kubevirt.io/md-clear": "true",
          "host-model-required-features.node.kubevirt.io/pdcm": "true",
          "host-model-required-features.node.kubevirt.io/pdpe1gb": "true",
          "host-model-required-features.node.kubevirt.io/pschange-mc-no":
            "true",
          "host-model-required-features.node.kubevirt.io/rsba": "true",
          "host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry":
            "true",
          "host-model-required-features.node.kubevirt.io/ss": "true",
          "host-model-required-features.node.kubevirt.io/ssbd": "true",
          "host-model-required-features.node.kubevirt.io/stibp": "true",
          "host-model-required-features.node.kubevirt.io/tsc_adjust": "true",
          "host-model-required-features.node.kubevirt.io/umip": "true",
          "host-model-required-features.node.kubevirt.io/vmx": "true",
          "host-model-required-features.node.kubevirt.io/vmx-activity-hlt":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-activity-wait-sipi":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-cr3-load-noexit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-cr3-store-noexit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-cr8-load-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-cr8-store-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-desc-exit": "true",
          "host-model-required-features.node.kubevirt.io/vmx-entry-ia32e-mode":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-entry-load-efer":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-entry-load-pat":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-entry-load-perf-global-ctrl":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-entry-noload-debugctl":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-ept": "true",
          "host-model-required-features.node.kubevirt.io/vmx-ept-1gb": "true",
          "host-model-required-features.node.kubevirt.io/vmx-ept-2mb": "true",
          "host-model-required-features.node.kubevirt.io/vmx-ept-execonly":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-eptad": "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-ack-intr":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-load-efer":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-load-pat":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-load-perf-global-ctrl":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-nosave-debugctl":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-save-efer":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-save-pat":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-exit-save-preemption-timer":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-flexpriority":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-hlt-exit": "true",
          "host-model-required-features.node.kubevirt.io/vmx-ins-outs": "true",
          "host-model-required-features.node.kubevirt.io/vmx-intr-exit": "true",
          "host-model-required-features.node.kubevirt.io/vmx-invept": "true",
          "host-model-required-features.node.kubevirt.io/vmx-invept-all-context":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-invept-single-context":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-invlpg-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-invpcid-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-invvpid": "true",
          "host-model-required-features.node.kubevirt.io/vmx-invvpid-all-context":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-invvpid-single-addr":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-io-bitmap": "true",
          "host-model-required-features.node.kubevirt.io/vmx-io-exit": "true",
          "host-model-required-features.node.kubevirt.io/vmx-monitor-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-movdr-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-msr-bitmap":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-mwait-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-nmi-exit": "true",
          "host-model-required-features.node.kubevirt.io/vmx-page-walk-4":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-pause-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-pml": "true",
          "host-model-required-features.node.kubevirt.io/vmx-preemption-timer":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-rdpmc-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-rdrand-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-rdtsc-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-rdtscp-exit":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-secondary-ctls":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-shadow-vmcs":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-store-lma": "true",
          "host-model-required-features.node.kubevirt.io/vmx-true-ctls": "true",
          "host-model-required-features.node.kubevirt.io/vmx-tsc-offset":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-unrestricted-guest":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-vintr-pending":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-vmwrite-vmexit-fields":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-vnmi": "true",
          "host-model-required-features.node.kubevirt.io/vmx-vnmi-pending":
            "true",
          "host-model-required-features.node.kubevirt.io/vmx-vpid": "true",
          "host-model-required-features.node.kubevirt.io/vmx-xsaves": "true",
          "host-model-required-features.node.kubevirt.io/xsaves": "true",
          "hyperv.node.kubevirt.io/base": "true",
          "hyperv.node.kubevirt.io/frequencies": "true",
          "hyperv.node.kubevirt.io/ipi": "true",
          "hyperv.node.kubevirt.io/reenlightenment": "true",
          "hyperv.node.kubevirt.io/reset": "true",
          "hyperv.node.kubevirt.io/runtime": "true",
          "hyperv.node.kubevirt.io/synic": "true",
          "hyperv.node.kubevirt.io/synic2": "true",
          "hyperv.node.kubevirt.io/synictimer": "true",
          "hyperv.node.kubevirt.io/time": "true",
          "hyperv.node.kubevirt.io/tlbflush": "true",
          "hyperv.node.kubevirt.io/vpindex": "true",
          "kubernetes.io/arch": "amd64",
          "kubernetes.io/hostname": "minikube",
          "kubernetes.io/os": "linux",
          "kubevirt.io/ksm-enabled": "false",
          "kubevirt.io/schedulable": "true",
          "minikube.k8s.io/commit": "5883c09216182566a63dff4c326a6fc9ed2982ff",
          "minikube.k8s.io/name": "minikube",
          "minikube.k8s.io/primary": "true",
          "minikube.k8s.io/updated_at": "2024_08_08T13_06_07_0700",
          "minikube.k8s.io/version": "v1.33.1",
          "node-role.kubernetes.io/control-plane": "",
          "node.kubernetes.io/exclude-from-external-load-balancers": "",
        },
        annotations: {
          "kubeadm.alpha.kubernetes.io/cri-socket":
            "unix:///var/run/cri-dockerd.sock",
          "kubevirt.io/heartbeat": "2024-08-09T09:37:07Z",
          "kubevirt.io/ksm-handler-managed": "false",
          "node.alpha.kubernetes.io/ttl": "0",
          "volumes.kubernetes.io/controller-managed-attach-detach": "true",
        },
        managedFields: [
          {
            manager: "kubelet",
            operation: "Update",
            apiVersion: "v1",
            time: "2024-08-08T07:36:03Z",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:annotations": {
                  ".": {},
                  "f:volumes.kubernetes.io/controller-managed-attach-detach":
                    {},
                },
                "f:labels": {
                  ".": {},
                  "f:beta.kubernetes.io/arch": {},
                  "f:beta.kubernetes.io/os": {},
                  "f:kubernetes.io/arch": {},
                  "f:kubernetes.io/hostname": {},
                  "f:kubernetes.io/os": {},
                },
              },
            },
          },
          {
            manager: "kubeadm",
            operation: "Update",
            apiVersion: "v1",
            time: "2024-08-08T07:36:05Z",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:annotations": {
                  "f:kubeadm.alpha.kubernetes.io/cri-socket": {},
                },
                "f:labels": {
                  "f:node-role.kubernetes.io/control-plane": {},
                  "f:node.kubernetes.io/exclude-from-external-load-balancers":
                    {},
                },
              },
            },
          },
          {
            manager: "kubectl-label",
            operation: "Update",
            apiVersion: "v1",
            time: "2024-08-08T07:36:09Z",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:labels": {
                  "f:minikube.k8s.io/commit": {},
                  "f:minikube.k8s.io/name": {},
                  "f:minikube.k8s.io/primary": {},
                  "f:minikube.k8s.io/updated_at": {},
                  "f:minikube.k8s.io/version": {},
                },
              },
            },
          },
          {
            manager: "kube-controller-manager",
            operation: "Update",
            apiVersion: "v1",
            time: "2024-08-09T09:35:44Z",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:annotations": {
                  "f:node.alpha.kubernetes.io/ttl": {},
                },
              },
              "f:spec": {
                "f:podCIDR": {},
                "f:podCIDRs": {
                  ".": {},
                  'v:"10.244.0.0/24"': {},
                },
              },
            },
          },
          {
            manager: "kubelet",
            operation: "Update",
            apiVersion: "v1",
            time: "2024-08-09T09:35:54Z",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:status": {
                "f:allocatable": {
                  "f:devices.kubevirt.io/kvm": {},
                  "f:devices.kubevirt.io/tun": {},
                  "f:devices.kubevirt.io/vhost-net": {},
                },
                "f:capacity": {
                  "f:devices.kubevirt.io/kvm": {},
                  "f:devices.kubevirt.io/tun": {},
                  "f:devices.kubevirt.io/vhost-net": {},
                },
                "f:conditions": {
                  'k:{"type":"DiskPressure"}': {
                    "f:lastHeartbeatTime": {},
                    "f:lastTransitionTime": {},
                    "f:message": {},
                    "f:reason": {},
                    "f:status": {},
                  },
                  'k:{"type":"MemoryPressure"}': {
                    "f:lastHeartbeatTime": {},
                    "f:lastTransitionTime": {},
                    "f:message": {},
                    "f:reason": {},
                    "f:status": {},
                  },
                  'k:{"type":"PIDPressure"}': {
                    "f:lastHeartbeatTime": {},
                    "f:lastTransitionTime": {},
                    "f:message": {},
                    "f:reason": {},
                    "f:status": {},
                  },
                  'k:{"type":"Ready"}': {
                    "f:lastHeartbeatTime": {},
                    "f:lastTransitionTime": {},
                    "f:message": {},
                    "f:reason": {},
                    "f:status": {},
                  },
                },
                "f:images": {},
                "f:nodeInfo": {
                  "f:containerRuntimeVersion": {},
                  "f:machineID": {},
                  "f:systemUUID": {},
                },
              },
            },
            subresource: "status",
          },
          {
            manager: "virt-handler",
            operation: "Update",
            apiVersion: "v1",
            time: "2024-08-09T09:37:11Z",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:annotations": {
                  "f:kubevirt.io/heartbeat": {},
                  "f:kubevirt.io/ksm-handler-managed": {},
                },
                "f:labels": {
                  "f:cpu-feature.node.kubevirt.io/3dnowprefetch": {},
                  "f:cpu-feature.node.kubevirt.io/abm": {},
                  "f:cpu-feature.node.kubevirt.io/adx": {},
                  "f:cpu-feature.node.kubevirt.io/aes": {},
                  "f:cpu-feature.node.kubevirt.io/amd-ssbd": {},
                  "f:cpu-feature.node.kubevirt.io/amd-stibp": {},
                  "f:cpu-feature.node.kubevirt.io/apic": {},
                  "f:cpu-feature.node.kubevirt.io/arat": {},
                  "f:cpu-feature.node.kubevirt.io/arch-capabilities": {},
                  "f:cpu-feature.node.kubevirt.io/avx": {},
                  "f:cpu-feature.node.kubevirt.io/avx2": {},
                  "f:cpu-feature.node.kubevirt.io/bmi1": {},
                  "f:cpu-feature.node.kubevirt.io/bmi2": {},
                  "f:cpu-feature.node.kubevirt.io/clflush": {},
                  "f:cpu-feature.node.kubevirt.io/clflushopt": {},
                  "f:cpu-feature.node.kubevirt.io/cmov": {},
                  "f:cpu-feature.node.kubevirt.io/cx16": {},
                  "f:cpu-feature.node.kubevirt.io/cx8": {},
                  "f:cpu-feature.node.kubevirt.io/de": {},
                  "f:cpu-feature.node.kubevirt.io/erms": {},
                  "f:cpu-feature.node.kubevirt.io/f16c": {},
                  "f:cpu-feature.node.kubevirt.io/fma": {},
                  "f:cpu-feature.node.kubevirt.io/fpu": {},
                  "f:cpu-feature.node.kubevirt.io/fsgsbase": {},
                  "f:cpu-feature.node.kubevirt.io/fxsr": {},
                  "f:cpu-feature.node.kubevirt.io/hle": {},
                  "f:cpu-feature.node.kubevirt.io/hypervisor": {},
                  "f:cpu-feature.node.kubevirt.io/ibpb": {},
                  "f:cpu-feature.node.kubevirt.io/ibrs": {},
                  "f:cpu-feature.node.kubevirt.io/invpcid": {},
                  "f:cpu-feature.node.kubevirt.io/lahf_lm": {},
                  "f:cpu-feature.node.kubevirt.io/lm": {},
                  "f:cpu-feature.node.kubevirt.io/mca": {},
                  "f:cpu-feature.node.kubevirt.io/mce": {},
                  "f:cpu-feature.node.kubevirt.io/md-clear": {},
                  "f:cpu-feature.node.kubevirt.io/mmx": {},
                  "f:cpu-feature.node.kubevirt.io/movbe": {},
                  "f:cpu-feature.node.kubevirt.io/msr": {},
                  "f:cpu-feature.node.kubevirt.io/mtrr": {},
                  "f:cpu-feature.node.kubevirt.io/nx": {},
                  "f:cpu-feature.node.kubevirt.io/pae": {},
                  "f:cpu-feature.node.kubevirt.io/pat": {},
                  "f:cpu-feature.node.kubevirt.io/pcid": {},
                  "f:cpu-feature.node.kubevirt.io/pclmuldq": {},
                  "f:cpu-feature.node.kubevirt.io/pdcm": {},
                  "f:cpu-feature.node.kubevirt.io/pdpe1gb": {},
                  "f:cpu-feature.node.kubevirt.io/pge": {},
                  "f:cpu-feature.node.kubevirt.io/pni": {},
                  "f:cpu-feature.node.kubevirt.io/popcnt": {},
                  "f:cpu-feature.node.kubevirt.io/pschange-mc-no": {},
                  "f:cpu-feature.node.kubevirt.io/pse": {},
                  "f:cpu-feature.node.kubevirt.io/pse36": {},
                  "f:cpu-feature.node.kubevirt.io/rdrand": {},
                  "f:cpu-feature.node.kubevirt.io/rdseed": {},
                  "f:cpu-feature.node.kubevirt.io/rdtscp": {},
                  "f:cpu-feature.node.kubevirt.io/rsba": {},
                  "f:cpu-feature.node.kubevirt.io/rtm": {},
                  "f:cpu-feature.node.kubevirt.io/sep": {},
                  "f:cpu-feature.node.kubevirt.io/skip-l1dfl-vmentry": {},
                  "f:cpu-feature.node.kubevirt.io/smap": {},
                  "f:cpu-feature.node.kubevirt.io/smep": {},
                  "f:cpu-feature.node.kubevirt.io/spec-ctrl": {},
                  "f:cpu-feature.node.kubevirt.io/ss": {},
                  "f:cpu-feature.node.kubevirt.io/ssbd": {},
                  "f:cpu-feature.node.kubevirt.io/sse": {},
                  "f:cpu-feature.node.kubevirt.io/sse2": {},
                  "f:cpu-feature.node.kubevirt.io/sse4.1": {},
                  "f:cpu-feature.node.kubevirt.io/sse4.2": {},
                  "f:cpu-feature.node.kubevirt.io/ssse3": {},
                  "f:cpu-feature.node.kubevirt.io/stibp": {},
                  "f:cpu-feature.node.kubevirt.io/syscall": {},
                  "f:cpu-feature.node.kubevirt.io/tsc": {},
                  "f:cpu-feature.node.kubevirt.io/tsc-deadline": {},
                  "f:cpu-feature.node.kubevirt.io/tsc_adjust": {},
                  "f:cpu-feature.node.kubevirt.io/umip": {},
                  "f:cpu-feature.node.kubevirt.io/vme": {},
                  "f:cpu-feature.node.kubevirt.io/vmx": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-activity-hlt": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-activity-wait-sipi": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-cr3-load-noexit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-cr3-store-noexit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-cr8-load-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-cr8-store-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-desc-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-entry-ia32e-mode": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-entry-load-efer": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-entry-load-pat": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-entry-load-perf-global-ctrl":
                    {},
                  "f:cpu-feature.node.kubevirt.io/vmx-entry-noload-debugctl":
                    {},
                  "f:cpu-feature.node.kubevirt.io/vmx-ept": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-ept-1gb": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-ept-2mb": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-ept-execonly": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-eptad": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-ack-intr": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-load-efer": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-load-pat": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-load-perf-global-ctrl":
                    {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-nosave-debugctl": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-save-efer": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-save-pat": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-exit-save-preemption-timer":
                    {},
                  "f:cpu-feature.node.kubevirt.io/vmx-flexpriority": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-hlt-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-ins-outs": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-intr-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invept": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invept-all-context": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invept-single-context":
                    {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invlpg-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invpcid-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invvpid": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invvpid-all-context": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-invvpid-single-addr": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-io-bitmap": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-io-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-monitor-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-movdr-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-msr-bitmap": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-mwait-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-nmi-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-page-walk-4": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-pause-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-pml": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-preemption-timer": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-rdpmc-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-rdrand-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-rdtsc-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-rdtscp-exit": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-secondary-ctls": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-shadow-vmcs": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-store-lma": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-true-ctls": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-tsc-offset": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-unrestricted-guest": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-vintr-pending": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-vmwrite-vmexit-fields":
                    {},
                  "f:cpu-feature.node.kubevirt.io/vmx-vnmi": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-vnmi-pending": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-vpid": {},
                  "f:cpu-feature.node.kubevirt.io/vmx-xsaves": {},
                  "f:cpu-feature.node.kubevirt.io/x2apic": {},
                  "f:cpu-feature.node.kubevirt.io/xgetbv1": {},
                  "f:cpu-feature.node.kubevirt.io/xsave": {},
                  "f:cpu-feature.node.kubevirt.io/xsavec": {},
                  "f:cpu-feature.node.kubevirt.io/xsaveopt": {},
                  "f:cpu-feature.node.kubevirt.io/xsaves": {},
                  "f:cpu-model-migration.node.kubevirt.io/Broadwell": {},
                  "f:cpu-model-migration.node.kubevirt.io/Broadwell-IBRS": {},
                  "f:cpu-model-migration.node.kubevirt.io/Broadwell-noTSX": {},
                  "f:cpu-model-migration.node.kubevirt.io/Broadwell-noTSX-IBRS":
                    {},
                  "f:cpu-model-migration.node.kubevirt.io/Haswell": {},
                  "f:cpu-model-migration.node.kubevirt.io/Haswell-IBRS": {},
                  "f:cpu-model-migration.node.kubevirt.io/Haswell-noTSX": {},
                  "f:cpu-model-migration.node.kubevirt.io/Haswell-noTSX-IBRS":
                    {},
                  "f:cpu-model-migration.node.kubevirt.io/IvyBridge": {},
                  "f:cpu-model-migration.node.kubevirt.io/IvyBridge-IBRS": {},
                  "f:cpu-model-migration.node.kubevirt.io/Nehalem": {},
                  "f:cpu-model-migration.node.kubevirt.io/Nehalem-IBRS": {},
                  "f:cpu-model-migration.node.kubevirt.io/Penryn": {},
                  "f:cpu-model-migration.node.kubevirt.io/SandyBridge": {},
                  "f:cpu-model-migration.node.kubevirt.io/SandyBridge-IBRS": {},
                  "f:cpu-model-migration.node.kubevirt.io/Skylake-Client": {},
                  "f:cpu-model-migration.node.kubevirt.io/Skylake-Client-IBRS":
                    {},
                  "f:cpu-model-migration.node.kubevirt.io/Skylake-Client-noTSX-IBRS":
                    {},
                  "f:cpu-model-migration.node.kubevirt.io/Westmere": {},
                  "f:cpu-model-migration.node.kubevirt.io/Westmere-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Broadwell": {},
                  "f:cpu-model.node.kubevirt.io/Broadwell-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Broadwell-noTSX": {},
                  "f:cpu-model.node.kubevirt.io/Broadwell-noTSX-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Haswell": {},
                  "f:cpu-model.node.kubevirt.io/Haswell-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Haswell-noTSX": {},
                  "f:cpu-model.node.kubevirt.io/Haswell-noTSX-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/IvyBridge": {},
                  "f:cpu-model.node.kubevirt.io/IvyBridge-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Nehalem": {},
                  "f:cpu-model.node.kubevirt.io/Nehalem-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Penryn": {},
                  "f:cpu-model.node.kubevirt.io/SandyBridge": {},
                  "f:cpu-model.node.kubevirt.io/SandyBridge-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Skylake-Client": {},
                  "f:cpu-model.node.kubevirt.io/Skylake-Client-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Skylake-Client-noTSX-IBRS": {},
                  "f:cpu-model.node.kubevirt.io/Westmere": {},
                  "f:cpu-model.node.kubevirt.io/Westmere-IBRS": {},
                  "f:cpu-vendor.node.kubevirt.io/Intel": {},
                  "f:cpumanager": {},
                  "f:host-model-cpu.node.kubevirt.io/Skylake-Client-IBRS": {},
                  "f:host-model-required-features.node.kubevirt.io/amd-ssbd":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/amd-stibp":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/arch-capabilities":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/clflushopt":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/hypervisor":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/ibpb": {},
                  "f:host-model-required-features.node.kubevirt.io/ibrs": {},
                  "f:host-model-required-features.node.kubevirt.io/md-clear":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/pdcm": {},
                  "f:host-model-required-features.node.kubevirt.io/pdpe1gb": {},
                  "f:host-model-required-features.node.kubevirt.io/pschange-mc-no":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/rsba": {},
                  "f:host-model-required-features.node.kubevirt.io/skip-l1dfl-vmentry":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/ss": {},
                  "f:host-model-required-features.node.kubevirt.io/ssbd": {},
                  "f:host-model-required-features.node.kubevirt.io/stibp": {},
                  "f:host-model-required-features.node.kubevirt.io/tsc_adjust":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/umip": {},
                  "f:host-model-required-features.node.kubevirt.io/vmx": {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-activity-hlt":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-activity-wait-sipi":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-cr3-load-noexit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-cr3-store-noexit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-cr8-load-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-cr8-store-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-desc-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-entry-ia32e-mode":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-entry-load-efer":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-entry-load-pat":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-entry-load-perf-global-ctrl":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-entry-noload-debugctl":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-ept": {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-ept-1gb":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-ept-2mb":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-ept-execonly":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-eptad":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-ack-intr":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-load-efer":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-load-pat":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-load-perf-global-ctrl":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-nosave-debugctl":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-save-efer":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-save-pat":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-exit-save-preemption-timer":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-flexpriority":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-hlt-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-ins-outs":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-intr-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invept":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invept-all-context":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invept-single-context":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invlpg-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invpcid-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invvpid":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invvpid-all-context":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-invvpid-single-addr":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-io-bitmap":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-io-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-monitor-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-movdr-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-msr-bitmap":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-mwait-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-nmi-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-page-walk-4":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-pause-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-pml": {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-preemption-timer":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-rdpmc-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-rdrand-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-rdtsc-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-rdtscp-exit":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-secondary-ctls":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-shadow-vmcs":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-store-lma":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-true-ctls":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-tsc-offset":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-unrestricted-guest":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-vintr-pending":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-vmwrite-vmexit-fields":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-vnmi":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-vnmi-pending":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-vpid":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/vmx-xsaves":
                    {},
                  "f:host-model-required-features.node.kubevirt.io/xsaves": {},
                  "f:hyperv.node.kubevirt.io/base": {},
                  "f:hyperv.node.kubevirt.io/frequencies": {},
                  "f:hyperv.node.kubevirt.io/ipi": {},
                  "f:hyperv.node.kubevirt.io/reenlightenment": {},
                  "f:hyperv.node.kubevirt.io/reset": {},
                  "f:hyperv.node.kubevirt.io/runtime": {},
                  "f:hyperv.node.kubevirt.io/synic": {},
                  "f:hyperv.node.kubevirt.io/synic2": {},
                  "f:hyperv.node.kubevirt.io/synictimer": {},
                  "f:hyperv.node.kubevirt.io/time": {},
                  "f:hyperv.node.kubevirt.io/tlbflush": {},
                  "f:hyperv.node.kubevirt.io/vpindex": {},
                  "f:kubevirt.io/ksm-enabled": {},
                  "f:kubevirt.io/schedulable": {},
                },
              },
            },
          },
        ],
      },
      spec: {
        podCIDR: "10.244.0.0/24",
        podCIDRs: ["10.244.0.0/24"],
      },
      status: {
        capacity: {
          cpu: "8",
          "devices.kubevirt.io/kvm": "1k",
          "devices.kubevirt.io/tun": "1k",
          "devices.kubevirt.io/vhost-net": "1k",
          "ephemeral-storage": "1055762868Ki",
          "hugepages-1Gi": "0",
          "hugepages-2Mi": "0",
          memory: "3950668Ki",
          pods: "110",
        },
        allocatable: {
          cpu: "8",
          "devices.kubevirt.io/kvm": "1k",
          "devices.kubevirt.io/tun": "1k",
          "devices.kubevirt.io/vhost-net": "1k",
          "ephemeral-storage": "1055762868Ki",
          "hugepages-1Gi": "0",
          "hugepages-2Mi": "0",
          memory: "3950668Ki",
          pods: "110",
        },
        conditions: [
          {
            type: "MemoryPressure",
            status: "False",
            lastHeartbeatTime: "2024-08-09T09:35:53Z",
            lastTransitionTime: "2024-08-09T09:35:53Z",
            reason: "KubeletHasSufficientMemory",
            message: "kubelet has sufficient memory available",
          },
          {
            type: "DiskPressure",
            status: "False",
            lastHeartbeatTime: "2024-08-09T09:35:53Z",
            lastTransitionTime: "2024-08-09T09:35:53Z",
            reason: "KubeletHasNoDiskPressure",
            message: "kubelet has no disk pressure",
          },
          {
            type: "PIDPressure",
            status: "False",
            lastHeartbeatTime: "2024-08-09T09:35:53Z",
            lastTransitionTime: "2024-08-09T09:35:53Z",
            reason: "KubeletHasSufficientPID",
            message: "kubelet has sufficient PID available",
          },
          {
            type: "Ready",
            status: "True",
            lastHeartbeatTime: "2024-08-09T09:35:53Z",
            lastTransitionTime: "2024-08-09T09:35:53Z",
            reason: "KubeletReady",
            message: "kubelet is posting ready status",
          },
        ],
        addresses: [
          {
            type: "InternalIP",
            address: "192.168.49.2",
          },
          {
            type: "Hostname",
            address: "minikube",
          },
        ],
        daemonEndpoints: {
          kubeletEndpoint: {
            Port: 10250,
          },
        },
        nodeInfo: {
          machineID: "641bf48d003544e3b7d12fd67a4bb4ef",
          systemUUID: "641bf48d003544e3b7d12fd67a4bb4ef",
          bootID: "b637c25a-6d0b-4882-8324-f79714999bea",
          kernelVersion: "5.15.146.1-microsoft-standard-WSL2",
          osImage: "Ubuntu 22.04.4 LTS",
          containerRuntimeVersion: "docker://26.1.1",
          kubeletVersion: "v1.30.0",
          kubeProxyVersion: "v1.30.0",
          operatingSystem: "linux",
          architecture: "amd64",
        },
        images: [
          {
            names: [
              "quay.io/kubevirt/virt-launcher@sha256:25a0332c3873bd59ae6adc80dfde314101a469910b9a60499b80f48f5d8bce02",
              "quay.io/kubevirt/virt-launcher:v1.3.0",
            ],
            sizeBytes: 457875233,
          },
          {
            names: [
              "quay.io/kubevirt/virt-handler@sha256:86dd1563b422910ad298ed9e98abf22ef7ca236b8f244980a2f54564901cbcaf",
              "quay.io/kubevirt/virt-handler:v1.3.0",
            ],
            sizeBytes: 269115148,
          },
          {
            names: [
              "kubevirtmanager/kubevirt-manager@sha256:f7a9d53a2ddc7ca16d33ef52a2ca1f0d66bfb42e3757b0497100839458dd5bea",
              "kubevirtmanager/kubevirt-manager:1.4.0",
            ],
            sizeBytes: 194934373,
          },
          {
            names: [
              "registry.k8s.io/etcd@sha256:44a8e24dcbba3470ee1fee21d5e88d128c936e9b55d4bc51fbef8086f8ed123b",
              "registry.k8s.io/etcd:3.5.12-0",
            ],
            sizeBytes: 149347661,
          },
          {
            names: [
              "quay.io/kubevirt/virt-operator@sha256:5f3d7dc740744d8b65016ca0e74eaa313d01a591a42a82498d09b6877f6d57d0",
              "quay.io/kubevirt/virt-operator:v1.3.0",
            ],
            sizeBytes: 125044475,
          },
          {
            names: [
              "registry.k8s.io/kube-apiserver@sha256:6b8e197b2d39c321189a475ac755a77896e34b56729425590fbc99f3a96468a3",
              "registry.k8s.io/kube-apiserver:v1.30.0",
            ],
            sizeBytes: 116552324,
          },
          {
            names: [
              "registry.k8s.io/kube-controller-manager@sha256:5f52f00f17d5784b5ca004dffca59710fa1a9eec8d54cebdf9433a1d134150fe",
              "registry.k8s.io/kube-controller-manager:v1.30.0",
            ],
            sizeBytes: 111113187,
          },
          {
            names: [
              "registry.k8s.io/kube-proxy@sha256:ec532ff47eaf39822387e51ec73f1f2502eb74658c6303319db88d2c380d0210",
              "registry.k8s.io/kube-proxy:v1.30.0",
            ],
            sizeBytes: 84675401,
          },
          {
            names: [
              "quay.io/kubevirt/virt-api@sha256:3f1e97424b7563fbab544b128fb06d0b84efea1a209be09178722309f34b215e",
              "quay.io/kubevirt/virt-api:v1.3.0",
            ],
            sizeBytes: 83234419,
          },
          {
            names: [
              "quay.io/kubevirt/virt-controller@sha256:c9f6cfc9cfc91d4093ace7468a8228e8269adc62eda7bdf4164503f684100143",
              "quay.io/kubevirt/virt-controller:v1.3.0",
            ],
            sizeBytes: 78375091,
          },
          {
            names: [
              "registry.k8s.io/kube-scheduler@sha256:2353c3a1803229970fcb571cffc9b2f120372350e01c7381b4b650c4a02b9d67",
              "registry.k8s.io/kube-scheduler:v1.30.0",
            ],
            sizeBytes: 61969366,
          },
          {
            names: [
              "registry.k8s.io/coredns/coredns@sha256:1eeb4c7316bacb1d4c8ead65571cd92dd21e27359f0d4917f1a5822a73b75db1",
              "registry.k8s.io/coredns/coredns:v1.11.1",
            ],
            sizeBytes: 59820619,
          },
          {
            names: [
              "gcr.io/k8s-minikube/storage-provisioner@sha256:18eb69d1418e854ad5a19e399310e52808a8321e4c441c1dddad8977a0d7a944",
              "gcr.io/k8s-minikube/storage-provisioner:v5",
            ],
            sizeBytes: 31465472,
          },
          {
            names: [
              "kubevirt/cirros-container-disk-demo@sha256:0e5ac38b20abcc7752293425b239a147868facd62cd5030dede6da6f2fc526a1",
              "kubevirt/cirros-container-disk-demo:latest",
            ],
            sizeBytes: 12716032,
          },
          {
            names: [
              "registry.k8s.io/pause@sha256:7031c1b283388d2c2e09b57badb803c05ebed362dc88d84b480cc47f72a21097",
              "registry.k8s.io/pause:3.9",
            ],
            sizeBytes: 743952,
          },
        ],
      },
    },
  ],
};

let vms = {
  apiVersion: "kubevirt.io/v1",
  items: [
    {
      apiVersion: "kubevirt.io/v1",
      kind: "VirtualMachine",
      metadata: {
        annotations: {
          "kubectl.kubernetes.io/last-applied-configuration":
            '{"apiVersion":"kubevirt.io/v1","kind":"VirtualMachine","metadata":{"annotations":{},"name":"my-vm","namespace":"default"},"spec":{"running":true,"template":{"metadata":{"labels":{"kubevirt.io/vm":"my-vm"}},"spec":{"domain":{"devices":{"disks":[{"disk":{"bus":"virtio"},"name":"containerdisk"},{"disk":{"bus":"virtio"},"name":"cloudinitdisk"}]},"resources":{"requests":{"memory":"64Mi"}}},"volumes":[{"containerDisk":{"image":"kubevirt/cirros-container-disk-demo:latest"},"name":"containerdisk"},{"cloudInitNoCloud":{"userData":"#cloud-config\\npassword: \\"root\\"\\nchpasswd: { expire: False }\\n"},"name":"cloudinitdisk"}]}}}}\n',
          "kubevirt.io/latest-observed-api-version": "v1",
          "kubevirt.io/storage-observed-api-version": "v1",
        },
        creationTimestamp: "2024-08-08T09:58:34Z",
        finalizers: ["kubevirt.io/virtualMachineControllerFinalize"],
        generation: 2,
        managedFields: [
          {
            apiVersion: "kubevirt.io/v1",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:annotations": {
                  "f:kubevirt.io/latest-observed-api-version": {},
                  "f:kubevirt.io/storage-observed-api-version": {},
                },
                "f:finalizers": {
                  ".": {},
                  'v:"kubevirt.io/virtualMachineControllerFinalize"': {},
                },
              },
            },
            manager: "virt-controller",
            operation: "Update",
            time: "2024-08-08T09:58:34Z",
          },
          {
            apiVersion: "kubevirt.io/v1",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:metadata": {
                "f:annotations": {
                  ".": {},
                  "f:kubectl.kubernetes.io/last-applied-configuration": {},
                },
              },
              "f:spec": {
                ".": {},
                "f:running": {},
                "f:template": {
                  ".": {},
                  "f:metadata": {
                    ".": {},
                    "f:labels": {
                      ".": {},
                      "f:kubevirt.io/vm": {},
                    },
                  },
                  "f:spec": {
                    ".": {},
                    "f:domain": {
                      ".": {},
                      "f:devices": {
                        ".": {},
                        "f:disks": {},
                      },
                      "f:resources": {
                        ".": {},
                        "f:requests": {
                          ".": {},
                          "f:memory": {},
                        },
                      },
                    },
                    "f:volumes": {},
                  },
                },
              },
            },
            manager: "kubectl-client-side-apply",
            operation: "Update",
            time: "2024-08-08T10:08:01Z",
          },
          {
            apiVersion: "kubevirt.io/v1",
            fieldsType: "FieldsV1",
            fieldsV1: {
              "f:status": {
                ".": {},
                "f:conditions": {},
                "f:created": {},
                "f:desiredGeneration": {},
                "f:observedGeneration": {},
                "f:printableStatus": {},
                "f:ready": {},
                "f:runStrategy": {},
                "f:volumeSnapshotStatuses": {},
              },
            },
            manager: "virt-controller",
            operation: "Update",
            subresource: "status",
            time: "2024-08-08T10:09:01Z",
          },
        ],
        name: "my-vm",
        namespace: "default",
        resourceVersion: "10666",
        uid: "143eea24-7637-4cc7-b387-9872be02b28f",
      },
      spec: {
        running: true,
        template: {
          metadata: {
            creationTimestamp: null,
            labels: {
              "kubevirt.io/vm": "my-vm",
            },
          },
          spec: {
            architecture: "amd64",
            domain: {
              devices: {
                disks: [
                  {
                    disk: {
                      bus: "virtio",
                    },
                    name: "containerdisk",
                  },
                  {
                    disk: {
                      bus: "virtio",
                    },
                    name: "cloudinitdisk",
                  },
                ],
              },
              machine: {
                type: "q35",
              },
              resources: {
                requests: {
                  memory: "64Mi",
                },
              },
            },
            volumes: [
              {
                containerDisk: {
                  image: "kubevirt/cirros-container-disk-demo:latest",
                },
                name: "containerdisk",
              },
              {
                cloudInitNoCloud: {
                  userData:
                    '#cloud-config\npassword: "root"\nchpasswd: { expire: False }\n',
                },
                name: "cloudinitdisk",
              },
            ],
          },
        },
      },
      status: {
        conditions: [
          {
            lastProbeTime: null,
            lastTransitionTime: "2024-08-08T10:08:40Z",
            status: "True",
            type: "Ready",
          },
          {
            lastProbeTime: null,
            lastTransitionTime: null,
            message:
              "cannot migrate VMI which does not use masquerade, bridge with kubevirt.io/allow-pod-bridge-network-live-migration VM annotation or a migratable plugin to connect to the pod network",
            reason: "InterfaceNotLiveMigratable",
            status: "False",
            type: "LiveMigratable",
          },
        ],
        created: true,
        desiredGeneration: 2,
        observedGeneration: 2,
        printableStatus: "Running",
        ready: true,
        runStrategy: "Always",
        volumeSnapshotStatuses: [
          {
            enabled: false,
            name: "containerdisk",
            reason:
              "Snapshot is not supported for this volumeSource type [containerdisk]",
          },
          {
            enabled: false,
            name: "cloudinitdisk",
            reason:
              "Snapshot is not supported for this volumeSource type [cloudinitdisk]",
          },
        ],
      },
    },
  ],
  kind: "VirtualMachineList",
  metadata: {
    continue: "",
    resourceVersion: "12736",
  },
};

export { nodes, vms };
