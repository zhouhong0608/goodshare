// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Heart, DollarSign, Calendar } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { DataTable } from '@/components/DataTable';
export default function DonationsPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0
  });
  const [currentPage, setCurrentPage] = useState('donations');
  const columns = [{
    key: 'transaction_id',
    title: '交易ID',
    sortable: true
  }, {
    key: 'user_openid',
    title: '用户ID',
    sortable: true
  }, {
    key: 'resource_id',
    title: '资源ID',
    sortable: true
  }, {
    key: 'amount',
    title: '捐赠金额',
    sortable: true,
    render: amount => `¥${amount}`
  }, {
    key: 'message',
    title: '留言'
  }, {
    key: 'status',
    title: '状态',
    render: status => <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
          {status === 'completed' ? '已完成' : '待处理'}
        </Badge>
  }, {
    key: 'created_at',
    title: '捐赠时间',
    sortable: true,
    render: timestamp => new Date(timestamp).toLocaleString()
  }];
  useEffect(() => {
    loadDonations();
  }, [pagination.current]);
  const loadDonations = async () => {
    setLoading(true);
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'donations',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 10,
          pageNumber: pagination.current,
          orderBy: [{
            created_at: 'desc'
          }]
        }
      });
      setDonations(result.records || []);
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
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'donations',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 10,
          pageNumber: 1,
          orderBy: [{
            [key]: direction === 'asc' ? 'asc' : 'desc'
          }]
        }
      });
      setDonations(result.records || []);
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
  const totalAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">总捐赠次数</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">总捐赠金额</p>
                <p className="text-2xl font-bold text-gray-900">¥{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">平均捐赠金额</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">捐赠记录</h2>
          </div>
          <DataTable data={donations} columns={columns} onSort={handleSort} pagination={pagination} onPageChange={page => setPagination(prev => ({
          ...prev,
          current: page
        }))} />
        </div>
      </div>
    </AdminLayout>;
}