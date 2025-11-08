// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, MoreHorizontal, Power, PowerOff } from 'lucide-react';

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
  const [updatingUserId, setUpdatingUserId] = useState(null);
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
          <AvatarImage src={url} alt={row.nickName || row.nickname || '用户'} />
          <AvatarFallback>{(row.nickName || row.nickname || '用户').charAt(0)}</AvatarFallback>
        </Avatar>
  }, {
    key: 'nickName',
    title: '昵称',
    sortable: true,
    render: (value, row) => value || row.nickname || row.name || '未设置昵称'
  }, {
    key: 'openid',
    title: '用户ID',
    sortable: true
  }, {
    key: 'email',
    title: '邮箱',
    render: value => value || '未设置邮箱'
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
  }, {
    key: 'actions',
    title: '操作',
    render: (_, user) => <div className="flex items-center gap-2">
          <Button size="sm" variant={user.status === 'active' ? 'destructive' : 'default'} onClick={() => toggleUserStatus(user)} disabled={updatingUserId === user._id}>
            {updatingUserId === user._id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : user.status === 'active' ? <><PowerOff size={14} className="mr-1" />禁用</> : <><Power size={14} className="mr-1" />启用</>}
          </Button>
        </div>
  }];
  useEffect(() => {
    loadUsers();
  }, [pagination.current]);
  const loadUsers = async () => {
    setLoading(true);
    try {
      // 使用云开发原生实例查询数据库
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('users');

      // 查询总数
      const countResult = await collection.count();
      const total = countResult.total;

      // 查询分页数据
      const result = await collection.orderBy('created_at', 'desc').skip((pagination.current - 1) * 10).limit(10).get();
      console.log('用户数据:', result.data); // 调试日志
      setUsers(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: total || 0,
        pages: Math.ceil((total || 0) / 10),
        start: (pagination.current - 1) * 10 + 1,
        end: Math.min(pagination.current * 10, total || 0)
      }));
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: "加载失败",
        description: error.message || "无法连接到数据库",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleUserStatus = async user => {
    setUpdatingUserId(user._id);
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('users');

      // 更新用户状态
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await collection.doc(user._id).update({
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      // 更新本地状态
      setUsers(prev => prev.map(u => u._id === user._id ? {
        ...u,
        status: newStatus
      } : u));
      toast({
        title: "操作成功",
        description: `用户已${newStatus === 'active' ? '启用' : '禁用'}`
      });
    } catch (error) {
      console.error('更新用户状态失败:', error);
      toast({
        title: "操作失败",
        description: error.message || "无法更新用户状态",
        variant: "destructive"
      });
    } finally {
      setUpdatingUserId(null);
    }
  };
  const handleSort = async (key, direction) => {
    try {
      // 使用云开发原生实例进行排序
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('users');
      const result = await collection.orderBy(key, direction === 'asc' ? 'asc' : 'desc').limit(10).get();
      setUsers(result.data || []);
    } catch (error) {
      console.error('排序失败:', error);
      toast({
        title: "排序失败",
        description: error.message || "无法排序数据",
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