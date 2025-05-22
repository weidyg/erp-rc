# ERP-RC 项目

## 项目简介

ERP-RC 是一个基于 React 和 Ant Design 构建的企业资源管理系统的前端项目。项目使用 Dumi 作为文档工具，支持组件开发和文档生成。

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm start
```

或

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 格式化代码

```bash
npm run prettier
```

### 发布项目

```bash
npm run release
```

发布最新版本：

```bash
npm run release:latest
```

### 部署文档站点

```bash
npm run deploy
```

## 脚本说明

- `bootstrap`: 运行 `./scripts/bootstrap.js` 初始化项目。
- `build`: 生成版本号并构建所有组件。
- `build-components`: 使用 `pnpm` 构建 `@erp-rc/**` 下的所有组件。
- `dev`: 生成版本号并启动 Dumi 开发服务器。
- `prettier`: 格式化项目中的代码文件。
- `release`: 运行 `./scripts/release.js` 发布项目。
- `release:latest`: 发布项目并标记为最新版本。
- `publish:only`: 仅发布项目，不执行其他操作。
- `start`: 启动开发环境。
- `version`: 生成版本号。
- `dumi`: 运行 `./scripts/preDeploy` 并构建 Dumi 文档。
- `site`: 构建项目并生成 Dumi 文档。
- `deploy`: 构建项目并部署文档站点到 GitHub Pages。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目。
