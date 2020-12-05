import request from '@/utils/request'
import setting from '@/settings'

export const getDeptPosition = (deptId) => {    
    return request({
        url: `${setting.apiPrefix}/position/dept/${deptId}`,
        method: 'get'
    })
}

export const getDeptPositionByOrgId = (orgId) => {    
    return request({
        url: `${setting.apiPrefix}/position/org/${orgId}`,
        method: 'get'
    })
}

export const getDepartmentByOrgId = (orgId) => {
    return request({
        url: `${setting.apiPrefix}/department/org/${orgId}`,
        method: 'get'
    })
}


export const createDepartment = (input) => {
    return request({
        url: `${setting.apiPrefix}/department`,
        method: 'post',
        data: {
            input: input
        }
    })
}

export const updateDepartment = input => {
    return request({
        url: `${setting.apiPrefix}/department`,
        method: 'put',
        data: {
            input: input
        }
    })
}

export const deleteDepartment = orgId => {
    return request({
        url: `${setting.apiPrefix}/department/${orgId}`,
        method: 'delete'
    })
}