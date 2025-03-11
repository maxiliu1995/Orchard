'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PodAvailability } from '@/components/pods/PodAvailability';
import { DateTimeRangePicker } from '@/components/ui/DateTimeRangePicker';
import { showToast } from '@/utils/toast';

interface BookPodPageProps {
  params: { id: string }
}

export default function BookPodPage({ params }: BookPodPageProps) {
  const router = useRouter();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const handleTimeSelect = (start: Date, end: Date) => {
    setStartTime(start);
    setEndTime(end);
  };

  const handleAvailable = () => {
    router.push(`/pods/${params.id}/payment`);
  };

  if (!startTime || !endTime) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Book a Pod</h1>
        <DateTimeRangePicker onSelect={handleTimeSelect} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book a Pod</h1>
      <PodAvailability
        podId={params.id}
        startTime={startTime}
        endTime={endTime}
        onAvailable={handleAvailable}
      />
    </div>
  );
} 