// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Badge, Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Eye, Download, Heart, Star, MoreHorizontal, Plus } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { DataTable } from '@/components/DataTable';
import { AddResourceModal } from '@/components/AddResourceModal';
export default function ResourcesPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0
  });
  const [currentPage, setCurrentPage] = useState('resources');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const columns = [{
    key: 'title',
    title: '标题',
    sortable: true
  }, {
    key: 'category_id',
    title: '分类',
    render: categoryId => {
      const category = categories.find(cat => cat._id === categoryId);
      return category ? category.name : '未知分类';
    }
  }, {
    key: 'file_type',
    title: '文件类型',
    render: type => <Badge variant="outline">{type?.toUpperCase()}</Badge>
  }, {
    key: 'file_size',
    title: '文件大小',
    render: size => size ? `${(size / 1024 / 1024).toFixed(2)} MB` : '-'
  }, {
    key: 'download_count',
    title: '下载次数',
    sortable: true,
    render: count => count || 0
  }, {
    key: 'favorite_count',
    title: '收藏次数',
    sortable: true,
    render: count => count || 0
  }, {
    key: 'hot_score',
    title: '热度分数',
    sortable: true,
    render: score => score || 0
  }, {
    key: 'is_recommended',
    title: '推荐',
    render: isRecommended => <Badge variant={isRecommended ? 'default' : 'secondary'}>
          {isRecommended ? '已推荐' : '未推荐'}
        </Badge>
  }, {
    key: 'status',
    title: '状态',
    render: status => <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? '正常' : '禁用'}
        </Badge>
  }, {
    key: 'created_at',
    title: '创建时间',
    sortable: true,
    render: timestamp => timestamp ? new Date(timestamp).toLocaleDateString() : '-'
  }];
  const filterOptions = [{
    key: 'title',
    label: '标题',
    type: 'text'
  }, {
    key: 'category_id',
    label: '分类',
    type: 'select',
    options: categories.map(category => ({
      value: category._id,
      label: category.name
    }))
  }, {
    key: 'file_type',
    label: '文件类型',
    type: 'select',
    options: [{
      value: 'pdf',
      label: 'PDF'
    }, {
      value: 'doc',
      label: 'Word文档'
    }, {
      value: 'zip',
      label: '压缩包'
    }, {
      value: 'mp4',
      label: '视频'
    }, {
      value: 'jpg',
      label: '图片'
    }, {
      value: 'png',
      label: 'PNG'
    }]
  }, {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [{
      value: 'active',
      label: '正常'
    }, {
      value: 'inactive',
      label: '禁用'
    }]
  }, {
    key: 'is_recommended',
    label: '推荐状态',
    type: 'select',
    options: [{
      value: true,
      label: '已推荐'
    }, {
      value: false,
      label: '未推荐'
    }]
  }];
  useEffect(() => {
    loadResources();
    loadCategories();
  }, [pagination.current]);
  useEffect(() => {
    applyFilters();
  }, [resources, filterField, filterValue, categories]);
  const loadResources = async () => {
    setLoading(true);
    try {
      // 使用云开发原生实例查询数据库
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('resources');

      // 查询总数
      const countResult = await collection.count();
      const total = countResult.total;

      // 查询分页数据
      const result = await collection.orderBy('created_at', 'desc').skip((pagination.current - 1) * 10).limit(10).get();
      setResources(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: total || 0,
        pages: Math.ceil((total || 0) / 10),
        start: (pagination.current - 1) * 10 + 1,
        end: Math.min(pagination.current * 10, total || 0)
      }));
    } catch (error) {
      console.error('加载资源数据失败:', error);
      toast({
        title: "加载失败",
        description: error.message || "无法连接到数据库",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const loadCategories = async () => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('categories');
      const result = await collection.orderBy('sort_order', 'asc').get();
      setCategories(result.data || []);
    } catch (error) {
      console.error('加载分类数据失败:', error);
      toast({
        title: "加载分类失败",
        description: error.message || "无法加载分类数据",
        variant: "destructive"
      });
    }
  };
  const applyFilters = () => {
    if (!filterField || !filterValue) {
      setFilteredResources(resources);
      return;
    }
    const filtered = resources.filter(resource => {
      const fieldValue = resource[filterField];
      if (filterField === 'title') {
        return fieldValue && fieldValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (filterField === 'is_recommended') {
        return fieldValue === (filterValue === 'true');
      }
      return fieldValue === filterValue;
    });
    setFilteredResources(filtered);
  };
  const handleSort = async (key, direction) => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('resources');
      const result = await collection.orderBy(key, direction === 'asc' ? 'asc' : 'desc').limit(10).get();
      setResources(result.data || []);
    } catch (error) {
      console.error('排序失败:', error);
      toast({
        title: "排序失败",
        description: error.message || "无法排序数据",
        variant: "destructive"
      });
    }
  };
  const handleFilter = (field, value) => {
    setFilterField(field);
    setFilterValue(value);
  };
  const handleRowClick = resource => {
    console.log('点击资源:', resource);
  };
  const handlePageChange = page => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
  };
  const handleAddSuccess = () => {
    loadResources();
    setShowAddModal(false);
    toast({
      title: "操作成功",
      description: "资源已成功添加"
    });
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
          <h2 className="text-2xl font-bold text-gray-900">资源管理</h2>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="mr-2" />
            添加资源
          </Button>
        </div>

        <DataTable data={filteredResources} columns={columns} onSort={handleSort} onFilter={handleFilter} onRowClick={handleRowClick} pagination={pagination} onPageChange={handlePageChange} filterable={true} filterOptions={filterOptions} />

        {/* 添加资源弹窗 */}
        <AddResourceModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} categories={categories} $w={$w} />
      </div>
    </AdminLayout>;
}