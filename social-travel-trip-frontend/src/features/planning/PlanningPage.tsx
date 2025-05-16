import React, { useState } from 'react';
import TemplatesList from './TemplatesList';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/radix-ui/button';
import {
  LayoutTemplate,
  Users,
  Calendar,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

const PlanningPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const navItems: NavItem[] = [
    {
      key: 'templates',
      icon: <LayoutTemplate className="h-5 w-5" />,
      label: 'Mẫu kế hoạch'
    },
    {
      key: 'myplans',
      icon: <Calendar className="h-5 w-5" />,
      label: 'Kế hoạch của tôi'
    },
    {
      key: 'groups',
      icon: <Users className="h-5 w-5" />,
      label: 'Nhóm của tôi'
    },
    {
      key: 'create',
      icon: <Plus className="h-5 w-5" />,
      label: 'Tạo kế hoạch mới'
    },
    {
      key: 'settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Cài đặt'
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-center border-b px-4">
          <h1 className="text-lg font-semibold text-primary">
            {collapsed ? "ST" : "Social Travel"}
          </h1>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={activeTab === item.key ? "secondary" : "ghost"}
                className={cn(
                  "justify-start gap-2 px-3",
                  collapsed && "justify-center px-2"
                )}
                onClick={() => setActiveTab(item.key)}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        {/* Collapse button */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {activeTab === 'templates' && <TemplatesList />}
          {activeTab === 'myplans' && (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Kế hoạch của tôi</h2>
                <p className="text-muted-foreground mt-2">Tính năng đang được phát triển</p>
              </div>
            </div>
          )}
          {activeTab === 'groups' && (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Nhóm của tôi</h2>
                <p className="text-muted-foreground mt-2">Tính năng đang được phát triển</p>
              </div>
            </div>
          )}
          {activeTab === 'create' && (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Tạo kế hoạch mới</h2>
                <p className="text-muted-foreground mt-2">Tính năng đang được phát triển</p>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="flex h-[80vh] items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Cài đặt</h2>
                <p className="text-muted-foreground mt-2">Tính năng đang được phát triển</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
