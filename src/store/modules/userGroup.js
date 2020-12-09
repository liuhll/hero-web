import * as UserGroup from "@/api/userGroup.js"


const state = {

}

const mutations = {
}

const actions = {
    createUserGroup({ commit },input) {
        return new Promise((resolve, reject) => {
            UserGroup.createUserGroup(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateUserGroup({ commit },input) {
        return new Promise((resolve, reject) => {
            UserGroup.updateUserGroup(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    }, 
    updateUserGroupStatus({ commit },input) {
        return new Promise((resolve, reject) => {
            UserGroup.updateUserGroupStatus(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    }, 
    deleteUserGroup({ commit },input) {
        return new Promise((resolve, reject) => {
            UserGroup.deleteUserGroup(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },        
    getUserGroup({ commit },id) {
        return new Promise((resolve, reject) => {
            UserGroup.getUserGroup(id).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    }, 
    searchUserGroup({ commit },query) {
        return new Promise((resolve, reject) => {
            UserGroup.searchUserGroup(query).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },   
    addUserGroupUsers({ commit },input) {
        return new Promise((resolve, reject) => {
            UserGroup.addUserGroupUsers(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },   
    deleteUserGroupUser({ commit },input) {
        return new Promise((resolve, reject) => {
            UserGroup.deleteUserGroupUser(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },       
    searchUserGroupUser({ commit },query) {
        return new Promise((resolve, reject) => {
            UserGroup.searchUserGroupUser(query).then(response => {
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
  