import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminBalanceForm from '@/components/AdminBalanceForm';

const ADMIN_EMAIL = 'briangelling08@gmail.com';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex-1 bg-[#090d16] px-4 py-12 text-gray-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Restricted access</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Portfolio administration</h1>
          <p className="mt-2 text-sm text-gray-400">Signed in as {user.email}. Look up a client, edit all six recorded balances, and save them together.</p>
        </header>
        <AdminBalanceForm />
      </div>
    </main>
  );
}
