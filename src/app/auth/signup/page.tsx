'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Landmark, Lock, Mail, User, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('financing');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_objective: accountType,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.replace('/dashboard');
        router.refresh();
      } else {
        setSuccessMessage('Application submitted. Check your email to confirm your address before signing in.');
      }
    } catch {
      setErrorMessage('Unable to create your account right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="bg-amber-500 p-2.5 rounded-xl text-black font-bold">
            <Landmark className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            TRUSTIA <span className="text-amber-500">CAPITAL</span>
          </span>
        </Link>
        <p className="text-gray-400 text-sm mt-2">Private Wealth Account Application</p>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="fullName"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Account Objective</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <select
                name="accountObjective"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
              >
                <option value="financing" className="bg-gray-900 text-white">Credit & Loan Facilities</option>
                <option value="investing" className="bg-gray-900 text-white">Wealth Management & Yield</option>
                <option value="both" className="bg-gray-900 text-white">Combined Full Suite</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-rose-400">{errorMessage}</p>
          )}
          {successMessage && (
            <p role="status" className="text-sm text-emerald-400">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition flex items-center justify-center space-x-2 mt-6 cursor-pointer"
          >
            <span>{isSubmitting ? 'Creating account…' : 'Submit Application'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-400 font-semibold hover:underline">
            Client Login
          </Link>
        </div>
      </div>

      <div className="mt-8 flex items-center space-x-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Institutional-Grade Privacy Protection</span>
      </div>
    </div>
  );
}