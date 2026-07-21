'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { useAuthStore, loadAuthFromStorage } from '@/stores/auth-store';
import { useBrandingStore } from '@/stores/branding-store';

function Particles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; size: number; duration: number; delay: number; opacity: number }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.3 + 0.05,
      }))
    );
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            animation: `pulse ${p.duration}s ease-in-out ${p.delay}s infinite`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(37, 99, 235, ${p.opacity})`,
          }}
        />
      ))}
    </div>
  );
}

const FONT = "'Cairo', 'IBM Plex Sans Arabic', system-ui, sans-serif";

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '56px',
  padding: '0 44px 0 16px',
  borderRadius: '16px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#ffffff',
  fontSize: '16px',
  fontFamily: FONT,
  fontWeight: 600,
  direction: 'rtl',
  textAlign: 'right',
  unicodeBidi: 'plaintext',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'right',
  fontSize: '14px',
  fontWeight: 600,
  color: '#cbd5e1',
  fontFamily: FONT,
  marginBottom: '8px',
};

const iconWrapStyle: React.CSSProperties = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: '#64748b',
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isRTL } = useLocale();
  const { login } = useAuthStore();
  const config = useBrandingStore((s) => s.config);

  useEffect(() => {
    const stored = loadAuthFromStorage();
    if (stored.role) {
      login(stored.username, stored.role, stored.userId);
      router.replace('/dashboard');
    }
  }, [login, router]);

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      login(data.user.username, data.user.role as 'admin' | 'user', data.user.id);
      router.push('/dashboard');
    } catch {
      setError(isRTL ? 'حدث خطأ في الاتصال' : 'Connection error');
      setLoading(false);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div dir="rtl" lang="ar" style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#020617' }}>

      {/* Background layers */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(37,99,235,0.12), transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 30% 70%, rgba(7,27,52,0.8), transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 40% at 70% 20%, rgba(4,17,29,0.6), transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <Particles />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '32px 16px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, filter: 'blur(48px)', opacity: 0.3, background: 'radial-gradient(circle, rgba(37,99,235,0.5), transparent 70%)', transform: 'scale(2)' }} />
            {config.logo?.logoUrl ? (
              <img
                src={config.logo.logoUrl}
                alt="Onyx IX"
                style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '16px', objectFit: 'contain', boxShadow: '0 0 40px rgba(37,99,235,0.25)' }}
              />
            ) : (
              <div
                style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(37,99,235,0.3)',
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                }}
              >
                <Database style={{ width: '40px', height: '40px', color: 'white' }} />
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'white', fontFamily: FONT, margin: 0 }}>
              {config.logo?.systemName || 'Onyx IX'}
            </h1>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px', fontFamily: FONT, fontWeight: 600, margin: '4px 0 0 0' }}>
              {config.logo?.companyName || 'Ultimate Solutions'}
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeUp 0.5s ease-out 0.15s both' }}>
          <div
            style={{
              borderRadius: '24px',
              padding: '32px',
              background: 'rgba(10,15,35,0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}
          >
            {/* Card header */}
            <div style={{ textAlign: 'right', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'white', fontFamily: FONT, margin: 0 }}>
                {isRTL ? 'تسجيل الدخول' : 'Sign In'}
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px', fontFamily: FONT, fontWeight: 600, margin: '8px 0 0 0' }}>
                {isRTL ? 'أدخل اسم المستخدم وكلمة المرور للوصول إلى النظام' : 'Enter your username and password to access the system'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Username */}
              <div>
                <label style={labelStyle}>
                  {isRTL ? 'اسم المستخدم أو البريد' : 'Username or Email'}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapStyle}>
                    <User style={{ width: '18px', height: '18px' }} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isRTL ? 'أدخل اسم المستخدم أو البريد' : 'Enter username or email'}
                    dir="rtl"
                    autoComplete="username"
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapStyle}>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                      aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                    dir="rtl"
                    autoComplete="current-password"
                    style={inputStyle}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    textAlign: 'right',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#f87171',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    fontFamily: FONT,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '16px',
                  border: 'none',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 700,
                  fontFamily: FONT,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                  boxShadow: '0 4px 20px rgba(37,99,235,0.35), 0 0 0 1px rgba(37,99,235,0.2) inset',
                  transition: 'transform 0.2s, opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  direction: 'rtl',
                }}
              >
                {loading ? (
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto' }} />
                ) : (
                  <>
                    <span>{isRTL ? 'دخول' : 'Sign In'}</span>
                    <ArrowLeft style={{ width: '16px', height: '16px', transform: 'scaleX(-1)' }} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'right' }}>
              <p style={{ fontSize: '14px', color: '#64748b', fontFamily: FONT, fontWeight: 600, margin: 0 }}>
                {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
                <a
                  href="/register"
                  style={{ fontWeight: 700, color: '#3B82F6', fontFamily: FONT, textDecoration: 'none', transition: 'text-decoration 0.2s' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none'; }}
                >
                  {isRTL ? 'تسجيل جديد' : 'Register'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
