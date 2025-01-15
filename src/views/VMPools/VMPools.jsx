import Page from "../../shared/Page";
import { useNavigate } from "react-router-dom";

export default function VMPools() {
    const navigate = useNavigate();
    const onAdd = () => {
        navigate("/virtual-machines/add", { state: { isVmPool: true } });
    }
    return <Page title="VM Pools" onAdd={onAdd} addText="Add VM Pool">VMPools</Page>;
}
