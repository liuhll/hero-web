import request from '@/utils/request'
import setting from '@/settings'


export const getCorporationByOrgId = (orgId) => {
    return request({
        url: `${setting.apiPrefix}/corporation/get/org/${orgId}`,
        method: 'get'
    })
}

export const createCorporation = (input) => {
    return request({
        url: `${setting.apiPrefix}/corporation/create`,
        method: 'post',
        data: {
            input: input
        }
    })
}
