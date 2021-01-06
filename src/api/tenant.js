import request from '@/utils/request'
import setting from '@/settings'

export const list = (searchKey) => {
  if (searchKey == null || searchKey == undefined) {
    searchKey = ""
  }
  return request({
    url: `${setting.apiPrefix}/tenant/list`,
    method: 'post',
    params: { searchKey: searchKey }
  })
}

export const search = query => {
  return request({
    url: `${setting.apiPrefix}/tenant/search`,
    method: 'post',
    data: { query: query }
  })
}

export const create = input => {
  return request({
    url: `${setting.apiPrefix}/tenant`,
    method: 'post',
    data: { input: input }
  })
}

export const update = input => {
  return request({
    url: `${setting.apiPrefix}/tenant`,
    method: 'put',
    data: { input: input }
  })
}


export const updateStatus = input => {
  return request({
    url: `${setting.apiPrefix}/tenant/status`,
    method: 'put',
    data: { input: input }
  })
}


export const deleteTenant = id => {
  return request({
    url: `${setting.apiPrefix}/tenant/${id}`,
    method: 'delete'
  })
}

export const getTenant = id => {
  return request({
    url: `${setting.apiPrefix}/tenant/${id}`,
    method: 'get'
  })  
}