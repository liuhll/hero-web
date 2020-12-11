import Layout from '@/layout'

const systemRouter = {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    name: 'system',
    meta: {
        title: '系统管理',
        icon: 'system'
    },
    children: [
        {
            path: 'wordbook',
            component: () => import('@/views/system/wordbook'),
            name: 'wordbook',
            meta: {
              title: '字典管理',
              icon: 'wordbook',
              noCache: true
            }              
        },
        {
            path: 'setting',
            component: () => import('@/views/system/setting'),
            name: 'setting',
            meta: {
              title: '系统设置',
              icon: 'setting',
              noCache: true
            }              
        }
    ]    
}


export default systemRouter