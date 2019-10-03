import { getOrgTree } from '@/api/organization'

const actions = {
    getOrgTree({ commit }) {
        return new Promise((resolve, reject) => { 
            getOrgTree().then(response=>{
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
