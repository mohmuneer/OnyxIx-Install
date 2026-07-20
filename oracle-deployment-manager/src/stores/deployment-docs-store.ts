'use client';

import { create } from 'zustand';

export interface DocAttachment {
  id: string;
  name: string;
  nameAr: string;
  href: string;
}

export interface DocStep {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'engineer' | 'consultant';
  step?: number;
  files: DocAttachment[];
}

const STORAGE_KEY = 'deployment-docs-v3';

function getDefaultSteps(): DocStep[] {
  return [
    // ── Engineer: Installation steps ──
    {
      id: 'linux-install', title: 'Linux IX Installation', titleAr: 'تثبيت لينكس IX',
      description: 'Step-by-step guide for installing Oracle Linux for IX system',
      descriptionAr: 'دليل خطوة بخطوة لتثبيت أوراكل لينكس لنظام IX',
      category: 'engineer', step: 1,
      files: [{ id: 'f1', name: 'Linux IX Install', nameAr: 'تثبيت لينكس IX', href: '/docs/install/1-Linux IX Install.pdf' }],
    },
    {
      id: 'oracle-db-12c', title: 'Oracle Database IX 12C', titleAr: 'قاعدة بيانات أوراكل IX 12C',
      description: 'Oracle Database 12C installation and configuration for IX',
      descriptionAr: 'تثبيت وتكوين قاعدة بيانات أوراكل 12C لنظام IX',
      category: 'engineer', step: 2,
      files: [{ id: 'f2', name: 'DB ORACLE IX 12C', nameAr: 'قاعدة بيانات أوراكل IX 12C', href: '/docs/install/2-DB ORACLE IX 12C.pdf' }],
    },
    {
      id: 'oracle-db-21c', title: 'Oracle Database 21c on OL8', titleAr: 'قاعدة بيانات أوراكل 21c على لينكس أوراكل 8',
      description: 'Installing Oracle Database 21c on Oracle Linux 8',
      descriptionAr: 'تثبيت قاعدة بيانات أوراكل 21c على لينكس أوراكل 8',
      category: 'engineer', step: 2,
      files: [{ id: 'f3', name: 'Oracle DB 21c on OL8', nameAr: 'تثبيت أوراكل 21c على لينكس 8', href: '/docs/install/2-Oracle Database 21c Installation On Oracle Linux 8 (OL8).pdf' }],
    },
    {
      id: 'jdk-weblogic', title: 'JDK, WebLogic, Forms & Reports', titleAr: 'JDK و WebLogic و Forms و Reports',
      description: 'Installation guide for JDK, WebLogic Server, Oracle Forms and Reports',
      descriptionAr: 'دليل تثبيت JDK و WebLogic Server و Oracle Forms و Reports',
      category: 'engineer', step: 3,
      files: [{ id: 'f4', name: 'JDK&WEBLOGIC&OFRMS', nameAr: 'JDK و WebLogic و Forms و Reports', href: '/docs/install/3-JDK&WEBLOGIC&OFRMS AND REPORTS.pdf' }],
    },
    {
      id: 'run-avant', title: 'Run IX from Avant Browser', titleAr: 'تشغيل IX من متصفح Avant',
      description: 'How to run Onyx-IX application from Avant Browser',
      descriptionAr: 'كيفية تشغيل تطبيق Onyx-IX من متصفح Avant',
      category: 'engineer', step: 4,
      files: [{ id: 'f5', name: 'Avant Browser', nameAr: 'متصفح Avant', href: '/docs/install/4-Run Onyx-ix from Avant Browser.pdf' }],
    },
    {
      id: 'run-edge', title: 'Run IX from Edge Browser', titleAr: 'تشغيل IX من متصفح Edge',
      description: 'How to run Onyx-IX application from Microsoft Edge Browser',
      descriptionAr: 'كيفية تشغيل تطبيق Onyx-IX من متصفح Microsoft Edge',
      category: 'engineer', step: 4,
      files: [{ id: 'f6', name: 'Edge Browser', nameAr: 'متصفح Edge', href: '/docs/install/4-Run Onyx-ix from Edge Browser.pdf' }],
    },
    {
      id: 'run-firefox', title: 'Run IX from Firefox Browser', titleAr: 'تشغيل IX من متصفح Firefox',
      description: 'How to run Onyx-IX application from Mozilla Firefox Browser',
      descriptionAr: 'كيفية تشغيل تطبيق Onyx-IX من متصفح Mozilla Firefox',
      category: 'engineer', step: 4,
      files: [{ id: 'f7', name: 'Firefox Browser', nameAr: 'متصفح Firefox', href: '/docs/install/4-Run Onyx-ix from Firefox Browser.pdf' }],
    },
    // ── Engineer: Guides (no step) ──
    {
      id: 'apex-install', title: 'APEX 22.2 Installation Guide', titleAr: 'دليل تثبيت APEX 22.2',
      description: 'Oracle APEX 22.2 installation and configuration guide',
      descriptionAr: 'دليل تثبيت وتكوين Oracle APEX 22.2',
      category: 'engineer',
      files: [{ id: 'f8', name: 'APEX 22.2', nameAr: 'تثبيت APEX 22.2', href: '/docs/APEX_22.2_Install_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'appserver-browsers', title: 'App Server & Browsers Guide', titleAr: 'دليل خادم التطبيقات والمتصفحات',
      description: 'Application server and browser compatibility guide',
      descriptionAr: 'دليل توافق خادم التطبيقات والمتصفحات',
      category: 'engineer',
      files: [{ id: 'f9', name: 'App Server Browsers', nameAr: 'خادم التطبيقات والمتصفحات', href: '/docs/AppServer_Browsers_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'architecture', title: 'Architecture Overview', titleAr: 'نظرة عامة على البنية المعمارية',
      description: 'Complete architecture overview of the ONYX IX system',
      descriptionAr: 'نظرة عامة شاملة على بنية نظام ONYX IX المعمارية',
      category: 'engineer',
      files: [{ id: 'f10', name: 'Architecture', nameAr: 'البنية المعمارية', href: '/docs/Architecture_Overview_UltimateSolutions.pdf' }],
    },
    {
      id: 'forms-patch', title: 'Forms Patch 17301874 Guide', titleAr: 'دليل ترقية Forms 17301874',
      description: 'Oracle Forms patch 17301874 installation guide',
      descriptionAr: 'دليل تثبيت ترقية Oracle Forms 17301874',
      category: 'engineer',
      files: [{ id: 'f11', name: 'Forms Patch', nameAr: 'ترقية Forms', href: '/docs/Forms_Patch_17301874_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'oracle21c-install', title: 'Oracle 21c Installation Guide', titleAr: 'دليل تثبيت أوراكل 21c',
      description: 'Oracle Database 21c complete installation guide',
      descriptionAr: 'دليل تثبيت شامل لقاعدة بيانات أوراكل 21c',
      category: 'engineer',
      files: [{ id: 'f12', name: 'Oracle 21c', nameAr: 'تثبيت أوراكل 21c', href: '/docs/Oracle21c_Install_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'oracle-linux', title: 'Oracle Linux Installation Guide', titleAr: 'دليل تثبيت لينكس أوراكل',
      description: 'Oracle Linux 8.9 installation and configuration guide',
      descriptionAr: 'دليل تثبيت وتكوين لينكس أوراكل 8.9',
      category: 'engineer',
      files: [{ id: 'f13', name: 'Oracle Linux 8.9', nameAr: 'لينكس أوراكل 8.9', href: '/docs/OracleLinux_8.9_Install_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'ords-apex-ssl', title: 'ORDS, APEX & SSL Guide', titleAr: 'دليل ORDS و APEX و SSL',
      description: 'Oracle REST Data Services, APEX and SSL configuration guide',
      descriptionAr: 'دليل تكوين Oracle REST Data Services و APEX و SSL',
      category: 'engineer',
      files: [{ id: 'f14', name: 'ORDS APEX SSL', nameAr: 'ORDS و APEX و SSL', href: '/docs/ORDS_APEX_SSL_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'pos-server', title: 'POS Server Guide', titleAr: 'دليل خادم نقاط البيع',
      description: 'POS Server setup and configuration guide',
      descriptionAr: 'دليل إعداد وتكوين خادم نقاط البيع',
      category: 'engineer',
      files: [{ id: 'f15', name: 'POS Server', nameAr: 'خادم نقاط البيع', href: '/docs/POS_Server_Guide_UltimateSolutions.pdf' }],
    },
    {
      id: 'apex-ultimate', title: 'Ultimate APEX 22.2 Installation', titleAr: 'تثبيت APEX 22.2 الشامل',
      description: 'Comprehensive APEX 22.2 installation guide',
      descriptionAr: 'دليل تثبيت شامل لـ APEX 22.2',
      category: 'engineer',
      files: [{ id: 'f16', name: 'APEX 22.2 Ultimate', nameAr: 'APEX 22.2 الشامل', href: '/docs/Ultimate_APEX_22.2_Installation_Guide.pdf' }],
    },
    {
      id: 'apex22', title: 'APEX22 Installation Guide', titleAr: 'دليل تثبيت APEX22',
      description: 'APEX 22 installation and deployment guide',
      descriptionAr: 'دليل تثبيت ونشر APEX 22',
      category: 'engineer',
      files: [{ id: 'f17', name: 'APEX22', nameAr: 'تثبيت APEX22', href: '/docs/Ultimate_APEX22_Installation_Guide.pdf' }],
    },
    {
      id: 'onyx-db', title: 'ONYX-WEB DB Install Main 8.9', titleAr: 'تثبيت قاعدة البيانات ONYX-WEB 8.9',
      description: 'Database installation guide for ONYX-WEB 8.9',
      descriptionAr: 'دليل تثبيت قاعدة البيانات لنظام ONYX-WEB الإصدار 8.9',
      category: 'engineer',
      files: [{ id: 'f18', name: 'ONYX-WEB DbInstall', nameAr: 'تثبيت ONYX-WEB', href: '/docs/install/%E2%80%8F%E2%80%8FONYX-WEB_DbInstall_main%20-%208.9.txt' }],
    },
    {
      id: 'tools-links', title: 'Tools & Links for IX', titleAr: 'الأدوات والروابط لنظام IX',
      description: 'Useful tools and links for IX system setup',
      descriptionAr: 'الأدوات والروابط المفيدة لإعداد نظام IX',
      category: 'engineer',
      files: [{ id: 'f19', name: 'Tools Links', nameAr: 'الأدوات والروابط', href: '/docs/install/tools%20links_lec1_ix.txt' }],
    },
    // ── Consultant docs ──
    {
      id: 'consultant-basics', title: 'Onyx IX Basics', titleAr: 'أساسيات ومفاهيم استخدام الأونكس آي إكس',
      description: 'System basics and usage concepts',
      descriptionAr: 'أساسيات ومفاهيم استخدام الأونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf1', name: 'Basics', nameAr: 'الأساسيات', href: '/docs/consultants/%D8%A3%D8%B3%D8%A7%D8%B3%D9%8A%D8%A7%D8%AA%20%D9%88%D9%85%D9%81%D8%A7%D9%87%D9%8A%D9%85%20%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85%20%D8%A7%D9%84%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-assets', title: 'Asset Management', titleAr: 'إدارة الأصول أونكس آي اكس',
      description: 'Asset management', descriptionAr: 'إدارة الأصول أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf2', name: 'Assets', nameAr: 'إدارة الأصول', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-fleet', title: 'Fleet Management', titleAr: 'إدارة الاسطول أونكس آي اكس',
      description: 'Fleet management', descriptionAr: 'إدارة الاسطول أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf3', name: 'Fleet', nameAr: 'إدارة الاسطول', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A7%D8%B3%D8%B7%D9%88%D9%84%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-audit', title: 'Audit & Transfer', titleAr: 'إدارة الترحيل والمراجعة أونكس آي إكس',
      description: 'Audit and transfer management', descriptionAr: 'إدارة الترحيل والمراجعة أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf4', name: 'Audit', nameAr: 'الترحيل والمراجعة', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AA%D8%B1%D8%AD%D9%8A%D9%84%20%D9%88%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D8%AC%D8%B9%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-bookings', title: 'Bookings Management', titleAr: 'إدارة الحجوزات أونكس آي إكس',
      description: 'Bookings management', descriptionAr: 'إدارة الحجوزات أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf5', name: 'Bookings', nameAr: 'الحجوزات', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AD%D8%AC%D9%88%D8%B2%D8%A7%D8%AA%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-talent', title: 'Talent Management', titleAr: 'إدارة الكفاءات - رأس المال البشري أونكس آي إكس',
      description: 'Talent management', descriptionAr: 'إدارة الكفاءات - رأس المال البشري أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf6', name: 'Talent', nameAr: 'إدارة الكفاءات', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%83%D9%81%D8%A7%D8%A1%D8%A7%D8%AA%20-%20%D8%B1%D8%A3%D8%B3%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%20%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D9%8A%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-inventory', title: 'Inventory Management', titleAr: 'إدارة المخزون أونكس آي إكس',
      description: 'Inventory management', descriptionAr: 'إدارة المخزون أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf7', name: 'Inventory', nameAr: 'إدارة المخزون', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D8%AE%D8%B2%D9%88%D9%86%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-talent2', title: 'Talent Management 2', titleAr: 'إدارة المواهب - رأس المال البشري أونكس آي إكس',
      description: 'Talent management', descriptionAr: 'إدارة المواهب - رأس المال البشري أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf8', name: 'Talent 2', nameAr: 'إدارة المواهب', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%87%D8%A8%20-%20%D8%B1%D8%A3%D8%B3%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%20%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D9%8A%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-admin', title: 'System Administration', titleAr: 'إدارة النظام أونكس آي إكس',
      description: 'System administration', descriptionAr: 'إدارة النظام أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf9', name: 'Admin', nameAr: 'إدارة النظام', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%85%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-maintenance', title: 'Asset Maintenance', titleAr: 'إدارة صيانة الأصول آي اكس',
      description: 'Asset maintenance', descriptionAr: 'إدارة صيانة الأصول آي اكس',
      category: 'consultant',
      files: [{ id: 'cf10', name: 'Maintenance', nameAr: 'صيانة الأصول', href: '/docs/consultants/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%B5%D9%8A%D8%A7%D9%86%D8%A9%20%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-banks', title: 'Bank Management', titleAr: 'ادارة البنوك أونكس آي إكس',
      description: 'Bank management', descriptionAr: 'ادارة البنوك أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf11', name: 'Banks', nameAr: 'إدارة البنوك', href: '/docs/consultants/%D8%A7%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A8%D9%86%D9%88%D9%83%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-gl', title: 'General Ledger', titleAr: 'الأستاذ العام أونكس آي إكس',
      description: 'General ledger', descriptionAr: 'الأستاذ العام أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf12', name: 'GL', nameAr: 'الأستاذ العام', href: '/docs/consultants/%D8%A7%D9%84%D8%A3%D8%B3%D8%AA%D8%A7%D8%B0%20%D8%A7%D9%84%D8%B9%D8%A7%D9%85%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-composite', title: 'Composite Items', titleAr: 'الأصناف المركبة أونكس آي إكس',
      description: 'Composite items', descriptionAr: 'الأصناف المركبة أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf13', name: 'Composite', nameAr: 'الأصناف المركبة', href: '/docs/consultants/%D8%A7%D9%84%D8%A3%D8%B5%D9%86%D8%A7%D9%81%20%D8%A7%D9%84%D9%85%D8%B1%D9%83%D8%A8%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-linking', title: 'Job Linking', titleAr: 'الإرتباط الوظيفي - إدارة نظام راس المال البشري أونكس آي اكس',
      description: 'Job linking', descriptionAr: 'الإرتباط الوظيفي - إدارة نظام راس المال البشري أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf14', name: 'Linking', nameAr: 'الإرتباط الوظيفي', href: '/docs/consultants/%D8%A7%D9%84%D8%A5%D8%B1%D8%AA%D8%A8%D8%A7%D8%B7%20%D8%A7%D9%84%D9%88%D8%B8%D9%8A%D9%81%D9%8A%20-%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D9%86%D8%B8%D8%A7%D9%85%20%D8%B1%D8%A7%D8%B3%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%20%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D9%8A%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-settings', title: 'General Settings', titleAr: 'الإعدادات العامة أونكس آي إكس',
      description: 'General settings', descriptionAr: 'الإعدادات العامة أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf15', name: 'Settings', nameAr: 'الإعدادات العامة', href: '/docs/consultants/%D8%A7%D9%84%D8%A5%D8%B9%D8%AF%D8%A7%D8%AF%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-facilities', title: 'Bank Facilities', titleAr: 'التسهيلات البنكية أونكس آي إكس',
      description: 'Bank facilities', descriptionAr: 'التسهيلات البنكية أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf16', name: 'Facilities', nameAr: 'التسهيلات البنكية', href: '/docs/consultants/%D8%A7%D9%84%D8%AA%D8%B3%D9%87%D9%8A%D9%84%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A8%D9%86%D9%83%D9%8A%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-init', title: 'HR Initialization', titleAr: 'التهيئة العامة - رأس المال البشري أونكس آي إكس',
      description: 'HR initialization', descriptionAr: 'التهيئة العامة - رأس المال البشري أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf17', name: 'Init', nameAr: 'التهيئة', href: '/docs/consultants/%D8%A7%D9%84%D8%AA%D9%87%D9%8A%D8%A6%D8%A9%20%D8%A7%D9%84%D8%B9%D8%A7%D9%85%D8%A9%20-%20%D8%B1%D8%A3%D8%B3%20%D8%A7%D9%84%D9%85%D8%A7%D9%84%20%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D9%8A%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-selfservice', title: 'Employee Self-Service', titleAr: 'الخدمة الذاتية للموظفين الأونكس آي اكس',
      description: 'Employee self-service', descriptionAr: 'الخدمة الذاتية للموظفين الأونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf18', name: 'Self-Service', nameAr: 'الخدمة الذاتية', href: '/docs/consultants/%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A9%20%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%8A%D8%A9%20%D9%84%D9%84%D9%85%D9%88%D8%B8%D9%81%D9%8A%D9%86%20%D8%A7%D9%84%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-production', title: 'Production & Cost', titleAr: 'نظام إدارة الإنتاج والتكاليف الصناعية أونكس آي اكس',
      description: 'Production management', descriptionAr: 'نظام إدارة الإنتاج والتكاليف الصناعية - إدارة المنشآت الصناعية أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf19', name: 'Production', nameAr: 'الإنتاج والتكاليف', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A5%D9%86%D8%AA%D8%A7%D8%AC%20%D9%88%D8%A7%D9%84%D8%AA%D9%83%D8%A7%D9%84%D9%8A%D9%81%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9%20-%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D9%86%D8%B4%D8%A2%D8%AA%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-budget', title: 'Budget Management', titleAr: 'نظام إدارة الخطط والموازنة أونكس آي إكس',
      description: 'Budget management', descriptionAr: 'نظام إدارة الخطط والموازنة أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf20', name: 'Budget', nameAr: 'الخطط والموازنة', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%AE%D8%B7%D8%B7%20%D9%88%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%B2%D9%86%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-realestate', title: 'Real Estate', titleAr: 'نظام إدارة العقارات أونكس آي اكس',
      description: 'Real estate management', descriptionAr: 'نظام إدارة العقارات أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf21', name: 'Real Estate', nameAr: 'إدارة العقارات', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-loans', title: 'Loans Management', titleAr: 'نظام إدارة القروض أونكس آي اكس',
      description: 'Loans management', descriptionAr: 'نظام إدارة القروض أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf22', name: 'Loans', nameAr: 'إدارة القروض', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%82%D8%B1%D9%88%D8%B6%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-projects', title: 'Projects Management', titleAr: 'نظام إدارة المشاريع أونكس آي إكس',
      description: 'Projects management', descriptionAr: 'نظام إدارة المشاريع أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf23', name: 'Projects', nameAr: 'إدارة المشاريع', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D8%B4%D8%A7%D8%B1%D9%8A%D8%B9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-hr', title: 'HR System', titleAr: 'نظام إدارة الموارد البشرية آي اكس',
      description: 'HR system', descriptionAr: 'نظام إدارة الموارد البشرية آي اكس',
      category: 'consultant',
      files: [{ id: 'cf24', name: 'HR', nameAr: 'الموارد البشرية', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D8%B1%D8%AF%20%D8%A7%D9%84%D8%A8%D8%B4%D8%B1%D9%8A%D8%A9%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-production-planning', title: 'Production Planning', titleAr: 'نظام إدارة تخطيط الإنتاج أونكس أي اكس',
      description: 'Production planning', descriptionAr: 'نظام إدارة تخطيط الإنتاج - إدارة المنشآت الصناعية أونكس أي اكس',
      category: 'consultant',
      files: [{ id: 'cf25', name: 'Planning', nameAr: 'تخطيط الإنتاج', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%AA%D8%AE%D8%B7%D9%8A%D8%B7%20%D8%A7%D9%84%D8%A5%D9%86%D8%AA%D8%A7%D8%AC%20-%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D9%86%D8%B4%D8%A2%D8%AA%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A3%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-quality', title: 'Quality Management', titleAr: 'نظام إدارة جودة الإنتاج أونكس آي اكس',
      description: 'Quality management', descriptionAr: 'نظام إدارة جودة الإنتاج - إدارة المنشآت الصناعية أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf26', name: 'Quality', nameAr: 'جودة الإنتاج', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%AC%D9%88%D8%AF%D8%A9%20%D8%A7%D9%84%D8%A5%D9%86%D8%AA%D8%A7%D8%AC%20-%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%20%D8%A7%D9%84%D9%85%D9%86%D8%B4%D8%A2%D8%AA%20%D8%A7%D9%84%D8%B5%D9%86%D8%A7%D8%B9%D9%8A%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-payroll', title: 'Payroll System', titleAr: 'نظام الأجور والمرتبات أونكس آي اكس',
      description: 'Payroll system', descriptionAr: 'نظام الأجور والمرتبات أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf27', name: 'Payroll', nameAr: 'الأجور والمرتبات', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%A3%D8%AC%D9%88%D8%B1%20%D9%88%D8%A7%D9%84%D9%85%D8%B1%D8%AA%D8%A8%D8%A7%D8%AA%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-distribution', title: 'Distribution System', titleAr: 'نظام التوزيع أونكس آي إكس',
      description: 'Distribution system', descriptionAr: 'نظام التوزيع أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf28', name: 'Distribution', nameAr: 'التوزيع', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%AA%D9%88%D8%B2%D9%8A%D8%B9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-inventory-count', title: 'Inventory Count', titleAr: 'نظام الجرد - أونكس آي إكس',
      description: 'Inventory count', descriptionAr: 'نظام الجرد - أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf29', name: 'Count', nameAr: 'الجرد', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%AC%D8%B1%D8%AF%20-%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-qual', title: 'Quality System', titleAr: 'نظام الجودة أونكس آي إكس',
      description: 'Quality system', descriptionAr: 'نظام الجودة أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf30', name: 'Quality', nameAr: 'الجودة', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%AC%D9%88%D8%AF%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-attendance', title: 'Attendance System', titleAr: 'نظام الحضور والانصراف أونكس آي إكس',
      description: 'Attendance system', descriptionAr: 'نظام الحضور والانصراف أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf31', name: 'Attendance', nameAr: 'الحضور والانصراف', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%AD%D8%B6%D9%88%D8%B1%20%D9%88%D8%A7%D9%84%D8%A7%D9%86%D8%B5%D8%B1%D8%A7%D9%81%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-customer-self', title: 'Customer Self-Service', titleAr: 'نظام الخدمة الذاتية للعملاء مع الويب أونكس آي إكس',
      description: 'Customer self-service', descriptionAr: 'نظام الخدمة الذاتية للعملاء مع الويب أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf32', name: 'Customer Self-Service', nameAr: 'خدمة العملاء', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A9%20%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%8A%D8%A9%20%D9%84%D9%84%D8%B9%D9%85%D9%84%D8%A7%D8%A1%20%D9%85%D8%B9%20%D8%A7%D9%84%D9%88%D9%8A%D8%A8%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-maintenance2', title: 'Maintenance System', titleAr: 'نظام الصيانة أونكس آي إكس',
      description: 'Maintenance system', descriptionAr: 'نظام الصيانة أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf33', name: 'Maintenance', nameAr: 'الصيانة', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%B5%D9%8A%D8%A7%D9%86%D8%A9%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-customers', title: 'Customer System', titleAr: 'نظام العملاء أونكس آي اكس',
      description: 'Customer system', descriptionAr: 'نظام العملاء أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf34', name: 'Customers', nameAr: 'العملاء', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%D8%A7%D8%A1%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-commissions', title: 'Commissions System', titleAr: 'نظام العمولات أونكس آي اكس',
      description: 'Commissions system', descriptionAr: 'نظام العمولات أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf35', name: 'Commissions', nameAr: 'العمولات', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%B9%D9%85%D9%88%D9%84%D8%A7%D8%AA%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-sales', title: 'Sales System', titleAr: 'نظام المبيعات أونكس آي إكس',
      description: 'Sales system', descriptionAr: 'نظام المبيعات أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf36', name: 'Sales', nameAr: 'المبيعات', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D9%85%D8%A8%D9%8A%D8%B9%D8%A7%D8%AA%20%D8%A7%D9%94%D9%88%D9%86%D9%83%D8%B3%20%D8%A7%D9%93%D9%8A%20%D8%A7%D9%95%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-ecommerce', title: 'E-Commerce', titleAr: 'نظام المتجر الإلكتروني أونكس آي اكس',
      description: 'E-commerce', descriptionAr: 'نظام المتجر الإلكتروني أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf37', name: 'E-Commerce', nameAr: 'المتجر الإلكتروني', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D9%85%D8%AA%D8%AC%D8%B1%20%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-purchases', title: 'Purchases System', titleAr: 'نظام المشتريات أونكس آي إكس',
      description: 'Purchases system', descriptionAr: 'نظام المشتريات أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf38', name: 'Purchases', nameAr: 'المشتريات', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D9%85%D8%B4%D8%AA%D8%B1%D9%8A%D8%A7%D8%AA%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-suppliers', title: 'Suppliers System', titleAr: 'نظام الموردين أونكس آي إكس',
      description: 'Suppliers system', descriptionAr: 'نظام الموردين أونكس آي إكس',
      category: 'consultant',
      files: [{ id: 'cf39', name: 'Suppliers', nameAr: 'الموردين', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D9%85%D9%88%D8%B1%D8%AF%D9%8A%D9%86%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A5%D9%83%D8%B3.pdf' }],
    },
    {
      id: 'consultant-purchase-cost', title: 'Purchase Cost', titleAr: 'نظام تكاليف الشراء أونكس آي اكس',
      description: 'Purchase cost', descriptionAr: 'نظام تكاليف الشراء أونكس آي اكس',
      category: 'consultant',
      files: [{ id: 'cf40', name: 'Cost', nameAr: 'تكاليف الشراء', href: '/docs/consultants/%D9%86%D8%B8%D8%A7%D9%85%20%D8%AA%D9%83%D8%A7%D9%84%D9%8A%D9%81%20%D8%A7%D9%84%D8%B4%D8%B1%D8%A7%D8%A1%20%D8%A3%D9%88%D9%86%D9%83%D8%B3%20%D8%A2%D9%8A%20%D8%A7%D9%83%D8%B3.pdf' }],
    },
  ];
}

function loadFromStorage(): DocStep[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSteps();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultSteps();
    return parsed;
  } catch {
    return getDefaultSteps();
  }
}

function saveToStorage(steps: DocStep[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
  } catch {}
}

interface DeploymentDocsStore {
  steps: DocStep[];
  init: () => void;
  resetDefaults: () => void;
  addStep: (step: DocStep) => void;
  updateStep: (id: string, updates: Partial<DocStep>) => void;
  removeStep: (id: string) => void;
  addFile: (stepId: string, file: DocAttachment) => void;
  removeFile: (stepId: string, fileId: string) => void;
  updateFile: (stepId: string, fileId: string, updates: Partial<DocAttachment>) => void;
}

export const useDeploymentDocsStore = create<DeploymentDocsStore>((set, get) => ({
  steps: getDefaultSteps(),

  init: () => {
    const stored = loadFromStorage();
    set({ steps: stored });
  },

  resetDefaults: () => {
    const defaults = getDefaultSteps();
    set({ steps: defaults });
    saveToStorage(defaults);
  },

  addStep: (step) => {
    const steps = [...get().steps, step];
    set({ steps });
    saveToStorage(steps);
  },

  updateStep: (id, updates) => {
    const steps = get().steps.map((s) => (s.id === id ? { ...s, ...updates } : s));
    set({ steps });
    saveToStorage(steps);
  },

  removeStep: (id) => {
    const steps = get().steps.filter((s) => s.id !== id);
    set({ steps });
    saveToStorage(steps);
  },

  addFile: (stepId, file) => {
    const steps = get().steps.map((s) =>
      s.id === stepId ? { ...s, files: [...s.files, file] } : s
    );
    set({ steps });
    saveToStorage(steps);
  },

  removeFile: (stepId, fileId) => {
    const steps = get().steps.map((s) =>
      s.id === stepId ? { ...s, files: s.files.filter((f) => f.id !== fileId) } : s
    );
    set({ steps });
    saveToStorage(steps);
  },

  updateFile: (stepId, fileId, updates) => {
    const steps = get().steps.map((s) =>
      s.id === stepId
        ? { ...s, files: s.files.map((f) => (f.id === fileId ? { ...f, ...updates } : f)) }
        : s
    );
    set({ steps });
    saveToStorage(steps);
  },
}));
