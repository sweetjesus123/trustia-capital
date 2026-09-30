'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';

type StatementGeneratorProps = {
  accountName: string;
  accountEmail: string;
  accountStatus: string;
  portfolioValue: number;
  activeLoans: number;
  yieldInvestments: number;
  settledLiquidity: number;
  encumberedCollateral: number;
  accruedYield: number;
};

function escapeCsv(value: string) {
  const safeValue = value.replace(/^[\t\r\n ]*[=+\-@]/, (match) => `'${match}`);
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

export default function StatementGenerator({
  accountName,
  accountEmail,
  accountStatus,
  portfolioValue,
  activeLoans,
  yieldInvestments,
  settledLiquidity,
  encumberedCollateral,
  accruedYield,
}: StatementGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const generatedAt = new Date();
  const generatedLabel = generatedAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }) + ' UTC';
  const currency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  const rows: [string, string][] = [
    ['Account holder', accountName],
    ['Account email', accountEmail],
    ['Account status', accountStatus],
    ['Statement generated (UTC)', generatedAt.toISOString()],
    ['Aggregate portfolio value', currency(portfolioValue)],
    ['Active loans', currency(activeLoans)],
    ['Yield investments', currency(yieldInvestments)],
    ['Settled liquidity', currency(settledLiquidity)],
    ['Encumbered collateral', currency(encumberedCollateral)],
    ['Accrued yield', currency(accruedYield)],
  ];

  function downloadCsv() {
    const csv = [['Field', 'Value'], ...rows]
      .map((row) => row.map((value) => escapeCsv(value)).join(','))
      .join('\r\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `trustia-account-statement-${generatedAt.toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
    setErrorMessage('');
  }

  function printPdf() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setErrorMessage('Allow pop-ups to print or save the statement as a PDF.');
      return;
    }

    printWindow.opener = null;
    const safeName = escapeHtml(accountName);
    const safeEmail = escapeHtml(accountEmail);
    const safeStatus = escapeHtml(accountStatus);
    const tableRows = rows.map(([label, value]) =>
      `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
    ).join('');

    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Trustia Capital Account Statement</title><style>
      :root{color-scheme:light}*{box-sizing:border-box}body{margin:0;padding:48px;color:#172033;font:14px/1.55 Arial,sans-serif}
      header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #d9a54b;padding-bottom:20px;margin-bottom:28px}
      .brand{font-size:20px;font-weight:700;letter-spacing:.08em}.brand span{color:#a8751c}.eyebrow{color:#8a6a2d;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
      h1{font-size:24px;margin:8px 0}.meta{text-align:right;color:#596273;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{text-align:left;padding:12px;border-bottom:1px solid #dfe3ea}th{width:42%;color:#596273;font-weight:600}td{font-weight:600}footer{margin-top:30px;border-top:1px solid #dfe3ea;padding-top:16px;color:#596273;font-size:11px}
      @media print{body{padding:24px}}
    </style></head><body><header><div><div class="brand">TRUSTIA <span>CAPITAL</span></div><div class="eyebrow">Private client account statement</div><h1>Account Summary</h1></div><div class="meta">Generated ${escapeHtml(generatedLabel)}<br>${safeName}<br>${safeEmail}</div></header><p>Account status: <strong>${safeStatus}</strong></p><table><tbody>${tableRows}</tbody></table><footer>Prepared from the portfolio data currently available in the Trustia Capital dashboard. This summary is not an audit opinion, tax advice, or confirmation of funds held. Consult your independent tax and financial professionals.</footer><script>window.addEventListener('load',()=>window.print());</script></body></html>`);
    printWindow.document.close();
    setIsOpen(false);
    setErrorMessage('');
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setErrorMessage('');
          setIsOpen((open) => !open);
        }}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:border-amber-500/50 hover:text-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download Statement (PDF/CSV)
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-xl">
          <button type="button" onClick={printPdf} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-200 transition hover:bg-white/5">
            <Printer className="h-4 w-4 text-amber-400" aria-hidden="true" />
            Print / Save as PDF
          </button>
          <button type="button" onClick={downloadCsv} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-200 transition hover:bg-white/5">
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Download CSV
          </button>
          {errorMessage && <p role="alert" className="px-3 py-2 text-xs text-rose-300">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}
