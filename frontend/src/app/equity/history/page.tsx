'use client';

import { useState } from 'react';
import { History, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OperationHistory } from '@/components/equity/OperationHistory';
import type { OperationLog } from '@/types/equity';

const mockOperationLogs: OperationLog[] = [
  {
    id: 1,
    companyId: 1,
    operationType: 'create',
    entityType: 'company',
    entityId: 1,
    entityName: '科技有限公司',
    description: '创建了新公司',
    operator: '张三',
    operatedAt: '2024-01-01 10:00:00',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 2,
    companyId: 1,
    operationType: 'create',
    entityType: 'shareholder',
    entityId: 1,
    entityName: '张三',
    description: '新增自然人股东',
    operator: '张三',
    operatedAt: '2024-01-02 14:30:00',
    createdAt: '2024-01-02T14:30:00Z',
  },
  {
    id: 3,
    companyId: 1,
    operationType: 'create',
    entityType: 'shareholder',
    entityId: 2,
    entityName: '李四',
    description: '新增自然人股东',
    operator: '张三',
    operatedAt: '2024-01-03 09:15:00',
    createdAt: '2024-01-03T09:15:00Z',
  },
  {
    id: 4,
    companyId: 1,
    operationType: 'create',
    entityType: 'equity_record',
    entityId: 1,
    entityName: '张三 - 35%股权',
    description: '登记股权持有情况',
    operator: '张三',
    operatedAt: '2024-01-04 11:00:00',
    createdAt: '2024-01-04T11:00:00Z',
  },
  {
    id: 5,
    companyId: 1,
    operationType: 'transfer',
    entityType: 'transfer',
    entityId: 1,
    entityName: '张三 → 李四',
    description: '张三向李四转让5%股权',
    operator: '张三',
    operatedAt: '2024-01-15 16:45:00',
    changes: {
      '转让股份': { old: '0股', new: '50000股' },
      '李四持股': { old: '0%', new: '5%' },
    },
    createdAt: '2024-01-15T16:45:00Z',
  },
  {
    id: 6,
    companyId: 1,
    operationType: 'grant',
    entityType: 'incentive',
    entityId: 1,
    entityName: '2024年第一期股权激励计划',
    description: '启动2024年第一期股权激励计划',
    operator: '管理员',
    operatedAt: '2024-01-20 10:00:00',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 7,
    companyId: 1,
    operationType: 'update',
    entityType: 'shareholder',
    entityId: 1,
    entityName: '张三',
    description: '更新股东联系信息',
    operator: '张三',
    operatedAt: '2024-02-01 14:00:00',
    changes: {
      '联系电话': { old: '13800138000', new: '13900139000' },
    },
    createdAt: '2024-02-01T14:00:00Z',
  },
  {
    id: 8,
    companyId: 1,
    operationType: 'delete',
    entityType: 'equity_record',
    entityId: 5,
    entityName: '已转让股权记录',
    description: '删除已完成的股权记录',
    operator: '管理员',
    operatedAt: '2024-02-15 09:30:00',
    createdAt: '2024-02-15T09:30:00Z',
  },
];

export default function HistoryPage() {
  const [logs] = useState<OperationLog[]>(mockOperationLogs);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');

  // 过滤日志
  const filteredLogs = logs.filter((log) => {
    const matchesKeyword =
      log.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.entityName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.operator?.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesType = filterType === 'all' || log.operationType === filterType;
    const matchesEntity = filterEntity === 'all' || log.entityType === filterEntity;
    return matchesKeyword && matchesType && matchesEntity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">变更历史</h1>
      </div>

      {/* 搜索和过滤栏 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="搜索操作描述、操作人或对象名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="操作类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="create">创建</SelectItem>
              <SelectItem value="update">更新</SelectItem>
              <SelectItem value="delete">删除</SelectItem>
              <SelectItem value="transfer">转让</SelectItem>
              <SelectItem value="grant">授予</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterEntity} onValueChange={setFilterEntity}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="操作对象" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部对象</SelectItem>
              <SelectItem value="company">公司</SelectItem>
              <SelectItem value="shareholder">股东</SelectItem>
              <SelectItem value="equity_record">股权记录</SelectItem>
              <SelectItem value="transfer">股权转让</SelectItem>
              <SelectItem value="incentive">股权激励</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {logs.filter((l) => l.operationType === 'create').length}
            </div>
            <div className="text-sm text-slate-500">创建记录</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {logs.filter((l) => l.operationType === 'update').length}
            </div>
            <div className="text-sm text-slate-500">更新记录</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {logs.filter((l) => l.operationType === 'transfer').length}
            </div>
            <div className="text-sm text-slate-500">转让记录</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">
              {logs.filter((l) => l.operationType === 'grant').length}
            </div>
            <div className="text-sm text-slate-500">激励记录</div>
          </CardContent>
        </Card>
      </div>

      {/* 操作历史列表 */}
      {filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <History className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchKeyword || filterType !== 'all' || filterEntity !== 'all'
                ? '未找到匹配的操作记录'
                : '暂无操作记录'}
            </h3>
            <p className="text-slate-500">
              {searchKeyword || filterType !== 'all' || filterEntity !== 'all'
                ? '请尝试其他搜索条件'
                : '操作记录将显示在这里'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <OperationHistory logs={filteredLogs} title="操作历史" />
      )}
    </div>
  );
}