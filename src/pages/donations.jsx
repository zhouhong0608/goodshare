// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, useToast, Input } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, MoreHorizontal, Eye, Download } from 'lucide-react';

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
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 状态筛选
  const [typeFilter, setTypeFilter] = useState(''); // 类型筛选
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0
  });
  const [currentPage, setCurrentPage] = useState('donations');
  const columns = [{
    key: 'user_info',
    title: '用户',
    render: (user_info, row) => <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user_info?.avatar_url} alt={user_info?.nickName || '用户'} />
            <AvatarFallback>{(user_info?.nickName || '用户').charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user_info?.nickName || user_info?.nickname || '未知用户'}</div>
            <div className="text-sm text-gray-500">{row.user_id}</div>
          </div>
        </div>
  }, {
    key: 'amount',
    title: '捐赠金额',
    sortable: true,
    render: amount => <span className="font-semibold text-green-600">¥{amount || 0}</span>
  }, {
    key: 'type',
    title: '类型',
    render: type => <Badge variant={type === 'monthly' ? 'default' : 'secondary'}>
          {type === 'monthly' ? '月度捐赠' : '单次捐赠'}
        </Badge>
  }, {
    key: 'message',
    title: '留言',
    render: message => message || '无留言'
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
    render: timestamp => timestamp ? new Date(timestamp).toLocaleDateString() : '-'
  }, {
    key: 'actions',
    title: '操作',
    render: (_, donation) => <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => console.log('查看详情', donation)}>
            <Eye size={14} className="mr-1" />
            详情
          </Button>
        </div>
  }];
  useEffect(() => {
    loadDonations();
  }, [pagination.current]);
  useEffect(() => {
    // 当搜索词、状态筛选、类型筛选或捐赠数据变化时，执行搜索过滤
    applyFilters();
  }, [searchTerm, statusFilter, typeFilter, donations]);
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
      console.log('捐赠数据:', result.data); // 调试日志
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
  const applyFilters = () => {
    let filtered = [...donations];

    // 应用搜索过滤
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(donation => {
        // 搜索用户昵称
        const nickName = (donation.user_info?.nickName || donation.user_info?.nickname || '').toLowerCase();
        // 搜索用户ID
        const userId = (donation.user_id || '').toLowerCase();
        // 搜索留言
        const message = (donation.message || '').toLowerCase();
        // 搜索金额
        const amount = (donation.amount || '').toString();
        return nickName.includes(searchLower) || userId.includes(searchLower) || message.includes(searchLower) || amount.includes(searchLower);
      });
    }

    // 应用状态筛选
    if (statusFilter) {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }

    // 应用类型筛选
    if (typeFilter) {
      filtered = filtered.filter(donation => donation.type === typeFilter);
    }
    setFilteredDonations(filtered);
  };
  const handleSearch = value => {
    setSearchTerm(value);
  };
  const handleStatusFilter = value => {
    setStatusFilter(value);
  };
  const handleTypeFilter = value => {
    setTypeFilter(value);
  };
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
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
  const handleRowClick = donation => {
    console.log('点击捐赠记录:', donation);
  };
  const handlePageChange = page => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
  };
  const handleNavigate = pageId => {
    setCurrentPage(pageId);
    $w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">捐赠管理</h2>
          <Button>导出记录</Button>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input type="text" placeholder="搜索用户昵称、用户ID、留言或金额..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="pl-10" />
            </div>
            
            {/* 状态筛选 */}
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={statusFilter} onChange={e => handleStatusFilter(e.target.value)}>
              <option value="">所有状态</option>
              <option value="completed">已完成</option>
              <option value="pending">待处理</option>
            </select>
            
            {/* 类型筛选 */}
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={typeFilter} onChange={e => handleTypeFilter(e.target.value)}>
              <option value="">所有类型</option>
              <option value="monthly">月度捐赠</option>
              <option value="once">单次捐赠</option>
            </select>
            
            {(searchTerm || statusFilter || typeFilter) && <Button variant="outline" onClick={handleClearFilters}>
                清除筛选
              </Button>}
          </div>
          {(searchTerm || statusFilter || typeFilter) && <div className="mt-2 text-sm text-gray-600">
              找到 {filteredDonations.length} 个匹配的捐赠记录
            </div>}
        </div>

        <DataTable data={filteredDonations} columns={columns} onSort={handleSort} onRowClick={handleRowClick} pagination={pagination} onPageChange={handlePageChange} showSearch={false} />
      </div>
    </AdminLayout>;
}