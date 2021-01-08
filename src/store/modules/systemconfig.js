import * as SystemConfig from '@/api/systemconfig'

const state = {
  sysName: "",
  nonPermissionOperationStyle: ""
}

const mutations = {
  SET_SYSTEM_CONFIG_SYSNAME: (state, sysName) => {
    state.sysName = sysName
  },
  SET_SYSTEM_CONFIG_OPERATIONSTYLE: (state, nonPermissionOperationStyle) => {
    state.nonPermissionOperationStyle = nonPermissionOperationStyle
  }
}

const actions = {
  getSystemConfig({ commit }) {
    return new Promise((resolve, reject) => {
      SystemConfig.getSystemConfig().then(response => {
        const { data } = response
        commit('SET_SYSTEM_CONFIG_SYSNAME',data.sysName)
        commit('SET_SYSTEM_CONFIG_OPERATIONSTYLE',data.nonPermissionOperationStyle)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setSystemConfig({ commit }, input) {
    return new Promise((resolve, reject) => {
      SystemConfig.setSystemConfig(input).then(response => {
        const { data } = response
        commit('SET_SYSTEM_CONFIG_SYSNAME',input.sysName)
        commit('SET_SYSTEM_CONFIG_OPERATIONSTYLE',input.nonPermissionOperationStyle)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getNonPermissionOperationStyles({ commit }) {
    return new Promise((resolve, reject) => {
      SystemConfig.getNonPermissionOperationStyles().then(response => {
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
  actions,
  mutations,
  state
}
