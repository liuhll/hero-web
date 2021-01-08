import request from '@/utils/request'
import setting from '@/settings'

export const getSystemConfig = () => {
    return request({
        url: `${setting.apiPrefix}/systemconfig`,
        method: 'get'
    })
}

export const setSystemConfig = input => {
    return request({
        url: `${setting.apiPrefix}/systemconfig`,
        method: 'put',
        data: { input: input }
    })
}

export const getNonPermissionOperationStyles = () => {
    return request({
        url: `${setting.apiPrefix}/systemconfig/nonpermissionoperationstyles`,
        method: 'get'
    })
}