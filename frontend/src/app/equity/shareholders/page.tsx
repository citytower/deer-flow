'use client';

import { useState } from 'react';
import { Plus, Users, Edit, Trash2, Phone, Mail, User, Search, Filter } from 'lucide-react';
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
import { ShareholderForm } from '@/components/equity/ShareholderForm';
import type { Shareholder, Company } from '@/types/equity';

const mockCompanies: Company[] = [
  { id: 1, name: '科技有限公司', createdAt: '', updatedAt: '' },
  { id: 2, name: '创新投资合伙企业', createdAt: '', updatedAt: '' },
];

const mockShareholders: Shareholder[] = [
  {
    id: 1,
    companyId: 1,
    name: '张三',
    type: 'natural',
    idCard: '110101199001011234',
    contactPhone: '13800138000',
    email: 'zhangsan@example.com',
    address: '北京市朝阳区',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    companyId: 1,
    name: '李四',
    type: 'natural',
    idCard: '110101199002022345',
    contactPhone: '13800138001',
    email: 'lisi@example.com',
    address: '北京市海淀区',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    companyId: 1,
    name: '创新投资有限公司',
    type: 'legal',
    idCard: '91110000MA001ABC12',
    contactPhone: '010-12345678',
    email: 'invest@example.com',
    address: '上海市浦东新区',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 4,
    companyId: 2,
    name: '王五',
    type: 'natural',
    idCard: '110101199003033456',
    contactPhone: '13900139000',
    email: 'wangwu@example.com',
    address: '北京市西城区',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
];

function getShareholderTypeLabel(type: string) {
  return type === 'natural' ? '自然人' : '法人';
}

export default function ShareholdersPage() {
  const [companies] = useState<Company[]>(mockCompanies);
  const [shareholders, setShareholders] = useState<Shareholder[]>(mockShareholders);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShareholder, setEditingShareholder] = useState<Shareholder | null>(null);

  // 过滤股东
  const filteredShareholders = shareholders.filter((shareholder) => {
    const matchesKeyword =
      shareholder.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      shareholder.contactPhone?.includes(searchKeyword) ||
      shareholder.email?.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCompany = filterCompany === 'all' || String(shareholder.companyId) === filterCompany;
    const matchesType = filterType === 'all' || shareholder.type === filterType;
    return matchesKeyword && matchesCompany && matchesType;
  });

  // 获取公司名称
  const getCompanyName = (companyId: number) => {
    return companies.find((c) => c.id === companyId)?.name || '未知公司';
  };

  // 处理删除
  const handleDelete = (shareholder: Shareholder) => {
    if (window.confirm(`确定要删除股东"${shareholder.name}"吗？此操作不可恢复。`)) {
      setShareholders(shareholders.filter((s) => s.id !== shareholder.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">股东管理</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新增股东
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingShareholder ? '编辑股东' : '新增股东'}
              </DialogTitle>
            </DialogHeader>
            <ShareholderForm
              companies={companies}
              initialData={editingShareholder || undefined}
              onSubmit={(data) => {
                if (editingShareholder) {
                  setShareholders(shareholders.map((s) =>
                    s.id === editingShareholder.id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
                  ));
                } else {
                  setShareholders([
                    ...shareholders,
                    {
                      ...data,
                      id: Math.max(...shareholders.map((s) => s.id)) + 1,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    },
                  ]);
                }
                setIsDialogOpen(false);
                setEditingShareholder(null);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingShareholder(null);
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
            placeholder="搜索股东姓名、电话或邮箱..."
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
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="股东类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="natural">自然人</SelectItem>
              <SelectItem value="legal">法人</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 股东列表 */}
      {filteredShareholders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Users className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchKeyword || filterCompany !== 'all' || filterType !== 'all'
                ? '未找到匹配的股东'
                : '暂无股东数据'}
            </h3>
            <p className="text-slate-500">
              {searchKeyword || filterCompany !== 'all' || filterType !== 'all'
                ? '请尝试其他搜索条件'
                : '点击上方按钮添加第一位股东'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredShareholders.map((shareholder) => (
            <Card
              key={shareholder.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setEditingShareholder(shareholder);
                setIsDialogOpen(true);
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{shareholder.name}</CardTitle>
                      <p className="text-xs text-slate-500">
                        {getShareholderTypeLabel(shareholder.type)} · {getCompanyName(shareholder.companyId)}
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingShareholder(shareholder);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleDelete(shareholder)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {shareholder.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{shareholder.contactPhone}</span>
                  </div>
                )}
                {shareholder.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{shareholder.email}</span>
                  </div>
                )}
                {shareholder.address && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="truncate">{shareholder.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
