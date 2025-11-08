// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Edit, Trash2, Plus } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { DataTable } from '@/components/DataTable';
export default function CategoriesPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('categories');
  const columns = [{
    key: 'name',
    title: '分类名称',
    sortable: true
  }, {
    key: 'description',
    title: '描述'
  }, {
    key: 'icon',
    title: '图标',
    render: icon => <Badge variant="outline">{icon}</Badge>
  }, {
    key: 'sort_order',
    title: '排序',
    sortable: true,
    render: order => order || 0
  }, {
    key: 'resource_count',
    title: '资源数量',
    sortable: true,
    render: count => count || 0
  }, {
    key: 'is_active',
    title: '状态',
    render: isActive => <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? '启用' : '禁用'}
        </Badge>
  }, {
    key: 'created_at',
    title: '创建时间',
    sortable: true,
    render: timestamp => timestamp ? new Date(timestamp).toLocaleDateString() : '-'
  }, {
    key: 'actions',
    title: '操作',
    render: (_, category) => <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Edit size={16} />
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 size={16} />
          </Button>
        </div>
  }];
  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    setLoading(true);
    try {
      // 使用数据源API查询categories数据模型
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'categories',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          pageSize: 100,
          orderBy: [{
            sort_order: 'asc'
          }]
        }
      });
      setCategories(result.records || []);
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
        dataSourceName: 'categories',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: false,
          pageSize: 100,
          orderBy: [{
            [key]: direction === 'asc' ? 'asc' : 'desc'
          }]
        }
      });
      setCategories(result.records || []);
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
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">分类管理</h2>
          <Button>
            <Plus size={16} className="mr-2" />
            添加分类
          </Button>
        </div>

        <DataTable data={categories} columns={columns} onSort={handleSort} />
      </div>
    </AdminLayout>;
}