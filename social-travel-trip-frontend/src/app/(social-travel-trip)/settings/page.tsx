import { PageHeader } from '@/components/ui/page-header';
import { SettingsTabs } from '@/features/settings/settings-tabs';

export default function SettingsPage() {
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Cài đặt" 
        description="Quản lý tài khoản và tùy chọn của bạn"
      />
      
      <div className="mt-8">
        <SettingsTabs />
      </div>
    </div>
  );
}