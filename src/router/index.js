import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  // sidebar侧边栏首页路由
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" }
      }
    ]
  }
];
export const allAsyncRoutes = [
  // sidebar侧边栏商品管理路由
  {
    path: "/product",
    component: Layout,
    name: "Product",
    meta: { title: "商品管理", icon: "el-icon-s-shop" },
    redirect: "/product/tardemark/list",
    children: [
      {
        path: "tardemark/list",
        component: () => import("views/product/trademark/List"),
        name: "Trademark",
        meta: { title: "品牌属性" }
      },
      {
        path: "attr/list",
        component: () => import("views/product/attr/List"),
        name: "Attr",
        meta: { title: "平台属性管理" }
      },
      {
        path: "spu/list",
        component: () => import("views/product/spu/List"),
        name: "Spu",
        meta: { title: "SPU管理" }
      },
      {
        path: "sku/list",
        component: () => import("views/product/sku/List"),
        name: "Sku",
        meta: { title: "SKU管理" }
      }
    ]
  },
  //权限数据管理相关的路由
  {
    name: "Acl",
    path: "/acl",
    component: Layout,
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "el-icon-lock"
    },
    children: [
      {
        name: "User",
        path: "user/list",
        component: () => import("@/views/acl/user/list"),
        meta: {
          title: "用户管理"
        }
      },
      {
        name: "Role",
        path: "role/list",
        component: () => import("@/views/acl/role/list"),
        meta: {
          title: "角色管理"
        }
      },
      {
        name: "RoleAuth",
        path: "role/auth/:id",
        component: () => import("@/views/acl/role/roleAuth"),
        meta: {
          activeMenu: "/acl/role/list",
          title: "角色授权"
        },
        hidden: true
      },
      {
        name: "Permission",
        path: "permission/list",
        component: () => import("@/views/acl/permission/list"),
        meta: {
          title: "菜单管理"
        }
      }
    ]
  },
  {
    name: "Test",
    path: "/test",
    component: Layout,
    // redirect: "/test/test1/list",
    meta: {
      title: "测试管理",
      icon: "el-icon-s-tools"
    },
    children: [
      {
        name: "Test111",
        path: "test1/list",
        component: () => import("@/views/Test/Test1/List"),
        meta: {
          title: "测试1"
        },
      },
      {
        name: "Test222",
        path: "test2/list",
        component: () => import("@/views/Test/Test2/List"),
        meta: {
          title: "测试2"
        }
      }
    ]
  }
];
export const notFoundRoute = [
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
