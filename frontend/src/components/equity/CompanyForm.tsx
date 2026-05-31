'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CompanyFormData } from '@/types/equity';

interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => void;
  onCancel: () => void;
}

export function CompanyForm({ initialData, onSubmit, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialData?.name || '',
    unifiedSocialCreditCode: initialData?.unifiedSocialCreditCode || '',
    registeredCapital: initialData?.registeredCapital || 0,
    establishedDate: initialData?.establishedDate || '',
    industry: initialData?.industry || '',
    address: initialData?.address || '',
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

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入公司名称';
    }
    if (formData.unifiedSocialCreditCode && formData.unifiedSocialCreditCode.length !== 18) {
      newErrors.unifiedSocialCreditCode = '统一社会信用代码应为18位';
    }
    if (formData.registeredCapital && formData.registeredCapital < 0) {
      newErrors.registeredCapital = '注册资本不能为负数';
    }
    if (formData.establishedDate && new Date(formData.establishedDate) > new Date()) {
      newErrors.establishedDate = '成立日期不能晚于当前日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">公司名称 *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入公司名称"
            required
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unifiedSocialCreditCode">统一社会信用代码</Label>
          <Input
            id="unifiedSocialCreditCode"
            name="unifiedSocialCreditCode"
            value={formData.unifiedSocialCreditCode}
            onChange={handleChange}
            placeholder="请输入统一社会信用代码"
            maxLength={18}
          />
          {errors.unifiedSocialCreditCode && (
            <p className="text-xs text-red-500">{errors.unifiedSocialCreditCode}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="registeredCapital">注册资本</Label>
          <Input
            id="registeredCapital"
            name="registeredCapital"
            type="number"
            value={formData.registeredCapital || ''}
            onChange={handleChange}
            placeholder="请输入注册资本"
            min={0}
          />
          {errors.registeredCapital && (
            <p className="text-xs text-red-500">{errors.registeredCapital}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="establishedDate">成立日期</Label>
          <Input
            id="establishedDate"
            name="establishedDate"
            type="date"
            value={formData.establishedDate}
            onChange={handleChange}
          />
          {errors.establishedDate && (
            <p className="text-xs text-red-500">{errors.establishedDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">所属行业</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="请输入所属行业"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">注册地址</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="请输入注册地址"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">公司简介</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="请输入公司简介"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          保存
        </Button>
      </div>
    </form>
  );
}