import { FaDesktop } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { checkNamespaceValue } from '../utils/commonFunctions';
import CustomOverlay from "./CustomOverlay";

const IconTemplate = () => {
  return (
    <div className="flex justify-center">
      <FaDesktop className="text-gray-600 text-xl" />
    </div>
  );
};

const VmName = ({ item, user }) => {
  const { userNamespace, profile } = user;
  if (
    checkNamespaceValue(userNamespace, item.namespace, "crudVMS") ||
    profile?.role === "admin"
  ) {
    return (
      <Link to={`/virtual-machines/details/${item.namespace}/${item.name}`}>
        {item.name}
      </Link>
    );
  } else {
    return <>{item.name}</>;
  }
};


const ActionTemplate = ({ item, onActions }) => {
  const { onStop, onOpenConsole, onPauseUnpause, onRestart, onDelete, onMigrate, onStart, onEdit } = onActions;
  return (
    <div className="flex align-items-center gap-2">
      {item?.status === "Running" && (
        <button
          className="p-link inline-flex align-items-center justify-content-center"
          onClick={() => onOpenConsole(item)}
          style={{
            width: '1.75rem',
            height: '1.75rem',
            borderRadius: '50%',
            transition: 'all 0.2s ease',
            padding: 0
          }}
        >
          <i
            className="pi pi-code"
            style={{
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              margin: 0,
              lineHeight: 0
            }}
          />
        </button>
      )}
      <CustomOverlay template={<i className="pi pi-ellipsis-h" />}>
        <div>
          <div className="font-semibold mb-2">Actions</div>

          {item?.status === "Running" && (
            <>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onPauseUnpause(item, "pause")}
              >
                Pause
              </div>
              <div className="cursor-pointer mb-2" onClick={() => onStop(item)}>
                Stop
              </div>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onRestart(item)}
              >
                Restart
              </div>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onMigrate(item)}
              >
                Migrate
              </div>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onOpenConsole(item)}
              >
                Open Console
              </div>
            </>
          )}
          {item?.status === "Paused" && (
            <>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onPauseUnpause(item, "unpause")}
              >
                Unpause
              </div>
              <div className="cursor-pointer mb-2" onClick={() => onStop(item)}>
                Stop
              </div>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onRestart(item)}
              >
                Restart
              </div>
            </>
          )}
          {(item?.status === "Stopped" || item?.status === "Stopping") && (
            <>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onStart(item)}
              >
                Start
              </div>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onMigrate(item)}
              >
                Migrate
              </div>
              <div
                className="cursor-pointer mb-2"
                onClick={() => onEdit(item)}
              >
                Edit VM
              </div>
              <div className="cursor-pointer" onClick={() => onDelete(item)}>
                Delete VM
              </div>
            </>
          )}

          {!["Running", "Paused", "Stopped", "Stopping"].includes(
            item?.status
          ) && (
              <>
                <div className="cursor-pointer mb-2" onClick={() => onStop(item)}>
                  Stop
                </div>
              </>
            )}
        </div>
      </CustomOverlay>
    </div>
  );
};

export { IconTemplate, VmName, ActionTemplate }