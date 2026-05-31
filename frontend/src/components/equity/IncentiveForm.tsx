'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Company } from '@/types/equity';

interface IncentiveFormProps {
  companies: Company[];
  initialData?: Partial<{
    companyId: number;
    planName: string;
    planType: string;
    totalShares: number;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  onSubmit: (data: {
    companyId: number;
    planName: string;
    planType: string;
    totalShares: number;
    startDate: string;
    endDate?: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

const PLAN_TYPES = [
  { value: 'stock_option', label: '股票期权' },
  { value: 'restricted_stock', label: '限制性股票' },
  { value: 'restricted_stock_unit', label: '限制性股票单位' },
  { value: 'performance_share', label: '业绩股票' },
  { value: 'stock_appreciation_right', label: '股票增值权' },
];

export function IncentiveForm({
  companies,
  initialData,
  onSubmit,
  onCancel,
}: IncentiveFormProps) {
  const [formData, setFormData] = useState({
    companyId: initialData?.companyId || 0,
    planName: initialData?.planName || '',
    planType: initialData?.planType || '',
    totalShares: initialData?.totalShares || 0,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : 0) : value,
    }));
    // 清除错误
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'companyId') {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // 清除错误
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyId) {
      newErrors.companyId = '请选择公司';
    }
    if (!formData.planName.trim()) {
      newErrors.planName = '请输入计划名称';
    }
    if (!formData.planType) {
      newErrors.planType = '请选择计划类型';
    }
    if (!formData.totalShares || formData.totalShares <= 0) {
      newErrors.totalShares = '请输入有效的股份数量';
    }
    if (!formData.startDate) {
      newErrors.startDate = '请选择开始日期';
    }
    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = '结束日期不能早于开始日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        startDate: formData.startDate as string,
        endDate: formData.endDate || undefined,
        description: formData.description || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="companyId">所属公司 *</Label>
          <Select
            value={formData.companyId ? String(formData.companyId) : ''}
            onValueChange={(value) => handleSelectChange('companyId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择公司" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={String(company.id)}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.companyId && (
            <p className="text-xs text-red-500">{errors.companyId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="planName">计划名称 *</Label>
          <Input
            id="planName"
            name="planName"
            value={formData.planName}
            onChange={handleChange}
            placeholder="如：2024年第一期股权激励计划"
          />
          {errors.planName && (
            <p className="text-xs text-red-500">{errors.planName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="planType">激励类型 *</Label>
          <Select
            value={formData.planType}
            onValueChange={(value) => handleSelectChange('planType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="请选择激励类型" />
            </SelectTrigger>
            <SelectContent>
              {PLAN_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.planType && (
            <p className="text-xs text-red-500">{errors.planType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalShares">股份数量 *</Label>
          <Input
            id="totalShares"
            name="totalShares"
            type="number"
            value={formData.totalShares || ''}
            onChange={handleChange}
            placeholder="请输入激励股份总数"
            min={1}
          />
          {errors.totalShares && (
            <p className="text-xs text-red-500">{errors.totalShares}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">开始日期 *</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">结束日期</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            placeholder="（可选）"
          />
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">计划描述</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="请输入激励计划的具体描述（可选）"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
