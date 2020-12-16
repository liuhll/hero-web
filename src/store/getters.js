import store from "."

const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.account.token,
  avatar: state => state.account.avatar,
  name: state => state.account.name,
  roles: state => state.account.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  operations: state => state.account.operations
}
export default getters
