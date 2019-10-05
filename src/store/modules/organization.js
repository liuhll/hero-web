import { getOrgTree, getDeptPosition, getDeptPositionByOrgId } from '@/api/organization'

const actions = {
    getOrgTree({ commit }) {
        return new Promise((resolve, reject) => {
            getOrgTree().then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getDeptPosition({ commit }, deptId) {
        return new Promise((resolve, reject) => {
            getDeptPosition(deptId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getDeptPositionByOrgId({ commit }, orgId) {
        return new Promise((resolve, reject) => {
            getDeptPositionByOrgId(orgId).then(response => {                
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
