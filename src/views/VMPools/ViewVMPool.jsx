import { useLocation } from "react-router-dom";
import Page from "../../shared/Page";
import { VirtualMachinePageTitle } from "../../shared/VirtualMachines";
import { StatusTemplate } from "../../shared/DataTableTemplates";

export const ViewVMPool = () => {
    const { state } = useLocation();

    return (
        <>
            <Page
                title={
                    <VirtualMachinePageTitle name={state.vmPoolName} status={<StatusTemplate status="Running" />} />
                }
            >

            </Page>
        </>
    )
}