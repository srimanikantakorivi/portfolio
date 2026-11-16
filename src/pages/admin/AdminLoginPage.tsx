import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Database,
  ArrowLeft,
} from 'lucide-react';
import { isSupabaseConfigured, configuredAdminEmail } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const { signIn, loading, authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSetupInstructions, setShowSetupInstructions] = useState(!isSupabaseConfigured);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim() || !password) {
      return;
    }

    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#4D5E4B] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Portfolio</span>
        </Link>

        <Badge variant="sage" size="sm">
          Single-Admin Portal
        </Badge>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto">
        <div className="p-7 sm:p-9 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF0EA] text-[#4D5E4B] mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#181A18]">
              Portfolio CMS Access
            </h1>
            <p className="text-xs text-[#6E756E]">
              Authenticate as Sri Manikanta Korivi to manage portfolio content, publish drafts, and review inquiries.
            </p>
          </div>

          {/* Not Configured Alert */}
          {!isSupabaseConfigured && (
            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2 text-xs text-[#92400E]">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Supabase Connection Pending</span>
              </div>
              <p className="leading-relaxed">
                Supabase credentials have not been configured in your local environment. Live authentication requires connecting your Supabase project.
              </p>
              <button
                type="button"
                onClick={() => setShowSetupInstructions(true)}
                className="font-medium underline underline-offset-2 text-[#78350F] hover:text-[#451A03] block pt-1 cursor-pointer"
              >
                View Exact Setup Guide &rarr;
              </button>
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#B91C1C]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Authentication / Authorization Error</span>
                <p>{authError}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-mono-code font-medium text-[#2E332E] mb-1.5"
              >
                Administrator Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={configuredAdminEmail || 'admin@example.com'}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#9A9E99] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-mono-code font-medium text-[#2E332E]"
                >
                  Password
                </label>
              </div>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-[#DCD6C9] bg-[#FAF8F5] text-[#181A18] placeholder:text-[#9A9E99] focus:outline-none focus:ring-2 focus:ring-[#4D5E4B] focus:bg-white transition-all"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting || loading || !isSupabaseConfigured}
                className="w-full justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {submitting ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
              </Button>
            </div>
          </form>

          {/* Security & Authorization Policy Notice */}
          <div className="pt-4 border-t border-[#F0ECE4] text-[11px] text-[#787E78] space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-[#181A18]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4D5E4B]" />
              <span>Strict Single-Admin Access</span>
            </div>
            <p className="leading-relaxed">
              Public signup is disabled. Authentication alone does not grant access; the account must be verified against the authorized administrator credentials in PostgreSQL.
            </p>
          </div>
        </div>

        {/* Toggle Setup Instructions Drawer */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowSetupInstructions(!showSetupInstructions)}
            className="text-xs font-mono-code text-[#4D5E4B] hover:underline cursor-pointer"
          >
            {showSetupInstructions ? 'Hide Setup Walkthrough' : 'Show Supabase Setup Walkthrough'}
          </button>
        </div>
      </div>

      {/* Setup Instructions Walkthrough */}
      {showSetupInstructions && (
        <div className="max-w-2xl mx-auto w-full my-8 p-6 rounded-2xl bg-white border border-[#E8E4DC] shadow-sm space-y-4 text-xs text-[#414741]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DE]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4D5E4B]" />
              <h3 className="text-sm font-semibold text-[#181A18]">
                Supabase Setup Walkthrough for Sri Manikanta Korivi
              </h3>
            </div>
            <Badge variant="sage" size="sm">
              Phase 2 Connection
            </Badge>
          </div>

          <p className="leading-relaxed text-[#595F59]">
            Follow these exact steps to connect your Supabase project without hardcoding secrets:
          </p>

          <ol className="list-decimal list-inside space-y-3 pl-1">
            <li className="leading-relaxed">
              <strong className="text-[#181A18]">Create Supabase Project:</strong> Go to{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4D5E4B] underline"
              >
                supabase.com
              </a>{' '}
              and create a free project.
            </li>
            <li className="leading-relaxed">
              <strong className="text-[#181A18]">Run SQL Migrations:</strong> In your Supabase Dashboard, open the{' '}
              <strong className="text-[#181A18]">SQL Editor</strong> and execute the 3 migration files stored in this project:
              <ul className="list-disc list-inside pl-5 pt-1 space-y-1 font-mono-code text-[11px] text-[#4D5E4B]">
                <li>supabase/migrations/20261115_001_create_portfolio_tables.sql</li>
                <li>supabase/migrations/20261115_002_create_storage_buckets.sql</li>
                <li>supabase/migrations/20261115_003_seed_verified_data.sql</li>
              </ul>
            </li>
            <li className="leading-relaxed">
              <strong className="text-[#181A18]">Create Admin Account:</strong> In Supabase Dashboard &rarr; Authentication &rarr; Users, click{' '}
              <strong className="text-[#181A18]">Add User</strong>, enter your admin email (e.g. your email) and a strong password. Then in SQL Editor run:
              <div className="p-2.5 my-1.5 rounded-lg bg-[#FAF8F5] border border-[#E2DDD2] font-mono-code text-[11px] text-[#181A18] overflow-x-auto">
                insert into public.admin_users (id, email) values ('YOUR_USER_UUID', 'YOUR_EMAIL');
              </div>
            </li>
            <li className="leading-relaxed">
              <strong className="text-[#181A18]">Configure Environment:</strong> In your project root, create a file named{' '}
              <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border font-mono-code">.env</code> containing:
              <div className="p-2.5 my-1.5 rounded-lg bg-[#FAF8F5] border border-[#E2DDD2] font-mono-code text-[11px] text-[#181A18] overflow-x-auto space-y-0.5">
                <div>VITE_SUPABASE_URL=https://your-project-id.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=your-anon-public-key</div>
                <div>VITE_ADMIN_EMAIL=your-admin-email</div>
              </div>
            </li>
          </ol>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full pt-6 text-center text-xs text-[#7A807A]">
        Portfolio CMS • Protected Single-Admin Access
      </div>
    </div>
  );
};
