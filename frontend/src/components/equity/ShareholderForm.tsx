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

interface ShareholderFormProps {
  companies: Company[];
  initialData?: Partial<Shareholder>;
  onSubmit: (data: {
    companyId: number;
    name: string;
    type: 'natural' | 'legal';
    idCard?: string;
    contactPhone?: string;
    email?: string;
    address?: string;
  }) => void;
  onCancel: () => void;
}

export function ShareholderForm({
  companies,
  initialData,
  onSubmit,
  onCancel,
}: ShareholderFormProps) {
  const [formData, setFormData] = useState({
    companyId: initialData?.companyId || 0,
    name: initialData?.name || '',
    type: initialData?.type || 'natural',
    idCard: initialData?.idCard || '',
    contactPhone: initialData?.contactPhone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      [name]: value,
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
      newErrors.companyId = '请选择所属公司';
    }
    if (!formData.name.trim()) {
      newErrors.name = '请输入股东姓名/名称';
    }
    if (formData.type === 'natural' && formData.idCard && formData.idCard.length !== 18) {
      newErrors.idCard = '身份证号应为18位';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        companyId: Number(formData.companyId),
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
          <Label htmlFor="name">股东姓名/名称 *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入股东姓名或名称"
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">股东类型 *</Label>
          <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="请选择股东类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="natural">自然人股东</SelectItem>
              <SelectItem value="legal">法人股东</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="idCard">
            {formData.type === 'natural' ? '身份证号' : '统一社会信用代码'}
          </Label>
          <Input
            id="idCard"
            name="idCard"
            value={formData.idCard}
            onChange={handleChange}
            placeholder={formData.type === 'natural' ? '请输入身份证号' : '请输入统一社会信用代码'}
            maxLength={formData.type === 'natural' ? 18 : 18}
          />
          {errors.idCard && (
            <p className="text-xs text-red-500">{errors.idCard}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">联系电话</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="请输入联系电话"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">电子邮箱</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="请输入电子邮箱"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">联系地址</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="请输入联系地址"
          rows={2}
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