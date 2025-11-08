// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, MoreHorizontal } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { DataTable } from '@/components/DataTable';
export default function UsersPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0
  });
  const [currentPage, setCurrentPage] = useState('users');
  const columns = [{
    key: 'avatar_url',
    title: '头像',
    render: (url, row) => <Avatar className="w-10 h-10">
          <AvatarImage src={url} alt={row.nickname} />
          <AvatarFallback>{row.nickname?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
  }, {
    key: 'nickname',
    title: '昵称',
    sortable: true
  }, {
    key: 'openid',
    title: '用户ID',
    sortable: true
  }, {
    key: 'email',
    title: '邮箱'
  }, {
    key: 'role',
    title: '角色',
    render: role => <Badge variant={role === 'admin' ? 'destructive' : 'secondary'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Badge>
  }, {
    key: 'status',
    title: '状态',
    render: status => <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? '活跃' : '禁用'}
        </Badge>
  }, {
    key: 'total_downloads',
    title: '下载数',
    sortable: true,
    render: count => count || 0
  }, {
    key: 'total_donations',
    title: '捐赠数',
    sortable: true,
    render: count => count || 0
  }, {
    key: 'created_at',
    title: '注册时间',
    sortable: true,
    render: timestamp => timestamp ? new Date(timestamp).toLocaleDateString() : '-'
  }];
  useEffect(() => {
    loadUsers();
  }, [pagination.current]);
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 使用数据源API查询users数据模型
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'users',
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
      setUsers(result.records || []);
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
        dataSourceName: 'users',
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
      setUsers(result.records || []);
    } catch (error) {
      toast({
        title: "排序失败",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleRowClick = user => {
    console.log('点击用户:', user);
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
          <h2 className="text-2xl font-bold text-gray-900">用户管理</h2>
          <Button>添加用户</Button>
        </div>

        <DataTable data={users} columns={columns} onSort={handleSort} onRowClick={handleRowClick} pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </AdminLayout>;
}