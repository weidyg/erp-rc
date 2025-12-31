import { useCallback, useEffect, useRef, useState } from 'react';
import { prinClientInfos, PrintClientType, printService } from '@erp-rc/print';
import { Button } from 'antd';
export default () => {
  const printers = useRef<{ [x: string]: string[] }>({});
  const [clientStatus, setClientStatus] = useState<{ [x: string]: boolean }>({});
  const clientTypes = Object.keys(prinClientInfos) as PrintClientType[];
  const _eventBus = printService._eventBus;

  useEffect(() => {
    const connection = onEventBus();
    return () => {
      connection.offEventBus();
    };
  }, []);

  const onEventBus = useCallback(() => {
    const list: Function[] = [];
    for (const type of clientTypes) {
      const offOpen = _eventBus.onOpen(type, () => handleOpen(type), `${type}_open`);
      const offClose = _eventBus.onClose(type, () => handleClose(type), `${type}_close`);
      list.push(offOpen, offClose);
    }
    return {
      offEventBus: () => {
        list.forEach(off => off());
      }
    };
  }, []);

  const handleOpen = useCallback((type: PrintClientType) => {
    console.log('handleOpen', type);
    setClientStatus((prev) => ({ ...prev, [type]: true, }));
  }, []);
  const handleClose = useCallback((type: PrintClientType) => {
    console.log('handleClose', type);
    setClientStatus((prev) => ({ ...prev, [type]: false, }));
    printers.current[type] = [];
  }, []);

  const getPrinters = useCallback(async (type: PrintClientType) => {
    return await new Promise<string[]>((resolve, reject) => {
      if (!type) { reject('getPrinters type undefined'); return; }
      if (printers.current[type]?.length > 0) {
        resolve(printers.current[type]);
      } else {
        printService.getPrinters({
          type: type,
          onSuccess: function (data, rawData) {
            printers.current[type] = data?.printers ?? [];
            resolve(printers.current[type]);
          },
          onError: function (data, rawData) {
            console.log('getPrinters onError', data, rawData);
            printers.current[type] = [];
            reject(data?.msg);
          }
        });
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* {JSON.stringify(clients)} */}
      {JSON.stringify(clientStatus)}
      {Object.keys(prinClientInfos).map((type) => (
        <div key={type} style={{ marginBottom: '10px' }}>
          {prinClientInfos[type as PrintClientType].name}
          {clientStatus[type] ? (
            <span style={{ marginLeft: '10px', color: 'green' }}>Connected</span>
          ) : (
            <span style={{ marginLeft: '10px', color: 'red' }}>Not Connected</span>
          )}
        </div>
      ))}
      <Button onClick={() => { getPrinters('cainiao'); }}>
        获取打印机
      </Button>
    </div>
  );
};
