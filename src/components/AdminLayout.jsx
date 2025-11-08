// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';
// @ts-ignore;
import { LayoutDashboard, Users, FolderOpen, Heart, Download, BarChart3, Menu, X, LogOut, Settings } from 'lucide-react';

export function AdminLayout({
  children,
  currentPage,
  onNavigate
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const menuItems = [{
    id: 'dashboard',
    label: '仪表板',
    icon: LayoutDashboard
  }, {
    id: 'users',
    label: '用户管理',
    icon: Users
  }, {
    id: 'resources',
    label: '资源管理',
    icon: FolderOpen
  }, {
    id: 'categories',
    label: '分类管理',
    icon: Settings
  }, {
    id: 'donations',
    label: '捐赠管理',
    icon: Heart
  }, {
    id: 'downloads',
    label: '下载记录',
    icon: Download
  }, {
    id: 'analytics',
    label: '数据统计',
    icon: BarChart3
  }];
  return <div className="flex h-screen bg-gray-50">
          {/* 侧边栏 */}
          <div className={cn("bg-gray-900 text-white transition-all duration-300 ease-in-out", sidebarOpen ? "w-64" : "w-16")}>
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h1 className={cn("font-bold text-xl", !sidebarOpen && "hidden")}>
                管理后台
              </h1>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded hover:bg-gray-800 transition-colors">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            
            <nav className="p-4">
              {menuItems.map(item => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => onNavigate(item.id)} className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-2", currentPage === item.id ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-300")}>
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>;
        })}
            </nav>
          </div>

          {/* 主内容区 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* 顶部栏 */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {menuItems.find(item => item.id === currentPage)?.label}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">管理员</span>
                  <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                    <LogOut size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </header>

            {/* 内容区域 */}
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>;
}