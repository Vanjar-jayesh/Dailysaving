'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role === 'admin') {
          localStorage.setItem('adminToken', data.token);
          router.push('/admin/settings');
        } else {
          setError('Access denied. Admin role required.');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Dark Blue Section */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#102754] via-[#091b40] to-[#050e26] p-12 text-white relative overflow-hidden">
        
        {/* Subtle Background Shapes (Abstract) */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1a4491] opacity-20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#0c2f70] opacity-30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-blue-500 p-2 rounded-xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">DailySave</h1>
            <p className="text-[10px] tracking-widest text-blue-300 uppercase mt-1">SAVE • GROW • ACHIEVE</p>
          </div>
        </div>

          <div className="z-10 mt-16 max-w-md relative flex-1">
            <h2 className="text-5xl font-bold leading-tight mb-6 text-white">
              Smarter Savings <br/> for a <span className="text-blue-400">Brighter Future</span>
            </h2>
            <p className="text-blue-200 text-lg mb-12 leading-relaxed max-w-sm">
              DailySave helps you build better money habits, track your savings and achieve your financial goals — one step at a time.
            </p>

            <div className="space-y-8 relative z-20">
            <div className="flex items-start gap-5">
              <div className="mt-1 bg-white/10 p-3 rounded-full border border-white/20">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Secure & Reliable</h3>
                <p className="text-blue-200 text-sm mt-1">Your data is always protected</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="mt-1 bg-white/10 p-3 rounded-full border border-white/20">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Fast & Simple</h3>
                <p className="text-blue-200 text-sm mt-1">Save time, save effort</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="mt-1 bg-white/10 p-3 rounded-full border border-white/20">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Better Financial Control</h3>
                <p className="text-blue-200 text-sm mt-1">Track. Plan. Grow.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Illustration Image - Floating at bottom right */}
        <div className="absolute bottom-16 right-0 w-[55%] max-w-[600px] hidden lg:block pointer-events-none z-0" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)' }}>
          <img src="/images/fintech-hero.png" alt="Fintech Growth Illustration" className="w-full h-auto mix-blend-screen opacity-90 translate-x-8" />
        </div>

        {/* Bottom Bar */}
        <div className="z-10 mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-blue-300 relative">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>Bank-Level Security<br/><span className="opacity-70 text-[10px]">256-bit Encryption</span></span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <span>Your Privacy Matters<br/><span className="opacity-70 text-[10px]">We never share your data</span></span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span>24/7 Support<br/><span className="opacity-70 text-[10px]">We're here for you</span></span>
          </div>
        </div>

      </div>

      {/* Right Panel - Login Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#f8fafc] relative">
        
        {/* Top Nav (Manage, Save, Grow) */}
        <div className="absolute top-8 right-12 hidden md:flex items-center gap-6 text-xs font-semibold text-slate-500 tracking-widest uppercase">
          <span className="hover:text-blue-600 cursor-pointer transition">Manage</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="hover:text-blue-600 cursor-pointer transition">Save</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="hover:text-blue-600 cursor-pointer transition">Grow</span>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          
          <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">DailySave</h2>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3">Admin Portal</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">
                Sign in to your account to access the dashboard and manage your system.
              </p>
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Extras */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer" />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-[0_8px_20px_-8px_rgba(37,99,235,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login to Dashboard</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Security Footer inside card */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs font-medium">Your information is secure and encrypted</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
