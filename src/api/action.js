import request from '@/utils/request'
import setting from '@/settings'

export const getServiceActionTree = () => {
    return request({
        url: `${setting.apiPrefix}/action/get/service/tree`,
        method: 'get'
    })
}

export const getServiceAction = query => {
    return request({
        url: `${setting.apiPrefix}/action/get/service`,
        method: 'post',
        data: { query: query }
    })
}