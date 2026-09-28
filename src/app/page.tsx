'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InquirySection from '../components/InquirySection';
import { 
  ShieldCheck, TrendingUp, ArrowRight, Menu, X, Landmark,
  DollarSign, Briefcase, Home as HomeIcon, Zap, Award, Globe
} from 'lucide-react';

export default function Home() {
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanTenure, setLoanTenure] = useState<number>(12);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Simple monthly payment calculation (Interest ~7.9% APR)
  const monthlyRate = 0.079 / 12;
  const monthlyRepayment = (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
    (Math.pow(1 + monthlyRate, loanTenure) - 1)
  ).toFixed(2);

  return (
    <div className="flex flex-1 flex-col bg-[#090d16] text-gray-100 font-sans">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#090d16]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-amber-500 p-2 rounded-lg text-black font-bold">
              <Landmark className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              TRUSTIA <span className="text-amber-500">CAPITAL</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <a href="#services" className="hover:text-amber-400 transition">Services</a>
            <a href="#loans" className="hover:text-amber-400 transition">Financing</a>
            <a href="#investments" className="hover:text-amber-400 transition">Investments</a>
            <a href="#calculator" className="hover:text-amber-400 transition">Calculator</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="/auth/login" className="text-sm text-gray-300 hover:text-white transition">Client Login</a>
            <a href="/auth/signup" className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
              Get Started
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-300">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-20 px-6 max-w-7xl mx-auto text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20 mb-4">
            EXCLUSIVITY REDEFINED
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Elevating Your <span className="text-amber-500">Financial Legacy</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 leading-relaxed">
            Tailored wealth management, institutional stability, and bespoke credit facilities designed to give you ultimate financial control.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href="/auth/signup" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg flex items-center justify-center space-x-2">
              <span>Apply For Financing</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#investments" className="border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold px-6 py-3 rounded-lg text-center">
              Explore Investments
            </a>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-gray-400">Live Rate Simulator</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">Active</span>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <div className="text-xs text-gray-400">Bespoke Credit Tier</div>
              <div className="text-xl font-bold text-white mt-1">$25,000 USD</div>
              <div className="text-xs text-emerald-400 mt-1">7.9% Fixed APR • 36 Months</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <div className="text-xs text-gray-400">Growth Investment Tier</div>
              <div className="text-xl font-bold text-white mt-1">+5.8% Monthly ROI</div>
              <div className="text-xs text-amber-400 mt-1">90-Day Lock Period</div>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-900/30 border-t border-gray-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Our Expertise</span>
            <h2 className="text-3xl font-bold text-white mt-2">Bespoke Financial Services</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-6">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Private Banking</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Personalized banking solutions including high-yield liquidity management and credit facilities.
              </p>
              <a href="/auth/signup" className="text-amber-400 text-sm font-semibold flex items-center space-x-1 hover:underline">
                <span>Explore Service</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Wealth Management</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Strategic asset allocation designed to preserve and grow your generational wealth.
              </p>
              <a href="/auth/signup" className="text-amber-400 text-sm font-semibold flex items-center space-x-1 hover:underline">
                <span>Explore Service</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Markets</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Direct access to international equity, fixed income, and liquidity pools managed by experts.
              </p>
              <a href="/auth/signup" className="text-amber-400 text-sm font-semibold flex items-center space-x-1 hover:underline">
                <span>Explore Service</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Estimator */}
      <section id="calculator" className="py-16 bg-gray-900/60 border-t border-gray-800 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Interactive Loan Estimator</h2>
            <p className="text-gray-400 mt-2 text-sm">Calculate your monthly repayments based on desired loan capital.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 flex justify-between">
                  <span>Loan Capital:</span>
                  <span className="text-amber-400 font-bold">${loanAmount.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500" 
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full mt-3 accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 flex justify-between">
                  <span>Tenure (Months):</span>
                  <span className="text-amber-400 font-bold">{loanTenure} Months</span>
                </label>
                <input 
                  type="range" 
                  min="3" 
                  max="60" 
                  step="3" 
                  value={loanTenure} 
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full mt-3 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 text-center">
              <div className="text-sm text-gray-400">Estimated Monthly Repayment</div>
              <div className="text-4xl font-extrabold text-amber-400 mt-2">${monthlyRepayment}</div>
              <div className="text-xs text-gray-500 mt-2">Includes estimated 7.9% APR fixed interest</div>
              <a href="/auth/signup" className="mt-6 inline-block w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition">
                Proceed With Application
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bespoke Financing / Loan Packages Grid */}
      <section id="loans" className="py-20 border-t border-gray-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Premium Financing</span>
            <h2 className="text-3xl font-bold text-white mt-2">Bespoke Loan Packages</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Starter Loan</h3>
                <p className="text-gray-400 text-xs mt-1">Short-term liquidity flexibility.</p>
                <div className="mt-6 space-y-2 text-xs border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-gray-400"><span>Interest Rate:</span><span className="text-white font-semibold">5.50%</span></div>
                  <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">12 Months</span></div>
                  <div className="flex justify-between text-gray-400"><span>Limit:</span><span className="text-amber-400 font-bold">$500 - $5,000</span></div>
                </div>
              </div>
              <a href="/auth/signup" className="mt-6 block w-full text-center bg-gray-800 hover:bg-amber-500 hover:text-black text-white text-xs font-bold py-2.5 rounded-xl transition">
                Apply Now
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Personal Loan</h3>
                <p className="text-gray-400 text-xs mt-1">For general personal capital requirements.</p>
                <div className="mt-6 space-y-2 text-xs border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-gray-400"><span>Interest Rate:</span><span className="text-white font-semibold">7.90%</span></div>
                  <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">36 Months</span></div>
                  <div className="flex justify-between text-gray-400"><span>Limit:</span><span className="text-amber-400 font-bold">$1,000 - $25,000</span></div>
                </div>
              </div>
              <a href="/auth/signup" className="mt-6 block w-full text-center bg-gray-800 hover:bg-amber-500 hover:text-black text-white text-xs font-bold py-2.5 rounded-xl transition">
                Apply Now
              </a>
            </div>

            <div className="bg-gray-900 border border-amber-500/30 p-6 rounded-2xl flex flex-col justify-between relative">
              <span className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              <div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Business Loan</h3>
                <p className="text-gray-400 text-xs mt-1">Capital for expansion and operations.</p>
                <div className="mt-6 space-y-2 text-xs border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-gray-400"><span>Interest Rate:</span><span className="text-white font-semibold">9.50%</span></div>
                  <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">60 Months</span></div>
                  <div className="flex justify-between text-gray-400"><span>Limit:</span><span className="text-amber-400 font-bold">$5,000 - $100,000</span></div>
                </div>
              </div>
              <a href="/auth/signup" className="mt-6 block w-full text-center bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-2.5 rounded-xl transition">
                Apply Now
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                  <HomeIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Mortgage Facility</h3>
                <p className="text-gray-400 text-xs mt-1">Long-term real estate financing.</p>
                <div className="mt-6 space-y-2 text-xs border-t border-gray-800 pt-4">
                  <div className="flex justify-between text-gray-400"><span>Interest Rate:</span><span className="text-white font-semibold">4.20%</span></div>
                  <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">360 Months</span></div>
                  <div className="flex justify-between text-gray-400"><span>Limit:</span><span className="text-amber-400 font-bold">$20k - $500k</span></div>
                </div>
              </div>
              <a href="/auth/signup" className="mt-6 block w-full text-center bg-gray-800 hover:bg-amber-500 hover:text-black text-white text-xs font-bold py-2.5 rounded-xl transition">
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans Grid */}
      <section id="investments" className="py-20 bg-gray-900/40 border-t border-gray-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Investment Opportunities</span>
            <h2 className="text-3xl font-bold text-white mt-2">Premium Yield Products</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Starter Savings</h3>
              <p className="text-gray-400 text-xs mt-1">Steady returns with short lockup.</p>
              <div className="my-6 p-4 bg-gray-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-400"><span>ROI Rate:</span><span className="text-emerald-400 font-bold">+3.50%</span></div>
                <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">30 Days</span></div>
                <div className="flex justify-between text-gray-400"><span>Investment Range:</span><span className="text-amber-400 font-bold">$100 - $5,000</span></div>
              </div>
              <a href="/auth/signup" className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition text-xs">
                Start Investing
              </a>
            </div>

            <div className="bg-gray-900 border border-amber-500/40 p-8 rounded-2xl relative">
              <span className="absolute -top-3 right-6 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">MOST POPULAR</span>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Growth Builder</h3>
              <p className="text-gray-400 text-xs mt-1">Accelerated yield for high returns.</p>
              <div className="my-6 p-4 bg-gray-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-400"><span>ROI Rate:</span><span className="text-emerald-400 font-bold">+5.80% / mo</span></div>
                <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">90 Days</span></div>
                <div className="flex justify-between text-gray-400"><span>Investment Range:</span><span className="text-amber-400 font-bold">$1,000 - $25,000</span></div>
              </div>
              <a href="/auth/signup" className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition text-xs">
                Start Investing
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Elite Diamond</h3>
              <p className="text-gray-400 text-xs mt-1">Institutional yield tier.</p>
              <div className="my-6 p-4 bg-gray-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-400"><span>ROI Rate:</span><span className="text-emerald-400 font-bold">+9.50% / mo</span></div>
                <div className="flex justify-between text-gray-400"><span>Duration:</span><span className="text-white font-semibold">365 Days</span></div>
                <div className="flex justify-between text-gray-400"><span>Investment Range:</span><span className="text-amber-400 font-bold">$25,000 - $500,000</span></div>
              </div>
              <a href="/auth/signup" className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition text-xs">
                Start Investing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Footer */}
      <section className="py-12 border-t border-gray-800 bg-gray-900/80 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-400">$450M+</div>
            <div className="text-xs text-gray-400 mt-1">Assets Managed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-xs text-gray-400 mt-1">Private Support</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-gray-400 mt-1">Encrypted Data</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-400">50,000+</div>
            <div className="text-xs text-gray-400 mt-1">Global Clients</div>
          </div>
        </div>
      </section>

      <InquirySection />

    </div>
  );
}