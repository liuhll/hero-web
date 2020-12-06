import Layout from '@/layout'

const authorizationRouter = {
    path: '/authorization',
    component: Layout,
    redirect: 'noRedirect',
    name: 'authorization',
    meta: {
        title: '权限管理',
        icon: 'auth'
    },
    children: [
        {
            path: 'user',
            component: () => import('@/views/authorization/user'),
            name: 'user',
            meta: { title: '用户管理', icon: 'user1', noCache: true }
        },
        {
            path: 'role',
            component: () => import('@/views/authorization/role'),
            name: 'role',
            meta: { title: '角色管理', icon: 'role', noCache: true }
        }, {
            path: 'organization',
            component: () => import('@/views/authorization/organization'),
            name: 'organization',
            meta: { title: '组织机构', icon: 'org', noCache: true }
        },
        {
            path: 'menu',
            component: () => import('@/views/authorization/menu'),
            name: 'menu',
            meta: { title: '菜单管理', icon: 'menu-manage', noCache: true }
        }
    ]
}

export default authorizationRouter