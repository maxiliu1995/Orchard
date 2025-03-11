'use client';

import { useState } from 'react';
import { format, addHours, isBefore, isAfter, startOfHour } from 'date-fns';
import { Button } from './Button';
import { showToast } from '@/utils/toast';

interface DateTimeRangePickerProps {
  onSelect: (start: Date, end: Date) => void;
  minHours?: number;
  maxHours?: number;
}

export function DateTimeRangePicker({
  onSelect,
  minHours = 1,
  maxHours = 8
}: DateTimeRangePickerProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(`${startDate}T${startTime}`);
    const end = addHours(start, duration);
    const now = new Date();

    if (isBefore(start, startOfHour(now))) {
      showToast('error', 'Start time must be in the future');
      return;
    }

    if (isAfter(end, addHours(start, maxHours))) {
      showToast('error', `Maximum booking duration is ${maxHours} hours`);
      return;
    }

    onSelect(start, end);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {Array.from({ length: maxHours }, (_, i) => i + 1).map((hours) => (
            <option key={hours} value={hours}>
              {hours} {hours === 1 ? 'hour' : 'hours'}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full">
        Check Availability
      </Button>
    </form>
  );
} 