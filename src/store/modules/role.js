import * as Role from '@/api/role'
const actions = {
    list({ commit }, searchKey) {
        return new Promise((resolve, reject) => {
            Role.list(searchKey).then(response => {
                const { data } = response
                resolve(data)
             }).catch(err => { 
                reject(err)
            })
        })
    },
    search({ commit }, query) {
        return new Promise((resolve, reject) => {
            Role.search(query).then(response => {
                const { data } = response
                resolve(data)
             }).catch(err => { 
                reject(err)
            })
        })
    },
    create({commit}, input) {
        return new Promise((resolve, reject) => {
            Role.create(input).then(response => {
                const { data } = response
                resolve(data)
             }).catch(err => { 
                reject(err)
            })
        })
    },
    update({commit}, input) {
        return new Promise((resolve, reject) => {
            Role.update(input).then(response => {
                const { data } = response
                resolve(data)
             }).catch(err => { 
                reject(err)
            })
        })
    },
    updateStatus({ commit }, input) {
        return new Promise((resolve, reject) => {
            Role.updateStatus(input).then(response => {
            const { data } = response
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      getPermissions({ commit }, id) {
        return new Promise((resolve, reject) => {
            Role.getPermissions(id).then(response => {
            const { data } = response
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
      },
      setPermissions({ commit }, input) {
        return new Promise((resolve, reject) => {
            Role.setPermissions(input).then(response => {
            const { data } = response
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        })
      }, 
      delete({ commit }, id) {
        return new Promise((resolve, reject) => {
            Role.deleteRole(id).then(response => {
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
