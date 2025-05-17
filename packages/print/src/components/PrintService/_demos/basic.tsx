import { useMemo, useState } from "react";
import { Button, message, notification, Segmented, Select, Space } from "antd";
import { prinClientInfos, printService } from "@erp-rc/print";
import { PrintClientType, PrintDocStatus, PrintError, PrintStatus, } from "@erp-rc/print";
import { cianiaoDoc, doudianDoc, jingdongDoc, kuaishouDoc, pinduoduoDoc } from "./_data";

export default () => {
    const [prinClientType, setPrinClientType] = useState<PrintClientType>('cainiao');
    const [printerOptions, setPrinterOptions] = useState<string[]>([]);
    const [printer, setPrinter] = useState<string>();
    const [messageApi, contextHolder] = message.useMessage();
    const [printMsgs, setPrintMsgs] = useState<any[]>([]);

    const prinClients = useMemo(() => {
        return Object.keys(prinClientInfos).map((key) => {
            const value = key as PrintClientType;
            return { label: prinClientInfos[value].name, value, };
        });
    }, []);

    function getPrinters(type: PrintClientType) {
        printService.getPrinters({
            type: type,
            onSuccess: ({ defaultPrinter, printers }, rawData) => {
                setPrinterOptions(printers);
                if (defaultPrinter) { setPrinter(defaultPrinter); }
                notification.success({
                    message: <div>打印机列表：<pre>{JSON.stringify(printers, null, 2)}</pre></div>,
                    description: <div>原始数据：<pre>{JSON.stringify(rawData, null, 2)}</pre></div>
                })
            },
            onError: (data, rawData) => {
                setPrinterOptions([]);
                notification.error({
                    message: <div>错误：<pre>{JSON.stringify(data, null, 2)}</pre></div>,
                    description: <div>原始数据：<pre>{JSON.stringify(rawData, null, 2)}</pre></div>
                })
            },
        });
    }

    function print(key: string, type: PrintClientType, documents: any[]) {
        messageApi.loading({ key, content: '打印中..', duration: 0, });
        setPrintMsgs([]);
        printService.doPrint({
            type: type,
            requestID: key,
            printer: printer!,
            documents: documents,
            onPrint: function (data: PrintStatus, rawData: any) {
                console.log('onPrint', data);
                setPrintMsgs(prev => [...prev, { onPrint: data }]);
                if (data.status === 'failed') {
                    messageApi.error({ key, content: '打印失败', duration: 0, });
                    setTimeout(messageApi.destroy, 2500);
                }
            },
            onRendered: function (data: PrintDocStatus[], rawData: any) {
                console.log('onRendered', data, rawData);
                setPrintMsgs(prev => [...prev, { onRendered: data }]);
                messageApi.loading({ key, content: '渲染完成', duration: 0, });
            },
            onPrinted: function (data: PrintDocStatus[], rawData: any) {
                console.log('onPrinted', data, rawData);
                setPrintMsgs(prev => [...prev, { onPrinted: data }]);
                messageApi.success({ key, content: '打印完成', duration: 0, });
                setTimeout(messageApi.destroy, 2500);
            },
            onError: (data: PrintError, rawData: any) => {
                console.log('onError', data, rawData);
                setPrintMsgs(prev => [...prev, { onError: data }]);
                messageApi.error({ key, content: '打印错误', duration: 0, });
                setTimeout(messageApi.destroy, 2500);
            },
        });
    }


    return (<div style={{ padding: '20px' }}>
        {contextHolder}
        <Space direction="vertical">
            <Segmented<PrintClientType>
                value={prinClientType}
                options={prinClients}
                onChange={(value) => {
                    setPrinClientType(value);
                }}
            />
            <Space>
                <Button onClick={async () => {
                    getPrinters(prinClientType);
                }}>
                    获取打印机
                </Button>
                <Select style={{ width: '200px' }} allowClear placeholder="请选择打印机"
                    options={printerOptions.map(item => ({ label: item, value: item }))}
                    value={printer}
                    onChange={(value) => { setPrinter(value); }}
                />
            </Space>

            <Button onClick={async () => {
                const docs = prinClientType === 'jingdong' ? jingdongDoc
                    : prinClientType === 'cainiao' ? cianiaoDoc
                        : prinClientType === 'doudian' ? doudianDoc
                            : prinClientType === 'pinduoduo' ? pinduoduoDoc
                                : prinClientType === 'kuaishou' ? kuaishouDoc
                                    : [];
                if (docs.length > 0) {
                    const key = printService.getUuid(8, 16);
                    print(key, prinClientType, docs);
                }
            }}>
                打印
            </Button>
        </Space>
        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
            <pre>
                {printMsgs?.length > 0 && JSON.stringify(printMsgs, null, 2)}
            </pre>
        </div>
    </div >);
};