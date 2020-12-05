import request from '@/utils/request'
import setting from '@/settings'


export const getCorporationByOrgId = (orgId) => {
    return request({
        url: `${setting.apiPrefix}/corporation/org/${orgId}`,
        method: 'get'
    })
}

export const createCorporation = (input) => {
    return request({
        url: `${setting.apiPrefix}/corporation`,
        method: 'post',
        data: {
            input: input
        }
    })
}

export const updateCorporation = (input) => {
    return request({
        url: `${setting.apiPrefix}/corporation`,
        method: 'put',
        data: {
            input: input
        }
    })
}

export const deleteCorporation = orgId => {
    return request({
        url: `${setting.apiPrefix}/corporation/${orgId}`,
        method: 'delete'
    })
}