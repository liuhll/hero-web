import * as Organization from '@/api/organization/index'
import * as Corporation from '@/api/organization/corporation'
import * as Department from '@/api/organization/department'
import * as Position from '@/api/organization/position'

const actions = {
    getOrgTree({ commit }) {
        return new Promise((resolve, reject) => {
            Organization.getOrgTree().then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getOwnOrgTree({ commit }) {
        return new Promise((resolve, reject) => {
            Organization.getOwnOrgTree().then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },    
    getDeptPosition({ commit }, deptId) {
        return new Promise((resolve, reject) => {
            Department.getDeptPosition(deptId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getDeptPositionByOrgId({ commit }, orgId) {
        return new Promise((resolve, reject) => {
            Department.getDeptPositionByOrgId(orgId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    getCorporationByOrgId({ commit }, orgId) {
        return new Promise((resolve, reject) => {
            Corporation.getCorporationByOrgId(orgId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    getDepartmentByOrgId({ commit }, orgId) {
        return new Promise((resolve, reject) => {
            Department.getDepartmentByOrgId(orgId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    createDepartment({ commit }, input) {
        return new Promise((resolve, reject) => {
            Department.createDepartment(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    createCorporation({ commit }, input) {
        return new Promise((resolve, reject) => {
            Corporation.createCorporation(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    updateDepartment({ commit }, input) {
        return new Promise((resolve, reject) => {
            Department.updateDepartment(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    updateCorporation({ commit }, input) {
        return new Promise((resolve, reject) => {
            Corporation.updateCorporation(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    deleteDepartment({ commit }, orgId) {
        return new Promise((resolve, reject) => {
            Department.deleteDepartment(orgId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteCorporation({ commit }, orgId) {
        return new Promise((resolve, reject) => {
            Corporation.deleteCorporation(orgId).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    checkCanDeletePosition({ commit }, id) {
        return new Promise((resolve, reject) => {
            Position.checkCanDeletePosition(id).then(response => {
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
    actions
}
