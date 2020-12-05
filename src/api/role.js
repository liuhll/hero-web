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

export const query = query => {
  return request({
    url: `${setting.apiPrefix}/role/search`,
    method: 'post',
    data: { query: query }
  })
}

export const create = input => {
  return request({
    url: `${setting.apiPrefix}/role`,
    method: 'post',
    data: { input: input }
  })
}

export const update = input => {
  return request({
    url: `${setting.apiPrefix}/role`,
    method: 'put',
    data: { input: input }
  })
}


export const updateStatus = input => {
  return request({
    url: `${setting.apiPrefix}/role/status`,
    method: 'put',
    data: { input: input }
  })
}


export const deleteRole = id => {
  return request({
    url: `${setting.apiPrefix}/role/delete/${id}`,
    method: 'delete'
  })
}
