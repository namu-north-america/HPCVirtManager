import CustomModal from "../../shared/CustomModal";
import CustomCard, { CustomCardField } from "../../shared/CustomCard";
import { Divider } from "primereact/divider";

export const ServiceDetailsModal = ({ isOpen, onHide, serviceItem }) => {
  return (
    <CustomModal visible={isOpen} title={`${serviceItem.name}`} onHide={onHide}>
      <CustomCard title={"Basic Details"}>
        <CustomCardField title="Namespace" value={serviceItem.namespace} />
        <CustomCardField title="Name" value={serviceItem.name} />
        <CustomCardField title="Service Type" value={serviceItem.serviceType} />
        <CustomCardField title="Target Resource" value={serviceItem.targetResource} />
      </CustomCard>

      <CustomCard title={"Ports"}>
        {"ports" in serviceItem &&
          serviceItem.ports.map((port, index) => {
            return (
              <div key={port.name}>
                <CustomCardField title="Name" value={port.name} />
                <CustomCardField title="Port" value={port.port} />
                <CustomCardField title="Target Port" value={port.targetPort} />
                <CustomCardField title="Protocol" value={port.protocol} />
                {index < serviceItem.ports.length - 1 && <Divider />}
              </div>
            );
          })}
      </CustomCard>
    </CustomModal>
  );
};
