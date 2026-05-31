// 公司相关类型
export interface Company {
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

// 股东相关类型
export interface Shareholder {
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

// 股权记录相关类型
export interface EquityRecord {
  id: number;
  companyId: number;
  shareholderId: number;
  shareholderName?: string;
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

// 股权转让相关类型
export interface EquityTransfer {
  id: number;
  companyId: number;
  transferorId: number;
  transferorName?: string;
  transfereeId: number;
  transfereeName?: string;
  sharesCount: number;
  transferPrice?: number;
  transferDate: string;
  transferReason?: string;
  status: string;
  type?: string;
  agreementFileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 股权激励相关类型
export interface IncentivePlan {
  id: number;
  companyId: number;
  planName: string;
  planType: string;
  totalShares: number;
  startDate: string;
  endDate?: string;
  description?: string;
  status: string;
  grantedShares?: number;
  vestedShares?: number;
  exercisedShares?: number;
  createdAt: string;
  updatedAt: string;
}

// 激励授予记录
export interface IncentiveGrant {
  id: number;
  planId: number;
  shareholderId: number;
  shareholderName?: string;
  grantShares: number;
  exercisePrice?: number;
  vestingSchedule?: string;
  grantDate: string;
  vestingStartDate?: string;
  vestingEndDate?: string;
  status: 'pending' | 'vested' | 'exercised' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// 操作日志类型
export interface OperationLog {
  id: number;
  companyId?: number;
  operationType: 'create' | 'update' | 'delete' | 'transfer' | 'grant';
  entityType: 'company' | 'shareholder' | 'equity_record' | 'transfer' | 'incentive';
  entityId: number;
  entityName?: string;
  description: string;
  operator?: string;
  operatedAt: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  createdAt: string;
}

// 仪表盘概览
export interface DashboardOverview {
  totalCompanies: number;
  totalShareholders: number;
  totalEquityValue: number;
  recentActivities: Activity[];
}

// 活动类型
export interface Activity {
  id: number;
  type: 'transfer' | 'record' | 'incentive' | 'company' | 'shareholder';
  description: string;
  date: string;
}

// 股权结构项
export interface EquityStructureItem {
  name: string;
  value: number;
  color: string;
}

// 表单数据类型
export interface CompanyFormData {
  name: string;
  unifiedSocialCreditCode?: string;
  registeredCapital?: number;
  establishedDate?: string;
  industry?: string;
  address?: string;
  description?: string;
}

export interface ShareholderFormData {
  companyId: number;
  name: string;
  type: 'natural' | 'legal';
  idCard?: string;
  contactPhone?: string;
  email?: string;
  address?: string;
}

export interface EquityRecordFormData {
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
}

export interface TransferFormData {
  companyId: number;
  transferorId: number;
  transfereeId: number;
  sharesCount: number;
  transferPrice?: number;
  transferDate: string;
  transferReason?: string;
}

export interface IncentiveFormData {
  companyId: number;
  planName: string;
  planType: string;
  totalShares: number;
  startDate: string;
  endDate?: string;
  description?: string;
}

// 通用 API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  companyId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
