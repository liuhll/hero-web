import { queryUser, create, update, updateStatus, deleteUser, resetPassword } from '@/api/user'
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
  },
  create({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      create(userInfo).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  update({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      update(userInfo).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateStatus({ commit }, userStatus) {
    return new Promise((resolve, reject) => {
      updateStatus(userStatus).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      deleteUser(userId).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  resetPassword({ commit }, input) {
    return new Promise((resolve, reject) => {
      resetPassword(input).then(response => {
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
