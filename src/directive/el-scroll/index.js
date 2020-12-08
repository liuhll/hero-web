import scroll from './scroll'

const install = function(Vue) {
  Vue.directive('el-scroll', scroll)
}

if (window.Vue) {
    window['el-scroll'] = scroll
    Vue.use(install); 
}

scroll.install = install
export default scroll
  
  