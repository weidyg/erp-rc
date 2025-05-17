---
title: 快速开始
order: 1

nav:
  title: 文档
  path: /docs
---

## 安装

Using npm:

```bash
npm install --save @erp-rc/components
```

or using yarn:

```bash
yarn add @erp-rc/components
```

or using pnpm:

```bash
 pnpm add @erp-rc/components
```

## 在项目中使用

每一个包都是一个独立的组件包，使用示例如下 ：

<!-- | pure -->

```jsx | pure
import { prinClientInfos, PrintService } from "@erp-rc/print";

export default () => {
  const printService = new PrintService();
  
  return <></>;
};
```