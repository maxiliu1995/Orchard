import React from 'react';

interface DateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
}

export const DateTimePicker = ({ label, value, onChange, minDate }: DateTimePickerProps) => {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="datetime-local"
        value={value?.toISOString().slice(0, 16) || ''}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        min={minDate?.toISOString().slice(0, 16)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
  );
}; 