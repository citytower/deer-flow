'use client';

import { useState } from 'react';
import { Plus, TrendingUp, Search, Calendar, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { EquityRecord, Company, Shareholder } from '@/types/equity';

const mockCompanies: Company[] = [
  { id: 1, name: '科技有限公司', createdAt: '', updatedAt: '' },
  { id: 2, name: '创新投资合伙企业', createdAt: '', updatedAt: '' },
];

const mockShareholders: Shareholder[] = [
  { id: 1, companyId: 1, name: '张三', type: 'natural', createdAt: '', updatedAt: '' },
  { id: 2, companyId: 1, name: '李四', type: 'natural', createdAt: '', updatedAt: '' },
  { id: 3, companyId: 1, name: '创新投资有限公司', type: 'legal', createdAt: '', updatedAt: '' },
];

const mockEquityRecords: EquityRecord[] = [
  {
    id: 1,
    companyId: 1,
    shareholderId: 1,
    shareholderName: '张三',
    shareType: '普通股',
    sharesCount: 350000,
    shareRatio: 35,
    registeredCapitalContribution: 3500000,
    contributionDate: '2020-01-01',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    companyId: 1,
    shareholderId: 2,
    shareholderName: '李四',
    shareType: '普通股',
    sharesCount: 250000,
    shareRatio: 25,
    registeredCapitalContribution: 2500000,
    contributionDate: '2020-01-01',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    companyId: 1,
    shareholderId: 3,
    shareholderName: '创新投资有限公司',
    shareType: '普通股',
    sharesCount: 200000,
    shareRatio: 20,
    registeredCapitalContribution: 2000000,
    contributionDate: '2020-06-01',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    companyId: 1,
    shareholderId: 1,
    shareholderName: '张三',
    shareType: '期权',
    sharesCount: 100000,
    shareRatio: 10,
    vestingStartDate: '2024-01-01',
    vestingEndDate: '2026-12-31',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    companyId: 1,
    shareholderId: 2,
    shareholderName: '李四',
    shareType: '限制性股票',
    sharesCount: 100000,
    shareRatio: 10,
    vestingStartDate: '2023-01-01',
    vestingEndDate: '2025-12-31',
    status: 'frozen',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    active: { label: '正常', variant: 'default' },
    frozen: { label: '冻结', variant: 'secondary' },
    transferred: { label: '已转让', variant: 'outline' },
  };
  return statusMap[status] || { label: status, variant: 'outline' };
}

export default function EquityRecordsPage() {
  const [companies] = useState<Company[]>(mockCompanies);
  const [shareholders] = useState<Shareholder[]>(mockShareholders);
  const [records, setRecords] = useState<EquityRecord[]>(mockEquityRecords);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EquityRecord | null>(null);

  // 过滤记录
  const filteredRecords = records.filter((record) => {
    const matchesKeyword =
      record.shareholderName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      record.shareType.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCompany = filterCompany === 'all' || String(record.companyId) === filterCompany;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesKeyword && matchesCompany && matchesStatus;
  });

  // 获取公司名称
  const getCompanyName = (companyId: number) => {
    return companies.find((c) => c.id === companyId)?.name || '未知公司';
  };

  // 获取公司股东列表
  const getCompanyShareholders = (companyId: number) => {
    return shareholders.filter((s) => s.companyId === companyId);
  };

  // 处理删除
  const handleDelete = (record: EquityRecord) => {
    if (window.confirm('确定要删除该股权记录吗？此操作不可恢复。')) {
      setRecords(records.filter((r) => r.id !== record.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">股权记录</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新增股权
        </Button>
      </div>

      {/* 搜索和过滤栏 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="搜索股东名称或股份类型..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="所属公司" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部公司</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={String(company.id)}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">正常</SelectItem>
              <SelectItem value="frozen">冻结</SelectItem>
              <SelectItem value="transferred">已转让</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 股权明细表格 */}
      {filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <TrendingUp className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchKeyword || filterCompany !== 'all' || filterStatus !== 'all'
                ? '未找到匹配的股权记录'
                : '暂无股权记录'}
            </h3>
            <p className="text-slate-500">
              {searchKeyword || filterCompany !== 'all' || filterStatus !== 'all'
                ? '请尝试其他搜索条件'
                : '点击上方按钮添加第一条股权记录'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>股权明细</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">股东名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">所属公司</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">股份类型</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">持股数量</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">持股比例</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">出资额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">状态</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => {
                    const statusInfo = getStatusBadge(record.status);
                    return (
                      <tr
                        key={record.id}
                        className="border-b hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {record.shareholderName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {getCompanyName(record.companyId)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {record.shareType}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {record.sharesCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {record.shareRatio}%
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          ¥{record.registeredCapitalContribution?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(record)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 股权结构统计 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {records.reduce((sum, r) => sum + r.sharesCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">总股本</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {records.filter((r) => r.status === 'active').length}
            </div>
            <div className="text-sm text-slate-500">活跃记录</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {records.filter((r) => r.status === 'frozen').length}
            </div>
            <div className="text-sm text-slate-500">冻结记录</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {new Set(records.map((r) => r.shareholderId)).size}
            </div>
            <div className="text-sm text-slate-500">股东人数</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
