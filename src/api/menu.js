import request from '@/utils/request'
import setting from '@/settings'

export const getTree = () => {
    return request({
        url: `${setting.apiPrefix}/permission/tree`,
        method: 'get'
    })
}


export const getMenu = id => {
    return request({
        url: `${setting.apiPrefix}/permission/menu/${id}`,
        method: 'get'
    })
}

export const getOperation = id => {
    return request({
        url: `${setting.apiPrefix}/permission/operation/${id}`,
        method: 'get'
    })
}

export const createMenu = data => {
    return request({
        url: `${setting.apiPrefix}/permission/menu`,
        data: { 'input': data },
        method: 'post'
    })
}

export const updateMenu = data => {
    return request({
        url: `${setting.apiPrefix}/permission/menu`,
        data: { 'input': data },
        method: 'put'
    })
}

export const createOperation = data => {
    return request({
        url: `${setting.apiPrefix}/permission/operation`,
        data: { 'input': data },
        method: 'post'
    })
}

export const updateOperation = data => {
    return request({
        url: `${setting.apiPrefix}/permission/operation`,
        data: { 'input': data },
        method: 'put'
    })
}

export const deletePermission = data => {
    return request({
        url: `${setting.apiPrefix}/permission`,
        data: { 'input': data },
        method: 'delete'
    })    
}

export const getDataPermissionTypes = () => {
    return request({
        url: `${setting.apiPrefix}/permission/datapermissiontypes`,
        method: 'get'
    })  
}