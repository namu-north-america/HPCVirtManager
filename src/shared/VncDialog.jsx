import { VncScreen } from 'react-vnc';
import { Dialog } from 'primereact/dialog';
import { showToastAction } from "../store/slices/commonSlice";
import { useDispatch } from 'react-redux';

export const VncDialog = ({ isOpen, selectedVM, onCloseConsole }) => {
  const dispatch = useDispatch();

  return (
    <Dialog
      header={`Console: ${selectedVM?.name}`}
      visible={isOpen}
      style={{ width: '80vw' }}
      modal
      onHide={onCloseConsole}
      maximizable
    >
      {selectedVM && (
        <div style={{ height: '70vh', width: '100%' }}>
          <div style={{ color: 'white', padding: '10px', backgroundColor: 'black' }}>
            <strong>VNC URL :</strong> {`/server/apis/subresources.kubevirt.io/v1alpha3/namespaces/${selectedVM.namespace}/virtualmachineinstances/${selectedVM.name}/vnc`}
          </div>
          <VncScreen
            url={`/server/apis/subresources.kubevirt.io/v1alpha3/namespaces/${selectedVM.namespace}/virtualmachineinstances/${selectedVM.name}/vnc`}
            scaleViewport
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000'
            }}
            onConnect={() => console.log('VNC Connected')}
            onDisconnect={() => console.log('VNC Disconnected')}
            onError={(error) => {
              console.error('VNC Error:', error);
              dispatch(showToastAction({
                type: 'error',
                title: 'Console Error',
                message: 'Failed to connect to VM console'
              }));
            }}
            wsProtocols={['binary']}
          />
        </div>
      )}
    </Dialog>
  )
}