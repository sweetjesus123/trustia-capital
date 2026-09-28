'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function DashboardNotificationsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative rounded-lg border border-gray-700/50 bg-gray-800/50 p-2 text-gray-400 hover:text-white"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500" />
      </button>
      {isOpen && (
        <div role="status" className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-700 bg-gray-900 p-4 text-sm text-gray-300 shadow-xl">
          You’re all caught up.
        </div>
      )}
    </div>
  );
}
