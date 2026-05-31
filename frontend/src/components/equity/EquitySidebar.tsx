'use client';

import { Building2, Users, PieChart, TrendingUp, Award, History, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: '仪表盘',
    href: '/equity',
    icon: PieChart,
  },
  {
    name: '公司管理',
    href: '/equity/companies',
    icon: Building2,
  },
  {
    name: '股东管理',
    href: '/equity/shareholders',
    icon: Users,
  },
  {
    name: '股权记录',
    href: '/equity/equity-records',
    icon: TrendingUp,
  },
  {
    name: '股权转让',
    href: '/equity/transfers',
    icon: TrendingUp,
  },
  {
    name: '股权激励',
    href: '/equity/incentives',
    icon: Award,
  },
  {
    name: '变更历史',
    href: '/equity/history',
    icon: History,
  },
];

export function EquitySidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50">
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-slate-900">股权管理</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
