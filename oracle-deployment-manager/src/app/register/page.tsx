'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Mail, User, Lock, ArrowLeft, CheckCircle, Shield, Server, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isRTL } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email');
      return;
    }
    if (!username.trim()) {
      setError(isRTL ? 'يرجى إدخال اسم المستخدم' : 'Please enter username');
      return;
    }
    if (!password.trim()) {
      setError(isRTL ? 'يرجى إدخال كلمة المرور' : 'Please enter password');
      return;
    }
    if (password.length < 4) {
      setError(isRTL ? 'كلمة المرور قصيرة جداً (4 أحرف على الأقل)' : 'Password too short (min 4 characters)');
      return;
    }
    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمة المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), username: username.trim(), password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setDone(true);
      setLoading(false);
    } catch {
      setError(isRTL ? 'حدث خطأ في الاتصال' : 'Connection error');
      setLoading(false);
    }
  };

  const features = [
    { icon: Server, title: isRTL ? 'إدارة الخوادم' : 'Server Management', desc: isRTL ? 'مراقبة وإدارة خوادم' : 'Monitor & manage servers' },
    { icon: Shield, title: isRTL ? 'صلاحيات متعددة' : 'Multi-level Roles', desc: isRTL ? 'مدير نظام ومستخدم عادي' : 'Admin and normal user' },
    { icon: Globe, title: isRTL ? 'منصة موحدة' : 'Unified Platform', desc: isRTL ? 'كل أدواتك في مكان واحد' : 'All tools in one place' },
  ];

  const LogoBlock = ({ size }: { size: 'sm' | 'lg' }) => {
    const dim = size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
    const iconDim = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
    const textDim = size === 'lg' ? 'text-2xl' : 'text-base';
    const subDim = size === 'lg' ? 'text-sm' : 'text-[10px]';

    return (
      <div className={cn('flex items-center gap-3', isRTL ? 'flex-row-reverse' : 'flex-row')}>
        <div
          className={cn(dim, 'rounded-2xl bg-gradient-to-br from-[var(--brand-primary,#2563EB)] to-[var(--brand-sidebar-active,#3B82F6)] flex items-center justify-center shadow-xl')}
          style={{ boxShadow: `0 8px 24px var(--brand-primary,#2563EB)33` }}
        >
          <Database className={cn(iconDim, 'text-white')} />
        </div>
        <div className={isRTL ? 'text-end' : 'text-start'}>
          <h1 className={cn(textDim, 'font-bold text-white')}>Onyx IX</h1>
          <p className={cn(subDim, 'text-slate-500')}>{isRTL ? 'متطلبات التركيب' : 'Installation Requirements'}</p>
        </div>
      </div>
    );
  };

  if (done) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen us-login-bg flex items-center justify-center p-4 relative overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--brand-primary,#2563EB)]/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#3A3A96]/[0.05] blur-[80px]" />
        </div>
        <div className="w-full max-w-md animate-fadeIn">
          <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/40 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand-success,#22C55E)]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-[var(--brand-success,#22C55E)]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {isRTL ? 'تم إرسال الطلب' : 'Request Submitted'}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {isRTL
                ? 'سيتم مراجعة طلبك من قبل مدير النظام. سيتم تفعيل حسابك بعد الموافقة.'
                : 'Your request will be reviewed by the administrator. Your account will be activated upon approval.'}
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="h-11 bg-gradient-to-r from-[var(--brand-primary,#2563EB)] to-[var(--brand-sidebar-active,#3B82F6)] text-white font-semibold rounded-xl shadow-lg"
              style={{ boxShadow: '0 4px 14px var(--brand-primary,#2563EB)33' }}
            >
              <span className={cn('flex items-center gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
                <ArrowLeft className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen us-login-bg flex items-center justify-center p-4 sm:p-6 relative overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--brand-primary,#2563EB)]/[0.04] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#3A3A96]/[0.05] blur-[80px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/[0.03] blur-[60px]" />
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">

        <div className="hidden lg:flex flex-col flex-1 gap-10 animate-slideIn">
          <div className={cn('space-y-4', isRTL ? 'text-end' : 'text-start')}>
            <LogoBlock size="lg" />
            <h2 className="text-4xl font-bold text-white leading-tight">
              {isRTL ? 'طلب تسجيل جديد' : 'New Registration'}
              <br />
              <span style={{ color: 'var(--brand-primary, #2563EB)' }}>
                {isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-md">
              {isRTL
                ? 'قم بإنشاء حساب جديد وسيتم تفعيله بعد موافقة مدير النظام.'
                : 'Create a new account. It will be activated after administrator approval.'}
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm animate-fadeUp',
                  isRTL ? 'flex-row-reverse' : 'flex-row'
                )}
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-primary,#2563EB)]/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-[var(--brand-primary,#2563EB)]" />
                </div>
                <div className={cn('min-w-0', isRTL ? 'text-end' : 'text-start')}>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-slate-500 truncate">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <LogoBlock size="sm" />
          </div>

          <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/40 p-6 sm:p-8">
            <div className={cn('space-y-1 mb-6', isRTL ? 'text-end' : 'text-start')}>
              <h2 className="text-xl font-bold text-white">
                {isRTL ? 'إنشاء حساب' : 'Create Account'}
              </h2>
              <p className="text-sm text-slate-500">
                {isRTL ? 'أدخل بياناتك لإنشاء حساب جديد' : 'Enter your details to create a new account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className={cn('text-xs font-medium text-slate-400', isRTL ? 'text-end block' : 'text-start block')}>
                  {isRTL ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <div className="relative">
                  <Mail className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600', isRTL ? 'end-3' : 'start-3')} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={cn(
                      'h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl',
                      'focus:border-[var(--brand-primary,#2563EB)]/40 focus:ring-[var(--brand-primary,#2563EB)]/20',
                      isRTL ? 'text-end pe-10' : 'text-start ps-10'
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={cn('text-xs font-medium text-slate-400', isRTL ? 'text-end block' : 'text-start block')}>
                  {isRTL ? 'اسم المستخدم' : 'Username'}
                </Label>
                <div className="relative">
                  <User className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600', isRTL ? 'end-3' : 'start-3')} />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={cn(
                      'h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl',
                      'focus:border-[var(--brand-primary,#2563EB)]/40 focus:ring-[var(--brand-primary,#2563EB)]/20',
                      isRTL ? 'text-end pe-10' : 'text-start ps-10'
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={cn('text-xs font-medium text-slate-400', isRTL ? 'text-end block' : 'text-start block')}>
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Lock className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600', isRTL ? 'end-3' : 'start-3')} />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={cn(
                      'h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl',
                      'focus:border-[var(--brand-primary,#2563EB)]/40 focus:ring-[var(--brand-primary,#2563EB)]/20',
                      isRTL ? 'text-end pe-10' : 'text-start ps-10'
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={cn('text-xs font-medium text-slate-400', isRTL ? 'text-end block' : 'text-start block')}>
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </Label>
                <div className="relative">
                  <Lock className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600', isRTL ? 'end-3' : 'start-3')} />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={isRTL ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={cn(
                      'h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 rounded-xl',
                      'focus:border-[var(--brand-primary,#2563EB)]/40 focus:ring-[var(--brand-primary,#2563EB)]/20',
                      isRTL ? 'text-end pe-10' : 'text-start ps-10'
                    )}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full h-12 font-semibold rounded-xl shadow-lg transition-all duration-200',
                  'bg-gradient-to-r from-[var(--brand-primary,#2563EB)] to-[var(--brand-sidebar-active,#3B82F6)]',
                  'hover:shadow-[var(--brand-primary,#2563EB)]/40 text-white'
                )}
                style={{ boxShadow: '0 4px 14px var(--brand-primary,#2563EB)33' }}
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className={cn('flex items-center justify-center gap-2', isRTL ? 'flex-row-reverse' : 'flex-row')}>
                    {isRTL ? 'إرسال الطلب' : 'Submit Request'}
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className={cn('mt-6 pt-6 border-t border-white/[0.06]', isRTL ? 'text-end' : 'text-start')}>
              <p className="text-sm text-slate-500">
                {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
                <Link
                  href="/login"
                  className="font-medium transition-colors"
                  style={{ color: 'var(--brand-primary, #2563EB)' }}
                >
                  {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
