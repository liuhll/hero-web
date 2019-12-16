import request from '@/utils/request'
import setting from '@/settings'

export const getOrgTree = () => {
    return request({
        url: `${setting.apiPrefix}/organization/get/tree`,
        method: 'get'
    })
}

export const getDeptPosition = (deptId) => {    
    return request({
        url: `${setting.apiPrefix}/position/get/dept/${deptId}`,
        method: 'get'
    })
}

export const getDeptPositionByOrgId = (orgId) => {    
    return request({
        url: `${setting.apiPrefix}/position/get/org/${orgId}`,
        method: 'get'
    })
}

export const getCorporationByOrgId = (orgId) => {
    return request({
        url: `${setting.apiPrefix}/corporation/get/org/${orgId}`,
        method: 'get'
    })
}

export const getDepartmentByOrgId = (orgId) => {
    return request({
        url: `${setting.apiPrefix}/department/get/orgid/${orgId}`,
        method: 'get'
    })
}