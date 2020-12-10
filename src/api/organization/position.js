import request from '@/utils/request'
import setting from '@/settings'

export const checkCanDeletePosition = (id) => {
    return request({
        url: `${setting.apiPrefix}/position/check/${id}`,
        method: 'post'
    })
}