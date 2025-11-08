// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Download, Calendar, Monitor } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { DataTable } from '@/components/DataTable';
export default function DownloadsPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0
  });
  const [currentPage, setCurrentPage] = useState('downloads');
  const columns = [{
    key: 'user_openid',
    title: '用户ID',
    sortable: true
  }, {
    key: 'resource_id',
    title: '资源ID',
    sortable: true
  }, {
    key: 'ip_address',
    title: 'IP地址'
  }, {
    key: 'user_agent',
    title: '用户代理',
    render: userAgent => <div className="max-w-xs truncate" title={userAgent}>
          {userAgent}
        </div>
  }, {
    key: 'download_time',
    title: '下载时间',
    sortable: true,
    render: timestamp => timestamp ? new Date(timestamp).toLocaleString() : '-'
  }];
  useEffect(() => {
    loadDownloads();
  }, [pagination.current]);
  const loadDownloads = async () => {
    setLoading(true);
    try {
      // 使用数据源API查询downloads数据模型
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'downloads',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 10,
          pageNumber: pagination.current,
          orderBy: [{
            download_time: 'desc'
          }]
        }
      });
      setDownloads(result.records || []);
      setPagination(prev => ({
        ...prev,
        total: result.total || 0,
        pages: Math.ceil((result.total || 0) / 10),
        start: (pagination.current - 1) * 10 + 1,
        end: Math.min(pagination.current * 10, result.total || 0)
      }));
    } catch (error) {
      toast({
        title: "加载失败",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSort = async (key, direction) => {
    try {
      // 使用数据源API进行排序
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'downloads',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: false,
          pageSize: 10,
          pageNumber: 1,
          orderBy: [{
            [key]: direction === 'asc' ? 'asc' : 'desc'
          }]
        }
      });
      setDownloads(result.records || []);
    } catch (error) {
      toast({
        title: "排序失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleNavigate = pageId => {
    setCurrentPage(pageId);
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };

  // 统计今日下载量
  const todayDownloads = downloads.filter(download => {
    const downloadDate = new Date(download.download_time).toDateString();
    const today = new Date().toDateString();
    return downloadDate === today;
  }).length;
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">总下载次数</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">今日下载</p>
                <p className="text-2xl font-bold text-gray-900">{todayDownloads}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Monitor size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">平均每日下载</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(pagination.total / 30)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">下载记录</h2>
          </div>
          <DataTable data={downloads} columns={columns} onSort={handleSort} pagination={pagination} onPageChange={page => setPagination(prev => ({
          ...prev,
          current: page
        }))} />
        </div>
      </div>
    </AdminLayout>;
}