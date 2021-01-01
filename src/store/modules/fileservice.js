import * as FileService from "@/api/fileservice"


const state = {

}

const mutations = {
}

const actions = {
    getCaptcha({ commit },uuid) {
        return new Promise((resolve, reject) => {
            FileService.getCaptcha(uuid).then(response => {
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
  