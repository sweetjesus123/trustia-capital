import { createClient } from '@/utils/supabase/server';
import DashboardActions from '@/components/DashboardActions';
import DashboardNotificationsButton from '@/components/DashboardNotificationsButton';
import SignOutButton from '@/components/SignOutButton';
import AuditCertificate from '@/components/AuditCertificate';
import BalanceBreakdown from '@/components/BalanceBreakdown';
import RelationshipManagerCard from '@/components/RelationshipManagerCard';
import StatementGenerator from '@/components/StatementGenerator';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Landmark,
  Wallet,
  LockKeyhole,
  ChartNoAxesCombined,
} from 'lucide-react';

export const runtime = 'edge';
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // FIXED: Changed 'user_id' to 'id'
  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('account_status, portfolio_value, active_loans, yield_investments')
    .eq('id', user.id)
    .maybeSingle();

  console.log('Current Portfolio Data:', portfolio);

  const isVerified = portfolio?.account_status === 'verified';
  const portfolioValue = Number(portfolio?.portfolio_value) || 0;
  const activeLoans = Number(portfolio?.active_loans) || 0;
  const yieldInvestments = Number(portfolio?.yield_investments) || 0;
  const settledLiquidity = 0;
  const encumberedCollateral = 0;
  const accruedYield = 0;

  const metadataName = user.user_metadata?.full_name;
  const displayName =
    typeof metadataName === 'string' && metadataName.trim()
      ? metadataName.trim()
      : user.email ?? 'Client';
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="flex flex-1 flex-col bg-[#090d16] text-gray-100 font-sans">
      {/* Top Header Nav */}
      <header className="border-b border-gray-800 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg text-black font-bold">
              <Landmark className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              TRUSTIA <span className="text-amber-500">CAPITAL</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <DashboardNotificationsButton />
            <div className="flex items-center space-x-3 border-l border-gray-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-200 hidden md:inline">{displayName}</span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 print:hidden">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back, {displayName}</h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              Account Status:{' '}
              <span className={`font-semibold ${isVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isVerified ? 'Verified' : 'Under Review'}
              </span>
            </p>
          </div>
          <DashboardActions
            userId={user.id}
            userName={displayName}
            email={user.email ?? ''}
            isVerified={isVerified}
            portfolioValue={portfolioValue}
            activeLoans={activeLoans}
          />
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <StatementGenerator
            accountName={displayName}
            accountEmail={user.email ?? ''}
            accountStatus={portfolio?.account_status ?? 'unknown'}
            portfolioValue={portfolioValue}
            activeLoans={activeLoans}
            yieldInvestments={yieldInvestments}
          />
        </div>

        {!isVerified && (
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-500">
                Under Review
              </span>
              <div>
                <h3 className="text-sm font-semibold text-amber-500">Account Pending Verification</h3>
                <p className="text-xs text-gray-400">
                  Your application is currently undergoing compliance review. Full funding capabilities will unlock once verified.
                </p>
              </div>
            </div>
            <Link
              href="/#inquiry"
              className="whitespace-nowrap rounded-lg bg-amber-500 px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-amber-400"
            >
              Contact Support
            </Link>
          </div>
        )}

        {/* Primary Account Balances and Portfolio Workspace */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Portfolio Overview Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-xs font-medium text-gray-400">Settled Liquidity</span>
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white">{formatCurrency(settledLiquidity)}</div>
                <p className="mt-2 text-xs text-gray-500">Available funds</p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-xs font-medium text-gray-400">Encumbered Collateral</span>
                  <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white">{formatCurrency(encumberedCollateral)}</div>
                <p className="mt-2 text-xs text-gray-500">Locked funds</p>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="text-xs font-medium text-gray-400">Accrued Yield</span>
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <ChartNoAxesCombined className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-white">{formatCurrency(accruedYield)}</div>
                <p className="mt-2 text-xs text-gray-500">Realized / accrued</p>
              </div>
            </div>

            {/* Dashboard Tabs & Content */}
            <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="text-lg font-bold text-white">Portfolio overview</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Aggregate portfolio value, active loans, and yield investments reflect the recorded account values. New or empty account balances default to zero.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
                <p className="text-xs text-gray-500">Aggregate portfolio value: <span className="font-semibold text-gray-300">{formatCurrency(portfolioValue)}</span></p>
                <BalanceBreakdown
                  portfolioValue={portfolioValue}
                  settledLiquidity={settledLiquidity}
                  encumberedCollateral={encumberedCollateral}
                  accruedYield={accruedYield}
                />
              </div>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-[#0b1019] p-4">
                  <dt className="text-xs text-gray-500">Active credit / loans</dt>
                  <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(activeLoans)}</dd>
                </div>
                <div className="rounded-xl border border-white/5 bg-[#0b1019] p-4">
                  <dt className="text-xs text-gray-500">Yield investments</dt>
                  <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(yieldInvestments)}</dd>
                </div>
              </dl>
            </section>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-1">
            <RelationshipManagerCard />
            <AuditCertificate />
          </div>
        </div>
      </main>

    </div>
  );
}