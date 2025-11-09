// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Badge, Button, useToast, Input } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';

import { AdminLayout } from '@/components/AdminLayout';
import { DataTable } from '@/components/DataTable';
// 分类模态框组件
function CategoryModal({
  title,
  category,
  onSubmit,
  onClose
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    status: category?.status || 'active'
  });
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "验证失败",
        description: "分类名称不能为空",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类名称 *
            </label>
            <Input type="text" value={formData.name} onChange={e => setFormData(prev => ({
            ...prev,
            name: e.target.value
          }))} placeholder="请输入分类名称" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} value={formData.description} onChange={e => setFormData(prev => ({
            ...prev,
            description: e.target.value
          }))} placeholder="请输入分类描述" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" value={formData.status} onChange={e => setFormData(prev => ({
            ...prev,
            status: e.target.value
          }))}>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>;
}
export default function CategoriesPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    start: 0,
    end: 0
  });
  const [currentPage, setCurrentPage] = useState('categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const columns = [{
    key: 'name',
    title: '分类名称',
    sortable: true
  }, {
    key: 'description',
    title: '描述',
    render: value => value || '暂无描述'
  }, {
    key: 'status',
    title: '状态',
    render: status => <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? '启用' : '禁用'}
        </Badge>
  }, {
    key: 'resource_count',
    title: '资源数量',
    sortable: true,
    render: count => count || 0
  }, {
    key: 'created_at',
    title: '创建时间',
    sortable: true,
    render: timestamp => timestamp ? new Date(timestamp).toLocaleDateString() : '-'
  }, {
    key: 'actions',
    title: '操作',
    render: (_, category) => <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
            <Edit size={14} className="mr-1" />
            编辑
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(category)}>
            <Trash2 size={14} className="mr-1" />
            删除
          </Button>
        </div>
  }];
  useEffect(() => {
    loadCategories();
  }, [pagination.current]);
  useEffect(() => {
    // 当搜索词或分类数据变化时，执行搜索过滤
    applySearch();
  }, [searchTerm, categories]);
  const loadCategories = async () => {
    setLoading(true);
    try {
      // 使用云开发原生实例查询数据库
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('categories');

      // 查询总数
      const countResult = await collection.count();
      const total = countResult.total;

      // 查询分页数据
      const result = await collection.orderBy('created_at', 'desc').skip((pagination.current - 1) * 10).limit(10).get();
      console.log('分类数据:', result.data); // 调试日志
      setCategories(result.data || []);
      setPagination(prev => ({
        ...prev,
        total: total || 0,
        pages: Math.ceil((total || 0) / 10),
        start: (pagination.current - 1) * 10 + 1,
        end: Math.min(pagination.current * 10, total || 0)
      }));
    } catch (error) {
      console.error('加载分类数据失败:', error);
      toast({
        title: "加载失败",
        description: error.message || "无法连接到数据库",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const applySearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const filtered = categories.filter(category => {
      // 搜索分类名称
      const name = (category.name || '').toLowerCase();
      // 搜索描述
      const description = (category.description || '').toLowerCase();
      // 搜索状态
      const status = (category.status || '').toLowerCase();
      return name.includes(searchLower) || description.includes(searchLower) || status.includes(searchLower);
    });
    setFilteredCategories(filtered);
  };
  const handleSearch = value => {
    setSearchTerm(value);
  };
  const handleEdit = category => {
    setEditingCategory(category);
    setShowEditModal(true);
  };
  const handleDelete = async category => {
    if (!confirm('确定要删除这个分类吗？删除后不可恢复。')) {
      return;
    }
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('categories');
      await collection.doc(category._id).remove();
      toast({
        title: "删除成功",
        description: "分类已成功删除"
      });
      loadCategories(); // 重新加载数据
    } catch (error) {
      console.error('删除分类失败:', error);
      toast({
        title: "删除失败",
        description: error.message || "无法删除分类",
        variant: "destructive"
      });
    }
  };
  const handleSort = async (key, direction) => {
    try {
      // 使用云开发原生实例进行排序
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('categories');
      const result = await collection.orderBy(key, direction === 'asc' ? 'asc' : 'desc').limit(10).get();
      setCategories(result.data || []);
    } catch (error) {
      console.error('排序失败:', error);
      toast({
        title: "排序失败",
        description: error.message || "无法排序数据",
        variant: "destructive"
      });
    }
  };
  const handleRowClick = category => {
    console.log('点击分类:', category);
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
  const handleAddCategory = async categoryData => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('categories');
      const newCategory = {
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        resource_count: 0
      };
      await collection.add(newCategory);
      toast({
        title: "添加成功",
        description: "分类已成功添加"
      });
      setShowAddModal(false);
      loadCategories(); // 重新加载数据
    } catch (error) {
      console.error('添加分类失败:', error);
      toast({
        title: "添加失败",
        description: error.message || "无法添加分类",
        variant: "destructive"
      });
    }
  };
  const handleUpdateCategory = async categoryData => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const db = tcb.database();
      const collection = db.collection('categories');
      const updateData = {
        ...categoryData,
        updated_at: new Date().toISOString()
      };
      await collection.doc(editingCategory._id).update(updateData);
      toast({
        title: "更新成功",
        description: "分类已成功更新"
      });
      setShowEditModal(false);
      setEditingCategory(null);
      loadCategories(); // 重新加载数据
    } catch (error) {
      console.error('更新分类失败:', error);
      toast({
        title: "更新失败",
        description: error.message || "无法更新分类",
        variant: "destructive"
      });
    }
  };
  return <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">分类管理</h2>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="mr-2" />
            添加分类
          </Button>
        </div>

        {/* 搜索栏 */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input type="text" placeholder="搜索分类名称、描述或状态..." value={searchTerm} onChange={e => handleSearch(e.target.value)} className="pl-10" />
            </div>
            {searchTerm && <Button variant="outline" onClick={() => handleSearch('')}>
                清除搜索
              </Button>}
          </div>
          {searchTerm && <div className="mt-2 text-sm text-gray-600">
              找到 {filteredCategories.length} 个匹配的分类
            </div>}
        </div>

        <DataTable data={filteredCategories} columns={columns} onSort={handleSort} onRowClick={handleRowClick} pagination={pagination} onPageChange={handlePageChange} showSearch={false} />

        {/* 添加分类模态框 */}
        {showAddModal && <CategoryModal title="添加分类" onSubmit={handleAddCategory} onClose={() => setShowAddModal(false)} />}

        {/* 编辑分类模态框 */}
        {showEditModal && <CategoryModal title="编辑分类" category={editingCategory} onSubmit={handleUpdateCategory} onClose={() => {
        setShowEditModal(false);
        setEditingCategory(null);
      }} />}
      </div>
    </AdminLayout>;
}