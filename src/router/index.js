import { createRouter, createWebHistory } from 'vue-router'
import AgentPump from '../views/AgentPump.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AgentPump,
    meta: {
      title: 'Tokenize Agent - Home'
    }
  },
  {
    path: '/agent-list',
    name: 'agent-list',
    component: AgentPump,
    meta: {
      title: 'Agent List - Tokenize Agent'
    }
  },
  {
    path: '/my-agents',
    name: 'my-agents',
    component: () => import('../views/MyAgents.vue'),
    meta: {
      title: 'My Tokenized Agent'
    }
  },
  {
    path: '/token/:id',
    name: 'token-detail',
    component: () => import('../views/TokenDetail.vue'),
    meta: {
      title: 'Token Details - Tokenize Agent'
    }
  },
  {
    path: '/launch',
    name: 'launch',
    component: () => import('../views/Launch.vue'),
    meta: {
      title: 'Launch Your Agent - Tokenize Agent'
    }
  }
]

const router = createRouter({
  history: createWebHistory('https://aon.dexian.io'),
  routes
})

// 全局路由守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'Tokenize Agent'
  next()
})

export default router
