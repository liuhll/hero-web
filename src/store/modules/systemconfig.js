import * as SystemConfig from '@/api/systemconfig'
const actions = { 
  getSystemConfig({ commit }) {
    return new Promise((resolve, reject) => {
      SystemConfig.getSystemConfig().then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setSystemConfig({ commit },input) {
    return new Promise((resolve, reject) => {
      SystemConfig.setSystemConfig(input).then(response => {
        const { data } = response
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
    actions
  }
  