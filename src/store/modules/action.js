import * as Action from "@/api/action"

const state = {

}

const mutations = {
}

const actions = {
    getServiceActionTree({ commit }) {
        return new Promise((resolve, reject) => {
            Action.getServiceActionTree().then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getServiceAction({ commit },query) {
        return new Promise((resolve, reject) => {
            Action.getServiceAction(query).then(response => {
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
  