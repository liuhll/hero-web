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