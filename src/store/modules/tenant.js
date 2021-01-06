import * as Tenant from '@/api/tenant'
const actions = {
  list({ commit }, searchKey) {
    return new Promise((resolve, reject) => {
      Tenant.list(searchKey).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  search({ commit }, query) {
    return new Promise((resolve, reject) => {
      Tenant.search(query).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  create({ commit }, input) {
    return new Promise((resolve, reject) => {
      Tenant.create(input).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  update({ commit }, input) {
    return new Promise((resolve, reject) => {
      Tenant.update(input).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateStatus({ commit }, input) {
    return new Promise((resolve, reject) => {
      Tenant.updateStatus(input).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  delete({ commit }, id) {
    return new Promise((resolve, reject) => {
      Tenant.deleteTenant(id).then(response => {
        const { data } = response
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getTenant({ commit }, id) {
    return new Promise((resolve, reject) => {
      Tenant.getTenant(id).then(response => {
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
