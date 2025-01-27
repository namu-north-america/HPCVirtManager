import { classNames } from 'primereact/utils';
import CustomOverlay from './CustomOverlay';

const ActionItem = ({ className, children, ...rest }) => {
    return (
        <div
            className={classNames("cursor-pointer mb-2", className)}
            {...rest}
        >
            {children}
        </div>
    )
}

const ActionsOverlay = ({ children }) => {
    return (
        <div className="flex align-items-center gap-2">
            <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
                <div>
                    <div className="font-semibold mb-2">Actions</div>
                    {children}
                </div>
            </CustomOverlay>
        </div>
    )
}

export { ActionsOverlay, ActionItem }