'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Database, Eye, EyeOff, ArrowRight, Shield, Server, Globe, UserCog, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocale } from '@/hooks/use-locale';
import { useAuthStore, loadAuthFromStorage } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isRTL } = useLocale();
  const { login, isLoggedIn } = useAuthStore();
  const { login: loginAction } = useAuthStore();

  useEffect(() => {
    const stored = loadAuthFromStorage();
    if (stored.role) {
      loginAction(stored.username, stored.role);
      router.replace('/dashboard');
    }
  }, [loginAction, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError(isRTL ? 'يرجى إدخال اسم المستخدم' : 'Please enter username');
      return;
    }
    if (!password.trim()) {
      setError(isRTL ? 'يرجى إدخال كلمة المرور' : 'Please enter password');
      return;
    }

    setLoading(true);
    const adminPass = selectedRole === 'admin' ? 'admin123' : '';
    const userPass = selectedRole === 'user' ? 'user123' : '';
    const expectedPass = selectedRole === 'admin' ? adminPass : userPass;

    setTimeout(() => {
      if (password === expectedPass) {
        login(username.trim(), selectedRole);
        router.push('/dashboard');
      } else {
        setError(isRTL ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
        setLoading(false);
      }
    }, 800);
  };

  const features = [
    { icon: Server, title: isRTL ? 'إدارة الخوادم' : 'Server Management', desc: isRTL ? 'مراقبة وإدارة خوادم' : 'Monitor & manage servers' },
    { icon: Shield, title: isRTL ? 'صلاحيات متعددة' : 'Multi-level Roles', desc: isRTL ? 'مدير نظام ومستخدم عادي' : 'Admin and normal user' },
    { icon: Globe, title: isRTL ? 'منصة موحدة' : 'Unified Platform', desc: isRTL ? 'كل أدواتك في مكان واحد' : 'All tools in one place' },
  ];

  const roles = [
    {
      id: 'admin' as const,
      icon: UserCog,
      label: isRTL ? 'مدير النظام' : 'Administrator',
      desc: isRTL ? 'صلاحية كاملة للتعديل والإدارة' : 'Full edit and manage access',
      passwordHint: isRTL ? 'كلمة المرور: admin123' : 'Password: admin123',
    },
    {
      id: 'user' as const,
      icon: UserIcon,
      label: isRTL ? 'مستخدم عادي' : 'Normal User',
      desc: isRTL ? 'صلاحية مشاهدة فقط بدون تعديل' : 'View-only, no edit access',
      passwordHint: isRTL ? 'كلمة المرور: user123' : 'Password: user123',
    },
  ];

  return (
    <div className="min-h-screen us-login-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#18B13A]/[0.03] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#3A3A96]/[0.05] blur-[80px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#38BDF8]/[0.03] blur-[60px]" />
      </div>

      <div className={cn('w-full max-w-5xl flex items-center gap-12 relative z-10', isRTL && 'flex-row-reverse')}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="hidden lg:flex flex-col flex-1 gap-10"
        >
          <div className={cn('space-y-4', isRTL && 'text-end')}>
            <div className={cn('flex items-center gap-3', isRTL && 'flex-row-reverse')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#18B13A] to-[#15803D] flex items-center justify-center shadow-xl shadow-[#18B13A]/20">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Onyx IX</h1>
                <p className="text-sm text-slate-500">{isRTL ? 'متطلبات التركيب' : 'Installation Requirements'}</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              {isRTL ? 'متطلبات تركيب' : 'Onyx IX'}
              <br />
              <span className="text-[#18B13A]">{isRTL ? 'نظام Onyx IX' : 'System Requirements'}</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md">
              {isRTL
                ? 'متطلبات تركيب نظام Onyx IX مع أدوات متقدمة للمراقبة والإدارة.'
                : 'Onyx IX System Installation Requirements with advanced monitoring and management tools.'
              }
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className={cn('flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm', isRTL && 'flex-row-reverse')}
              >
                <div className="w-10 h-10 rounded-xl bg-[#18B13A]/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-[#18B13A]" />
                </div>
                <div className={cn('min-w-0', isRTL && 'text-end')}>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs text-slate-500 truncate">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          <div className={cn('flex lg:hidden items-center gap-3 mb-8', isRTL && 'flex-row-reverse')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18B13A] to-[#15803D] flex items-center justify-center shadow-lg shadow-[#18B13A]/20">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Onyx IX</h1>
              <p className="text-[10px] text-slate-500">{isRTL ? 'متطلبات التركيب' : 'Requirements'}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/40 p-8">
            <div className={cn('space-y-1 mb-6', isRTL && 'text-end')}>
              <h2 className="text-xl font-bold text-white">
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </h2>
              <p className="text-sm text-slate-500">
                {isRTL ? 'اختر نوع المستخدم وأدخل البيانات' : 'Select role and enter credentials'}
              </p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roles.map((role) => {
                const RoleIcon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center',
                      isSelected
                        ? 'border-[#18B13A] bg-[#18B13A]/10 ring-1 ring-[#18B13A]/30'
                        : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                    )}
                  >
                    <RoleIcon className={cn('h-5 w-5', isSelected ? 'text-[#18B13A]' : 'text-slate-400')} />
                    <span className={cn('text-xs font-medium', isSelected ? 'text-[#18B13A]' : 'text-slate-300')}>
                      {role.label}
                    </span>
                    <span className="text-[9px] text-slate-500 leading-tight">{role.desc}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-400">
                  {isRTL ? 'اسم المستخدم' : 'Username'}
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
                  className="h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#18B13A]/40 focus:ring-[#18B13A]/20 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-slate-400">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                    className="h-11 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#18B13A]/40 focus:ring-[#18B13A]/20 rounded-xl pe-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-600 text-center">
                {selectedRole === 'admin'
                  ? (isRTL ? 'كلمة مرور المدير: admin123' : 'Admin password: admin123')
                  : (isRTL ? 'كلمة مرور المستخدم: user123' : 'User password: user123')
                }
              </p>

              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-[#18B13A] to-[#15803D] hover:from-[#15803D] hover:to-[#14702F] text-white font-semibold rounded-xl shadow-lg shadow-[#18B13A]/25 hover:shadow-[#18B13A]/40 transition-all duration-200"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                    {isRTL ? 'دخول' : 'Sign In'}
                    <ArrowRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-center text-[11px] text-slate-600">
                &copy; {new Date().getFullYear()} Onyx IX. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
