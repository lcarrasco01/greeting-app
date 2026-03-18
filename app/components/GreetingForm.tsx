'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  GreetingFormData,
  Occasion,
  Vibe,
  OCCASION_LABELS,
  VIBE_LABELS,
} from '../types';

interface GreetingFormProps {
  onSubmit: (data: GreetingFormData) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
}

const INITIAL_FORM: Partial<GreetingFormData> = {
  occasion: 'birthday',
  vibe: 'heartfelt',
};

export function GreetingForm({ onSubmit, onClear, isLoading }: GreetingFormProps) {
  const [formData, setFormData] = useState<Partial<GreetingFormData>>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof GreetingFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.fromName?.trim()) newErrors.fromName = 'Please enter your name';
    if (!formData.toName?.trim()) newErrors.toName = "Please enter the recipient's name";
    if (!formData.occasion) newErrors.occasion = 'Please select an occasion';
    if (!formData.vibe) newErrors.vibe = 'Please select a vibe';
    if (formData.age !== undefined && formData.age !== null && formData.age !== ('' as unknown as number)) {
      const age = Number(formData.age);
      if (isNaN(age) || age < 1 || age > 150) newErrors.age = 'Age must be between 1 and 150';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData as GreetingFormData);
  };

  const handleClear = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* From Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fromName">From <span className="text-red-400">*</span></Label>
          <input
            id="fromName"
            type="text"
            placeholder="Your name"
            value={formData.fromName || ''}
            onChange={(e) => setFormData((p) => ({ ...p, fromName: e.target.value }))}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
          />
          {errors.fromName && <p className="text-xs text-red-500">{errors.fromName}</p>}
        </div>

        {/* To Name */}
        <div className="space-y-1.5">
          <Label htmlFor="toName">To <span className="text-red-400">*</span></Label>
          <input
            id="toName"
            type="text"
            placeholder="Recipient's name"
            value={formData.toName || ''}
            onChange={(e) => setFormData((p) => ({ ...p, toName: e.target.value }))}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
          />
          {errors.toName && <p className="text-xs text-red-500">{errors.toName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Occasion */}
        <div className="space-y-1.5">
          <Label>Occasion <span className="text-red-400">*</span></Label>
          <Select
            value={formData.occasion}
            onValueChange={(v) => setFormData((p) => ({ ...p, occasion: v as Occasion }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OCCASION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.occasion && <p className="text-xs text-red-500">{errors.occasion}</p>}
        </div>

        {/* Vibe */}
        <div className="space-y-1.5">
          <Label>Vibe <span className="text-red-400">*</span></Label>
          <Select
            value={formData.vibe}
            onValueChange={(v) => setFormData((p) => ({ ...p, vibe: v as Vibe }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vibe" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(VIBE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vibe && <p className="text-xs text-red-500">{errors.vibe}</p>}
        </div>
      </div>

      {/* Age (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="age">
          Age <span className="text-gray-400 text-xs font-normal">(optional)</span>
        </Label>
        <input
          id="age"
          type="number"
          placeholder="e.g. 30"
          min={1}
          max={150}
          value={formData.age ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            setFormData((p) => ({ ...p, age: val ? Number(val) : undefined }));
          }}
          className="flex h-10 w-full sm:w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
        />
        {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="flex-1 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating your card...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Greeting Card
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isLoading}
          onClick={handleClear}
          className="text-base font-semibold"
        >
          <Trash2 className="w-5 h-5" />
          Clear
        </Button>
      </div>
    </form>
  );
}
