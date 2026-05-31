'use client';

import { useState } from 'react';
import { Building2, Users, TrendingUp, Activity, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquityStructureChart } from '@/components/equity/EquityStructureChart';
import { RecentActivities } from '@/components/equity/RecentActivities';
import type { Activity as ActivityType } from '@/types/equity';

const mockDashboardData = {
  totalCompanies: 3,
  totalShareholders: 12,
  totalEquityValue: 37000000,
  activeIncentives: 2,
  pendingTransfers: 1,
  equityStructure: [
    { name: '张三', value: 35, color: '#3b82f6' },
    { name: '李四', value: 25, color: '#10b981' },
    { name: '创新投资', value: 20, color: '#f59e0b' },
    { name: '王五', value: 10, color: '#8b5cf6' },
    { name: '其他股东', value: 10, color: '#6b7280' },
  ],
  recentActivities: [
    { id: 1, type: 'transfer', description: '张三向李四转让 5% 股权', date: '2024-01-15' },
    { id: 2, type: 'record', description: '新增股东：赵六', date: '2024-01-10' },
    { id: 3, type: 'incentive', description: '2024年股权激励计划启动', date: '2024-01-05' },
    { id: 4, type: 'company', description: '新增公司：智能制造股份有限公司', date: '2024-01-03' },
    { id: 5, type: 'record', description: '李四获得限制性股票 10万股', date: '2024-01-01' },
  ] as ActivityType[],
};

export default function EquityDashboard() {
  const [dashboardData] = useState(mockDashboardData);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">股权管理仪表盘</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          <span>数据更新于 2024-01-20</span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">公司数量</CardTitle>
            <Building2 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.totalCompanies}
            </div>
            <p className="text-xs text-slate-500 mt-1">家注册公司</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">股东数量</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.totalShareholders}
            </div>
            <p className="text-xs text-slate-500 mt-1">位个人/法人股东</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">注册资本</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ¥{(dashboardData.totalEquityValue / 100000000).toFixed(1)}亿
            </div>
            <p className="text-xs text-slate-500 mt-1">总注册资本</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">活跃激励</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.activeIncentives}
            </div>
            <p className="text-xs text-slate-500 mt-1">个激励计划进行中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">待处理转让</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {dashboardData.pendingTransfers}
            </div>
            <p className="text-xs text-slate-500 mt-1">笔转让待确认</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表和活动 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>股权结构分布</CardTitle>
          </CardHeader>
          <CardContent>
            <EquityStructureChart data={dashboardData.equityStructure} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivities activities={dashboardData.recentActivities} />
          </CardContent>
        </Card>
      </div>

      {/* 快捷操作 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">公司管理</div>
              <div className="text-xs text-slate-500">添加/编辑公司信息</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">股东管理</div>
              <div className="text-xs text-slate-500">管理所有股东</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">股权转让</div>
              <div className="text-xs text-slate-500">记录股权交易</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <Activity className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">股权激励</div>
              <div className="text-xs text-slate-500">管理激励计划</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}