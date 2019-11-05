import { getWordbookitemByCode } from '@/api/wordbook'

const actions = {
    getWordbookitemByCode({ commit }, code) {
        return new Promise((resolve, reject) => {
            getWordbookitemByCode(code).then(response => {
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
