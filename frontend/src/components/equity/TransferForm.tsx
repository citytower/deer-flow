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
import type { Shareholder, Company } from '@/types/equity';

interface TransferFormProps {
  companies: Company[];
  shareholders: Shareholder[];
  initialData?: Partial<{
    companyId: number;
    transferorId: number;
    transfereeId: number;
    sharesCount: number;
    transferPrice: number;
    transferDate: string;
    transferReason: string;
  }>;
  onSubmit: (data: {
    companyId: number;
    transferorId: number;
    transfereeId: number;
    sharesCount: number;
    transferPrice?: number;
    transferDate: string;
    transferReason?: string;
  }) => void;
  onCancel: () => void;
}

export function TransferForm({
  companies,
  shareholders,
  initialData,
  onSubmit,
  onCancel,
}: TransferFormProps) {
  const [formData, setFormData] = useState({
    companyId: initialData?.companyId || 0,
    transferorId: initialData?.transferorId || 0,
    transfereeId: initialData?.transfereeId || 0,
    sharesCount: initialData?.sharesCount || 0,
    transferPrice: initialData?.transferPrice || 0,
    transferDate: initialData?.transferDate || new Date().toISOString().split('T')[0],
    transferReason: initialData?.transferReason || '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyId) {
      newErrors.companyId = '请选择公司';
    }
    if (!formData.transferorId) {
      newErrors.transferorId = '请选择转让方';
    }
    if (!formData.transfereeId) {
      newErrors.transfereeId = '请选择受让方';
    }
    if (formData.transferorId === formData.transfereeId) {
      newErrors.transfereeId = '转让方和受让方不能相同';
    }
    if (!formData.sharesCount || formData.sharesCount <= 0) {
      newErrors.sharesCount = '请输入有效的转让数量';
    }
    if (!formData.transferDate) {
      newErrors.transferDate = '请选择转让日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        transferDate: formData.transferDate as string,
        transferPrice: formData.transferPrice || undefined,
        transferReason: formData.transferReason || undefined,
      });
    }
  };

  // 获取选中公司的股东列表
  const companyShareholders = shareholders.filter((s) => s.companyId === formData.companyId);

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
          <Label htmlFor="transferDate">转让日期 *</Label>
          <Input
            id="transferDate"
            name="transferDate"
            type="date"
            value={formData.transferDate}
            onChange={handleChange}
          />
          {errors.transferDate && (
            <p className="text-xs text-red-500">{errors.transferDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transferorId">转让方 *</Label>
          <Select
            value={formData.transferorId ? String(formData.transferorId) : ''}
            onValueChange={(value) => handleSelectChange('transferorId', value)}
            disabled={!formData.companyId}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.companyId ? '请选择转让方' : '请先选择公司'} />
            </SelectTrigger>
            <SelectContent>
              {companyShareholders.map((shareholder) => (
                <SelectItem key={shareholder.id} value={String(shareholder.id)}>
                  {shareholder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.transferorId && (
            <p className="text-xs text-red-500">{errors.transferorId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transfereeId">受让方 *</Label>
          <Select
            value={formData.transfereeId ? String(formData.transfereeId) : ''}
            onValueChange={(value) => handleSelectChange('transfereeId', value)}
            disabled={!formData.companyId}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.companyId ? '请选择受让方' : '请先选择公司'} />
            </SelectTrigger>
            <SelectContent>
              {companyShareholders.map((shareholder) => (
                <SelectItem
                  key={shareholder.id}
                  value={String(shareholder.id)}
                  disabled={shareholder.id === formData.transferorId}
                >
                  {shareholder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.transfereeId && (
            <p className="text-xs text-red-500">{errors.transfereeId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sharesCount">转让股份数量 *</Label>
          <Input
            id="sharesCount"
            name="sharesCount"
            type="number"
            value={formData.sharesCount || ''}
            onChange={handleChange}
            placeholder="请输入转让股份数量"
            min={1}
          />
          {errors.sharesCount && (
            <p className="text-xs text-red-500">{errors.sharesCount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transferPrice">转让价格</Label>
          <Input
            id="transferPrice"
            name="transferPrice"
            type="number"
            value={formData.transferPrice || ''}
            onChange={handleChange}
            placeholder="请输入转让价格（可选）"
            min={0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transferReason">转让原因</Label>
        <Textarea
          id="transferReason"
          name="transferReason"
          value={formData.transferReason}
          onChange={handleChange}
          placeholder="请输入转让原因（可选）"
          rows={3}
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
