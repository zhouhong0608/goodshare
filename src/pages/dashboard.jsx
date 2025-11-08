// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Users, FolderOpen, Heart, Download, TrendingUp, DollarSign, Activity } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { StatCard } from '@/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
export default function Dashboard(props) {
  const {
    $w
  } = props;
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    totalDonations: 0,
    totalDownloads: 0
  });
  const [chartData, setChartData] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      // 获取统计数据
      const [usersResult, resourcesResult, donationsResult, downloadsResult] = await Promise.all([$w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 1
        }
      }), $w.cloud.callDataSource({
        dataSourceName: 'resources',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 1
        }
      }), $w.cloud.callDataSource({
        dataSourceName: 'donations',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 1
        }
      }), $w.cloud.callDataSource({
        dataSourceName: 'downloads',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 1
        }
      })]);
      setStats({
        totalUsers: usersResult.total || 0,
        totalResources: resourcesResult.total || 0,
        totalDonations: donationsResult.total || 0,
        totalDownloads: downloadsResult.total || 0
      });

      // 模拟图表数据
      setChartData([{
        name: '1月',
        users: 400,
        resources: 240,
        donations: 120
      }, {
        name: '2月',
        users: 300,
        resources: 139,
        donations: 180
      }, {
        name: '3月',
        users: 200,
        resources: 380,
        donations: 200
      }, {
        name: '4月',
        users: 278,
        resources: 390,
        donations: 168
      }, {
        name: '5月',
        users: 189,
        resources: 480,
        donations: 218
      }, {
        name: '6月',
        users: 239,
        resources: 380,
        donations: 250
      }]);
    } catch (error) {
      console.error('加载仪表板数据失败:', error);
    }
  };
  const pieData = [{
    name: '编程开发',
    value: 35,
    color: '#3B82F6'
  }, {
    name: '设计素材',
    value: 25,
    color: '#10B981'
  }, {
    name: '学习资料',
    value: 20,
    color: '#F59E0B'
  }, {
    name: '工具软件',
    value: 15,
    color: '#EF4444'
  }, {
    name: '多媒体',
    value: 5,
    color: '#8B5CF6'
  }];
  const handleNavigate = pageId => {
    setCurrentPage(pageId);
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="总用户数" value={stats.totalUsers} change="+12.5%" changeType="increase" icon={Users} />
          <StatCard title="总资源数" value={stats.totalResources} change="+8.2%" changeType="increase" icon={FolderOpen} />
          <StatCard title="总捐赠数" value={stats.totalDonations} change="+15.3%" changeType="increase" icon={Heart} />
          <StatCard title="总下载数" value={stats.totalDownloads} change="+5.7%" changeType="increase" icon={Download} />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 用户增长趋势 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">用户增长趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 资源分类分布 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">资源分类分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({
                name,
                percent
              }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 最新活动 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">最新活动</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">新用户注册</p>
                  <p className="text-sm text-gray-600">用户"张三"刚刚注册了账号</p>
                </div>
                <span className="text-sm text-gray-500">2分钟前</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Download size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">资源下载</p>
                  <p className="text-sm text-gray-600">用户"李四"下载了"Vue.js 3.0 完整开发指南"</p>
                </div>
                <span className="text-sm text-gray-500">5分钟前</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">收到捐赠</p>
                  <p className="text-sm text-gray-600">用户"王五"捐赠了 20 元</p>
                </div>
                <span className="text-sm text-gray-500">10分钟前</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>;
}