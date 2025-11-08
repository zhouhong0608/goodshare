// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { TrendingUp, Users, Download, Heart, DollarSign, Activity } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
export default function AnalyticsPage(props) {
  const {
    $w
  } = props;
  const [currentPage, setCurrentPage] = useState('analytics');

  // 模拟数据
  const userGrowthData = [{
    month: '1月',
    users: 120,
    newUsers: 30
  }, {
    month: '2月',
    users: 150,
    newUsers: 35
  }, {
    month: '3月',
    users: 180,
    newUsers: 40
  }, {
    month: '4月',
    users: 220,
    newUsers: 45
  }, {
    month: '5月',
    users: 260,
    newUsers: 50
  }, {
    month: '6月',
    users: 310,
    newUsers: 60
  }];
  const resourceStats = [{
    category: '编程开发',
    count: 45,
    downloads: 1200
  }, {
    category: '设计素材',
    count: 32,
    downloads: 800
  }, {
    category: '学习资料',
    count: 28,
    downloads: 600
  }, {
    category: '工具软件',
    count: 20,
    downloads: 400
  }, {
    category: '多媒体',
    count: 15,
    downloads: 200
  }];
  const donationTrend = [{
    date: '11-01',
    amount: 120
  }, {
    date: '11-02',
    amount: 180
  }, {
    date: '11-03',
    amount: 150
  }, {
    date: '11-04',
    amount: 220
  }, {
    date: '11-05',
    amount: 280
  }, {
    date: '11-06',
    amount: 320
  }, {
    date: '11-07',
    amount: 380
  }];
  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  const handleNavigate = pageId => {
    setCurrentPage(pageId);
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">数据统计</h2>

        {/* 用户增长趋势 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">用户增长趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
              <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#10B981" fill="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 资源分类统计 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">资源分类统计</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
                <Bar dataKey="downloads" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">资源分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={resourceStats} cx="50%" cy="50%" labelLine={false} label={({
                category,
                percent
              }) => `${category} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="count">
                  {resourceStats.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 捐赠趋势 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">捐赠趋势（最近7天）</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={donationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 关键指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">月活跃用户</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600">+12.5%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">月下载量</p>
                <p className="text-2xl font-bold text-gray-900">5,678</p>
                <p className="text-sm text-green-600">+8.2%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">月捐赠额</p>
                <p className="text-2xl font-bold text-gray-900">¥12,345</p>
                <p className="text-sm text-green-600">+15.3%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">转化率</p>
                <p className="text-2xl font-bold text-gray-900">3.45%</p>
                <p className="text-sm text-red-600">-2.1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>;
}