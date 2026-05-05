import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Download, FileText, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";
import { useState } from "react";
import { useLanguage } from "../../LanguageContext";

export function PlatformSettings() {
  const { t } = useLanguage();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleExportPDF = async () => {
    const token = localStorage.getItem("token");
    toast.info(t('settings.export_pdf_loading'));
    try {
      const res = await fetch(`${API_BASE_URL}/admin/export/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-swapmarket-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('settings.export_pdf_success'));
    } catch {
      toast.error(t('settings.export_pdf_error'));
    }
  };

  const handleExportXML = async () => {
    const token = localStorage.getItem("token");
    toast.info(t('settings.export_xml_loading'));
    try {
      const res = await fetch(`${API_BASE_URL}/admin/export/xml`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-swapmarket-${new Date().toISOString().split("T")[0]}.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('settings.export_xml_success'));
    } catch {
      toast.error(t('settings.export_xml_error'));
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">{t('admin_nav.settings')}</h1>
        <p className="text-neutral-600">{t('settings.platform_desc')}</p>
      </div>

      <div className="grid gap-6">
        {/* Export Section - Kept as requested */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-neutral-900">{t('settings.export_data')}</h2>
          <p className="mb-6 text-neutral-500">{t('settings.export_desc')}</p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExportPDF} className="h-11 gap-2 bg-neutral-900 px-6 text-white hover:bg-neutral-800 transition-all">
              <FileText className="h-5 w-5" />
              {t('settings.export_pdf_btn')}
            </Button>
            <Button variant="outline" onClick={handleExportXML} className="h-11 gap-2 px-6 border-neutral-200 hover:bg-neutral-50 transition-all">
              <Download className="h-5 w-5" />
              {t('settings.export_xml_btn')}
            </Button>
          </div>
        </div>

        {/* Global Controls - Simplified */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-neutral-900">{t('settings.system_controls')}</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">{t('settings.maintenance_mode')}</p>
                  <p className="text-sm text-neutral-500">{t('settings.maintenance_desc')}</p>
                </div>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={(checked) => {
                  setMaintenanceMode(checked);
                  toast.info(checked ? t('settings.maintenance_on') : t('settings.maintenance_off'));
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
