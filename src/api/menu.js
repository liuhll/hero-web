import request from '@/utils/request'
import setting from '@/settings'

export const getTree = () => {
    return request({
        url: `${setting.apiPrefix}/permission/get/tree`,
        method: 'get'
    })
}
