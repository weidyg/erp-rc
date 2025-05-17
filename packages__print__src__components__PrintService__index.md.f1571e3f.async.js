"use strict";(self.webpackChunkerp_rc=self.webpackChunkerp_rc||[]).push([[391],{82978:function(s,d,n){n.r(d);var a=n(89681),l=n(24615),m=n(11955),r=n(95789),i=n(7597),p=n(40524),t=n(29594),o=n(42180),c=n(75271),_=n(2254),e=n(52676);function u(){return(0,e.jsx)(t.dY,{children:(0,e.jsx)(c.Suspense,{fallback:(0,e.jsx)(o.Z,{}),children:(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h2",{id:"\u4EE3\u7801\u6F14\u793A",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u4EE3\u7801\u6F14\u793A",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u4EE3\u7801\u6F14\u793A"]}),(0,e.jsxs)("h3",{id:"\u57FA\u672C\u4F7F\u7528",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u57FA\u672C\u4F7F\u7528",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u57FA\u672C\u4F7F\u7528"]})]}),(0,e.jsx)(t.Dl,{demo:{id:"printservice-demo-basic"},previewerProps:{filename:"packages/print/src/components/PrintService/_demos/basic.tsx"}}),(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h3",{id:"\u6D4F\u89C8\u5668\u76F4\u63A5\u5F15\u5165",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u6D4F\u89C8\u5668\u76F4\u63A5\u5F15\u5165",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"\u6D4F\u89C8\u5668\u76F4\u63A5\u5F15\u5165"]}),(0,e.jsx)(r.Z,{lang:"html",children:_.texts[0].value}),(0,e.jsxs)("h2",{id:"api",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#api",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"API"]}),(0,e.jsx)(i.Z,{children:(0,e.jsx)("thead",{children:(0,e.jsxs)("tr",{children:[(0,e.jsx)("th",{children:_.texts[1].value}),(0,e.jsx)("th",{children:_.texts[2].value}),(0,e.jsx)("th",{children:_.texts[3].value}),(0,e.jsx)("th",{children:_.texts[4].value}),(0,e.jsx)("th",{children:_.texts[5].value})]})})})]})]})})})}d.default=u},2254:function(s,d,n){n.r(d),n.d(d,{texts:function(){return a}});const a=[{value:`<script src="/js/print.min.js"><\/script>
<script type="text/javascript">
  const { prinClientInfos, printService }= erpRcPrint;
  
  function getPrinters() {
    printService.getPrinters({
      type:...,// \u6253\u5370\u7C7B\u578B prinClientInfos \u7684 key
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
      type:...,// \u6253\u5370\u7C7B\u578B prinClientInfos \u7684 key
      documents:[...], // \u6253\u5370\u6587\u6863
      printer: '...', // \u6253\u5370\u673A\u540D\u79F0
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
<\/script>
`,paraId:0,tocIndex:2},{value:"\u53C2\u6570",paraId:1,tocIndex:3},{value:"\u8BF4\u660E",paraId:1,tocIndex:3},{value:"\u7C7B\u578B",paraId:1,tocIndex:3},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:3},{value:"\u7248\u672C",paraId:1,tocIndex:3}]}}]);
