<template>
  <div class="dashboard-container">
    <div style="font-weight:bold">【项目简介】</div>
    <p>1. 服务端基于.net5平台,开发框架是基于surging.cloud(surging.cloud是在surging基础上进行二次开发的微服务框架)</p>
    <p>2. 采用mysql作为存储数据库、使用redis作为缓存数据库</p>
    <p>3. 服务之间使用dotnetty实现的rpc框架进行通信,服务调用支持缓存缓存拦截,极大的提高了系统性能</p>
    <p>4. 采用zookeeper作为服务注册中心;也支持consul 作为服务注册中心(consul未经测试) </p>
    <p>5. hero权限管理系统支持菜单、操作、数据权限</p>
    <p>6. 前端使用vue2，基于element-admin框架进行开发</p>
    <p>7. 项目地址：【服务端:https://github.com/liuhll/hero】、【前端:https://github.com/liuhll/hero-web】 </p>

    <div style="font-weight:bold">【surging.cloud的调整】</div>
    <p>1. 增加异常处理模块，分为业务异常和非业务异常,rpc通信过程中,如果捕获到的是业务异常，被捕获之后服务消费者不会重试,且异常可以在服务之间进行传递,最终通过网关及时返回给调用者</p>
    <p>2. 通过 IdleStateHandler 提供的心跳功能重构服务健康检查,提高rpc通信的可靠性 </p>
    <p>3. 通过 Rabbit.Zookeeper 重构基于zookeeper的服务注册中心,提高服务注册中心的可靠性</p>
    <p>4. 修复通过RpcContenxt获取rpc通信上下文参数的bug,新增ISurgingSession获取rpc通信上下文参数</p>
    <p>5. 扩展了诸如Dapper、mongodb、autoMapper、es、分布式锁等组件 </p>
    <p>6. 对rpc通信模型进行调整,生成的webpai支持restful架构风格 </p>
    <p>7. 使用JWT组件重构token签发方式</p>
    <p>8. 其他</p> 

    <div style="font-weight:bold">【todo】</div>
    <p> 1. hero支持租户</p>
    <p> 2. 完善开发者文档</p>
    <p> 3. 完成hero的系统管理,支持查看微服务集群的服务状态、系统监控、服务链路跟踪、缓存数据等</p>
    <p> 4. 封装基于ef的数据访问组件</p>
    <p> 5. 封装分布式事务组件</p>
    
  </div>
  

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      
    }
  },
  computed: {
  },
  created() {

  }
}
</script>
