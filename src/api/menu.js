import request from '@/utils/request'
import setting from '@/settings'

export const getTree = () => {
    return request({
        url: `${setting.apiPrefix}/permission/get/tree`,
        method: 'get'
    })
}


export const getMenu = id => {
    return request({
        url: `${setting.apiPrefix}/permission/get/menu/${id}`,
        method: 'get'
    })
}

export const getOperation = id => {
    return request({
        url: `${setting.apiPrefix}/permission/get/operation/${id}`,
        method: 'get'
    })
}

export const createMenu = data => {
    return request({
        url: `${setting.apiPrefix}/permission/menu/create`,
        data: { 'input': data },
        method: 'post'
    })
}

export const updateMenu = data => {
    return request({
        url: `${setting.apiPrefix}/permission/menu/update`,
        data: { 'input': data },
        method: 'put'
    })
}

export const createOperation = data => {
    return request({
        url: `${setting.apiPrefix}/permission/operation/create`,
        data: { 'input': data },
        method: 'post'
    })
}

export const updateOperation = data => {
    return request({
        url: `${setting.apiPrefix}/permission/operation/update`,
        data: { 'input': data },
        method: 'put'
    })
}