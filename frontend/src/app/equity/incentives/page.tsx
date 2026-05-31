'use client';

import { useState } from 'react';
import { Plus, Award, Search, Calendar, Trash, Edit } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IncentiveForm } from '@/components/equity/IncentiveForm';
import type { IncentivePlan, Company } from '@/types/equity';
import { Badge } from '@/components/ui/badge';

const mockCompanies: Company[] = [
  { id: 1, name: '科技有限公司', createdAt: '', updatedAt: '' },
  { id: 2, name: '创新投资合伙企业', createdAt: '', updatedAt: '' },
];

const mockIncentives: IncentivePlan[] = [
  {
    id: 1,
    companyId: 1,
    planName: '2024年第一期股权激励计划',
    planType: 'stock_option',
    totalShares: 1000000,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    description: '面向核心员工的股票期权激励计划',
    status: 'active',
    grantedShares: 300000,
    vestedShares: 100000,
    exercisedShares: 50000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    companyId: 1,
    planName: '2023年限制性股票计划',
    planType: 'restricted_stock',
    totalShares: 500000,
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    description: '面向管理团队的限制性股票计划',
    status: 'active',
    grantedShares: 500000,
    vestedShares: 200000,
    exercisedShares: 150000,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    companyId: 2,
    planName: '员工持股计划',
    planType: 'esop',
    totalShares: 800000,
    startDate: '2024-03-01',
    endDate: '2027-03-01',
    description: '面向全体员工的持股计划',
    status: 'pending',
    grantedShares: 0,
    vestedShares: 0,
    exercisedShares: 0,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
];

function getPlanTypeLabel(type: string) {
  const typeMap: Record<string, string> = {
    stock_option: '股票期权',
    restricted_stock: '限制性股票',
    rsu: 'RSU',
    esop: '员工持股',
    performance_share: '业绩股票',
  };
  return typeMap[type] || type;
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: '草稿', variant: 'outline' },
    pending: { label: '待审批', variant: 'secondary' },
    approved: { label: '已批准', variant: 'default' },
    active: { label: '进行中', variant: 'default' },
    completed: { label: '已完成', variant: 'secondary' },
    cancelled: { label: '已取消', variant: 'destructive' },
  };
  return statusMap[status] || { label: status, variant: 'outline' };
}

export default function IncentivesPage() {
  const [companies] = useState<Company[]>(mockCompanies);
  const [incentives, setIncentives] = useState<IncentivePlan[]>(mockIncentives);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<IncentivePlan | null>(null);

  // 过滤激励计划
  const filteredIncentives = incentives.filter((plan) => {
    const matchesKeyword =
      plan.planName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (plan.description?.toLowerCase().includes(searchKeyword.toLowerCase()) || false);
    const matchesCompany = filterCompany === 'all' || String(plan.companyId) === filterCompany;
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesKeyword && matchesCompany && matchesStatus;
  });

  // 获取公司名称
  const getCompanyName = (companyId: number) => {
    return companies.find((c) => c.id === companyId)?.name || '未知公司';
  };

  // 处理删除
  const handleDelete = (plan: IncentivePlan) => {
    if (window.confirm('确定要删除该股权激励计划吗？此操作不可恢复。')) {
      setIncentives(incentives.filter((p) => p.id !== plan.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">股权激励</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新增激励计划
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? '编辑激励计划' : '新增激励计划'}
              </DialogTitle>
            </DialogHeader>
            <IncentiveForm
              companies={companies}
              initialData={editingPlan || undefined}
              onSubmit={(data) => {
                if (editingPlan) {
                  setIncentives(incentives.map((p) =>
                    p.id === editingPlan.id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
                  ));
                } else {
                  setIncentives([
                    ...incentives,
                    {
                      ...data,
                      id: Math.max(...incentives.map((p) => p.id)) + 1,
                      status: 'draft',
                      grantedShares: 0,
                      vestedShares: 0,
                      exercisedShares: 0,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ]);
                }
                setIsDialogOpen(false);
                setEditingPlan(null);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingPlan(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和过滤栏 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="搜索激励计划名称或描述..."
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
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="pending">待审批</SelectItem>
              <SelectItem value="active">进行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 激励计划列表 */}
      {filteredIncentives.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Award className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchKeyword || filterCompany !== 'all' || filterStatus !== 'all'
                ? '未找到匹配的激励计划'
                : '暂无激励计划'}
            </h3>
            <p className="text-slate-500">
              {searchKeyword || filterCompany !== 'all' || filterStatus !== 'all'
                ? '请尝试其他搜索条件'
                : '点击上方按钮添加第一条激励计划'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredIncentives.map((plan) => {
            const statusInfo = getStatusBadge(plan.status);
            return (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.planName}</CardTitle>
                        <p className="text-xs text-slate-500">{getCompanyName(plan.companyId)}</p>
                      </div>
                    </div>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-600">
                    {getPlanTypeLabel(plan.planType)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">授予总量</p>
                      <p className="font-medium text-slate-900">
                        {plan.totalShares.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">已授予</p>
                      <p className="font-medium text-slate-900">
                        {(plan.grantedShares || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">已归属</p>
                      <p className="font-medium text-slate-900">
                        {(plan.vestedShares || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">已行权</p>
                      <p className="font-medium text-slate-900">
                        {(plan.exercisedShares || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {plan.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 pt-2 border-t">
                      {plan.description}
                    </p>
                  )}
                  <div className="pt-2 border-t flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleDelete(plan)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
