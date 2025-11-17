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
    
    async getCloudInstance() {
      // 模拟云开发实例，返回一个具有database方法的对象
      return {
        database() {
          return {
            collection(collectionName) {
              const data = map[collectionName] || { records: [], total: 0 }
              
              return {
                async count() {
                  return { total: data.total }
                },
                
                async get() {
                  return { data: data.records }
                },
                
                orderBy(field, order) {
                  const sortedRecords = [...data.records].sort((a, b) => {
                    const aVal = a[field] || 0
                    const bVal = b[field] || 0
                    if (order === 'desc') {
                      return bVal > aVal ? 1 : -1
                    }
                    return aVal > bVal ? 1 : -1
                  })
                  
                  return {
                    async get() {
                      return { data: sortedRecords }
                    },
                    skip(num) {
                      const skippedRecords = sortedRecords.slice(num)
                      return {
                        async get() {
                          return { data: skippedRecords }
                        },
                        limit(limitNum) {
                          return {
                            async get() {
                              return { data: skippedRecords.slice(0, limitNum) }
                            }
                          }
                        }
                      }
                    },
                    limit(num) {
                      return {
                        async get() {
                          return { data: sortedRecords.slice(0, num) }
                        }
                      }
                    }
                  }
                },
                
                skip(num) {
                  const skippedRecords = data.records.slice(num)
                  return {
                    async get() {
                      return { data: skippedRecords }
                    },
                    limit(limitNum) {
                      return {
                        async get() {
                          return { data: skippedRecords.slice(0, limitNum) }
                        }
                      }
                    }
                  }
                },
                
                limit(num) {
                  return {
                    async get() {
                      return { data: data.records.slice(0, num) }
                    }
                  }
                },
                
                doc(id) {
                  return {
                    async update(updateData) {
                      console.log(`模拟更新文档 ${id}:`, updateData)
                      // 在真实环境中，这里会更新数据库
                      return { id }
                    },
                    async remove() {
                      console.log(`模拟删除文档 ${id}`)
                      // 在真实环境中，这里会删除数据库记录
                      return { id }
                    }
                  }
                },
                
                async add(newData) {
                  console.log(`模拟添加数据到集合 ${collectionName}:`, newData)
                  // 在真实环境中，这里会向数据库添加记录
                  return { id: `mock_${Date.now()}` }
                }
              }
            }
          }
        },
        
        async uploadFile({ cloudPath, filePath }) {
          console.log(`模拟上传文件: ${cloudPath}`)
          // 在真实环境中，这里会上传文件到云存储
          return { fileID: `cloud://mock-env/${cloudPath}` }
        },
        
        async getTempFileURL({ fileList }) {
          console.log(`模拟获取临时文件URL:`, fileList)
          // 在真实环境中，这里会获取文件的临时访问URL
          return {
            fileList: fileList.map(fileID => ({
              fileID,
              tempFileURL: `https://mock-cdn.example.com/${fileID.replace('cloud://', '')}`
            }))
          }
        }
      }
    }
  },
}