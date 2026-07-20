'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardList,
  FileText,
  FileSpreadsheet,
  Printer,
  Building2,
  Users,
  Database,
  Server,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

interface QuestionnaireField {
  id: string;
  labelAr: string;
  labelEn: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  options?: { ar: string; en: string }[];
  placeholder?: string;
}

interface QuestionnaireSection {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: any;
  fields: QuestionnaireField[];
}

const SECTIONS: QuestionnaireSection[] = [
  {
    id: 'client',
    titleAr: 'بيانات العميل',
    titleEn: 'Client Information',
    icon: Building2,
    fields: [
      { id: 'clientName', labelAr: 'اسم العميل / الشركة', labelEn: 'Client / Company Name', type: 'text' },
      { id: 'contactPerson', labelAr: 'المسؤول', labelEn: 'Contact Person', type: 'text' },
      { id: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email', type: 'text' },
      { id: 'phone', labelAr: 'رقم التواصل', labelEn: 'Phone', type: 'text' },
      { id: 'surveyDate', labelAr: 'تاريخ الاستبيان', labelEn: 'Survey Date', type: 'text' },
    ],
  },
  {
    id: 'systems',
    titleAr: 'الأنظمة والتطبيقات',
    titleEn: 'Systems & Applications',
    icon: ClipboardList,
    fields: [
      { id: 'requiredSystems', labelAr: 'الأنظمة المطلوبة', labelEn: 'Required Systems', type: 'textarea', placeholder: 'مثل: IX POS, IX Online, IX Reports...' },
      { id: 'mobileApps', labelAr: 'تطبيقات الموبايل المطلوبة', labelEn: 'Required Mobile Apps', type: 'textarea' },
      { id: 'mobileDevices', labelAr: 'عدد أجهزة الموبايل المتصلة', labelEn: 'Connected Mobile Devices', type: 'number' },
      { id: 'connectionType', labelAr: 'نوع الاتصال (داخلي / خارجي / كليهما)', labelEn: 'Connection Type (Internal / External / Both)', type: 'select', options: [{ ar: 'داخلي فقط', en: 'Internal Only' }, { ar: 'خارجي فقط', en: 'External Only' }, { ar: 'كليهما', en: 'Both' }] },
      { id: 'maxUsers', labelAr: 'الحد الأقصى للمستخدمين', labelEn: 'Maximum Users', type: 'number' },
      { id: 'concurrentUsers', labelAr: 'عدد المستخدمين المتصلين في نفس الوقت', labelEn: 'Concurrent Users', type: 'number' },
      { id: 'avgSessions', labelAr: 'متوسط عدد الجلسات المفتوحة بنفس الوقت', labelEn: 'Average Open Sessions', type: 'number' },
    ],
  },
  {
    id: 'business',
    titleAr: 'الهيكل التنظيمي',
    titleEn: 'Business Structure',
    icon: Users,
    fields: [
      { id: 'accountingUnits', labelAr: 'عدد الوحدات المحاسبية المنفصلة', labelEn: 'Separate Accounting Units', type: 'number' },
      { id: 'branches', labelAr: 'عدد الفروع', labelEn: 'Number of Branches', type: 'number' },
      { id: 'items', labelAr: 'عدد الأصناف', labelEn: 'Number of Items', type: 'number' },
      { id: 'employees', labelAr: 'عدد الموظفين', labelEn: 'Number of Employees', type: 'number' },
      { id: 'salaryItems', labelAr: 'عدد بنود الراتب', labelEn: 'Salary Items', type: 'number' },
      { id: 'warehouses', labelAr: 'عدد المخازن', labelEn: 'Number of Warehouses', type: 'number' },
      { id: 'assets', labelAr: 'عدد الأصول', labelEn: 'Number of Assets', type: 'number' },
    ],
  },
  {
    id: 'operations',
    titleAr: 'العمليات اليومية',
    titleEn: 'Daily Operations',
    icon: Database,
    fields: [
      { id: 'financialOps', labelAr: 'متوسط العمليات المالية في اليوم', labelEn: 'Avg Daily Financial Operations', type: 'number' },
      { id: 'inventoryOps', labelAr: 'متوسط العمليات المخزنية في اليوم', labelEn: 'Avg Daily Inventory Operations', type: 'number' },
      { id: 'adminOps', labelAr: 'متوسط العمليات الإدارية في اليوم', labelEn: 'Avg Daily Admin Operations', type: 'number' },
      { id: 'distributors', labelAr: 'عدد المندوبين (نظام التوزيع)', labelEn: 'Number of Distributors (Distribution)', type: 'number' },
    ],
  },
  {
    id: 'integration',
    titleAr: 'الربط والتكامل',
    titleEn: 'Integration & Connectivity',
    icon: Server,
    fields: [
      { id: 'webServices', labelAr: 'استخدام خدمات الويب سرفيس للربط مع الأنظمة الخارجية', labelEn: 'Web Service Integration with External Systems', type: 'textarea', placeholder: 'حدد وصف كل خدمة' },
      { id: 'auxSystems', labelAr: 'استخدام الأنظمة المساعدة لل IX', labelEn: 'Auxiliary IX Systems (Android, Websites)', type: 'textarea' },
      { id: 'maxItemFlex', labelAr: 'الحد الأقصى لعدد المقاطع المستخدمة للأصناف (MAX ITEM FLEX FIELD)', labelEn: 'Max Item Flex Field Segments', type: 'number' },
      { id: 'maxSubLedgers', labelAr: 'الحد الأقصى لعدد الأدلة الفرعية المستخدمة (MAX SUB LEDGERS)', labelEn: 'Max Sub Ledgers', type: 'number' },
      { id: 'subLedgerDetails', labelAr: 'عدد كل دليل فرعي على حدة (مراكز، أنشطة، مشاريع...)', labelEn: 'Sub-ledger Counts (Centers, Activities, Projects...)', type: 'textarea' },
    ],
  },
  {
    id: 'advanced',
    titleAr: 'الميزات المتقدمة',
    titleEn: 'Advanced Features',
    icon: ClipboardList,
    fields: [
      { id: 'archiving', labelAr: 'استخدام الأرشفة ومتوسط حجم الملفات المؤرشفة شهرياً', labelEn: 'Archiving & Avg Monthly Archived Size', type: 'text' },
      { id: 'storageType', labelAr: 'طبيعة الخزن في أرشفة الملفات', labelEn: 'Storage Type (File System / Database)', type: 'select', options: [{ ar: 'File System', en: 'File System' }, { ar: 'Database', en: 'Database' }, { ar: 'كليهما', en: 'Both' }] },
      { id: 'monitoring', labelAr: 'استخدام الرقابة وطبيعة المراقبة', labelEn: 'Monitoring & Audit Controls', type: 'textarea' },
      { id: 'alerts', labelAr: 'استخدام التنبيهات الآلية', labelEn: 'Automatic Alerts Usage', type: 'textarea' },
      { id: 'integrationAspects', labelAr: 'Integration Aspects', labelEn: 'Integration Aspects', type: 'textarea' },
    ],
  },
];

function FieldInput({ field, value, onChange, isRTL }: { field: QuestionnaireField; value: string; onChange: (v: string) => void; isRTL: boolean }) {
  const baseClass = 'h-9 text-sm bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-[#18B13A]/40 focus:ring-[#18B13A]/20';

  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn('h-9 w-full rounded-lg border bg-white/[0.04] border-white/[0.08] px-3 text-sm text-white', isRTL && 'text-right')}
      >
        <option value="" className="bg-[#111827]">--</option>
        {field.options?.map((opt) => (
          <option key={opt.en} value={opt.en} className="bg-[#111827]">{opt[isRTL ? 'ar' : 'en']}</option>
        ))}
      </select>
    );
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || ''}
        rows={3}
        className={cn('w-full rounded-lg border bg-white/[0.04] border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[#18B13A]/40 focus:ring-[#18B13A]/20 resize-none', isRTL && 'text-right')}
      />
    );
  }

  return (
    <Input
      type={field.type === 'number' ? 'number' : 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder || ''}
      className={cn(baseClass, isRTL && 'text-right')}
    />
  );
}

export function QuestionnaireForm() {
  const { isRTL } = useLocale();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [clientName, setClientName] = useState('');

  const updateField = useCallback((fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setClientName('');
  }, []);

  const handlePrintPDF = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
    const dir = isRTL ? 'rtl' : 'ltr';

    let html = `
      <!DOCTYPE html>
      <html dir="${dir}">
      <head>
        <meta charset="UTF-8">
        <title>${isRTL ? 'استبيان العميل - ONYX IX' : 'Client Questionnaire - ONYX IX'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { font-family: 'Inter', Arial, sans-serif; box-sizing: border-box; }
          @media print { body { margin: 0; } @page { margin: 1.5cm; } }
          body { padding: 30px; max-width: 900px; margin: 0 auto; color: #1e293b; }
          h1 { font-size: 22px; text-align: center; margin-bottom: 5px; color: #0f172a; }
          h2 { font-size: 15px; margin: 24px 0 12px; padding: 8px 12px; background: #0f172a; color: white; border-radius: 6px; }
          .subtitle { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 20px; }
          .field { margin-bottom: 10px; page-break-inside: avoid; }
          .field label { display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 3px; }
          .field .value { padding: 6px 10px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 12px; min-height: 28px; background: #f8fafc; }
          .field .value.empty { color: #cbd5e1; font-style: italic; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
          .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #94a3b8; }
          .client-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-bottom: 16px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>${isRTL ? 'استبيان متطلبات نظام ONYX IX' : 'ONYX IX Requirements Questionnaire'}</h1>
        <p class="subtitle">${isRTL ? 'تاريخ:' : 'Date:'} ${dateStr} ${clientName ? `| ${isRTL ? 'العميل:' : 'Client:'} ${clientName}` : ''}</p>
    `;

    SECTIONS.forEach((section) => {
      html += `<h2>${section.titleAr}</h2>`;
      html += '<div class="grid">';
      section.fields.forEach((field) => {
        const val = formData[field.id] || '';
        html += `
          <div class="field">
            <label>${field[isRTL ? 'labelAr' : 'labelEn']}</label>
            <div class="value ${val ? '' : 'empty'}">${val || (isRTL ? 'غير محدد' : 'Not specified')}</div>
          </div>
        `;
      });
      html += '</div>';
    });

    html += `
        <div class="footer">
          ${isRTL ? 'تم الإنشاء بواسطة Oracle Deployment Manager' : 'Generated by Oracle Deployment Manager'} — ${dateStr}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => printWindow.print();
    }
  }, [formData, clientName, isRTL]);

  const handleExportExcel = useCallback(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
    const dir = isRTL ? 'rtl' : 'ltr';

    let html = `
      <html dir="${dir}" xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Calibri, Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background: #0f172a; color: #ffffff; font-weight: bold; text-align: ${isRTL ? 'right' : 'left'}; }
          td, th { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; }
          td { text-align: ${isRTL ? 'right' : 'left'}; vertical-align: top; }
          tr:nth-child(even) td { background: #f8fafc; }
          .title-row td { background: #0f172a; color: #ffffff; font-size: 16px; font-weight: bold; text-align: center; padding: 12px; }
          .section-row td { background: #18b13a20; color: #18b13a; font-weight: bold; font-size: 13px; border-bottom: 2px solid #18b13a; }
          .label { color: #64748b; font-weight: 500; width: 40%; }
          .footer { color: #94a3b8; font-size: 10px; text-align: center; font-style: italic; border-top: 2px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <table>
          <tr class="title-row">
            <td colspan="2">${isRTL ? 'استبيان متطلبات نظام ONYX IX' : 'ONYX IX Requirements Questionnaire'}<br><span style="font-size:11px;color:#94a3b8;">${dateStr}${clientName ? ` | ${clientName}` : ''}</span></td>
          </tr>
    `;

    SECTIONS.forEach((section) => {
      html += `<tr class="section-row"><td colspan="2">${section.titleAr}</td></tr>`;
      section.fields.forEach((field) => {
        const val = formData[field.id] || (isRTL ? 'غير محدد' : 'Not specified');
        html += `<tr><td class="label">${field[isRTL ? 'labelAr' : 'labelEn']}</td><td>${val}</td></tr>`;
      });
    });

    html += `
          <tr><td colspan="2" class="footer">${isRTL ? 'تم الإنشاء بواسطة Oracle Deployment Manager' : 'Generated by Oracle Deployment Manager'} — ${dateStr}</td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `questionnaire-${clientName || 'client'}-${now.toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [formData, clientName, isRTL]);

  const filledCount = Object.values(formData).filter((v) => v.trim()).length;
  const totalFields = SECTIONS.reduce((acc, s) => acc + s.fields.length, 0);

  return (
    <div className="space-y-4 max-w-[1000px] mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={cn('flex items-center justify-between flex-wrap gap-3', isRTL && 'flex-row-reverse')}>
        <div>
          <h2 className={cn('text-lg font-semibold flex items-center gap-2', isRTL && 'flex-row-reverse')}>
            <ClipboardList className="h-5 w-5 text-[#38BDF8]" />
            {isRTL ? 'استبيان العميل' : 'Client Questionnaire'}
          </h2>
          <p className="text-sm text-slate-500">
            {isRTL ? 'نمذج متطلبات نظام ONYX IX' : 'ONYX IX Requirements Form'}
          </p>
        </div>
        <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
          <Badge variant="secondary" className="text-[10px] font-mono">
            {filledCount}/{totalFields} {isRTL ? 'تم تعبئتها' : 'filled'}
          </Badge>
          <Button variant="outline" size="sm" onClick={resetForm} className="gap-1 text-xs">
            <RotateCcw className="h-3 w-3" />
            {isRTL ? 'إعادة تعيين' : 'Reset'}
          </Button>
          <Button size="sm" onClick={handleExportExcel} className="gap-1 text-xs bg-[#18B13A] hover:bg-[#15803D]">
            <FileSpreadsheet className="h-3 w-3" />
            Excel
          </Button>
          <Button size="sm" onClick={handlePrintPDF} className="gap-1 text-xs bg-[#38BDF8] hover:bg-[#0ea5e9]">
            <FileText className="h-3 w-3" />
            PDF
          </Button>
        </div>
      </div>

      {/* Client Name Input */}
      <Card className="bg-[#111827] border-[#38BDF8]/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={cn('text-xs font-medium flex items-center gap-1.5', isRTL && 'flex-row-reverse')}>
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                {isRTL ? 'اسم العميل / الشركة' : 'Client / Company Name'}
              </Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder={isRTL ? 'أدخل اسم العميل...' : 'Enter client name...'}
                className={cn('h-9 text-sm bg-white/[0.04] border-white/[0.08] text-white', isRTL && 'text-right')}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={cn('text-xs font-medium flex items-center gap-1.5', isRTL && 'flex-row-reverse')}>
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                {isRTL ? 'التاريخ' : 'Date'}
              </Label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className={cn('h-9 text-sm bg-white/[0.04] border-white/[0.08] text-white', isRTL && 'text-right')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Sections */}
      {SECTIONS.map((section, si) => {
        const Icon = section.icon;
        return (
          <Card key={section.id} className="bg-[#111827] border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className={cn('text-sm font-medium flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <Icon className="h-4 w-4 text-[#38BDF8]" />
                {section.titleAr}
                <Badge variant="secondary" className="text-[9px] font-mono ms-auto">
                  {section.fields.filter((f) => formData[f.id]?.trim()).length}/{section.fields.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <Label className={cn('text-xs text-slate-400', isRTL && 'text-right')}>
                      {field[isRTL ? 'labelAr' : 'labelEn']}
                    </Label>
                    <FieldInput
                      field={field}
                      value={formData[field.id] || ''}
                      onChange={(v) => updateField(field.id, v)}
                      isRTL={isRTL}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
