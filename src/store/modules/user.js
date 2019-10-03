import { queryUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {

}

const mutations = {
}

const actions = {
  queryUser({ commit }, query) {
    return new Promise((resolve, reject) => {
      queryUser(query).then(response => {
        const { data } = response        
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
