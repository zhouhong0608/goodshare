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
    render: amount => `¥${amount || 0}`
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
    render: timestamp => timestamp ? new Date(timestamp).toLocaleString() : '-'
  }];
  useEffect(() => {
    loadDonations();
  }, [pagination.current]);
  const loadDonations = async () => {
    setLoading(true);
    try {
      // 使用云开发原生实例查询数据库
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('donations');

      // 查询总数
      const countResult = await collection.count();
      const total = countResult.total;

      // 查询分页数据
      const result = await collection.orderBy('created_at', 'desc').skip((pagination.current - 1) * 10).limit(10).get();
      setDonations(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: total || 0,
        pages: Math.ceil((total || 0) / 10),
        start: (pagination.current - 1) * 10 + 1,
        end: Math.min(pagination.current * 10, total || 0)
      }));
    } catch (error) {
      console.error('加载捐赠数据失败:', error);
      toast({
        title: "加载失败",
        description: error.message || "无法连接到数据库",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSort = async (key, direction) => {
    try {
      // 使用云开发原生实例进行排序
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('donations');
      const result = await collection.orderBy(key, direction === 'asc' ? 'asc' : 'desc').limit(10).get();
      setDonations(result.data || []);
    } catch (error) {
      console.error('排序失败:', error);
      toast({
        title: "排序失败",
        description: error.message || "无法排序数据",
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