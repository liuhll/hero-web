import request from '@/utils/request'
import setting from '@/settings'

export function queryUser(query) {
  return request({
    url: `${setting.apiPrefix}/user/query`,
    method: 'post',
    data: { query: query }
  })
}
