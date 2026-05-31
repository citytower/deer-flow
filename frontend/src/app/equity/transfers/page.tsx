'use client';

import { useState } from 'react';
import { Plus, TrendingUp, Search, Calendar, Edit, Trash2 } from 'lucide-react';
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
import { TransferForm } from '@/components/equity/TransferForm';
import type { EquityTransfer, Company, Shareholder } from '@/types/equity';
import { Badge } from '@/components/ui/badge';

const mockCompanies: Company[] = [
  { id: 1, name: '科技有限公司', createdAt: '', updatedAt: '' },
  { id: 2, name: '创新投资合伙企业', createdAt: '', updatedAt: '' },
];

const mockShareholders: Shareholder[] = [
  { id: 1, companyId: 1, name: '张三', type: 'natural', createdAt: '', updatedAt: '' },
  { id: 2, companyId: 1, name: '李四', type: 'natural', createdAt: '', updatedAt: '' },
  { id: 3, companyId: 1, name: '创新投资有限公司', type: 'legal', createdAt: '', updatedAt: '' },
  { id: 4, companyId: 2, name: '王五', type: 'natural', createdAt: '', updatedAt: '' },
];

const mockTransfers: EquityTransfer[] = [
  {
    id: 1,
    companyId: 1,
    type: 'transfer',
    status: 'pending',
    transferorId: 1,
    transfereeId: 2,
    sharesCount: 50000,
    transferPrice: 250000,
    transferDate: '2024-05-15',
    transferReason: '调整股权结构',
    createdAt: '2024-05-10T00:00:00Z',
    updatedAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 2,
    companyId: 1,
    type: 'transfer',
    status: 'completed',
    transferorId: 2,
    transfereeId: 3,
    sharesCount: 30000,
    transferPrice: 180000,
    transferDate: '2024-03-20',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
];

function getTransferStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: '待处理', variant: 'outline' },
    approved: { label: '已批准', variant: 'secondary' },
    completed: { label: '已完成', variant: 'default' },
    cancelled: { label: '已取消', variant: 'destructive' },
  };
  return statusMap[status] || { label: status, variant: 'outline' };
}

function getTransferTypeLabel(type: string) {
  const typeMap: Record<string, string> = {
    transfer: '股权转让',
    capital_increase: '增资扩股',
    other: '其他',
  };
  return typeMap[type] || type;
}

export default function TransfersPage() {
  const [companies] = useState<Company[]>(mockCompanies);
  const [shareholders] = useState<Shareholder[]>(mockShareholders);
  const [transfers, setTransfers] = useState<EquityTransfer[]>(mockTransfers);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<EquityTransfer | null>(null);

  // 过滤转让记录
  const filteredTransfers = transfers.filter((transfer) => {
    const transferorName = shareholders.find((s) => s.id === transfer.transferorId)?.name || '';
    const transfereeName = shareholders.find((s) => s.id === transfer.transfereeId)?.name || '';
    const matchesKeyword =
      transferorName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      transfereeName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCompany = filterCompany === 'all' || String(transfer.companyId) === filterCompany;
    const matchesStatus = filterStatus === 'all' || transfer.status === filterStatus;
    return matchesKeyword && matchesCompany && matchesStatus;
  });

  // 获取公司名称
  const getCompanyName = (companyId: number) => {
    return companies.find((c) => c.id === companyId)?.name || '未知公司';
  };

  // 获取股东名称
  const getShareholderName = (shareholderId?: number) => {
    if (!shareholderId) return '未知';
    return shareholders.find((s) => s.id === shareholderId)?.name || '未知';
  };

  // 处理删除
  const handleDelete = (transfer: EquityTransfer) => {
    if (window.confirm('确定要删除该股权转让记录吗？此操作不可恢复。')) {
      setTransfers(transfers.filter((t) => t.id !== transfer.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">股权转让</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新增转让
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTransfer ? '编辑转让' : '新增转让'}
              </DialogTitle>
            </DialogHeader>
            <TransferForm
              companies={companies}
              shareholders={shareholders}
              initialData={editingTransfer || undefined}
              onSubmit={(data) => {
                if (editingTransfer) {
                  setTransfers(transfers.map((t) =>
                    t.id === editingTransfer.id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
                  ));
                } else {
                  setTransfers([
                    ...transfers,
                    {
                      ...data,
                      id: Math.max(...transfers.map((t) => t.id)) + 1,
                      status: 'pending',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ]);
                }
                setIsDialogOpen(false);
                setEditingTransfer(null);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingTransfer(null);
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
            placeholder="搜索转让方或受让方..."
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
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="approved">已批准</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 转让记录列表 */}
      {filteredTransfers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <TrendingUp className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchKeyword || filterCompany !== 'all' || filterStatus !== 'all'
                ? '未找到匹配的转让记录'
                : '暂无股权转让记录'}
            </h3>
            <p className="text-slate-500">
              {searchKeyword || filterCompany !== 'all' || filterStatus !== 'all'
                ? '请尝试其他搜索条件'
                : '点击上方按钮添加第一笔转让记录'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTransfers.map((transfer) => {
            const statusInfo = getTransferStatusBadge(transfer.status);
            return (
              <Card key={transfer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {getShareholderName(transfer.transferorId)} → {getShareholderName(transfer.transfereeId)}
                      </CardTitle>
                      <p className="text-xs text-slate-500">
                        {getCompanyName(transfer.companyId)} · {getTransferTypeLabel(transfer.type || 'transfer')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingTransfer(transfer);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(transfer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm text-slate-500">转让股数</p>
                      <p className="font-medium text-slate-900">{transfer.sharesCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">转让价格</p>
                      <p className="font-medium text-slate-900">¥{transfer.transferPrice?.toLocaleString() || 0}</p>
                    </div>
                    {transfer.transferDate && (
                      <div>
                        <p className="text-sm text-slate-500">转让日期</p>
                        <p className="font-medium text-slate-900">{transfer.transferDate}</p>
                      </div>
                    )}
                    {transfer.transferPrice && transfer.sharesCount && (
                      <div>
                        <p className="text-sm text-slate-500">每股价格</p>
                        <p className="font-medium text-slate-900">
                          ¥{(transfer.transferPrice / transfer.sharesCount).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  {transfer.transferReason && (
                    <p className="text-xs text-slate-500 mt-2 pt-2 border-t">{transfer.transferReason}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
