---
order: 0
atomId: PrintService
title: Print 打印
group:
  title: 工具
apiHeader:
  pkg: '@erp-rc/print'
---

## 代码演示

### 基本使用
<code src="./_demos/basic.tsx" ></code>


### 浏览器直接引入
```html
<script src="/js/print.min.js"></script>
<script type="text/javascript">
  const { prinClientInfos, PrintService }= erpRcPrint;
  const printService = new PrintService();
  
  function getPrinters() {
    printService.getPrinters({
      type: printType,
      onSuccess: function ({ defaultPrinter, printers }, rawData) {
        console.log("getPrinters onSuccess", printers, rawData);
        },
        onError: function (data, rawData) {
          console.log("getPrinters onError", data, rawData);
        }
     });
  }
  
  function doPrint() {
    printService.doPrint({
      type:type,
      documents:documents,
      printer: printer,
      onPrint: function (data, rawData) {
        console.log("onPrint", data, rawData);
      },
      onRendered: function (data, rawData) {
        console.log("onRendered", data, rawData);
      },
      onPrinted: function (data, rawData) {
        console.log("onPrinted", data, rawData);
      },
      onError: function (data, rawData) {
        console.log("onError", data, rawData);
        }
    });
  }
</script>
```
## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ------ | ---- |
