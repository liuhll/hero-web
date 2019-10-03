import request from '@/utils/request'
import setting from '@/settings'

export const login = ({ userName, password }) => {
  const data = { userName, password }
  return request({
    url: 'api/oauth2/token',
    data: { 'input': data },
    method: 'post'

  })
}

export const getLoginUser = () => {
  return request({
    url: `${setting.apiPrefix}/account/getloginuser`,
    method: 'get'
  })
}
