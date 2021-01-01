import request from '@/utils/request'
import setting from '@/settings'

export const getCaptcha = (uuid) => {
    return request({
        baseURL: process.env.VUE_APP_FILESERVICE_API, 
        url: `${setting.apiPrefix}/captcha/${uuid}`,
        method: 'get'
    })
}