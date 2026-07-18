'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { SmartEditor } from '@/components/editor/smart-editor';

export default function EditorPage() {
  return (
    <AppLayout>
      <div className="us-page-bg min-h-screen">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Smart Editor</h1>
          <p className="text-slate-500">Professional text editor with syntax highlighting</p>
        </div>
        <SmartEditor />
      </div>
      </div>
    </AppLayout>
  );
}
