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
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
  }
  