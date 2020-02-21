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
    url: `${setting.apiPrefix}/role/query`,
    method: 'post',
    data: { query: query }
  })
}

export const create = input => {
  return request({
    url: `${setting.apiPrefix}/role/create`,
    method: 'post',
    data: { input: input }
  })
}

export const update = input => {
  return request({
    url: `${setting.apiPrefix}/role/update`,
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


export const getPermissions = id => {
  return request({
    url: `${setting.apiPrefix}/role/get/permissions/${id}`,
    method: 'get'
  })
}


export const setPermissions = input => {
  return request({
    url: `${setting.apiPrefix}/role/set/permissions`,
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
