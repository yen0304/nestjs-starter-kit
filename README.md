# NestJS Starter Kit

這是一個基於 NestJS 的 starter kit，包含了基本的配置、資料庫設定和工具類別。

## 功能特色

- 🚀 NestJS 框架
- 🗄️ Prisma ORM 支援 PostgreSQL
- 📝 TypeScript 完整支援
- 🔧 配置管理系統
- 📊 Swagger API 文檔
- 🧪 Jest 測試框架
- 📏 ESLint + Prettier 代碼規範
- 🔄 分頁工具類別
- 📅 日期工具類別

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境變數設定

複製 `env.example` 並重新命名為 `.env`，然後修改其中的配置：

```bash
cp env.example .env
```

編輯 `.env` 檔案：

```env
# Database
dbConnectionString="postgresql://username:password@localhost:5432/database_name?schema=public"

# Application
NODE_ENV=development
APP_PORT=3000
```

### 3. 資料庫設定

```bash
# 生成 Prisma 客戶端
npm run prisma:generate

# 執行資料庫遷移
npm run prisma:migrate

# 開啟 Prisma Studio (可選)
npm run prisma:studio
```

### 4. 啟動應用程式

```bash
# 開發模式
npm run start:dev

# 生產模式
npm run build
npm run start:prod
```

## 可用腳本

- `npm run start` - 啟動應用程式
- `npm run start:dev` - 開發模式啟動
- `npm run start:debug` - 除錯模式啟動
- `npm run build` - 建置應用程式
- `npm run test` - 執行測試
- `npm run test:watch` - 監聽模式測試
- `npm run test:cov` - 測試覆蓋率
- `npm run lint` - 代碼檢查
- `npm run type-check` - TypeScript 類型檢查
- `npm run prisma:generate` - 生成 Prisma 客戶端
- `npm run prisma:migrate` - 執行資料庫遷移
- `npm run prisma:deploy` - 部署資料庫遷移
- `npm run prisma:studio` - 開啟 Prisma Studio

## 專案結構

```
src/
├── core/                    # 核心模組
│   ├── config/             # 配置管理
│   └── database/           # 資料庫相關
├── modules/                # 業務模組
├── utils/                  # 工具類別
├── types/                  # 類型定義
├── constants/              # 常數定義
├── enum/                   # 列舉定義
├── app.module.ts           # 主模組
├── app.controller.ts       # 主控制器
├── app.service.ts          # 主服務
└── main.ts                 # 應用程式入口
```

## API 文檔

啟動應用程式後，可以訪問 Swagger API 文檔：

- 開發環境: http://localhost:3000/api-docs

## 資料庫

本專案使用 Prisma 作為 ORM，支援 PostgreSQL 資料庫。

### 新增模型

1. 在 `prisma/schema/schema.prisma` 中定義模型
2. 執行 `npm run prisma:migrate` 建立遷移
3. 執行 `npm run prisma:generate` 生成客戶端

## 開發指南

### 新增模組

```bash
# 使用 NestJS CLI 生成模組
nest generate module modules/your-module
nest generate controller modules/your-module
nest generate service modules/your-module
```

### 配置管理

所有配置都在 `src/core/config/` 目錄下管理，使用 class-validator 進行驗證。

### 工具類別

- `date-util.ts` - 日期相關工具函數
- `pagination.ts` - 分頁相關工具函數
- `validate-config.ts` - 配置驗證工具

## 授權

MIT License
