'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function CanEdit({ children }: { children: ReactNode }) {
  const canEdit = useAuthStore((s) => s.canEdit());
  if (!canEdit) return null;
  return <>{children}</>;
}
