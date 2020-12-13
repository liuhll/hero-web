import * as WordBook from '@/api/wordbook'

const actions = {
    getWordbookitemByCode({ commit }, code) {
        return new Promise((resolve, reject) => {
            WordBook.getWordbookitemByCode(code).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    searchWordbook({ commit }, query) {
        return new Promise((resolve, reject) => {
            WordBook.searchWordbook(query).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    createWordbook({ commit }, input) {
        return new Promise((resolve, reject) => {
            WordBook.createWordbook(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateWordbook({ commit }, input) {
        return new Promise((resolve, reject) => {
            WordBook.updateWordbook(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteWordbook({ commit }, id) {
        return new Promise((resolve, reject) => {
            WordBook.deleteWordbook(id).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    updateWordbookItem({ commit }, input) {
        return new Promise((resolve, reject) => {
            WordBook.updateWordbookItem(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },  
    createWordbookItem({ commit }, input) {
        return new Promise((resolve, reject) => {
            WordBook.createWordbookItem(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    getWordbookItems({ commit }, input) {
        return new Promise((resolve, reject) => {
            WordBook.getWordbookItems(input).then(response => {
                const { data } = response
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    }, 
    deleteWordbookItem({ commit }, query) {
        return new Promise((resolve, reject) => {
            WordBook.deleteWordbookItem(query).then(response => {
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
