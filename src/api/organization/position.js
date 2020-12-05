import request from '@/utils/request'
import setting from '@/settings'

export const checkCanDeletePosition = (input) => {
    return request({
        url: `${setting.apiPrefix}/position/check`,
        method: 'post',
        data: {
            input: input
        }
    })
}