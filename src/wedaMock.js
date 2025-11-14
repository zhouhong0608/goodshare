import usersRaw from '../.datasources/users/data.json'
import resourcesRaw from '../.datasources/resources/data.json'

function normalize(ds) {
  if (!ds) return { records: [], total: 0 }
  if (Array.isArray(ds)) return { records: ds, total: ds.length }
  const records = Array.isArray(ds.records) ? ds.records : []
  const total = typeof ds.total === 'number' ? ds.total : records.length
  return { records, total }
}

const map = {
  users: normalize(usersRaw),
  resources: normalize(resourcesRaw),
  donations: { records: [], total: 0 },
  downloads: { records: [], total: 0 },
}

export const $w = {
  utils: {
    navigateTo: (payload) => console.log('[navigateTo]', payload),
  },
  cloud: {
    async callDataSource({ dataSourceName, methodName, params }) {
      // 最小实现：仅返回总数与记录，用于仪表盘统计
      const ds = map[dataSourceName] || { records: [], total: 0 }
      // 可根据 params 做筛选/分页，这里先忽略以确保页面可运行
      return Promise.resolve({ ...ds })
    },
  },
}