"use strict";(self.webpackChunkerp_rc=self.webpackChunkerp_rc||[]).push([[391],{39137:function(s,a,e){e.r(a);var d=e(42344),l=e(77576),m=e(31374),r=e(29132),i=e(25903),p=e(61163),t=e(19775),o=e(23857),c=e(75271),_=e(38448),n=e(52676);function u(){return(0,n.jsx)(t.dY,{children:(0,n.jsx)(c.Suspense,{fallback:(0,n.jsx)(o.Z,{}),children:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"markdown",children:[(0,n.jsxs)("h2",{id:"\u4EE3\u7801\u6F14\u793A",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u4EE3\u7801\u6F14\u793A",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u4EE3\u7801\u6F14\u793A"]}),(0,n.jsxs)("h3",{id:"\u57FA\u672C\u4F7F\u7528",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u57FA\u672C\u4F7F\u7528",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u57FA\u672C\u4F7F\u7528"]})]}),(0,n.jsx)(t.Dl,{demo:{id:"printservice-demo-basic"},previewerProps:{filename:"packages/print/src/components/PrintService/_demos/basic.tsx"}}),(0,n.jsxs)("div",{className:"markdown",children:[(0,n.jsxs)("h3",{id:"\u6D4F\u89C8\u5668\u76F4\u63A5\u5F15\u5165",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u6D4F\u89C8\u5668\u76F4\u63A5\u5F15\u5165",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u6D4F\u89C8\u5668\u76F4\u63A5\u5F15\u5165"]}),(0,n.jsx)(r.Z,{lang:"html",children:_.texts[0].value}),(0,n.jsxs)("h2",{id:"api",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#api",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"API"]}),(0,n.jsx)(i.Z,{children:(0,n.jsx)("thead",{children:(0,n.jsxs)("tr",{children:[(0,n.jsx)("th",{children:_.texts[1].value}),(0,n.jsx)("th",{children:_.texts[2].value}),(0,n.jsx)("th",{children:_.texts[3].value}),(0,n.jsx)("th",{children:_.texts[4].value}),(0,n.jsx)("th",{children:_.texts[5].value})]})})})]})]})})})}a.default=u},38448:function(s,a,e){e.r(a),e.d(a,{texts:function(){return d}});const d=[{value:`<script src="/js/print.min.js"><\/script>
<script type="text/javascript">
  const { prinClientInfos, printService }= erpRcPrint;
  
  function getPrinters() {
    printService.getPrinters({
      type:"cainiao",
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
      type:"cainiao",
      documents:[], // \u6253\u5370\u6587\u6863
      printer: '', // \u6253\u5370\u673A\u540D\u79F0
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
