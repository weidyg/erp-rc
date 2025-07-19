import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { prinClientInfos, PrintClientType, printService } from '@erp-rc/print';
export default () => {
  const [connectedClients, setConnectedClients] = useState<PrintClientType[]>([]);
  const prinClients = useMemo(() => {
    return Object.keys(prinClientInfos).map((key) => {
      const value = key as PrintClientType;
      return { label: prinClientInfos[value].name, value };
    });
  }, []);

  useEffect(() => {
    connectPrinClient();
  }, []);

  // const key = useMemo(() => printService.getUuid(8, 16), []);
  const connectPrinClient = useCallback(() => {
    for (let index = 0; index < prinClients.length; index++) {
      const { label, value } = prinClients[index];
      // console.log(`Connecting1 to ${value} ${JSON.stringify(connectedClients.current)}...`);
      // if (connectedClients.current.includes(value)) { continue; }
      console.log(`Connecting to ${value}...`);
      connect(value);
    }
  }, []);

  const waitConnects = useRef<PrintClientType[]>([]);
  const reConnect = (value: PrintClientType) => {
    if (!waitConnects.current.includes(value)) {
      waitConnects.current = [...waitConnects.current, value];
      setTimeout(() => {
        waitConnects.current = waitConnects.current.filter((t) => t !== value);
        connect(value);
      }, 5000);
    }
  };
  const connect = (value: PrintClientType) => {
    // printService.connect({
    //   type: value,
    //   onOpen: () => {
    //     setConnectedClients((prev) => [...prev, value]);
    //     console.log(`onOpen__${value}_${JSON.stringify(connectedClients)}`);
    //   },
    //   onClose: () => {
    //     setConnectedClients((prev) => prev.filter((t) => t !== value));
    //     console.log(`onClose  ${value}`);
    //     reConnect(value);
    //   },
    // });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* {JSON.stringify(clients)} */}
      {JSON.stringify(connectedClients)}
      {prinClients.map((client) => (
        <div key={client.value} style={{ marginBottom: '10px' }}>
          {client.label}
          {connectedClients.includes(client.value) ? (
            <span style={{ marginLeft: '10px', color: 'green' }}>Connected</span>
          ) : (
            <span style={{ marginLeft: '10px', color: 'red' }}>Not Connected</span>
          )}
        </div>
      ))}
    </div>
  );
};
