import { list } from '@/api/role'
const actions = {
    list({ commit }, searchKey) {
        return new Promise((resolve, reject) => {
            list(searchKey).then(response => {
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
