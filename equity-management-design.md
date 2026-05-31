# 股权管理网站设计方案

## 一、项目概述

### 1.1 项目目标
构建一个完整的股权管理系统，支持公司股权结构管理、股东信息维护、股权转让、股权激励等核心功能。

### 1.2 技术栈
- **前端**: Next.js 16 + React 19 + TypeScript + Tailwind CSS + Shadcn UI
- **后端**: Python FastAPI + SQLAlchemy
- **数据库**: SQLite/PostgreSQL
- **图表**: Recharts / ECharts

---

## 二、数据库架构设计

### 2.1 核心数据表

#### 2.1.1 公司表 (companies)
```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    unified_social_credit_code VARCHAR(18),
    registered_capital DECIMAL(20, 2),
    established_date DATE,
    industry VARCHAR(100),
    address TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2.1.2 股东表 (shareholders)
```sql
CREATE TABLE shareholders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    id_card VARCHAR(18),
    contact_phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

#### 2.1.3 股权记录表 (equity_records)
```sql
CREATE TABLE equity_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    shareholder_id INTEGER NOT NULL,
    share_type VARCHAR(50) NOT NULL,
    shares_count DECIMAL(20, 6) NOT NULL,
    share_ratio DECIMAL(10, 6) NOT NULL,
    registered_capital_contribution DECIMAL(20, 2),
    contribution_date DATE,
    vesting_start_date DATE,
    vesting_end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (shareholder_id) REFERENCES shareholders(id)
);
```

#### 2.1.4 股权转让表 (equity_transfers)
```sql
CREATE TABLE equity_transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    transferor_id INTEGER NOT NULL,
    transferee_id INTEGER NOT NULL,
    shares_count DECIMAL(20, 6) NOT NULL,
    transfer_price DECIMAL(20, 2),
    transfer_date DATE NOT NULL,
    transfer_reason TEXT,
    status VARCHAR(20) DEFAULT 'completed',
    agreement_file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (transferor_id) REFERENCES shareholders(id),
    FOREIGN KEY (transferee_id) REFERENCES shareholders(id)
);
```

#### 2.1.5 股权激励计划表 (equity_incentive_plans)
```sql
CREATE TABLE equity_incentive_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    total_shares DECIMAL(20, 6) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

#### 2.1.6 股权变更历史表 (equity_change_history)
```sql
CREATE TABLE equity_change_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    change_date DATE NOT NULL,
    description TEXT,
    related_record_id INTEGER,
    related_record_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

---

## 三、前端页面结构设计

### 3.1 页面路由结构
```
app/
├── equity/
│   ├── layout.tsx
│   ├── page.tsx                    # 仪表盘首页
│   ├── companies/
│   │   ├── page.tsx                # 公司列表
│   │   ├── [id]/
│   │   │   ├── page.tsx            # 公司详情
│   │   │   └── edit/
│   │   │       └── page.tsx        # 编辑公司
│   │   └── new/
│   │       └── page.tsx            # 新建公司
│   ├── shareholders/
│   │   ├── page.tsx                # 股东列表
│   │   ├── [id]/
│   │   │   └── page.tsx            # 股东详情
│   │   └── new/
│   │       └── page.tsx            # 新增股东
│   ├── equity-records/
│   │   ├── page.tsx                # 股权记录
│   │   └── new/
│   │       └── page.tsx            # 新增股权
│   ├── transfers/
│   │   ├── page.tsx                # 转让记录
│   │   └── new/
│   │       └── page.tsx            # 新增转让
│   ├── incentives/
│   │   ├── page.tsx                # 激励计划
│   │   ├── [id]/
│   │   │   └── page.tsx            # 激励详情
│   │   └── new/
│   │       └── page.tsx            # 新增激励
│   └── history/
│       └── page.tsx                # 变更历史
```

### 3.2 核心组件设计

#### 3.2.1 仪表盘组件
- `EquityDashboard.tsx` - 主仪表盘
- `EquityOverviewCard.tsx` - 股权概览卡片
- `EquityStructureChart.tsx` - 股权结构图表
- `RecentActivities.tsx` - 最近活动

#### 3.2.2 公司管理组件
- `CompanyList.tsx` - 公司列表
- `CompanyForm.tsx` - 公司表单
- `CompanyDetail.tsx` - 公司详情

#### 3.2.3 股东管理组件
- `ShareholderList.tsx` - 股东列表
- `ShareholderForm.tsx` - 股东表单
- `ShareholderDetail.tsx` - 股东详情

#### 3.2.4 股权记录组件
- `EquityRecordList.tsx` - 股权记录列表
- `EquityRecordForm.tsx` - 股权记录表单
- `EquityTable.tsx` - 股权表格

#### 3.2.5 股权转让组件
- `TransferList.tsx` - 转让列表
- `TransferForm.tsx` - 转让表单

#### 3.2.6 股权激励组件
- `IncentivePlanList.tsx` - 激励计划列表
- `IncentivePlanForm.tsx` - 激励计划表单

---

## 四、后端 API 接口设计

### 4.1 API 路由结构
```
api/
├── companies/
│   ├── GET /api/companies              # 获取公司列表
│   ├── POST /api/companies             # 创建公司
│   ├── GET /api/companies/:id          # 获取公司详情
│   ├── PUT /api/companies/:id          # 更新公司
│   └── DELETE /api/companies/:id       # 删除公司
│
├── shareholders/
│   ├── GET /api/shareholders           # 获取股东列表
│   ├── POST /api/shareholders          # 创建股东
│   ├── GET /api/shareholders/:id       # 获取股东详情
│   ├── PUT /api/shareholders/:id       # 更新股东
│   └── DELETE /api/shareholders/:id    # 删除股东
│
├── equity-records/
│   ├── GET /api/equity-records         # 获取股权记录
│   ├── POST /api/equity-records        # 创建股权记录
│   ├── PUT /api/equity-records/:id     # 更新股权记录
│   └── DELETE /api/equity-records/:id  # 删除股权记录
│
├── transfers/
│   ├── GET /api/transfers              # 获取转让记录
│   ├── POST /api/transfers             # 创建转让
│   └── GET /api/transfers/:id          # 获取转让详情
│
├── incentives/
│   ├── GET /api/incentives             # 获取激励计划
│   ├── POST /api/incentives            # 创建激励计划
│   ├── PUT /api/incentives/:id         # 更新激励计划
│   └── DELETE /api/incentives/:id      # 删除激励计划
│
└── dashboard/
    └── GET /api/dashboard/overview     # 获取仪表盘数据
```

### 4.2 API 数据模型

#### 4.2.1 Company 模型
```typescript
interface Company {
  id: number;
  name: string;
  unifiedSocialCreditCode?: string;
  registeredCapital?: number;
  establishedDate?: string;
  industry?: string;
  address?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 4.2.2 Shareholder 模型
```typescript
interface Shareholder {
  id: number;
  companyId: number;
  name: string;
  type: 'natural' | 'legal';
  idCard?: string;
  contactPhone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 4.2.3 EquityRecord 模型
```typescript
interface EquityRecord {
  id: number;
  companyId: number;
  shareholderId: number;
  shareType: string;
  sharesCount: number;
  shareRatio: number;
  registeredCapitalContribution?: number;
  contributionDate?: string;
  vestingStartDate?: string;
  vestingEndDate?: string;
  status: 'active' | 'frozen' | 'transferred';
  createdAt: string;
  updatedAt: string;
}
```

---

## 五、核心功能模块

### 5.1 公司管理模块
- 公司信息增删改查
- 公司基本信息维护
- 多公司支持

### 5.2 股东管理模块
- 股东信息管理
- 自然人/法人股东区分
- 联系方式维护

### 5.3 股权记录模块
- 股权登记
- 股权比例计算
- 股权状态管理

### 5.4 股权转让模块
- 转让记录管理
- 转让流程处理
- 转让协议管理

### 5.5 股权激励模块
- 激励计划管理
- 期权/限制性股票管理
- 行权管理

### 5.6 股权结构可视化
- 饼图展示股权分布
- 柱状图展示历史变化
- 股权结构图

### 5.7 变更历史追踪
- 完整的变更记录
- 变更时间线
- 操作日志

---

## 六、实现计划

### 阶段一：基础架构
1. 创建数据库模型
2. 搭建后端 API 基础框架
3. 搭建前端页面基础架构

### 阶段二：核心功能
1. 公司管理功能
2. 股东管理功能
3. 股权记录功能

### 阶段三：高级功能
1. 股权转让功能
2. 股权激励功能
3. 数据可视化

### 阶段四：优化完善
1. 权限管理
2. 数据导出
3. 性能优化
