import { login, logout, getInfo } from "@/api/acl/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, {
  resetRouter,
  allAsyncRoutes,
  constantRoutes,
  notFoundRoute
} from "@/router";
import filterAsyncRoutes from "@/utils/filterAsyncRoutes";
import cloneDeep from "lodash/cloneDeep";
const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    // 最终的所有路由对象数组
    routes: [],
    // 匹配的根据请求返回的routesname筛选的路由对象数组
    asyncRoutes: [],

    roles: [],
    buttons: []
  };
};

const state = getDefaultState();
const actions = {
  // 登录 获取token
  async login({ commit }, { username, password }) {
    try {
      const res = await login({ username: username.trim(), password });
      if (res.code === 20000 || res.code === 200) {
        commit("SET_TOKEN", res.data.token);
        setToken(res.data.token);
        return "ok";
      } else {
        return Promise.reject(new Error("failed"));
      }
    } catch (error) {
      alert("服务器错误" + error.message);
    }
  },
  // 根据token获取用户信息
  async getInfo({ commit, state }) {
    try {
      const res = await getInfo(state.token);
      if (res.code === 20000 || res.code === 200) {
        commit("SET_USER_INFO", res.data);
        commit(
          "SET_ROUTES",
          filterAsyncRoutes(res.data.routes, cloneDeep(allAsyncRoutes))
        );
        return "ok";
      } else {
        return Promise.reject("Verification failed, please Login again.");
      }
    } catch (error) {
      alert("服务器错误" + error.message);
    }
  },
  // 退出登录
  async logout({ commit, state }) {
    try {
      const res = await logout(state.token);
      if (res.code === 20000 || res.code === 200) {
        removeToken();
        resetRouter();
        commit("RESET_STATE");
        return "ok";
      } else {
        return Promise.reject("退出登录失败");
      }
    } catch (error) {
      alert("服务器错误" + error.message);
    }
  },
  // 重置token
  removeToken({ commit }) {
    removeToken();
    commit("RESET_STATE");
  }
};
const mutations = {
  // 设置token
  SET_TOKEN(state, token) {
    state.token = token;
  },
  // 设置userInfo
  SET_USER_INFO(state, userInfo) {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.roles = userInfo.roles;
    state.buttons = userInfo.buttons;
  },
  // 设置异步路由和最终路由
  SET_ROUTES(state, asyncRoutes) {
    state.asyncRoutes = asyncRoutes;
    state.routes = constantRoutes.concat(asyncRoutes, notFoundRoute);
    router.addRoutes([...asyncRoutes, ...notFoundRoute]);
  },
  // RESET_STATE
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
