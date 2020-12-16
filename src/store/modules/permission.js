import { asyncRoutes, constantRoutes } from '@/router'
import { accountMenu } from '@/api/account'
import menu from './menu'
/**
 * Use meta.role to determine if the current user has permission
 * @param route
 * @param menus
 */
function hasPermission(route, menus) {
  let hasPermission = false
  menus.forEach(m => {
    if (m.name == route.name) {
      route.meta = Object.assign({ menuId: m.id },route.meta)
      hasPermission = true
    }
    if (route.meta && route.meta.isPermission) {
      route.meta = Object.assign({ menuId: m.id },route.meta)
      hasPermission = true
    }
  })
  return hasPermission
}

function getPermissionRoutes(routes, menus) {

  let filterRoutes = []
  routes.forEach(route => {
    let tmp = { ...route }

    if (hasPermission(tmp, menus)) {
      if (route.children) {
        tmp.children = getPermissionRoutes(route.children, menus)
      }
      filterRoutes.push(tmp)
    }
  })
  return filterRoutes
}


/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes) {
  return new Promise((resolve, reject) => {
    accountMenu().then(response => {
      const { data } = response
      const res = getPermissionRoutes(routes, data)
      resolve(res)

    }).catch(err => reject(err))
  })

}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      let accessedRoutes = asyncRoutes || []
      filterAsyncRoutes(asyncRoutes).then(res => {
        accessedRoutes = res
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
