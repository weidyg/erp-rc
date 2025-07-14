---
order: 0
atomId: printService
title: Print 打印
group:
  title: 工具
apiHeader:
  pkg: '@erp-rc/print'
---

## 代码演示

### 基本使用

<code src="./_demos/basic.tsx" ></code>
<code src="./_demos/connect.tsx" ></code>

## API

### 打印参数

| 参数       | 说明           | 类型                                           | 默认值 | 版本 |
| ---------- | -------------- | ---------------------------------------------- | ------ | ---- |
| type       | 打印客户端类型 | PrintClientType                                |        |      |
| documents  | 打印文档列表   | array                                          |        |
| printer    | 打印机         | string                                         |        |      |
| requestID  | 请求 ID        | string                                         |        |      |
| onPrint    | 开始打印触发   | (data: PrintStatus, rawData: any) => void      |        |      |
| onRendered | 渲染结束触发   | (data: PrintDocStatus[], rawData: any)         |        |      |
| onPrinted  | 打印结束触发   | (data: PrintDocStatus[], rawData: any) => void |        |      |
| onError    | 打印错误触发   | (data: PrintError, rawData: any) => void       |        |      |

### 浏览器直接引入

```html | pure
<script src="https://unpkg.com/@erp-rc/print@latest/dist/print.min.js"></script>
<script type="text/javascript">
  const { prinClientInfos, printService } = erpRcPrint;

  function getPrinters() {
    printService.getPrinters({
      type: 'cainiao',
      onSuccess: function ({ defaultPrinter, printers }, rawData) {
        console.log('getPrinters onSuccess', printers, rawData);
      },
      onError: function (data, rawData) {
        console.log('getPrinters onError', data, rawData);
      },
    });
  }

  function doPrint() {
    printService.doPrint({
      type: 'cainiao',
      documents: [], // 打印文档
      printer: 'Microsoft Print to PDF', // 打印机名称
      onPrint: function (data, rawData) {
        console.log('onPrint', data, rawData);
      },
      onRendered: function (data, rawData) {
        console.log('onRendered', data, rawData);
      },
      onPrinted: function (data, rawData) {
        console.log('onPrinted', data, rawData);
      },
      onError: function (data, rawData) {
        console.log('onError', data, rawData);
      },
    });
  }
</script>
```
