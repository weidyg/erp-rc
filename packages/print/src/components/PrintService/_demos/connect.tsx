import { useCallback, useEffect, useMemo, useState } from 'react';
import { prinClientInfos, PrintClientType, printService } from '@erp-rc/print';

export default () => {
  const [prinClientTypes, setPrinClientTypes] = useState<PrintClientType[]>([]);
  const prinClients = useMemo(() => {
    return Object.keys(prinClientInfos).map((key) => {
      const value = key as PrintClientType;
      return { label: prinClientInfos[value].name, value, };
    });
  }, []);

  useEffect(() => {
    connectPrinClient();
  })

  const key = printService.getUuid(8, 16);
  const connectPrinClient = useCallback(() => {
    setInterval(() => {
      const type = 'cainiao';
      const isConnected = prinClientTypes.includes(type);
      if (!isConnected) {
        console.log(`Connecting to ${type} ${key}...`);
        printService.connect({
          requestID: key,
          type: type,
          onOpen: (socket: any) => {
            setPrinClientTypes((prev) => [...prev, type]);
          },
          onError: (rawData: any) => {
            console.error(`Error connecting to ${type}`, rawData);
            setPrinClientTypes((prev) => prev.filter((t) => t !== type));
          },
        });
      }
    }, 5000);
  }, [prinClientTypes]);

  return (
    <div style={{ padding: '20px' }}>
      {prinClients.map((client) => (
        <div key={client.value} style={{ marginBottom: '10px' }}>
          {client.label}
          {prinClientTypes.includes(client.value) && (
            <span style={{ marginLeft: '10px', color: 'green' }}>Connected</span>
          )}
          {!prinClientTypes.includes(client.value) && (
            <span style={{ marginLeft: '10px', color: 'red' }}>Not Connected</span>
          )}

        </div>
      ))}
    </div>
  );
};
