import request from '@/utils/request'
import setting from '@/settings'

export const list = (searchKey) => {
  if (searchKey == null || searchKey == undefined) {
    searchKey = ""
  }
  return request({
    url: `${setting.apiPrefix}/role/list`,
    method: 'get',
    params: { searchKey: searchKey }
  })
}

