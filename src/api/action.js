import request from '@/utils/request'
import setting from '@/settings'

export const getServiceActionTree = () => {
    return request({
        url: `${setting.apiPrefix}/action/service/tree`,
        method: 'get'
    })
}

export const getServiceAction = query => {
    return request({
        url: `${setting.apiPrefix}/action/action/search`,
        method: 'post',
        data: { query: query }
    })
}