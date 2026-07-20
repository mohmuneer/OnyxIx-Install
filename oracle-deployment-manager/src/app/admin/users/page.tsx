'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Shield, UserCog, Users,
  Mail, User as UserIcon, Clock, Search, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/use-locale';
import { useAuthStore, loadAuthFromStorage } from '@/stores/auth-store';
import { useRegistrationStore, type RegistrationRequest, type ApprovedUser } from '@/stores/registration-store';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'pending' | 'approved';

type Row = {
  id: string;
  email: string;
  username: string;
  role: string;
  status: 'pending' | 'approved';
  createdAt: number;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const { isRTL, formatDate } = useLocale();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: 'reject' | 'remove'; id: string } | null>(null);

  const role = useAuthStore((s) => s.role);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const login = useAuthStore((s) => s.login);

  const pendingRequests = useRegistrationStore((s) => s.pendingRequests);
  const approvedUsers = useRegistrationStore((s) => s.approvedUsers);
  const loadFromStorage = useRegistrationStore((s) => s.loadFromStorage);
  const approveRequest = useRegistrationStore((s) => s.approveRequest);
  const rejectRequest = useRegistrationStore((s) => s.rejectRequest);
  const removeUser = useRegistrationStore((s) => s.removeUser);

  useEffect(() => {
    loadFromStorage();
    const stored = loadAuthFromStorage();
    if (stored.role) {
      login(stored.username, stored.role);
    }
    if (stored.role === 'admin') {
      setAuthorized(true);
    }
    setChecking(false);
  }, [loadFromStorage, login]);

  useEffect(() => {
    if (!checking && !authorized && isLoggedIn) {
      router.replace('/dashboard');
    }
    if (!checking && !authorized && !isLoggedIn) {
      router.replace('/login');
    }
  }, [checking, authorized, isLoggedIn, router]);

  const rows: Row[] = useMemo(() => {
    const pending: Row[] = pendingRequests.map((r) => ({
      id: r.id,
      email: r.email,
      username: r.username,
      role: r.requestedRole,
      status: 'pending' as const,
      createdAt: r.createdAt,
    }));
    const approved: Row[] = approvedUsers.map((u) => ({
      id: u.email,
      email: u.email,
      username: u.username,
      role: u.role,
      status: 'approved' as const,
      createdAt: 0,
    }));
    return [...pending, ...approved];
  }, [pendingRequests, approvedUsers]);

  const filtered = useMemo(() => {
    let list = rows;
    if (tab === 'pending') list = list.filter((r) => r.status === 'pending');
    if (tab === 'approved') list = list.filter((r) => r.status === 'approved');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.email.toLowerCase().includes(q) || r.username.toLowerCase().includes(q));
    }
    return list;
  }, [rows, tab, search]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'pending', label: isRTL ? 'قيد الانتظار' : 'Pending', count: pendingRequests.length },
    { key: 'approved', label: isRTL ? 'معتمد' : 'Approved', count: approvedUsers.length },
    { key: 'all', label: isRTL ? 'الكل' : 'All', count: rows.length },
  ];

  if (checking || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F17]">
        <div className="h-8 w-8 border-2 border-[#18B13A]/30 border-t-[#18B13A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isRTL ? 'إدارة المستخدمين' : 'User Management'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isRTL ? 'إدارة واعتماد طلبات التسجيل' : 'Manage and approve registration requests'}
          </p>
        </div>
        <Badge variant="outline" className="text-xs text-[#18B13A] border-[#18B13A]/20 bg-[#18B13A]/5">
          <Shield className="h-3 w-3 ms-1" />
          {isRTL ? 'مدير النظام' : 'Administrator'}
        </Badge>
      </div>

      <Card className="glass-card border-white/5">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
                    tab === t.key
                      ? 'bg-[#18B13A]/10 text-[#18B13A]'
                      : 'text-slate-500 hover:text-slate-300'
                  )}
                >
                  {t.label}
                  <span className={cn(
                    'ms-1.5 text-[10px] px-1.5 py-0.5 rounded-full',
                    tab === t.key ? 'bg-[#18B13A]/15 text-[#18B13A]' : 'bg-white/[0.06] text-slate-500'
                  )}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isRTL ? 'بحث بالبريد أو الاسم' : 'Search email or name'}
                className="h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 text-xs rounded-xl ps-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-8 w-8 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                {search
                  ? (isRTL ? 'لا توجد نتائج للبحث' : 'No results found')
                  : (isRTL ? 'لا يوجد مستخدمون' : 'No users')
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className={cn('py-3 px-4 text-xs font-medium text-slate-500', isRTL ? 'text-end' : 'text-start')}>
                      {isRTL ? 'المستخدم' : 'User'}
                    </th>
                    <th className={cn('py-3 px-4 text-xs font-medium text-slate-500', isRTL ? 'text-end' : 'text-start')}>
                      {isRTL ? 'البريد الإلكتروني' : 'Email'}
                    </th>
                    <th className={cn('py-3 px-4 text-xs font-medium text-slate-500', isRTL ? 'text-end' : 'text-start')}>
                      {isRTL ? 'الدور' : 'Role'}
                    </th>
                    <th className={cn('py-3 px-4 text-xs font-medium text-slate-500', isRTL ? 'text-end' : 'text-start')}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={cn('py-3 px-4 text-xs font-medium text-slate-500', isRTL ? 'text-end' : 'text-start')}>
                      {isRTL ? 'الاعتماد' : 'Approval'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                            row.role === 'admin' ? 'bg-[#18B13A]/10' : 'bg-blue-500/10'
                          )}>
                            {row.role === 'admin'
                              ? <UserCog className="h-4 w-4 text-[#18B13A]" />
                              : <UserIcon className="h-4 w-4 text-blue-400" />
                            }
                          </div>
                          <span className="text-sm font-medium text-white">{row.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-400">{row.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={cn(
                          'text-[10px]',
                          row.role === 'admin'
                            ? 'text-[#18B13A] border-[#18B13A]/20 bg-[#18B13A]/5'
                            : 'text-blue-400 border-blue-500/20 bg-blue-500/5'
                        )}>
                          {row.role === 'admin'
                            ? (isRTL ? 'مدير' : 'Admin')
                            : (isRTL ? 'مستخدم' : 'User')
                          }
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {row.status === 'pending' ? (
                          <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/5">
                            <Clock className="h-3 w-3 ms-1" />
                            {isRTL ? 'قيد الانتظار' : 'Pending'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-[#18B13A] border-[#18B13A]/20 bg-[#18B13A]/5">
                            <CheckCircle className="h-3 w-3 ms-1" />
                            {isRTL ? 'معتمد' : 'Approved'}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {row.status === 'pending' ? (
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => approveRequest(row.id)}
                              className="h-7 text-[11px] bg-[#18B13A]/10 hover:bg-[#18B13A]/20 text-[#18B13A] border border-[#18B13A]/20 rounded-lg px-2.5"
                            >
                              <CheckCircle className="h-3 w-3 ms-1" />
                              {isRTL ? 'اعتماد' : 'Approve'}
                            </Button>
                            {confirmAction?.type === 'reject' && confirmAction.id === row.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => { rejectRequest(row.id); setConfirmAction(null); }}
                                  className="h-7 text-[11px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg px-2"
                                >
                                  {isRTL ? 'تأكيد' : 'Yes'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmAction(null)}
                                  className="h-7 text-[11px] text-slate-500 rounded-lg px-2"
                                >
                                  {isRTL ? 'إلغاء' : 'No'}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setConfirmAction({ type: 'reject', id: row.id })}
                                className="h-7 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg px-2"
                              >
                                <XCircle className="h-3 w-3 ms-1" />
                                {isRTL ? 'رفض' : 'Reject'}
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {confirmAction?.type === 'remove' && confirmAction.id === row.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => { removeUser(row.id); setConfirmAction(null); }}
                                  className="h-7 text-[11px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg px-2"
                                >
                                  {isRTL ? 'تأكيد' : 'Yes'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmAction(null)}
                                  className="h-7 text-[11px] text-slate-500 rounded-lg px-2"
                                >
                                  {isRTL ? 'إلغاء' : 'No'}
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setConfirmAction({ type: 'remove', id: row.id })}
                                className="h-7 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                              >
                                <ToggleRight className="h-4 w-4 ms-1" />
                                {isRTL ? 'إلغاء الاعتماد' : 'Revoke'}
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
