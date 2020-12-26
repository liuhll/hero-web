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
    url: `${setting.apiPrefix}/account/userinfo`,
    method: 'get'
  })
}


export const accountMenu = () => {
  return request({
    url: `${setting.apiPrefix}/account/menu`,
    method: 'get'
  })  
}

export const getOperations = menuName => {
  return request({
    url: `${setting.apiPrefix}/account/operation/name/${menuName}`,
    method: 'get'
  })    
} 