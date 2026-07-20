import type { DashboardData } from '@/types';

export function exportRequirementsPDF(data: DashboardData, isRTL: boolean) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  const timeStr = now.toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US');

  const sectionsHtml = data.sections.map((section) => {
    const hwRows = section.hw.map((item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">${item.label[isRTL ? 'ar' : 'en']}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-family:monospace;">${item.value}</td>
      </tr>
    `).join('');

    const swRows = section.sw.map((item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">${item.label[isRTL ? 'ar' : 'en']}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${item.value}</td>
      </tr>
    `).join('');

    return `
      <div style="margin-bottom:24px;page-break-inside:avoid;">
        <h3 style="font-size:16px;margin:0 0 12px;color:#1e293b;border-bottom:2px solid ${section.color};padding-bottom:8px;">
          ${section.title[isRTL ? 'ar' : 'en']}
        </h3>
        ${section.hw.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:8px 12px;text-align:${isRTL ? 'right' : 'left'};font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${isRTL ? 'المورد' : 'Item'}</th>
                <th style="padding:8px 12px;text-align:${isRTL ? 'right' : 'left'};font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${isRTL ? 'القيمة' : 'Value'}</th>
              </tr>
            </thead>
            <tbody>${hwRows}</tbody>
          </table>
        ` : ''}
        ${section.sw.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:8px 12px;text-align:${isRTL ? 'right' : 'left'};font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${isRTL ? 'المورد' : 'Item'}</th>
                <th style="padding:8px 12px;text-align:${isRTL ? 'right' : 'left'};font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">${isRTL ? 'القيمة' : 'Value'}</th>
              </tr>
            </thead>
            <tbody>${swRows}</tbody>
          </table>
        ` : ''}
      </div>
    `;
  }).join('');

  const reqHtml = data.requirements.map((req) => {
    const items = req.items.map((item) => `
      <li style="padding:4px 0;font-size:13px;color:#374151;">${item[isRTL ? 'ar' : 'en']}</li>
    `).join('');

    return `
      <div style="margin-bottom:16px;page-break-inside:avoid;">
        <h4 style="font-size:14px;margin:0 0 8px;color:#1e293b;display:flex;align-items:center;gap:8px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#f97316;"></span>
          ${req.category[isRTL ? 'ar' : 'en']}
        </h4>
        <ul style="margin:0;padding-${isRTL ? 'right' : 'left'}:24px;list-style:none;">
          ${items}
        </ul>
      </div>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html dir="${isRTL ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <title>${isRTL ? 'متطلبات تركيب نظام Onyx IX' : 'ONYX IX Installation Requirements'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body style="padding:40px;max-width:900px;margin:0 auto;background:#fff;">
      <div style="text-align:center;margin-bottom:32px;border-bottom:2px solid #e5e7eb;padding-bottom:24px;">
        <h1 style="font-size:22px;margin:0 0 4px;color:#1e293b;">
          ${isRTL ? 'متطلبات تركيب نظام Onyx IX' : 'ONYX IX Installation Requirements'}
        </h1>
        <p style="font-size:13px;color:#94a3b8;margin:0;">
          ${isRTL ? 'تاريخ:' : 'Date:'} ${dateStr} &nbsp;|&nbsp; ${isRTL ? 'الوقت:' : 'Time:'} ${timeStr}
        </p>
      </div>

      <h2 style="font-size:18px;color:#1e293b;margin:0 0 16px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">
        ${isRTL ? 'أقسام الخوادم' : 'Server Sections'}
      </h2>
      ${sectionsHtml}

      <h2 style="font-size:18px;color:#1e293b;margin:32px 0 16px;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">
        ${isRTL ? 'متطلبات التثبيت' : 'Installation Requirements'}
      </h2>
      ${reqHtml}

      <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="font-size:11px;color:#94a3b8;margin:0;">
          ${isRTL ? 'تم الإنشاء بواسطة Oracle Deployment Manager' : 'Generated by Oracle Deployment Manager'}
        </p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

export function exportRequirementsExcel(data: DashboardData, isRTL: boolean) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
  const dir = isRTL ? 'rtl' : 'ltr';

  let html = `
    <html dir="${dir}" xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>ONYX IX Requirements</x:Name>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: Calibri, Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
        th { background: #1e293b; color: #ffffff; font-weight: bold; text-align: ${isRTL ? 'right' : 'left'}; }
        td, th { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; }
        td { text-align: ${isRTL ? 'right' : 'left'}; }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e2e8f0; }
        .section-header { background: #0f172a; color: #ffffff; font-size: 14px; font-weight: bold; }
        .section-header td { background: #0f172a; color: #ffffff; font-size: 14px; font-weight: bold; border: 1px solid #334155; padding: 10px 12px; }
        .hw-header td { background: #38bdf820; color: #38bdf8; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #38bdf8; }
        .sw-header td { background: #18b13a20; color: #18b13a; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #18b13a; }
        .req-header { background: #ff980020; color: #ff9800; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #ff9800; }
        .title-row td { background: #1e293b; color: #ffffff; font-size: 16px; font-weight: bold; padding: 12px; }
        .subtitle { color: #64748b; font-size: 10px; font-style: italic; }
        .mono { font-family: Consolas, monospace; }
        .footer { color: #94a3b8; font-size: 10px; text-align: center; font-style: italic; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
  `;

  html += `<table>`;

  // Title row
  html += `
    <tr class="title-row">
      <td colspan="4" style="text-align:center;">
        ${isRTL ? 'متطلبات تركيب نظام Onyx IX' : 'ONYX IX Installation Requirements'}
        <br><span class="subtitle" style="color:#94a3b8;">${isRTL ? 'تاريخ:' : 'Date:'} ${dateStr}</span>
      </td>
    </tr>
  `;

  // Server Sections
  if (data.sections.length > 0) {
    html += `
      <tr class="section-header">
        <td colspan="4">${isRTL ? 'أقسام الخوادم' : 'Server Sections'}</td>
      </tr>
    `;

    data.sections.forEach((section) => {
      // Section title
      html += `
        <tr>
          <td colspan="4" style="background:${section.color}15;color:${section.color};font-weight:bold;font-size:13px;border-bottom:2px solid ${section.color};">
            ${section.title[isRTL ? 'ar' : 'en']}
          </td>
        </tr>
      `;

      // H/W header
      if (section.hw.length > 0) {
        html += `
          <tr class="hw-header">
            <td colspan="2">${isRTL ? 'مواصفات العتاد' : 'HARDWARE SPECIFICATION'}</td>
          </tr>
          <tr class="hw-header">
            <td style="width:35%;">${isRTL ? 'المورد' : 'Item'}</td>
            <td>${isRTL ? 'القيمة' : 'Value'}</td>
          </tr>
        `;

        section.hw.forEach((item) => {
          html += `
            <tr>
              <td style="color:#64748b;">${item.label[isRTL ? 'ar' : 'en']}</td>
              <td class="mono">${item.value}</td>
            </tr>
          `;
        });
      }

      // S/W header
      if (section.sw.length > 0) {
        html += `
          <tr class="sw-header">
            <td colspan="2">${isRTL ? 'مواصفات البرمجيات' : 'SOFTWARE SPECIFICATION'}</td>
          </tr>
          <tr class="sw-header">
            <td style="width:35%;">${isRTL ? 'المورد' : 'Item'}</td>
            <td>${isRTL ? 'القيمة' : 'Value'}</td>
          </tr>
        `;

        section.sw.forEach((item) => {
          html += `
            <tr>
              <td style="color:#64748b;">${item.label[isRTL ? 'ar' : 'en']}</td>
              <td>${item.value}</td>
            </tr>
          `;
        });
      }

      // Empty separator row
      html += `<tr><td colspan="4" style="border:none;height:8px;"></td></tr>`;
    });
  }

  // Requirements
  if (data.requirements.length > 0) {
    html += `
      <tr class="section-header">
        <td colspan="4">${isRTL ? 'متطلبات التثبيت' : 'INSTALLATION REQUIREMENTS'}</td>
      </tr>
      <tr class="req-header">
        <td style="width:35%;">${isRTL ? 'الفئة' : 'Category'}</td>
        <td style="width:32.5%;">${isRTL ? 'المتطلب (عربي)' : 'Requirement (AR)'}</td>
        <td style="width:32.5%;">${isRTL ? 'المتطلب (إنجليزي)' : 'Requirement (EN)'}</td>
      </tr>
    `;

    data.requirements.forEach((req) => {
      req.items.forEach((item, i) => {
        html += `
          <tr>
            ${i === 0 ? `<td rowspan="${req.items.length}" style="font-weight:bold;color:#ff9800;">${req.category[isRTL ? 'ar' : 'en']}</td>` : ''}
            <td>${item.ar}</td>
            <td>${item.en}</td>
          </tr>
        `;
      });
    });
  }

  // Footer
  html += `
    <tr>
      <td colspan="4" class="footer">
        ${isRTL ? 'تم الإنشاء بواسطة Oracle Deployment Manager' : 'Generated by Oracle Deployment Manager'} — ${dateStr}
      </td>
    </tr>
  `;

  html += `</table></body></html>`;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `onyx-ix-requirements-${now.toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
