'use client';

import { TrendingUp, Users, Award, Calendar } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  description: string;
  date: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'transfer':
      return TrendingUp;
    case 'record':
      return Users;
    case 'incentive':
      return Award;
    default:
      return Calendar;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'transfer':
      return 'bg-blue-100 text-blue-600';
    case 'record':
      return 'bg-green-100 text-green-600';
    case 'incentive':
      return 'bg-amber-100 text-amber-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        return (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
