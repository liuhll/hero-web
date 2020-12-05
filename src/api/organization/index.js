import request from '@/utils/request'
import setting from '@/settings'

export const getOrgTree = () => {
    return request({
        url: `${setting.apiPrefix}/organization/tree`,
        method: 'get'
    })
}
