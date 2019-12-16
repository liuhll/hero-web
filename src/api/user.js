import request from '@/utils/request'
import setting from '@/settings'

export function queryUser(query) {
  return request({
    url: `${setting.apiPrefix}/user/query`,
    method: 'post',
    data: { query: query }
  })
}


export function create(userInfo) {
  return request({
    url: `${setting.apiPrefix}/user/create`,
    method: 'post',
    data: { input: userInfo }
  })
}

export function update(userInfo) {
  return request({
    url: `${setting.apiPrefix}/user/update`,
    method: 'put',
    data: { input: userInfo }
  })
}

export function updateStatus(userStatus) {
  return request({
    url: `${setting.apiPrefix}/user/update/status`,
    method: 'put',
    data: { input: userStatus }
  })
}

export function deleteUser (userId) {
  return request({
    url: `${setting.apiPrefix}/user/delete/${userId}`,
    method: 'delete'
  })
}

export function resetPassword (input) {
  return request({
    url: `${setting.apiPrefix}/user/resetpassword`,
    method: 'put',
    data: { input: input }
  })
}