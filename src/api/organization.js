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