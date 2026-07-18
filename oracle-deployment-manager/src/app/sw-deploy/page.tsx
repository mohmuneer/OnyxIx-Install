'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { SwDeployWizard } from '@/components/sw-deploy/sw-deploy-wizard';

export default function SwDeployPage() {
  return (
    <AppLayout>
      <div className="us-page-bg min-h-screen">
        <SwDeployWizard />
      </div>
    </AppLayout>
  );
}
