import request from '@/utils/request'
import setting from '@/settings'

export function queryUser(query) {
  return request({
    url: `${setting.apiPrefix}/user/search`,
    method: 'post',
    data: { query: query }
  })
}


export function create(userInfo) {
  return request({
    url: `${setting.apiPrefix}/user`,
    method: 'post',
    data: { input: userInfo }
  })
}

export function update(userInfo) {
  return request({
    url: `${setting.apiPrefix}/user`,
    method: 'put',
    data: { input: userInfo }
  })
}

export function updateStatus(userStatus) {
  return request({
    url: `${setting.apiPrefix}/user/status`,
    method: 'put',
    data: { input: userStatus }
  })
}

export function deleteUser (userId) {
  return request({
    url: `${setting.apiPrefix}/user/${userId}`,
    method: 'delete'
  })
}

export function resetPassword (input) {
  return request({
    url: `${setting.apiPrefix}/user/password`,
    method: 'put',
    data: { input: input }
  })
}

export function getUser (id) {
  return request({
    url: `${setting.apiPrefix}/user/${id}`,
    method: 'get'
  })
}

export function check (orgId) {
  return request({
    url: `${setting.apiPrefix}/user/check/${orgId}`,
    method: 'post'
  })
}