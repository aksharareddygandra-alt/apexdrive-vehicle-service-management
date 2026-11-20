import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, Wrench } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => { ok: boolean; error?: string };
  onNavigate: (view: 'home' | 'register' | 'track') => void;
}

export function LoginView({ onLogin, onNavigate }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    const result = onLogin(email, password);
    if (!result.ok && result.error) {
      setError(result.error);
    }
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-lg font-display font-bold text-white cursor-pointer"
          >
            <Wrench className="w-5 h-5 text-orange-500" />
            <span>ApexDrive Service</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Portal Sign In</h1>
          <p className="text-sm text-slate-600 mb-6">
            Access your customer garage or workshop administrator console.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="loginEmail" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Email Address
              </label>
              <input
                id="loginEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
              />
            </div>

            <div>
              <label htmlFor="loginPassword" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Credentials for College Viva */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500 mb-3">
              Demonstration Accounts (Click to Autofill)
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fillDemo('rahul@example.com', 'Customer@123')}
                className="p-2.5 text-left border border-slate-200 hover:border-orange-500 rounded-lg bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-900">Customer Demo</div>
                <div className="text-[11px] font-mono text-slate-600 truncate">rahul@example.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@apexdrive.com', 'Admin@123')}
                className="p-2.5 text-left border border-slate-200 hover:border-orange-500 rounded-lg bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-slate-900">Admin Demo</div>
                <div className="text-[11px] font-mono text-slate-600 truncate">admin@apexdrive.com</div>
              </button>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-600 text-center">
            New customer?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              Register an account
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

interface RegisterViewProps {
  onRegister: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => { ok: boolean; error?: string };
  onNavigate: (view: 'home' | 'login') => void;
}

export function RegisterView({ onRegister, onNavigate }: RegisterViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = onRegister({ fullName, email, phone, password });
    if (!res.ok) {
      setError(res.error || 'Registration failed.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-lg font-display font-bold text-white cursor-pointer"
          >
            <Wrench className="w-5 h-5 text-orange-500" />
            <span>ApexDrive Service</span>
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="text-sm font-medium text-slate-300 hover:text-white cursor-pointer"
          >
            Already registered? Sign In
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-8">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">
            Customer Registration
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            Create your account to register vehicles and schedule workshop services.
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Account Created Successfully</span>
              </div>
              <p className="text-sm">
                Your customer record has been saved. You can now sign in to manage your vehicles and book appointments.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg cursor-pointer"
              >
                Proceed to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="regName" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Full Name
                </label>
                <input
                  id="regName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Kulkarni"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="regEmail" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="regEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label htmlFor="regPhone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="regPhone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="regPass" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Password
                  </label>
                  <input
                    id="regPass"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
                <div>
                  <label htmlFor="regConfirm" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    id="regConfirm"
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Create Customer Account
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
