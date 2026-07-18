'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { DeploymentGuide } from '@/components/guide/deployment-guide';

export default function TemplatesPage() {
  return (
    <AppLayout>
      <div className="us-page-bg min-h-screen">
        <DeploymentGuide />
      </div>
    </AppLayout>
  );
}
