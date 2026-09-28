'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setErrorMessage('Could not sign out. Please try again.');
      setIsSigningOut(false);
      return;
    }

    router.replace('/auth/login');
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label="Sign out"
        title="Sign out"
        className="ml-2 flex items-center space-x-1 text-xs text-gray-400 transition hover:text-rose-400 disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
      </button>
      {errorMessage && (
        <span role="alert" className="absolute right-0 top-full mt-2 whitespace-nowrap text-xs text-rose-300">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
