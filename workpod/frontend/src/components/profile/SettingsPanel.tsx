'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
  };
  language: 'en' | 'es' | 'de';
  currency: 'USD' | 'EUR' | 'GBP';
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      push: true,
    },
    language: 'en',
    currency: 'USD',
  });

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'de', label: 'Deutsch' },
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'GBP', label: 'British Pound' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-gray-500">Manage your preferences</p>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <h4 className="font-medium">Notifications</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  email: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={(e) => setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  push: e.target.checked,
                },
              })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Push notifications</span>
          </label>
        </div>
      </div>

      {/* Language */}
      <div className="space-y-2">
        <label className="block font-medium">Language</label>
        <select
          value={settings.language}
          onChange={(e) => setSettings({
            ...settings,
            language: e.target.value as Settings['language'],
          })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <label className="block font-medium">Currency</label>
        <select
          value={settings.currency}
          onChange={(e) => setSettings({
            ...settings,
            currency: e.target.value as Settings['currency'],
          })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          {currencies.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full">Save Changes</Button>
    </div>
  );
} 