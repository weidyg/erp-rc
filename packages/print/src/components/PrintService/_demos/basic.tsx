import { useMemo, useState } from "react";
import { Button, message, notification, Segmented, Select, Space, Timeline, TimelineItemProps } from "antd";
import { prinClientInfos, printService } from "@erp-rc/print";
import { PrintClientType, PrintDocStatus, PrintError, PrintStatus, } from "@erp-rc/print";
import { cianiaoDoc, doudianDoc, jingdongDoc, kuaishouDoc, pinduoduoDoc } from "./_data";
import data1 from './_data1.json';

export default () => {
    const [prinClientType, setPrinClientType] = useState<PrintClientType>('cainiao');
    const [printerOptions, setPrinterOptions] = useState<string[]>([]);
    const [printer, setPrinter] = useState<string>();
    const [messageApi, messageHolder] = message.useMessage();
    const [notificationApi, notificationHolder] = notification.useNotification();
    const [printMsgs, setPrintMsgs] = useState<TimelineItemProps[]>([]);

    const prinClients = useMemo(() => {
        return Object.keys(prinClientInfos).map((key) => {
            const value = key as PrintClientType;
            return { label: prinClientInfos[value].name, value, };
        });
    }, []);

    function getDocs() {
        const docs: any = data1.find(f => f.type === prinClientType);
        docs.isWaybill = true;
        // const docs = prinClientType === 'jingdong' ? jingdongDoc
        //     : prinClientType === 'cainiao' ? cianiaoDoc
        //         : prinClientType === 'doudian' ? doudianDoc
        //             : prinClientType === 'pinduoduo' ? pinduoduoDoc
        //                 : prinClientType === 'kuaishou' ? kuaishouDoc
        //                     : [];
        return docs;
    }

    function getPrinters(type: PrintClientType) {
        printService.getPrinters({
            type: type,
            onSuccess: ({ defaultPrinter, printers }, rawData) => {
                setPrinterOptions(printers);
                if (defaultPrinter) { setPrinter(defaultPrinter); }
                notificationApi.success({
                    message: <div>打印机列表：<pre>{JSON.stringify(printers, null, 2)}</pre></div>,
                    description: <div>原始数据：<pre>{JSON.stringify(rawData, null, 2)}</pre></div>
                })
            },
            onError: (data, rawData) => {
                setPrinterOptions([]);
                notificationApi.error({
                    message: <div>错误：<pre>{JSON.stringify(data, null, 2)}</pre></div>,
                    description: <div>原始数据：<pre>{JSON.stringify(rawData, null, 2)}</pre></div>
                })
            },
        });
    }

    function print(data: { type: PrintClientType, documents: any[] }) {
        const key = printService.getUuid(8, 16);
        messageApi.loading({ key, content: '打印中..', duration: 0, });
        setPrintMsgs([]);
        printService.doPrint({
            requestID: key,
            printer: printer!,
            ...data,
            onPrint: function (data: PrintStatus, rawData: any) {
                console.log('onPrint', data, rawData);
                setPrintMsgs(prev => [...prev, { children: <>onPrint<pre>{JSON.stringify(data, null, 2)}</pre></> }]);
                if (data.status === 'failed') {
                    messageApi.error({ key, content: '打印失败', duration: 0, });
                    setTimeout(messageApi.destroy, 2500);
                }
            },
            onRendered: function (data: PrintDocStatus[], rawData: any) {
                console.log('onRendered', data, rawData);
                setPrintMsgs(prev => [...prev, { children: <>onRendered<pre>{JSON.stringify(data, null, 2)}</pre></> }]);
                messageApi.loading({ key, content: '渲染完成', duration: 0, });
            },
            onPrinted: function (data: PrintDocStatus[], rawData: any) {
                console.log('onPrinted', data, rawData);
                setPrintMsgs(prev => [...prev, { children: <>onPrinted <pre>{JSON.stringify(data, null, 2)}</pre> </> }]);
                messageApi.success({ key, content: '打印完成', duration: 0, });
                setTimeout(messageApi.destroy, 2500);
            },
            onError: (data: PrintError, rawData: any) => {
                console.log('onError', data, rawData);
                setPrintMsgs(prev => [...prev, { children: <>onError <pre>{JSON.stringify(data, null, 2)}</pre></> }]);
                messageApi.error({ key, content: '打印错误', duration: 0, });
                setTimeout(messageApi.destroy, 2500);
            },
        });
    }


    return (<div style={{ padding: '20px' }}>
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
                <Button onClick={async () => {
                    getPrinters(prinClientType);
                }}>
                    获取打印机
                </Button>
                <Select style={{ width: '200px' }} allowClear placeholder="请选择打印机"
                    options={printerOptions.map(item => ({ label: item, value: item }))}
                    value={printer}
                    onChange={(value: any) => { setPrinter(value); }}
                />
            </Space>

            <Button onClick={async () => {
                const docs = getDocs();
                if (docs) { print(docs); }
            }}>
                打印
            </Button>
        </Space>
        <br />
        <br />
        <Timeline items={printMsgs} mode='left' />
    </div >);
};