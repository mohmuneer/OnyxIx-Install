'use client';

import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PanelRightClose } from 'lucide-react';

interface EditorSidebarProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  width?: string;
}

export function EditorSidebar({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  width = 'w-[480px]',
}: EditorSidebarProps) {
  const { isRTL } = useLocale();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={cn(
          'fixed top-0 z-50 h-full max-w-[90vw] bg-background border-l shadow-2xl transition-transform duration-300 ease-in-out flex flex-col',
          width,
          isRTL ? 'left-0 border-r border-l-0' : 'right-0',
          open ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center justify-between p-4 border-b shrink-0', isRTL && 'flex-row-reverse')}>
          <h2 className="text-sm font-bold truncate">{title}</h2>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0" onClick={onClose}>
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Optional footer */}
        {footer && (
          <>
            <Separator />
            <div className={cn('p-4 shrink-0 flex items-center gap-2', isRTL && 'flex-row-reverse')}>
              {footer}
            </div>
          </>
        )}
      </div>
    </>
  );
}
