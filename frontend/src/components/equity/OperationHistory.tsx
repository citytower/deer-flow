'use client';

import { History, Plus, Minus, Edit, TrendingUp, Award, Building2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OperationLog } from '@/types/equity';

interface OperationHistoryProps {
  logs: OperationLog[];
  title?: string;
}

function getOperationIcon(type: OperationLog['operationType']) {
  switch (type) {
    case 'create':
      return Plus;
    case 'delete':
      return Minus;
    case 'update':
      return Edit;
    case 'transfer':
      return TrendingUp;
    case 'grant':
      return Award;
    default:
      return History;
  }
}

function getOperationColor(type: OperationLog['operationType']) {
  switch (type) {
    case 'create':
      return 'bg-green-100 text-green-600';
    case 'delete':
      return 'bg-red-100 text-red-600';
    case 'update':
      return 'bg-blue-100 text-blue-600';
    case 'transfer':
      return 'bg-purple-100 text-purple-600';
    case 'grant':
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function getOperationLabel(type: OperationLog['operationType']) {
  switch (type) {
    case 'create':
      return '创建';
    case 'delete':
      return '删除';
    case 'update':
      return '更新';
    case 'transfer':
      return '转让';
    case 'grant':
      return '授予';
    default:
      return type;
  }
}

function getEntityLabel(entityType: OperationLog['entityType']) {
  switch (entityType) {
    case 'company':
      return '公司';
    case 'shareholder':
      return '股东';
    case 'equity_record':
      return '股权记录';
    case 'transfer':
      return '股权转让';
    case 'incentive':
      return '股权激励';
    default:
      return entityType;
  }
}

export function OperationHistory({ logs, title = '操作历史' }: OperationHistoryProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <History className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">暂无操作记录</h3>
          <p className="text-slate-500">操作记录将显示在这里</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* 时间线 */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-6">
            {logs.map((log) => {
              const Icon = getOperationIcon(log.operationType);
              const colorClass = getOperationColor(log.operationType);

              return (
                <div key={log.id} className="relative pl-10">
                  {/* 图标 */}
                  <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-slate-900">
                        {log.description}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getEntityLabel(log.entityType)}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          log.operationType === 'create' ? 'bg-green-100 text-green-700' :
                          log.operationType === 'delete' ? 'bg-red-100 text-red-700' :
                          log.operationType === 'update' ? 'bg-blue-100 text-blue-700' :
                          log.operationType === 'transfer' ? 'bg-purple-100 text-purple-700' :
                          log.operationType === 'grant' ? 'bg-amber-100 text-amber-700' :
                          ''
                        }`}
                      >
                        {getOperationLabel(log.operationType)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {log.operator && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {log.operator}
                        </span>
                      )}
                      <span>{log.operatedAt}</span>
                    </div>

                    {/* 变更详情 */}
                    {log.changes && Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-md text-xs">
                        <div className="font-medium text-slate-700 mb-2">变更内容：</div>
                        <div className="space-y-1">
                          {Object.entries(log.changes).map(([key, { old: oldValue, new: newValue }]) => (
                            <div key={key} className="flex items-start gap-2">
                              <span className="text-slate-600">{key}:</span>
                              <span className="line-through text-red-500">
                                {String(oldValue) || '(空)'}
                              </span>
                              <span className="text-slate-400">-&gt;</span>
                              <span className="text-green-600">
                                {String(newValue) || '(空)'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 简化版本的时间线组件
export function Timeline({ logs }: { logs: OperationLog[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
      <div className="space-y-4">
        {logs.map((log) => {
          const Icon = getOperationIcon(log.operationType);
          const colorClass = getOperationColor(log.operationType);

          return (
            <div key={log.id} className="relative pl-10">
              <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-900">{log.description}</span>
                <span className="text-xs text-slate-500">{log.operatedAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}