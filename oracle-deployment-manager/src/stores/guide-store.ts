import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuideStep {
  id: string;
  title: string;
  titleAr: string;
}

export interface GuidePhase {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  bg: string;
  border: string;
  icon: string;
  pdfHref: string;
  steps: GuideStep[];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const DEFAULT_PHASES: GuidePhase[] = [
  {
    id: 'linux',
    title: 'Linux Installation',
    titleAr: 'تثبيت Linux',
    description: 'Oracle Linux 8.9 base setup',
    descriptionAr: 'إعداد Oracle Linux 8.9 الأساسي',
    color: 'text-orange-400',
    bg: 'bg-orange-500/5',
    border: 'border-orange-500/30',
    icon: 'Terminal',
    pdfHref: '/docs/OracleLinux_8.9_Install_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'install', title: 'Install Oracle Linux', titleAr: 'تثبيت Oracle Linux' },
      { id: 'network', title: 'Configure Network', titleAr: 'إعداد الشبكة' },
      { id: 'firewall', title: 'Basic Firewall Setup', titleAr: 'إعداد الجدار الناري الأساسي' },
      { id: 'selinux', title: 'Configure SELinux', titleAr: 'إعداد SELinux' },
      { id: 'packages', title: 'Install Required Packages', titleAr: 'تثبيت الحزم المطلوبة' },
      { id: 'oracleUser', title: 'Create Oracle User', titleAr: 'إنشاء مستخدم Oracle' },
      { id: 'kernel', title: 'Kernel Parameters', titleAr: 'معلمات النواة' },
      { id: 'limits', title: 'User Limits', titleAr: 'حدود المستخدم' },
      { id: 'firewalld', title: 'Firewalld Rules', titleAr: 'قواعد Firewalld' },
    ],
  },
  {
    id: 'database',
    title: 'Database Installation',
    titleAr: 'تثبيت قاعدة البيانات',
    description: 'Oracle 21c Database setup',
    descriptionAr: 'إعداد قاعدة بيانات Oracle 21c',
    color: 'text-red-400',
    bg: 'bg-red-500/5',
    border: 'border-red-500/30',
    icon: 'Database',
    pdfHref: '/docs/Oracle21c_Install_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'uploadMedia', title: 'Upload Installation Media', titleAr: 'رفع وسيلة التثبيت' },
      { id: 'runInstaller', title: 'Run Installer', titleAr: 'تشغيل المثبت' },
      { id: 'setPassword', title: 'Set SYS Password', titleAr: 'تعيين كلمة مرور SYS' },
      { id: 'createDB', title: 'Create Database', titleAr: 'إنشاء قاعدة البيانات' },
      { id: 'configureListener', title: 'Configure Listener', titleAr: 'إعداد المستمع' },
      { id: 'createService', title: 'Create Service', titleAr: 'إنشاء الخدمة' },
      { id: 'testConn', title: 'Test Connection', titleAr: 'اختبار الاتصال' },
      { id: 'createUsers', title: 'Create Users', titleAr: 'إنشاء المستخدمين' },
      { id: 'importData', title: 'Import Data', titleAr: 'استيراد البيانات' },
      { id: 'checkListener', title: 'Verify Listener Status', titleAr: 'التحقق من حالة المستمع' },
    ],
  },
  {
    id: 'apex',
    title: 'APEX Installation',
    titleAr: 'تثبيت APEX',
    description: 'Oracle APEX configuration',
    descriptionAr: 'إعداد Oracle APEX',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    border: 'border-cyan-500/30',
    icon: 'Globe2',
    pdfHref: '/docs/Oracle21c_Install_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'installApex', title: 'Install APEX', titleAr: 'تثبيت APEX' },
      { id: 'configureApex', title: 'Configure APEX', titleAr: 'إعداد APEX' },
      { id: 'testApex', title: 'Test APEX Access', titleAr: 'اختبار الوصول إلى APEX' },
      { id: 'configureImages', title: 'Configure Images', titleAr: 'إعداد الصور' },
      { id: 'backupApexConfig', title: 'Backup APEX Config', titleAr: 'نسخ احتياطي لإعدادات APEX' },
    ],
  },
  {
    id: 'weblogic',
    title: 'WebLogic Installation',
    titleAr: 'تثبيت WebLogic',
    description: 'WebLogic Server & Forms/Reports setup',
    descriptionAr: 'إعداد WebLogic Server و Forms/Reports',
    color: 'text-blue-400',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/30',
    icon: 'Server',
    pdfHref: '/docs/AppServer_Browsers_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'installJdk', title: 'Install JDK', titleAr: 'تثبيت JDK' },
      { id: 'installWebLogic', title: 'Install WebLogic', titleAr: 'تثبيت WebLogic' },
      { id: 'createDomain', title: 'Create Domain', titleAr: 'إنشاء النطاق' },
      { id: 'configNodeManager', title: 'Configure Node Manager', titleAr: 'إعداد Node Manager' },
      { id: 'startNodeManager', title: 'Start Node Manager', titleAr: 'تشغيل Node Manager' },
      { id: 'installFormsReports', title: 'Install Forms & Reports', titleAr: 'تثبيت Forms و Reports' },
      { id: 'applyPatch', title: 'Apply Patch', titleAr: 'تطبيق التصحيح' },
      { id: 'configureForms', title: 'Configure Forms', titleAr: 'إعداد Forms' },
      { id: 'configureReports', title: 'Configure Reports', titleAr: 'إعداد Reports' },
      { id: 'createManagedServers', title: 'Create Managed Servers', titleAr: 'إنشاء الخوادم المُدارة' },
      { id: 'startServers', title: 'Start Servers', titleAr: 'تشغيل الخوادم' },
    ],
  },
  {
    id: 'ords',
    title: 'ORDS Installation',
    titleAr: 'تثبيت ORDS',
    description: 'Oracle REST Data Services setup',
    descriptionAr: 'إعداد Oracle REST Data Services',
    color: 'text-teal-400',
    bg: 'bg-teal-500/5',
    border: 'border-teal-500/30',
    icon: 'Globe2',
    pdfHref: '/docs/ORDS_APEX_SSL_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'installOrds', title: 'Install ORDS', titleAr: 'تثبيت ORDS' },
      { id: 'configureOrds', title: 'Configure ORDS', titleAr: 'إعداد ORDS' },
      { id: 'startOrds', title: 'Start ORDS', titleAr: 'تشغيل ORDS' },
      { id: 'sslCert', title: 'SSL Certificate', titleAr: 'شهادة SSL' },
      { id: 'configureHttps', title: 'Configure HTTPS', titleAr: 'إعداد HTTPS' },
      { id: 'testOrdsAccess', title: 'Test ORDS Access', titleAr: 'اختبار الوصول إلى ORDS' },
      { id: 'backupOrdsConfig', title: 'Backup ORDS Config', titleAr: 'نسخ احتياطي لإعدادات ORDS' },
    ],
  },
  {
    id: 'ixConfig',
    title: 'IX Configuration',
    titleAr: 'إعداد IX',
    description: 'IX-specific configuration',
    descriptionAr: 'إعدادات IX الخاصة',
    color: 'text-purple-400',
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/30',
    icon: 'Settings',
    pdfHref: '/docs/Forms_Patch_17301874_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'createDirs', title: 'Create Directories', titleAr: 'إنشاء المجلدات' },
      { id: 'copyConfigFiles', title: 'Copy Config Files', titleAr: 'نسخ ملفات الإعداد' },
      { id: 'replaceHost', title: 'Replace Host', titleAr: 'استبدال المضيف' },
      { id: 'replaceService', title: 'Replace Service', titleAr: 'استبدال الخدمة' },
      { id: 'installWebUtil', title: 'Install WebUtil', titleAr: 'تثبيت WebUtil' },
      { id: 'installJarFiles', title: 'Install JAR Files', titleAr: 'تثبيت ملفات JAR' },
      { id: 'configureEnv', title: 'Configure Environment', titleAr: 'إعداد البيئة' },
      { id: 'copyRegistry', title: 'Copy Registry', titleAr: 'نسخ السجل' },
      { id: 'copyFontConfig', title: 'Copy Font Config', titleAr: 'نسخ إعدادات الخط' },
      { id: 'restartServers', title: 'Restart Servers', titleAr: 'إعادة تشغيل الخوادم' },
    ],
  },
  {
    id: 'client',
    title: 'Client Setup',
    titleAr: 'إعداد العميل',
    description: 'Client-side configuration',
    descriptionAr: 'إعدادات العميل',
    color: 'text-green-400',
    bg: 'bg-green-500/5',
    border: 'border-green-500/30',
    icon: 'MonitorCheck',
    pdfHref: '/docs/POS_Server_Guide_UltimateSolutions.pdf',
    steps: [
      { id: 'installJre', title: 'Install JRE', titleAr: 'تثبيت JRE' },
      { id: 'configBrowser', title: 'Configure Browser', titleAr: 'إعداد المتصفح' },
      { id: 'addTrustedSite', title: 'Add Trusted Site', titleAr: 'إضافة موقع موثوق' },
      { id: 'disableSecurity', title: 'Disable Security Warnings', titleAr: 'تعطيل تحذيرات الأمان' },
      { id: 'installCert', title: 'Install Certificate', titleAr: 'تثبيت الشهادة' },
      { id: 'testForms', title: 'Test Forms', titleAr: 'اختبار Forms' },
      { id: 'configPOS', title: 'Configure POS', titleAr: 'إعداد POS' },
      { id: 'testPOS', title: 'Test POS', titleAr: 'اختبار POS' },
      { id: 'verifyPrinting', title: 'Verify Printing', titleAr: 'التحقق من الطباعة' },
      { id: 'documentIPs', title: 'Document IP Addresses', titleAr: 'توثيق عناوين IP' },
    ],
  },
];

const GUIDE_STORAGE_KEY = 'ix-deployment-guide';

export function getDefaultPhases(): GuidePhase[] {
  return JSON.parse(JSON.stringify(DEFAULT_PHASES));
}

interface GuideStore {
  phases: GuidePhase[];
  setPhases: (phases: GuidePhase[]) => void;
  addPhase: (phase: Partial<GuidePhase>) => void;
  updatePhase: (id: string, patch: Partial<GuidePhase>) => void;
  removePhase: (id: string) => void;
  addStep: (phaseId: string, step: Partial<GuideStep>) => void;
  updateStep: (phaseId: string, stepId: string, patch: Partial<GuideStep>) => void;
  removeStep: (phaseId: string, stepId: string) => void;
  reorderPhases: (ids: string[]) => void;
  reorderSteps: (phaseId: string, stepIds: string[]) => void;
  resetToDefaults: () => void;
}

export const useGuideStore = create<GuideStore>()(
  persist(
    (set, get) => ({
      phases: getDefaultPhases(),

      setPhases: (phases) => set({ phases }),

      addPhase: (partial) => {
        const phase: GuidePhase = {
          id: partial.id || uid(),
          title: partial.title || 'New Phase',
          titleAr: partial.titleAr || 'مرحلة جديدة',
          description: partial.description || '',
          descriptionAr: partial.descriptionAr || '',
          color: partial.color || 'text-gray-400',
          bg: partial.bg || 'bg-gray-500/5',
          border: partial.border || 'border-gray-500/30',
          icon: partial.icon || 'Settings',
          pdfHref: partial.pdfHref || '',
          steps: partial.steps || [],
        };
        set((s) => ({ phases: [...s.phases, phase] }));
      },

      updatePhase: (id, patch) =>
        set((s) => ({
          phases: s.phases.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      removePhase: (id) =>
        set((s) => ({ phases: s.phases.filter((p) => p.id !== id) })),

      addStep: (phaseId, step) => {
        const newStep: GuideStep = {
          id: step.id || uid(),
          title: step.title || 'New Step',
          titleAr: step.titleAr || 'خطوة جديدة',
        };
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId ? { ...p, steps: [...p.steps, newStep] } : p
          ),
        }));
      },

      updateStep: (phaseId, stepId, patch) =>
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId
              ? { ...p, steps: p.steps.map((st) => (st.id === stepId ? { ...st, ...patch } : st)) }
              : p
          ),
        })),

      removeStep: (phaseId, stepId) =>
        set((s) => ({
          phases: s.phases.map((p) =>
            p.id === phaseId ? { ...p, steps: p.steps.filter((st) => st.id !== stepId) } : p
          ),
        })),

      reorderPhases: (ids) =>
        set((s) => {
          const map = new Map(s.phases.map((p) => [p.id, p]));
          return { phases: ids.map((id) => map.get(id)!).filter(Boolean) };
        }),

      reorderSteps: (phaseId, stepIds) =>
        set((s) => ({
          phases: s.phases.map((p) => {
            if (p.id !== phaseId) return p;
            const map = new Map(p.steps.map((st) => [st.id, st]));
            return { ...p, steps: stepIds.map((id) => map.get(id)!).filter(Boolean) };
          }),
        })),

      resetToDefaults: () => set({ phases: getDefaultPhases() }),
    }),
    {
      name: GUIDE_STORAGE_KEY,
    }
  )
);

export const PHASE_COLORS = [
  { color: 'text-orange-400', bg: 'bg-orange-500/5', border: 'border-orange-500/30', label: 'Orange' },
  { color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/30', label: 'Red' },
  { color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/30', label: 'Cyan' },
  { color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/30', label: 'Blue' },
  { color: 'text-teal-400', bg: 'bg-teal-500/5', border: 'border-teal-500/30', label: 'Teal' },
  { color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/30', label: 'Purple' },
  { color: 'text-green-400', bg: 'bg-green-500/5', border: 'border-green-500/30', label: 'Green' },
  { color: 'text-yellow-400', bg: 'bg-yellow-500/5', border: 'border-yellow-500/30', label: 'Yellow' },
  { color: 'text-pink-400', bg: 'bg-pink-500/5', border: 'border-pink-500/30', label: 'Pink' },
  { color: 'text-gray-400', bg: 'bg-gray-500/5', border: 'border-gray-500/30', label: 'Gray' },
];

export const ICON_OPTIONS = ['Terminal', 'Database', 'Globe2', 'Server', 'Settings', 'MonitorCheck', 'FileText', 'Shield', 'Layers', 'Network'];
