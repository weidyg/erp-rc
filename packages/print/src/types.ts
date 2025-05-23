export type PrintClientType = 'cainiao' | 'doudian' | 'pinduoduo' | 'kuaishou' | 'jingdong';
export type PrintersData = {
  defaultPrinter?: string;
  printers: string[];
};
export type PrintersError = Omit<PrintStatus, 'status'>;
export type PrintError = Omit<PrintStatus, 'status'>;

export type GetPrintersParams = {
  type: PrintClientType;
  requestID?: string;
  onSuccess: (data: PrintersData, rawData: any) => void;
  onError: (data: PrintersError, rawData: any) => void;
};
export type PrintStatus = {
  requestID: string;
  status: 'success' | 'failed' | 'canceled';
  msg?: string;
};
export type PrintDocStatus = PrintStatus & {
  documentID: string;
  seq?: number;
  total?: number;
};
export type PrintParams = {
  type: PrintClientType;
  documents: (PrintDocument | WaybillDocument)[];
  requestID?: string;
  printer: string;
  preview?: boolean;
  previewType?: 'pdf' | 'image';
  onPrint: (data: PrintStatus, rawData: any) => void;
  onRendered: (data: PrintDocStatus[], rawData: any) => void;
  onPrinted: (data: PrintDocStatus[], rawData: any) => void;
  onError: (data: PrintError, rawData: any) => void;
};

//https://open.jdl.com/#/open-business-document/access-guide/157/54222

export type JingdongPrintResult = {
  requestID: string; //冗余字段
  key: string;
  code: '2' | '8'; // 2：批量推送打印，6：获取打印机列表，8：预览
  success: 'true' | 'false';
  message: string;
  status: string; //500：执行成功， 502：数据有误， 503：数据格式不正确
  content: string;
  detailinfo: {
    total: string; //"2-2"
    detail?: { seq: string; msg: string }[];
    errors?: { seq: string; msg: string }[];
    info?: string;
    imgdata: string;
    imgpath: string;
  };
};
export type JingdongPrintDocument = PrintDocument & {
  documentID: string; //冗余字段
  tempUrl: string; //标准模板
  printData: string; //标准区密文数据
  customTempUrl?: string; //自定义模板
  customData?: { [k: string]: any }; //自定义数据，对应模板上的自定义区占位符
  dataType?: 'app' | string;
  addData?: {
    //寄件人替换
    sender?: {
      name?: string;
      mobile?: string;
      phone?: string;
      address?: string;
    };
  };
};
export type JingdongPrintRequest = {
  key: string;
  orderType: 'PRINT' | 'PRE_View' | 'PRE_View:multi';
  version: '2';
  parameters: {
    printName: string; //打印机名称,
    contents: JingdongPrintDocument[];
  };
};
export type JingdongNotifyPrintResult = {
  requestID: string; //冗余字段
  key: string;
  code: '2' | '8'; // 2：批量推送打印，6：获取打印机列表，8：预览
  success: 'true' | 'false';
  message: string;
  status: string; //500：执行成功， 502：数据有误， 503：数据格式不正确
  content: string;
  detailinfo: {
    total: string; //"2-2"
    detail?: { seq: string; msg: string }[];
    errors?: { seq: string; msg: string }[];
    info?: string;
    imgdata: string;
    imgpath: string;
  };
};
export type JingdongGetPrintersRequest = {
  key: string;
  orderType: 'GET_Printers';
};
export type JingdongGetPrintersResult = {
  requestID: string; //冗余字段
  key: string;
  code: '6'; // 2：批量推送打印，6：获取打印机列表，8：预览
  success: 'true' | 'false';
  message: string;
  status: string; //500：执行成功， 502：数据有误， 503：数据格式不正确
  content: string;
  detailinfo: {
    printers: string[];
  };
};

//https://support-cnkuaidi.taobao.com/docs/doc.htm?treeId=409&articleId=107014&docType=1
export type CainiaoPrintDocument = PrintDocument & {
  documentID: string;
  contents: CainiaoPrintContent[];
};
export type CainiaoPrintContent =
  | {
      encryptedData?: string;
      signature?: string;
      templateURL?: string;
      addData?: { [k: string]: any };
      ver?: string;
    }
  | {
      data?: { [k: string]: any };
      templateURL?: string;
    };
export type CainiaoPrintRequest = {
  cmd: 'print';
  requestID: string;
  version: string;
  task: {
    taskID: string;
    preview: boolean;
    printer?: string;
    previewType?: 'pdf' | 'image';
    firstDocumentNumber?: number;
    totalDocumentCount?: number;
    documents: CainiaoPrintDocument[];
  };
};
export type CainiaoNotifyPrintResult = {
  requestID: string;
  cmd: 'notifyPrintResult';
  printer: string;
  taskID: string;
  taskStatus: 'failed' | 'rendered' | 'printed';
  msg?: string;
  status?: number;
  evaluationSpendTime?: number;
  pendingSpendTime?: number;
  downloadingSpendTime?: number;
  totalSpendTime?: number;
  errorCode?: number;
  printStatus: {
    documentID: string;
    status: 'success' | 'canceled' | 'failed';
    msg: string;
    detail: string;
    printer: string;
    renderingSpendTime: number;
    renderingStartTime: string;
  }[];
};

export type CainiaoPrintResponse = PrintResponse & {
  previewURL?: string;
  previewImage?: string[];
  urls?: string[]; //1.x后的菜鸟打印组件版本会在预览时返回
};
export type CainiaoGetPrintersRequest = GetPrintersRequest & {};
export type CainiaoGetPrintersResult = GetPrintersResult & {};

//https://bytedance.larkoffice.com/docx/doxcn1Q29qB2M3HKzjK5uaMbsMb
export type DoudianPrintDocument = PrintDocument & {
  documentID: string;
  contents: DoudianPrintContent[];
};
export type DoudianPrintContent =
  | {
      params: string; //access_token=值&app_key=值&method=logistics.getShopKey&param_json={}&timestamp=时间&v=2&sign=值，各参数值的生成详见电商开放平台https://op.jinritemai.com/docs/guide-docs/10/23，其中的method=logistics.getShopKey，param_json={}
      encryptedData: string;
      signature?: string;
      templateURL?: string;
      addData?: {
        //密文中有发件人信息，修改发件人信息，可选
        senderInfo?: {
          address?: {
            cityName?: string;
            countryCode?: string;
            detailAddress?: string;
            districtName?: string;
            provinceName?: string;
            streetName?: string;
          };
          contact?: {
            mobile?: string;
            name?: string;
          };
        };
      };
      config?: {
        printMask?: string; //0x40 //不打印模板上的 "保价金额"
        packageNumber?: string; //"1/3"//包裹号
      };
    }
  | {
      data?: { [k: string]: any };
      templateURL?: string;
    };
export type DoudianPrintRequest = {
  cmd: 'print';
  requestID: string;
  version: string;
  task: {
    taskID: string;
    printer?: string;
    preview: boolean;
    previewType?: 'pdf' | 'image';
    firstDocumentNumber?: number; //task 起始 document 序号，1.0.1.3支持
    totalDocumentCount?: number; //task document 总数，1.0.1.3支持
    documents: DoudianPrintDocument[];
  };
};
export type DoudianNotifyPrintResult = {
  cmd: 'notifyPrintResult';
  printer: string;
  taskID: string;
  taskStatus: 'failed' | 'rendered' | 'printed';
  printStatus: {
    documentID: string;
    successCount: number;
    failCount: number;
    status: 'success' | 'canceled' | 'failed';
    msg: string;
    detail: string;
    detailString?: string;
    errorcode?: string;
    trackNo?: string;
  }[];
  previewURL?: string;
  previewImage?: string[];
};

export type DoudianPrintResponse = PrintResponse & {};
export type DoudianGetPrintersRequest = GetPrintersRequest & {};
export type DoudianGetPrintersResult = GetPrintersResult & {};

//https://open.pinduoduo.com/application/document/browse?idStr=3BBB4C229B6A8FCC
export type PinduoduoPrintDocument = PrintDocument & {
  documentID: string;
  contents: PinduoduoPrintContent[];
};
export type PinduoduoPrintContent =
  | {
      encryptedData?: string;
      signature?: string;
      templateUrl?: string;
      userid?: string;
      ver?: string;
      addData?: {
        //密文中有发件人信息，修改发件人信息，可选
        sender?: {
          address?: {
            province?: string;
            city?: string;
            district?: string;
            town?: string;
            detail?: string;
          };
          mobile?: string;
          phone?: string;
          name?: string;
        };
      };
    }
  | {
      data?: { [k: string]: any };
      templateURL?: string;
    };
export type PinduoduoPrintRequest = {
  ERPId?: string; //"isv id"
  ISVName?: string;
  cmd: 'print';
  requestID: string;
  version: string;
  task: {
    taskID: string;
    printer?: string;
    preview: boolean;
    previewType?: 'pdf' | 'image';
    documents: PinduoduoPrintDocument[];
  };
};
export type PinduoduoNotifyPrintResult = {
  cmd: 'PrintResultNotify';
  printer: string;
  taskID: string;
  firstFailedDocSN: number;
  taskStatus: 'failed' | 'printed';
  msg?: string;
  printStatus: (NotifyPrintResultStatus & {
    documentID: string;
    status: 'success' | 'canceled' | 'failed';
    msg: string;
    detail: string;
  })[];
};
export type PinduoduoPrintResponse = PrintResponse & {
  previewURL?: string;
  previewImage?: string[];
};
export type PinduoduoGetPrintersRequest = GetPrintersRequest & {};
export type PinduoduoGetPrintersResult = GetPrintersResult & {};

//https://docs.qingque.cn/d/home/eZQA41D2h9LGUFaD26bC07e--?identityId=1oEFwmDizx5#section=h.p5cs6acekzdq
export type KuaishouPrintDocument = PrintDocument & {
  waybillCode?: string;
  ksOrderFlag: boolean;
  documentID: string;
  contents: KuaishouPrintContent[];
};
export type KuaishouPrintContent =
  | {
      data?: { [k: string]: any };
      addData?: {
        senderInfo?: {
          address?: {
            cityName?: string;
            countryCode?: string;
            detailAddress?: string;
            districtName?: string;
            provinceName?: string;
            streetName?: string;
          };
          contact?: {
            mobile?: string;
            name?: string;
          };
        };
      };
      encryptedData?: string;
      signature?: string;
      templateURL: string;
      key?: string;
      ver?: string;
    }
  | {
      customData: { [k: string]: any };
      templateURL: string;
    };

export type KuaishouPrintRequest = {
  cmd: 'print';
  requestID: string;
  version: string;
  task: {
    taskID: string;
    printer: string;
    preview: boolean;
    firstDocumentNumber?: number;
    totalDocumentCount?: number;
    documents: KuaishouPrintDocument[];
  };
};
export type KuaishouNotifyPrintResult = {
  cmd: 'notifyPrintResult';
  requestID: string;
  status: 'success' | 'failed';
  msg: string;
  taskID: string;
  taskStatus: 'printed' | 'failed ' | 'partPrinted';
  printStatus: [
    {
      documentID: string;
      waybillCode: string;
      status: 'success' | 'failed';
      detail: null;
    },
  ];
};
export type KuaishouPrintResponse = PrintResponse & {
  previewImage?: string[];
};
export type KuaishouGetPrintersRequest = GetPrintersRequest & {};
export type KuaishouGetPrintersResult = GetPrintersResult & {};

export type GetPrintersRequest = {
  cmd: 'getPrinters';
  requestID: string;
  version: string;
};
export type GetPrintersResult = {
  cmd: 'getPrinters';
  requestID: string;
  defaultPrinter: string;
  printers: { name: string }[];
};
export type PrintRequest = {
  cmd: 'print';
  requestID: string;
  version: '1.0';
  task: {
    taskID: string;
    preview: boolean;
    printer: string;
    previewType?: string;
    documents: any[];
  };
};
export type PrintResponse = {
  cmd: 'print';
  requestID: string;
  taskID: string;
  status: 'success' | 'failed';
  msg?: string;
};
export type NotifyPrintResult = {
  requestID: string;
  cmd: 'notifyPrintResult';
  printer: string;
  taskID: string;
  taskStatus: 'failed' | 'rendered' | 'printed' | 'partPrinted';
  msg?: string;
  printStatus?: NotifyPrintResultStatus[];
};
export type NotifyPrintResultStatus = {
  documentID: string;
  status: 'success' | 'canceled' | 'failed';
  msg: string;
  detail: string;
};

export type PrintDocument = {
  documentID: string;
  copy?: number; //2:打印两份，默认1份
  contents?: any;
};

export type WaybillDocument = {
  documentID: string;
  copy?: number; //2:打印两份，默认1份
  sender?: {
    name?: string;
    mobile?: string;
    phone?: string;
    province?: string;
    city?: string;
    district?: string;
    street?: string;
    address?: string;
  };
  standardArea?: {
    templateURL: string;
    signature?: string;
    encryptedData?: string;
    data?: { [k: string]: any };
    addData?: { [k: string]: any };
    ver?: string;
    extraProperties?: { [k: string]: any };
  };
  customArea?: {
    templateURL: string;
    data?: { [k: string]: any };
  };
};
