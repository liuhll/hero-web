import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    if (value) {
      const { name } = value
      if (name) {
        const operations = store.getters && store.getters.operations
        const hasPermission = operations.some(operation => {
          return operation.name == name
        })
        if (!hasPermission) {
          debugger
          el.setAttribute('disabled',true)
          el.classList.add('is-disabled','is-plain')
          //el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`权限指令必须要指定name属性!Like v-permission="{name: 'user-create'}"`)
      }

    } else {
      throw new Error(`需要权限名称! Like v-permission="{name: 'user-create'}"`)
    }
  }
}
