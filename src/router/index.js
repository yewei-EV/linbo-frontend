import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  }
]

export const asyncRouterMap = [
  {
    path:'/user',
    component: Layout,
    redirect: '/user/item',
    name: 'user',
    meta: {title: '包裹管理', icon: 'order'},
    children: [
      {
        path: 'item',
        name: 'item',
        component: () => import('@/views/user/item/index'),
        meta: {title: '包裹列表', icon: 'ums-role'}
      }
    ]
  },
  {
    path:'/wms',
    component: Layout,
    redirect: '/wms/dashboard',
    name: 'wms',
    meta: {title: '海外仓管理', icon: 'order'},
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/wms/dashboard/index'),
        meta: {title: '控制台', icon: 'ums-admin'},
      },
      {
        path: 'item',
        name: 'item',
        component: () => import('@/views/wms/item/index'),
        meta: {title: '货物列表', icon: 'ums-role'}
      }
    ]
  },
  {
    path:'/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: {title: '权限', icon: 'ums'},
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: {title: '用户列表', icon: 'ums-admin'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: {title: '角色列表', icon: 'ums-role'}
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: {title: '分配菜单'},
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: {title: '分配资源'},
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: {title: '菜单列表', icon: 'ums-menu'}
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: {title: '添加菜单'},
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: {title: '修改菜单'},
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: {title: '资源列表', icon: 'ums-resource'}
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: {title: '资源分类'},
        hidden: true
      },
      {
        path: 'announcement',
        name: 'announcement',
        component: () => import('@/views/ums/announcement/index'),
        meta: {title: '公告管理', icon: 'product-add'},
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/ums/log/index'),
        meta: {title: '日志管理', icon: 'product-add'},
      }
    ]
  },
  {
    path:'/lms',
    component: Layout,
    redirect: '/lms/item',
    name: 'lms',
    meta: {title: '物流', icon: 'order'},
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/lms/dashboard/index'),
        meta: {title: '控制台', icon: 'ums-admin'},
      },
      {
        path: 'item',
        name: 'item',
        component: () => import('@/views/lms/item/index'),
        meta: {title: '货物列表', icon: 'ums-admin'},
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/lms/order/index'),
        meta: {title: '订单列表', icon: 'ums-role'}
      }
    ]
  },
  {
    path:'/setting',
    component: Layout,
    redirect: '/setting/address',
    name: 'setting',
    meta: {title: '设置', icon: 'order'},
    children: [
      {
        path: 'address',
        name: 'address',
        component: () => import('@/views/setting/address/index'),
        meta: {title: '地址管理', icon: 'product-add'},
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/setting/profile/index'),
        meta: {title: '个人资料', icon: 'ums-role'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

