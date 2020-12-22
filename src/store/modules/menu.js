import * as Menu from "@/api/menu"

const state = {

}

const mutations = {
}

const actions = {
    getTree({ commit }) {
        return new Promise((resolve, reject) => {
            Menu.getTree().then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getMenu({ commit }, id) {
        return new Promise((resolve, reject) => {
            Menu.getMenu(id).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getOperation({ commit }, id) {
        return new Promise((resolve, reject) => {
            Menu.getOperation(id).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    createMenu({ commit }, data) {
        return new Promise((resolve, reject) => {
            Menu.createMenu(data).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateMenu({ commit }, data) {
        return new Promise((resolve, reject) => {
            Menu.updateMenu(data).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    createOperation({ commit }, data) {
        return new Promise((resolve, reject) => {
            Menu.createOperation(data).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateOperation({ commit }, data) {
        return new Promise((resolve, reject) => {
            Menu.updateOperation(data).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deletePermission({ commit }, data) {
        return new Promise((resolve, reject) => {
            Menu.deletePermission(data).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getDataPermissionTypes({ commit }) {
        return new Promise((resolve, reject) => {
            Menu.getDataPermissionTypes().then(response => {
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
