'use client';

import { useState } from 'react';
import { Plus, Building2, Edit, Trash2, Calendar, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CompanyForm } from '@/components/equity/CompanyForm';
import type { Company } from '@/types/equity';

const mockCompanies: Company[] = [
  {
    id: 1,
    name: '科技有限公司',
    unifiedSocialCreditCode: '91110000MA001ABC12',
    registeredCapital: 10000000,
    establishedDate: '2020-01-01',
    industry: '软件和信息技术服务业',
    address: '北京市海淀区中关村大街1号',
    description: '一家专注于人工智能技术的科技公司',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '创新投资合伙企业',
    unifiedSocialCreditCode: '91110000MA002DEF34',
    registeredCapital: 5000000,
    establishedDate: '2021-06-15',
    industry: '资本市场服务',
    address: '上海市浦东新区陆家嘴金融中心',
    description: '专注于创新科技领域的投资企业',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: '智能制造股份有限公司',
    unifiedSocialCreditCode: '91110000MA003GHI56',
    registeredCapital: 20000000,
    establishedDate: '2019-03-20',
    industry: '高端装备制造',
    address: '深圳市南山区科技园',
    description: '致力于智能制造解决方案的高新技术企业',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // 过滤公司
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    company.unifiedSocialCreditCode?.includes(searchKeyword)
  );

  // 处理创建
  const handleCreate = (data: {
    name: string;
    unifiedSocialCreditCode?: string;
    registeredCapital?: number;
    establishedDate?: string;
    industry?: string;
    address?: string;
    description?: string;
  }) => {
    const newCompany: Company = {
      id: Math.max(...companies.map((c) => c.id)) + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCompanies([...companies, newCompany]);
    setIsDialogOpen(false);
  };

  // 处理更新
  const handleUpdate = (data: {
    name: string;
    unifiedSocialCreditCode?: string;
    registeredCapital?: number;
    establishedDate?: string;
    industry?: string;
    address?: string;
    description?: string;
  }) => {
    if (!editingCompany) return;

    const updatedCompanies = companies.map((c) =>
      c.id === editingCompany.id
        ? { ...c, ...data, updatedAt: new Date().toISOString() }
        : c
    );
    setCompanies(updatedCompanies);
    setEditingCompany(null);
    setIsDialogOpen(false);
  };

  // 处理删除
  const handleDelete = (company: Company) => {
    if (window.confirm(`确定要删除公司"${company.name}"吗？此操作不可恢复。`)) {
      setCompanies(companies.filter((c) => c.id !== company.id));
    }
  };

  // 打开编辑对话框
  const openEditDialog = (company: Company) => {
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  // 关闭对话框
  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">公司管理</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新增公司
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? '编辑公司' : '新增公司'}
              </DialogTitle>
            </DialogHeader>
            <CompanyForm
              initialData={editingCompany || undefined}
              onSubmit={editingCompany ? handleUpdate : handleCreate}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索栏 */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="搜索公司名称、行业或信用代码..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 公司列表 */}
      {filteredCompanies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Building2 className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchKeyword ? '未找到匹配的公司' : '暂无公司数据'}
            </h3>
            <p className="text-slate-500">
              {searchKeyword ? '请尝试其他搜索关键词' : '点击上方按钮添加第一家公司'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openEditDialog(company)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <p className="text-xs text-slate-500">{company.industry}</p>
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
                      onClick={() => openEditDialog(company)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleDelete(company)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.unifiedSocialCreditCode && (
                  <div className="text-xs text-slate-500 font-mono">
                    {company.unifiedSocialCreditCode}
                  </div>
                )}
                {company.establishedDate && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>成立日期：{company.establishedDate}</span>
                  </div>
                )}
                {company.address && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{company.address}</span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">注册资本</span>
                    <span className="font-semibold text-slate-900">
                      ¥{company.registeredCapital?.toLocaleString()}
                    </span>
                  </div>
                </div>
                {company.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 pt-2 border-t">
                    {company.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
