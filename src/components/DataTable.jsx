// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { ChevronUp, ChevronDown, Search, Filter, X } from 'lucide-react';

export function DataTable({
  data,
  columns,
  onSort,
  onFilter,
  onRowClick,
  pagination,
  onPageChange,
  filterable = false,
  filterOptions = []
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [filterValue, setFilterValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const handleSort = key => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({
      key,
      direction
    });
    onSort?.(key, direction);
  };
  const handleFilter = (field, value) => {
    setFilterValue(value);
    setSelectedFilter(field);
    onFilter?.(field, value);
  };
  const clearFilters = () => {
    setFilterValue('');
    setSelectedFilter('');
    onFilter?.('', '');
  };
  return <div className="bg-white rounded-lg shadow">
          {/* 搜索和筛选 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="搜索..." value={filterValue} onChange={e => handleFilter(selectedFilter || 'title', e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              {filterable && <div className="flex items-center gap-2">
                  <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter size={16} />
                    筛选
                  </button>
                  
                  {(filterValue || selectedFilter) && <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                      <X size={16} />
                      清除筛选
                    </button>}
                </div>}
            </div>

            {/* 筛选选项 */}
            {showFilters && filterable && <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filterOptions.map(option => <div key={option.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {option.label}
                      </label>
                      {option.type === 'select' ? <select value={selectedFilter === option.key ? filterValue : ''} onChange={e => handleFilter(option.key, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="">全部{option.label}</option>
                          {option.options.map(opt => <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>)}
                        </select> : <input type="text" placeholder={`按${option.label}筛选`} value={selectedFilter === option.key ? filterValue : ''} onChange={e => handleFilter(option.key, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />}
                    </div>)}
                </div>
              </div>}
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.map(column => <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => column.sortable && handleSort(column.key)}>
                      <div className="flex items-center gap-2">
                        {column.title}
                        {column.sortable && <div className="flex flex-col">
                            <ChevronUp size={12} className={sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'} />
                            <ChevronDown size={12} className={sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'} />
                          </div>}
                      </div>
                    </th>)}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, index) => <tr key={index} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick?.(row)}>
                    {columns.map(column => <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>)}
                  </tr>)}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {pagination && <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示 {pagination.start} 到 {pagination.end} 条，共 {pagination.total} 条记录
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onPageChange(pagination.current - 1)} disabled={pagination.current === 1} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  上一页
                </button>
                <span className="px-3 py-1">
                  {pagination.current} / {pagination.pages}
                </span>
                <button onClick={() => onPageChange(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  下一页
                </button>
              </div>
            </div>}
        </div>;
}