import request from '@/utils/request'
import setting from '@/settings'


export function createUserGroup(input) {
    return request({
        url: `${setting.apiPrefix}/usergroup`,
        method: 'post',
        data: { input: input }
    })
}


export function updateUserGroup(input) {
    return request({
        url: `${setting.apiPrefix}/usergroup`,
        method: 'put',
        data: { input: input }
    })
}

export function updateUserGroupStatus(input) {
    return request({
        url: `${setting.apiPrefix}/usergroup/status`,
        method: 'put',
        data: { input: input }
    })
}


export function deleteUserGroup(id) {
    return request({
        url: `${setting.apiPrefix}/usergroup/${id}`,
        method: 'delete'
    })
}

export function getUserGroup(id) {
    return request({
        url: `${setting.apiPrefix}/usergroup/${id}`,
        method: 'get'
    })
}

export function searchUserGroup(query) {
    return request({
        url: `${setting.apiPrefix}/usergroup/search`,
        method: 'post',
        data: { query: query }
    })
}


export function searchUserGroupUser(query) {
    return request({
        url: `${setting.apiPrefix}/usergroup/users/search`,
        method: 'post',
        data: { query: query }
    })
}

export function deleteUserGroupUser(input) {
    return request({
        url: `${setting.apiPrefix}/usergroup/users`,
        method: 'delete',
        data: { input: input }
    })
}

export function addUserGroupUsers(input) {
    return request({
        url: `${setting.apiPrefix}/usergroup/users`,
        method: 'post',
        data: { input: input }
    })
}