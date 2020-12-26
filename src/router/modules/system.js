import Layout from '@/layout'

const systemRouter = {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'system',
    meta: {
        title: '系统管理',
        icon: 'system',
        permissionMenuName: "system"
    },
    children: [
        {
            path: 'wordbook',
            component: () => import('@/views/system/wordbook'),
            name: 'wordbook',
            meta: {
              title: '字典管理',
              icon: 'wordbook',
              noCache: true,
              permissionMenuName: "wordbook"
            }              
        },
        {
            path: 'wordbook/items',
            component: () => import('@/views/system/wordbook/WordbookItem.vue'),
            name: 'wordbook-item',
            hidden: true,
            meta: {
              title: '字典项管理',
              icon: 'wordbook',
              noCache: true,
              isPermission: true,
              permissionMenuName: "wordbook"
            }              
        },        
        {
            path: 'setting',
            component: () => import('@/views/system/setting'),
            name: 'setting',
            meta: {
              title: '系统设置',
              icon: 'setting',
              noCache: true,
              permissionMenuName: "setting"
            }              
        }
    ]    
}


export default systemRouter