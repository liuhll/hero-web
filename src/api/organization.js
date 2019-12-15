import request from '@/utils/request'
import setting from '@/settings'

export const getOrgTree = () => {
    return request({
        url: `${setting.apiPrefix}/organization/gettree`,
        method: 'get'
    })
}

export const getDeptPosition = (deptId) => {    
    return request({
        url: `${setting.apiPrefix}/position/getdeptposition/${deptId}`,
        method: 'get'
    })
}

export const getDeptPositionByOrgId = (orgId) => {    
    return request({
        url: `${setting.apiPrefix}/position/getdeptpositionbyorgid/${orgId}`,
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
        url: `${setting.apiPrefix}/department/get/byorg/${orgId}`,
        method: 'get'
    })
}