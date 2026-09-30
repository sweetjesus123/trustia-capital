import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'briangelling08@gmail.com';
const USER_PAGE_SIZE = 1000;
const MAX_BALANCE = 1_000_000_000_000;

const balanceColumns = {
  portfolioValue: 'portfolio_value',
  yieldInvestments: 'yield_investments',
  activeLoans: 'active_loans',
  availableFunds: 'available_funds',
  lockedFunds: 'locked_funds',
  realizedYield: 'realized_yield',
} as const;

type DatabaseBalances = Record<(typeof balanceColumns)[keyof typeof balanceColumns], number>;
type RequestBody = 
  | { action: 'lookup'; email: string }
  | { action: 'update'; email: string; balances: DatabaseBalances };

const portfolioSelect = 'id, portfolio_value, yield_investments, active_loans, available_funds, locked_funds, realized_yield';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseBody(value: unknown): RequestBody | null {
  if (!isRecord(value)) return null;

  const { action, email } = value;
  if (
    (action !== 'lookup' && action !== 'update') ||
    typeof email !== 'string' ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return null;
  }

  if (action === 'lookup') {
    return { action, email: email.trim() };
  }

  if (!isRecord(value.balances)) {
    return null;
  }

  const balances = {} as DatabaseBalances;
  for (const column of Object.values(balanceColumns) as (typeof balanceColumns)[keyof typeof balanceColumns][]) {
    const amount = Number.parseFloat(String(value.balances[column] ?? ''));
    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > MAX_BALANCE ||
      Math.round(amount * 100) / 100 !== amount
    ) {
      return null;
    }
    balances[column] = amount;
  }

  return {
    action: 'update',
    email: email.trim(),
    balances,
  };
}

export async function POST(request: Request) {
  const sessionClient = await createClient();
  const { data: { user }, error: authError } = await sessionClient.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: 'Please sign in to continue.' }, { status: 401 });
  }

  if (user.email?.trim().toLowerCase() !== ADMIN_EMAIL) {
    return Response.json({ error: 'You are not authorized to perform this action.' }, { status: 403 });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const body = parseBody(rawBody);
  if (!body) {
    return Response.json({ error: 'Please provide valid account and balance details.' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: 'Supabase service role key is missing in environment variables.' }, { status: 503 });
  }

  const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    let targetUserId: string | null = null;
    for (let page = 1; ; page += 1) {
      const { data, error } = await adminClient.auth.admin.listUsers({
        page,
        perPage: USER_PAGE_SIZE,
      });
      if (error) {
        return Response.json({ error: `Auth lookup error: ${error.message}` }, { status: 500 });
      }

      const match = data.users.find((targetUser) => targetUser.email?.toLowerCase() === body.email.toLowerCase());
      if (match) {
        targetUserId = match.id;
        break;
      }
      if (data.users.length < USER_PAGE_SIZE) break;
    }

    if (!targetUserId) {
      return Response.json({ error: `No Supabase Auth user found for email: ${body.email}` }, { status: 404 });
    }

    const { data: foundPortfolio, error: lookupError } = await adminClient
      .from('portfolios')
      .select(portfolioSelect)
      .eq('id', targetUserId)
      .maybeSingle();

    if (lookupError) {
      return Response.json({ error: `Database lookup error: ${lookupError.message}` }, { status: 500 });
    }

    let portfolio = foundPortfolio;
    if (!portfolio) {
      const { error: createError } = await adminClient
        .from('portfolios')
        .upsert({
          id: targetUserId,
          portfolio_value: 0,
          yield_investments: 0,
          active_loans: 0,
          available_funds: 0,
          locked_funds: 0,
          realized_yield: 0,
        }, { onConflict: 'id', ignoreDuplicates: true });

      if (createError) {
        return Response.json({ error: `Database creation error: ${createError.message}` }, { status: 500 });
      }

      const { data: createdPortfolio, error: createdLookupError } = await adminClient
        .from('portfolios')
        .select(portfolioSelect)
        .eq('id', targetUserId)
        .maybeSingle();

      if (createdLookupError || !createdPortfolio) {
        return Response.json({ error: `Database readback error: ${createdLookupError?.message || 'Portfolio not found after creation'}` }, { status: 500 });
      }

      portfolio = createdPortfolio;
    }

    const balances = {
      portfolioValue: Number(portfolio.portfolio_value) || 0,
      yieldInvestments: Number(portfolio.yield_investments) || 0,
      activeLoans: Number(portfolio.active_loans) || 0,
      availableFunds: Number(portfolio.available_funds) || 0,
      lockedFunds: Number(portfolio.locked_funds) || 0,
      realizedYield: Number(portfolio.realized_yield) || 0,
    };

    if (body.action === 'lookup') {
      return Response.json({ email: body.email, balances });
    }

    const { data: updatedPortfolio, error: updateError } = await adminClient
      .from('portfolios')
      .update(body.balances)
      .eq('id', targetUserId)
      .select(portfolioSelect)
      .maybeSingle();

    if (updateError || !updatedPortfolio) {
      return Response.json({ error: `Database update error: ${updateError?.message || 'Portfolio not updated'}` }, { status: 500 });
    }

    return Response.json({
      message: 'Portfolio balance updated successfully.',
      email: body.email,
      balances: {
        portfolioValue: Number(updatedPortfolio.portfolio_value) || 0,
        yieldInvestments: Number(updatedPortfolio.yield_investments) || 0,
        activeLoans: Number(updatedPortfolio.active_loans) || 0,
        availableFunds: Number(updatedPortfolio.available_funds) || 0,
        lockedFunds: Number(updatedPortfolio.locked_funds) || 0,
        realizedYield: Number(updatedPortfolio.realized_yield) || 0,
      },
    });
  } catch (error) {
    return Response.json({ error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` }, { status: 500 });
  }
}