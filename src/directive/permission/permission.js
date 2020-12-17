import store from '@/store'

function setParentElPermission(el) {
  const menuButton = el.parentNode.parentNode
  const items = Array.from(menuButton.children)
  if (items.every(item => {
    return item.children[0].classList.contains('is-disabled')
  })) {
    menuButton.parentNode.children[0].setAttribute('disabled',true)
    menuButton.parentNode.children[0].classList.add('is-disabled','is-plain')
  }
}

export default {
  async inserted (el, binding, vnode) {
    const { value } = binding
    if (value) {
      const { name, operateType, dataType, nodeType } = value
      if (name) {
        const operations = await store.getters && await store.getters.operations
        const hasPermission = operations.some(operation => {
          return operation.name == name
        })
        if (!hasPermission) {
          el.setAttribute('disabled',true)
          el.classList.add('is-disabled','is-plain')
          if (el.classList.contains('el-dropdown-menu__item')) {
            setParentElPermission(el)
          }
          //el.parentNode && el.parentNode.removeChild(el)
        }
      } else if (operateType) {
        let dataTypeDesc = []
        if (nodeType == 'org') {
          dataTypeDesc = ['corporation', 'department']
        } else if (nodeType == 'menu') {
          dataTypeDesc = ['menu', 'operation']
        }

        const permissionName = `${dataTypeDesc[dataType]}-${operateType}`
        const operations = await store.getters && await store.getters.operations
        const hasPermission = operations.some(operation => {
          return operation.name == permissionName
        })
        if (!hasPermission) {
          el.setAttribute('disabled','disabled')
          el.classList.add('is-disabled')
          //el.parentNode && el.parentNode.removeChild(el)
        }        
      }
       else {
        throw new Error(`权限指令必须要指定name属性!Like v-permission="{name: 'user-create'}"`)
      }

    } else {
      throw new Error(`需要权限名称! Like v-permission="{name: 'user-create'}"`)
    }
  }
}
