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
    }    
}

export default {
    namespaced: true,
    actions
}
