'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { QuestionnaireForm } from '@/components/questionnaire/questionnaire-form';

export default function QuestionnairePage() {
  return (
    <AppLayout>
      <div className="us-page-bg min-h-screen">
        <QuestionnaireForm />
      </div>
    </AppLayout>
  );
}
