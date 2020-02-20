import request from '@/utils/request'
import setting from '@/settings'

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

export const getDepartmentByOrgId = (orgId) => {
    return request({
        url: `${setting.apiPrefix}/department/get/orgid/${orgId}`,
        method: 'get'
    })
}


export const createDepartment = (input) => {
    return request({
        url: `${setting.apiPrefix}/department/create`,
        method: 'post',
        data: {
            input: input
        }
    })
}

export const updateDepartment = input => {
    return request({
        url: `${setting.apiPrefix}/department/update`,
        method: 'put',
        data: {
            input: input
        }
    })
}

export const deleteDepartment = orgId => {
    return request({
        url: `${setting.apiPrefix}/department/delete/${orgId}`,
        method: 'delete'
    })
}