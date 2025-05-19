import { EventBus, EventData } from "../../utils/EventBus";
import {
    PrintClientType, GetPrintersRequest, JingdongGetPrintersRequest, GetPrintersResult, JingdongGetPrintersResult, JingdongPrintRequest,
    JingdongNotifyPrintResult, PrintResponse, NotifyPrintResult, PrintRequest, GetPrintersParams, PrintDocStatus, PrintParams, PrintStatus,
    WaybillDocument, PrintDocument, JingdongPrintDocument, DoudianPrintDocument, KuaishouPrintDocument, PinduoduoPrintDocument, CainiaoPrintDocument,
    CainiaoPrintContent, DoudianPrintContent, PinduoduoPrintContent, KuaishouPrintContent
} from "../../types";

export const prinClientInfos: Record<PrintClientType, { name: string; wsUrl: string; wssUrl?: string }> = {
    ['cainiao']: { name: '菜鸟', wsUrl: 'ws://localhost:13528', wssUrl: 'wss://localhost:13529' },
    ['doudian']: { name: '抖店', wsUrl: 'ws://localhost:13888', wssUrl: 'wss://localhost:13999' },
    ['pinduoduo']: { name: '拼多多', wsUrl: 'ws://localhost:5000', wssUrl: 'ws://localhost:18653' },
    ['kuaishou']: { name: ' 快手', wsUrl: 'ws://localhost:16888/ks/printer', wssUrl: 'wss://localhost:16889/ks/printer' },
    ['jingdong']: { name: '京东', wsUrl: 'ws://localhost:9113', wssUrl: '' },
};

class PrintService {
    private _sockets: { [key: string]: WebSocket | undefined } = {};
    private _eventBus: EventBus;
    constructor() {
        this._eventBus = new EventBus();
    }
    public getPrinters(params: GetPrintersParams) {
        const { type, requestID } = params || {};
        const _requestID = requestID || this.getUuid(8, 16);
        this.registerEventBus_getPrinters(_requestID, params);
        const request = this.getPrintersRequest(type, _requestID);
        this.send(type, request);
    }
    public doPrint(params: PrintParams) {
        const { type, requestID, preview, onError } = params || {};
        const _requestID = requestID || this.getUuid(8, 16);
        if (preview) {
            onError?.({ requestID: _requestID, msg: '暂不支持预览功能！' }, {});
            return;
        }
        this.registerEventBus_print(_requestID, params);
        const request = this.getPrintRequest(type, _requestID, params);
        this.send(type, request);
    }

    private send(type: PrintClientType, request: any) {
        const data = JSON.stringify(request);
        let socket = this._sockets[type];
        if (!socket) {
            socket = this.connect(type, () => {
                socket?.send(data);
            });
        } else {
            socket.send(data);
        }
        return socket;
    }
    private connect(type: PrintClientType, onopen: (ev: Event) => void) {
        const { name, wsUrl } = prinClientInfos[type] || {};
        const socket = new WebSocket(wsUrl);
        socket.onopen = (ev: Event) => {
            console.log(`【WebSocket】${type} Client open`, ev);
            this._sockets[type] = socket;
            onopen(ev);
        };
        socket.onclose = (ev: CloseEvent) => {
            console.log(`【WebSocket】${type} Client closed`, ev);
            this._sockets[type] = undefined;
        };
        socket.onmessage = (ev: MessageEvent) => {
            const data = JSON.parse(ev.data) || {};
            console.log(`【WebSocket】${type} Client received a message`, data);
            switch (type) {
                case 'jingdong':
                    data.requestID = data.requestID || data.key;
                    if (data.code === '2') {
                        this._eventBus.emitNotifyPrintResult(data);
                    } else if (data.code === '6') {
                        this._eventBus.emitGetPrinters(data);
                    }
                    break;
                case 'pinduoduo':
                    if (data.cmd === 'print') {
                        this._eventBus.emitPrint(data);
                    } else if (data.cmd == 'PrintResultNotify') {
                        //pdd 打印回调 没回传 requestID
                        data.requestID = data.requestID || data.taskID;
                        this._eventBus.emitNotifyPrintResult(data);
                    } else if (data.cmd === 'getPrinters') {
                        this._eventBus.emitGetPrinters(data);
                    }
                    break;
                default:
                    if (data.cmd === 'print') {
                        this._eventBus.emitPrint(data);
                    } else if (data.cmd == 'notifyPrintResult') {
                        this._eventBus.emitNotifyPrintResult(data);
                    } else if (data.cmd === 'getPrinters') {
                        this._eventBus.emitGetPrinters(data);
                    }
                    break;
            }
        };
        socket.onerror = (ev: Event) => {
            console.log(`【WebSocket】${type} Client error`, ev);
            this._sockets[type] = undefined;
            this._eventBus.emitError({ requestID: 'ws_error', msg: `连接${name}打印控件失败!` });
        };
        return socket;
    }
    private getPrintersRequest(type: PrintClientType, requestID: string) {
        switch (type) {
            case 'jingdong': {
                const request: JingdongGetPrintersRequest = {
                    key: requestID,
                    orderType: 'GET_Printers'
                };
                return request;
            }
            default: {
                const request: GetPrintersRequest = {
                    requestID: requestID,
                    cmd: 'getPrinters',
                    version: '1.0',
                };
                return request;
            }
        }
    }
    private getPrintRequest(type: PrintClientType, requestID: string, params: PrintParams) {
        const { printer, preview = false, previewType, isWaybill = false, documents: _documents = [] } = params || {};
        let documents = isWaybill ? this.toClientDocuments(type, _documents) : _documents;
        documents = this.copyDocuments(documents);
        switch (type) {
            case 'jingdong': {
                const request: JingdongPrintRequest = {
                    key: requestID,
                    version: "2",
                    orderType: preview ? "PRE_View:multi" : "PRINT",
                    parameters: {
                        printName: printer,
                        contents: documents as any
                    }
                };
                return request;
            }
            default:
                const request: PrintRequest = {
                    cmd: "print",
                    version: "1.0",
                    requestID: requestID,
                    task: {
                        taskID: requestID,
                        printer: printer,
                        preview: preview,
                        previewType: previewType,
                        documents: documents
                    }
                };
                return request;
        }
    }
    private copyDocuments(documents: PrintDocument[]) {
        const _documents: PrintDocument[] = [];
        documents.forEach(doc => {
            const { documentID, copy = 1, ...rest } = doc;
            if (copy > 1) {
                for (let i = 0; i < copy; i++) {
                    _documents.push({ ...rest, documentID: this.parseDocumentID(documentID, i + 1, copy) });
                }
            } else {
                _documents.push(doc);
            }
        });
        return _documents;
    }
    private toClientDocuments(type: PrintClientType, documents: WaybillDocument[]) {
        switch (type) {
            case 'jingdong': {
                const _documents: JingdongPrintDocument[] = [];
                for (const doc of documents) {
                    const { documentID, copy, sender, standardArea: standard, customArea: custom } = doc;
                    let jdPrintData = standard?.encryptedData;
                    let jdDataType = undefined;
                    if (!jdPrintData || jdPrintData.trim() === '') {
                        jdDataType = 'app';
                        jdPrintData = JSON.stringify(standard?.data);
                    }
                    const content: JingdongPrintDocument = {
                        documentID: documentID,
                        copy: copy,
                        tempUrl: standard?.templateURL!,
                        printData: jdPrintData,
                        addData: standard?.addData,
                        customTempUrl: custom?.templateURL,
                        customData: custom?.data,
                        dataType: jdDataType,
                    };
                    if (sender) {
                        var _sender = {
                            name: sender.name,
                            mobile: sender.mobile,
                            phone: sender.phone,
                            address: `${sender.province??''}${sender.city??''}${sender.district??''}${sender.street??''}${sender.address??''}`,
                        };
                        content.addData = content.addData || {};
                        content.addData.sender = _sender;
                    }
                    _documents.push(content);
                }
                return _documents;
            }
            case 'cainiao': {
                const _documents: CainiaoPrintDocument[] = [];
                for (const doc of documents) {
                    const { documentID, sender, standardArea, customArea, ...rest } = doc;
                    const contents: CainiaoPrintDocument['contents'] = [];
                    if (standardArea) {
                        const { templateURL, signature, encryptedData, data, addData = {}, ...rest } = standardArea;
                        const content: CainiaoPrintContent = {
                            templateURL, signature, encryptedData, data,
                            addData: {
                                ...addData,
                                sender: sender
                                    ? {
                                        name: sender.name,
                                        mobile: sender.mobile,
                                        phone: sender.phone,
                                        address:
                                        {
                                            province: sender.province,
                                            city: sender.city,
                                            district: sender.district,
                                            detail: `${sender.street ?? ''}${sender.address ?? ''}`,
                                        }
                                    }
                                    : addData.sender,
                            },
                            ...rest
                        };
                        contents.push(content);
                    }
                    if (customArea) {
                        const { templateURL, data, ...rest } = customArea;
                        contents.push({ templateURL, data, ...rest });
                    }
                    _documents.push({
                        documentID: documentID,
                        contents: contents,
                        ...rest
                    });
                }
                return _documents;
            }
            case 'doudian': {
                const _documents: DoudianPrintDocument[] = [];
                for (const doc of documents) {
                    const { documentID, sender, standardArea, customArea, ...rest } = doc;
                    const contents: DoudianPrintDocument['contents'] = [];
                    if (standardArea) {
                        const { templateURL, signature, encryptedData, data, addData = {}, params, ...rest } = standardArea;
                        const content: DoudianPrintContent = {
                            templateURL, signature, encryptedData, data,
                            addData: {
                                ...addData,
                                senderInfo: sender
                                    ? {
                                        address: {
                                            provinceName: sender.province,
                                            cityName: sender.city,
                                            districtName: sender.district,
                                            streetName: sender.street,
                                            detailAddress: sender.address,
                                        },
                                        contact: {
                                            name: sender.name,
                                            mobile: sender.mobile,
                                        }
                                    }
                                    : addData.senderInfo,
                            },
                            params,
                            ...rest
                        };
                        contents.push(content);
                    }
                    if (customArea) {
                        const { templateURL, data, ...rest } = customArea;
                        contents.push({ templateURL, data, ...rest });
                    }
                    _documents.push({
                        documentID: documentID,
                        contents: contents,
                        ...rest
                    });
                }
                return _documents;
            }
            case 'pinduoduo': {
                const _documents: PinduoduoPrintDocument[] = [];
                for (const doc of documents) {
                    const { documentID, sender, standardArea, customArea, ...rest } = doc;
                    const contents: PinduoduoPrintDocument['contents'] = [];
                    if (standardArea) {
                        const { templateURL, signature, encryptedData, data, addData = {}, params, ...rest } = standardArea;
                        const content: PinduoduoPrintContent = {
                            templateURL, signature, encryptedData, data,
                            addData: {
                                ...addData,
                                sender: sender
                                    ? {
                                        address: {
                                            province: sender.province,
                                            city: sender.city,
                                            district: sender.district,
                                            town: sender.street,
                                            detail: sender.address,
                                        },
                                        name: sender.name,
                                        mobile: sender.mobile,
                                        phone: sender.phone,
                                    }
                                    : addData.sender,
                            },
                            ...rest
                        };
                        contents.push(content);
                    }
                    if (customArea) {
                        const { templateURL, data, ...rest } = customArea;
                        contents.push({ templateURL, data, ...rest });
                    }
                    _documents.push({
                        documentID: documentID,
                        contents: contents,
                        ...rest
                    });
                }
                return _documents;
            }
            case 'kuaishou': {
                const _documents: KuaishouPrintDocument[] = [];
                for (const doc of documents) {
                    const { documentID, sender, standardArea, customArea, ...rest } = doc;
                    const contents: KuaishouPrintDocument['contents'] = [];
                    if (standardArea) {
                        const { templateURL, signature, encryptedData, data, addData = {}, params, ...rest } = standardArea;
                        const content: KuaishouPrintContent = {
                            templateURL, signature, encryptedData, data,
                            addData: {
                                ...addData,
                                senderInfo: sender
                                    ? {
                                        address: {
                                            provinceName: sender.province,
                                            cityName: sender.city,
                                            districtName: sender.district,
                                            streetName: sender.street,
                                            detailAddress: sender.address,
                                        },
                                        contact: {
                                            name: sender.name,
                                            mobile: sender.mobile,
                                        }
                                    }
                                    : addData.senderInfo,
                            },
                            ...rest
                        };
                        contents.push(content);
                    }
                    if (customArea) {
                        const { templateURL, data, ...rest } = customArea;
                        contents.push({ templateURL, customData: data, ...rest });
                    }
                    _documents.push({
                        ksOrderFlag: true,
                        documentID: documentID,
                        contents: contents,
                        ...rest
                    });
                }
                return _documents;
            }
        }
    }
    private registerEventBus_getPrinters(requestID: string, params: GetPrintersParams) {
        const { type, onSuccess, onError } = params || {};
        let errorFun = (rawData: EventData): void => {
            // console.log("getPrinters errorFunc", requestID, rawData);
            if (rawData?.requestID == requestID || rawData?.requestID == 'ws_error') {
                let message = rawData?.msg || rawData?.message;
                onError?.({ requestID, msg: message }, rawData);
                offEventBus();
            }
        }
        let getPrintersFun = (rawData: EventData): void => {
            // console.log("getPrinters getPrintersFunc", requestID, rawData);
            if (rawData?.requestID == requestID) {
                let printers: string[] = [];
                let defaultPrinter: string;
                switch (type) {
                    case 'jingdong':
                        {
                            const _data = rawData as JingdongGetPrintersResult;
                            if (_data?.success == "true") {
                                printers = _data?.detailinfo?.printers || [];
                                defaultPrinter = printers?.[0];
                                onSuccess?.({ defaultPrinter, printers }, rawData);
                            } else {
                                const message = _data?.message;
                                onError?.({ requestID, msg: message }, rawData);
                            }
                            break;
                        }
                    default:
                        {
                            const _data = rawData as GetPrintersResult;
                            printers = _data?.printers?.map((item: any) => item.name) || [];
                            defaultPrinter = _data?.defaultPrinter;
                            onSuccess?.({ defaultPrinter, printers }, rawData);
                            break;
                        }
                }
                offEventBus();
            }
        }
        this._eventBus.onError(errorFun);
        this._eventBus.onGetPrinters(getPrintersFun);
        let offEventBus = () => {
            this._eventBus.offError(errorFun);
            this._eventBus.offGetPrinters(getPrintersFun);
        };
    }
    private registerEventBus_print(requestID: string, params: PrintParams) {
        const { type, onPrint, onRendered, onPrinted, onError } = params || {};
        let errorFun = (rawData: EventData): void => {
            console.log("【PrintService】print errorFun", requestID, rawData);
            if (rawData?.requestID == requestID || rawData?.requestID == 'ws_error') {
                const data: PrintStatus = {
                    status: 'failed',
                    msg: rawData?.msg || rawData?.message,
                    requestID: requestID,
                };
                onError?.(data, rawData);
                offEventBus();
            }
        }

        let printFun = (rawData: EventData): void => {
            console.log("【PrintService】print printFun", requestID, rawData);
            if (rawData?.requestID == requestID) {
                switch (type) {
                    case 'jingdong':
                        break;
                    default:
                        {
                            if (type === 'cainiao' && rawData?.status === 'success' &&
                                (rawData?.previewURL || rawData?.previewImage)) {
                                //TODO: 预览
                                offEventBus();
                            } else {
                                const _data = rawData as unknown as PrintResponse;
                                const { status, msg } = _data || {};
                                const data: PrintStatus = { status, msg, requestID, };
                                onPrint?.(data, rawData);
                            }
                        }
                        break;
                }
            };
        }
        let notifyPrintResultFun = (rawData: EventData): void => {
            console.log("【PrintService】print notifyPrintResultFun", requestID, rawData);
            if (rawData?.requestID == requestID) {
                switch (type) {
                    case 'jingdong':
                        {
                            const _data = rawData as JingdongNotifyPrintResult;
                            const documents = params.documents as JingdongPrintRequest['parameters']['contents'];
                            const { errors = [], detail = [] } = _data?.detailinfo || {};
                            if (_data?.success == 'true') {
                                const data: PrintDocStatus[] = [];
                                for (let index = 0; index < documents.length; index++) {
                                    const { documentID } = documents[index] || {};
                                    const error = errors?.find(s => s.seq == `${index + 1}`);
                                    const status = error ? 'failed' : 'success';
                                    const printDocStatus = this.parsePrintDocStatus({ requestID, documentID, status, msg: error?.msg, });
                                    data.push(printDocStatus);
                                }
                                onPrinted?.(data, rawData);
                            } else {
                                if (errors.length > 0 || detail.length > 0) {
                                    const data: PrintDocStatus[] = [];
                                    for (let index = 0; index < documents.length; index++) {
                                        const { documentID } = documents[index] || {};
                                        const msg = errors?.find(s => s.seq == `${index + 1}`)?.msg
                                            ?? detail?.find(s => s.seq == `${index + 1}`)?.msg
                                            ?? _data?.detailinfo?.info ?? '打印失败';
                                        const printDocStatus = this.parsePrintDocStatus({ requestID, documentID, status: 'failed', msg, });
                                        data.push(printDocStatus);
                                    }
                                    onPrinted?.(data, rawData);
                                } else {
                                    const msg = _data?.content ?? _data?.message ?? _data?.detailinfo?.info;
                                    onError?.({ requestID, msg }, rawData);
                                }
                                offEventBus();
                            }
                        }
                        break;
                    default:
                        {
                            const _data = rawData as NotifyPrintResult;
                            const { taskStatus, printStatus = [] } = _data;
                            const data = printStatus.map(status => (
                                this.parsePrintDocStatus({ ...status, requestID, msg: status.msg || status.detail })
                            ));
                            switch (taskStatus) {
                                case 'rendered': {
                                    onRendered?.(data, rawData);
                                    break;
                                }
                                case 'printed': {
                                    onPrinted?.(data, rawData);
                                    offEventBus();
                                    break;
                                }
                                case 'partPrinted':
                                case 'failed': {
                                    if (printStatus.length > 0) {
                                        onPrinted?.(data, rawData);
                                    } else {
                                        const msg = _data?.msg ?? '打印失败';
                                        onError?.({ msg, requestID }, rawData);
                                    }
                                    offEventBus();
                                    break;
                                }
                                default:
                                    break;
                            }
                        }
                        break;
                }
            }
        }

        let offEventBus = () => {
            this._eventBus.offError(errorFun);
            this._eventBus.offPrint(printFun);
            this._eventBus.offNotifyPrintResult(notifyPrintResultFun);
        };
        this._eventBus.onError(errorFun);
        this._eventBus.onPrint(printFun);
        this._eventBus.onNotifyPrintResult(notifyPrintResultFun);
    }
    private parsePrintDocStatus(data: PrintDocStatus): PrintDocStatus {
        const { documentID } = data;
        if (documentID) {
            const match = documentID?.match(/(.+)\_([\d]+)\/([\d]+)\_/);
            if (match) {
                const [_, documentID, index, total] = match;
                return { ...data, documentID, seq: Number(index), total: Number(total) };
            }
            return { ...data, documentID, seq: 1, total: 1 };
        }
        return data;
    }
    private parseDocumentID(documentID: string, index: number, total: number): string {
        if (documentID) { return `${documentID}_${index}/${total}_`; }
        return documentID;
    }
    public getUuid(len: number, radix: number): string {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid: any[] = [], i: number;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | (Math.random() * radix)];
            }
        } else {
            var r: number;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | (Math.random() * 16);
                    uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
}

export const printService = new PrintService();