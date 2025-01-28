import { FaDesktop } from 'react-icons/fa';

const VirtualMachinePageTitle = ({ name, status }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center">
                <FaDesktop className="text-gray-600 text-xl leading-none my-auto" style={{ verticalAlign: 'middle' }} />
            </div>
            <span>{name}</span>
            <div className="self-center">
                {status}
            </div>
        </div>
    )
}

export { VirtualMachinePageTitle }