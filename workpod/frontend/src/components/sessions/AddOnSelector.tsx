'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface AddOnSelectorProps {
  selectedAddOns: string[];
  onSelect: (addOns: string[]) => void;
}

const MOCK_ADDONS: AddOn[] = [
  {
    id: 'monitor',
    name: 'Monitor',
    description: '27" 4K Display',
    price: 10,
    available: true,
  },
  {
    id: 'headphones',
    name: 'Headphones',
    description: 'Noise-cancelling',
    price: 5,
    available: true,
  },
];

export function AddOnSelector({ selectedAddOns, onSelect }: AddOnSelectorProps) {
  const toggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      onSelect(selectedAddOns.filter(addOnId => addOnId !== id));
    } else {
      onSelect([...selectedAddOns, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Add-ons</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_ADDONS.map((addOn) => (
          <div
            key={addOn.id}
            className={`p-4 rounded-lg border ${
              selectedAddOns.includes(addOn.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{addOn.name}</h4>
                <p className="text-sm text-gray-500">{addOn.description}</p>
              </div>
              <p className="text-sm font-medium">${addOn.price}/hr</p>
            </div>
            <Button
              variant={selectedAddOns.includes(addOn.id) ? 'default' : 'outline'}
              onClick={() => toggleAddOn(addOn.id)}
              disabled={!addOn.available}
              className="w-full mt-2"
            >
              {selectedAddOns.includes(addOn.id) ? 'Remove' : 'Add'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 