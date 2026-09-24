'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
  const router = useRouter();
  const [currentVersion, setCurrentVersion] = useState<any>(null);
  
  // Form State
  const [versionName, setVersionName] = useState('');
  const [versionCode, setVersionCode] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [apkFile, setApkFile] = useState<File | null>(null);
  
  // Status State
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchCurrentVersion();
  }, [router]);

  const fetchCurrentVersion = async () => {
    try {
      const res = await fetch('/api/version');
      if (res.ok) {
        const data = await res.json();
        setCurrentVersion(data.version);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkFile) {
      setError('Please select an APK file to upload.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('versionName', versionName);
    formData.append('versionCode', versionCode);
    formData.append('releaseNotes', releaseNotes);
    formData.append('isMandatory', isMandatory ? 'true' : 'false');
    formData.append('apk', apkFile);

    try {
      const res = await fetch('/api/admin/upload-apk', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('APK Uploaded and Published Successfully!');
        setCurrentVersion(data.version);
        setVersionName('');
        setVersionCode('');
        setReleaseNotes('');
        setIsMandatory(false);
        setApkFile(null);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
      {/* Sidebar */}
      <div className="w-[260px] bg-[#0c1a35] text-white flex flex-col justify-between hidden md:flex shrink-0">
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="bg-blue-500 p-1.5 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DailySave</h1>
            <p className="text-[9px] tracking-widest text-blue-300 uppercase mt-0.5">Save • Grow • Achieve</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl text-white font-medium">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Users
            </div>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Savings
            </div>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Loans
            </div>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Reports
            </div>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href="#" className="flex items-center justify-between px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </div>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden group hover:bg-white/10 transition cursor-pointer" onClick={handleLogout}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 bg-slate-300 rounded-full flex justify-center items-center overflow-hidden">
              <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Admin</p>
              <p className="text-xs text-slate-400">Log out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-8 shrink-0 sticky top-0 z-50">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input type="text" placeholder="Search anything..." className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 transition" />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <div className="flex items-center gap-2 cursor-pointer pl-4 border-l border-slate-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex justify-center items-center text-blue-600 font-bold text-sm">
                A
              </div>
              <span className="text-sm font-semibold text-slate-700">Admin</span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 pb-12 max-w-[1400px] w-full mx-auto">
          
          <div className="flex gap-8">
            
            {/* Left Column (Main Dash) */}
            <div className="flex-1 space-y-6">
              
              {/* Welcome Banner */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Welcome Back,</h2>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold text-slate-900">Admin</h1>
                      <span className="text-2xl">👋</span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Manage your platform, track progress and help users build a better financial future.</p>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <div className="text-sm font-medium text-slate-600">
                    <div>Saturday, Sep 24, 2026</div>
                    <div className="text-xs text-slate-400">10:04 AM</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                    <span className="font-semibold text-slate-600 text-sm">Total Users</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">1,248</div>
                  <div className="flex items-center gap-1 text-sm"><span className="text-emerald-500 font-semibold flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>12%</span><span className="text-slate-400">vs. last month</span></div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                    <span className="font-semibold text-slate-600 text-sm">Total Savings</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">₹ 8,45,320</div>
                  <div className="flex items-center gap-1 text-sm"><span className="text-emerald-500 font-semibold flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>18%</span><span className="text-slate-400">vs. last month</span></div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <span className="font-semibold text-slate-600 text-sm">Active Loans</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">86</div>
                  <div className="flex items-center gap-1 text-sm"><span className="text-emerald-500 font-semibold flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>6%</span><span className="text-slate-400">vs. last month</span></div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
                    <span className="font-semibold text-slate-600 text-sm">Monthly Growth</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">₹ 1,32,450</div>
                  <div className="flex items-center gap-1 text-sm"><span className="text-emerald-500 font-semibold flex items-center"><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>24%</span><span className="text-slate-400">vs. last month</span></div>
                </div>
              </div>

              {/* Bottom Charts & Activity Area */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* Chart Placeholder */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Savings Overview</h3>
                      <p className="text-slate-500 text-xs mt-1">Monthly savings trend for the last 6 months</p>
                    </div>
                    <div className="px-3 py-1 border border-slate-200 rounded text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer">
                      Last 6 Months <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end relative h-48 border-l border-b border-slate-200 p-2">
                    {/* SVG Line Chart Placeholder */}
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                      <path d="M0,130 C50,110 100,70 150,80 C200,90 250,50 300,40 C350,30 400,10 400,10" fill="none" stroke="#3b82f6" strokeWidth="3" />
                      <path d="M0,130 C50,110 100,70 150,80 C200,90 250,50 300,40 C350,30 400,10 400,10 L400,150 L0,150 Z" fill="url(#blue-gradient)" opacity="0.2" />
                      <defs>
                        <linearGradient id="blue-gradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      <circle cx="0" cy="130" r="4" fill="#3b82f6" />
                      <circle cx="150" cy="80" r="4" fill="#3b82f6" />
                      <circle cx="300" cy="40" r="4" fill="#3b82f6" />
                      <circle cx="400" cy="10" r="4" fill="#3b82f6" />
                    </svg>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-xl mt-6 border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">Your savings have grown by 24% this month!</p>
                      <p className="text-xs text-blue-500 mt-0.5">Keep up the great work!</p>
                    </div>
                    <span className="text-2xl">🎉</span>
                  </div>
                </div>

                {/* Latest Activity List */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <h3 className="font-bold text-slate-800 text-lg">Latest Activity</h3>
                    </div>
                    <a href="#" className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">View All <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></a>
                  </div>
                  
                  <div className="space-y-6 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">New user registered</p>
                        <p className="text-xs text-slate-500">Rahul Patel joined the platform</p>
                      </div>
                      <span className="text-xs text-slate-400">2 hours ago</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex justify-center items-center shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">Savings updated</p>
                        <p className="text-xs text-slate-500">₹ 5,000 added by Neha Shah</p>
                      </div>
                      <span className="text-xs text-slate-400">4 hours ago</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex justify-center items-center shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">Loan request approved</p>
                        <p className="text-xs text-slate-500">Loan of ₹ 25,000 approved for Amit Kumar</p>
                      </div>
                      <span className="text-xs text-slate-400">6 hours ago</span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex justify-center items-center shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg></div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">System update</p>
                        <p className="text-xs text-slate-500">Platform updated to version 1.0.5</p>
                      </div>
                      <span className="text-xs text-slate-400">8 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Settings Form) */}
            <div className="w-[360px] shrink-0">
              
              {/* Blue Portal Header */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-md text-white mb-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Admin Portal</h2>
                </div>
                <p className="text-blue-100 text-sm font-medium relative z-10">Manage and publish updates</p>
              </div>

              {/* Functional Settings Block */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                
                {/* Current Version */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Current Live Version</h3>
                  {currentVersion ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">v{currentVersion.versionName}</span>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded">Latest</span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-500 italic">No versions published yet.</div>
                  )}
                </div>

                <hr className="border-slate-100 mb-8" />

                {/* Form */}
                <h3 className="text-sm font-bold text-slate-800 mb-4">Publish New Update</h3>
                
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-medium">{error}</div>}
                {message && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-4 text-xs font-medium">{message}</div>}

                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Version Name (e.g. 1.0.5)</label>
                    <input 
                      type="text" required 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                      value={versionName} onChange={(e) => setVersionName(e.target.value)}
                      placeholder="Enter version name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Version Code (integer, e.g. 5)</label>
                    <input 
                      type="number" required 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                      value={versionCode} onChange={(e) => setVersionCode(e.target.value)}
                      placeholder="Enter version code"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Release Notes</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
                      value={releaseNotes} onChange={(e) => setReleaseNotes(e.target.value)}
                      placeholder="What's new in this update?"
                    />
                  </div>

                  <div className="flex items-center pt-1 pb-1">
                    <input 
                      type="checkbox" 
                      id="mandatory"
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={isMandatory} onChange={(e) => setIsMandatory(e.target.checked)}
                    />
                    <label htmlFor="mandatory" className="text-xs font-semibold text-slate-700 cursor-pointer">Force Mandatory Update?</label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">APK File</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2 px-4 rounded-lg transition-colors border border-blue-200">
                        Choose file
                        <input 
                          type="file" required accept=".apk" className="hidden"
                          onChange={(e) => setApkFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      <span className="text-xs text-slate-500 max-w-[120px] truncate">
                        {apkFile ? apkFile.name : 'No file chosen'}
                      </span>
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={isLoading}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-6 flex justify-center items-center gap-2 shadow-md shadow-blue-500/20"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        Publish Update
                      </>
                    )}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
