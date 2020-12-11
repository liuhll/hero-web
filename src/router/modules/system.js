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
              noCache: true
            }              
        }
    ]    
}


export default systemRouter