import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  message,
  notification,
  Segmented,
  Select,
  Space,
  Timeline,
  TimelineItemProps,
  Typography,
} from 'antd';
import { prinClientInfos, printService } from '@erp-rc/print';
import { PrintClientType, PrintDocStatus, PrintError, PrintStatus } from '@erp-rc/print';
import dataJson1 from './_data1.json';
import dataJson from './_data.json';

export default () => {
  const [prinClientType, setPrinClientType] = useState<PrintClientType>('cainiao');
  const [printerOptions, setPrinterOptions] = useState<string[]>([]);
  const [printer, setPrinter] = useState<string>();
  const [messageApi, messageHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification();
  const [printMsgs, setPrintMsgs] = useState<TimelineItemProps[]>([]);
  const [useCommonFormat, setUseCommonFormat] = useState<boolean>(false);

  const prinClients = useMemo(() => {
    return Object.keys(prinClientInfos).map((key) => {
      const value = key as PrintClientType;
      return { label: prinClientInfos[value].name, value };
    });
  }, []);

  function getDocs() {
    const docs: any = useCommonFormat
      ? dataJson1.find((f) => f.type === prinClientType)
      : dataJson.find((f: any) => f.type === prinClientType);
    return docs;
  }

  function getPrinters(type: PrintClientType) {
    printService.getPrinters({
      type: type,
      onSuccess: ({ defaultPrinter, printers }, rawData) => {
        setPrinterOptions(printers);
        if (defaultPrinter) {
          setPrinter(defaultPrinter);
        }
        notificationApi.success({
          message: (
            <div>
              打印机列表：<pre>{JSON.stringify(printers, null, 2)}</pre>
            </div>
          ),
          description: (
            <div>
              原始数据：<pre>{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          ),
        });
      },
      onError: (data, rawData) => {
        setPrinterOptions([]);
        notificationApi.error({
          message: (
            <div>
              错误：<pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          ),
          description: (
            <div>
              原始数据：<pre>{JSON.stringify(rawData, null, 2)}</pre>
            </div>
          ),
        });
      },
    });
  }

  function print(data: { type: PrintClientType; documents: any[] }) {
    const key = printService.getUuid(8, 16);
    messageApi.loading({ key, content: '打印中..', duration: 0 });
    setPrintMsgs([]);
    printService.doPrint({
      requestID: key,
      printer: printer!,
      ...data,
      onPrint: function (data: PrintStatus, rawData: any) {
        console.log('onPrint', data, rawData);
        setPrintMsgs((prev) => [
          ...prev,
          {
            children: (
              <>
                onPrint<pre>{JSON.stringify(data, null, 2)}</pre>
              </>
            ),
          },
        ]);
        if (data.status === 'failed') {
          messageApi.error({ key, content: '打印失败', duration: 0 });
          setTimeout(messageApi.destroy, 2500);
        }
      },
      onRendered: function (data: PrintDocStatus[], rawData: any) {
        console.log('onRendered', data, rawData);
        setPrintMsgs((prev) => [
          ...prev,
          {
            children: (
              <>
                onRendered<pre>{JSON.stringify(data, null, 2)}</pre>
              </>
            ),
          },
        ]);
        messageApi.loading({ key, content: '渲染完成', duration: 0 });
      },
      onPrinted: function (data: PrintDocStatus[], rawData: any) {
        console.log('onPrinted', data, rawData);
        setPrintMsgs((prev) => [
          ...prev,
          {
            children: (
              <>
                onPrinted <pre>{JSON.stringify(data, null, 2)}</pre>{' '}
              </>
            ),
          },
        ]);
        messageApi.success({ key, content: '打印完成', duration: 0 });
        setTimeout(messageApi.destroy, 2500);
      },
      onError: (data: PrintError, rawData: any) => {
        console.log('onError', data, rawData);
        setPrintMsgs((prev) => [
          ...prev,
          {
            children: (
              <>
                onError <pre>{JSON.stringify(data, null, 2)}</pre>
              </>
            ),
          },
        ]);
        messageApi.error({ key, content: '打印错误', duration: 0 });
        setTimeout(messageApi.destroy, 2500);
      },
    });
  }

  return (
    <div style={{ padding: '20px' }}>
      {messageHolder}
      {notificationHolder}
      <Space direction="vertical">
        <Segmented<PrintClientType>
          value={prinClientType}
          options={prinClients}
          onChange={(value) => {
            setPrinClientType(value);
          }}
        />
        <Space>
          <Button
            onClick={async () => {
              getPrinters(prinClientType);
            }}
          >
            获取打印机
          </Button>
          <Select
            style={{ width: '200px' }}
            allowClear
            placeholder="请选择打印机"
            options={printerOptions.map((item) => ({ label: item, value: item }))}
            value={printer}
            onChange={(value: any) => {
              setPrinter(value);
            }}
          />
        </Space>
        <Space>
          <Checkbox
            checked={useCommonFormat}
            onChange={(e) => {
              setUseCommonFormat(e.target.checked);
            }}
          >
            使用通用格式
          </Checkbox>
          <Button
            onClick={async () => {
              const docs = getDocs();
              if (docs) {
                print(docs as any);
              }
            }}
          >
            打印
          </Button>
        </Space>
        <Typography.Text>
          <pre>
            <Typography.Paragraph
              ellipsis={{
                rows: 2,
                expandable: 'collapsible',
                symbol: (expanded) => (expanded ? '收起' : '展开'),
              }}
            >
              {JSON.stringify(getDocs(), null, 2)}
            </Typography.Paragraph>
          </pre>
        </Typography.Text>
      </Space>
      <br />
      <br />
      <Timeline items={printMsgs} mode="left" />
    </div>
  );
};
