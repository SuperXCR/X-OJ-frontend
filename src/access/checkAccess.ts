import ACCESS_ENUM from "@/access/accessEnum";
import router from "@/router";
import store from "@/store";

/**
 * 检查权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前用户所具有的权限 (没有loginUser 表示未登录)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  // 如果用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // 如果用户未登录就没权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  // 如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果不为管理员
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
    return true;
  }

  router.beforeEach((to, from, next) => {
    // 仅管理员可见，判断当前用户是否有权限
    if (to.meta?.access === "canAdmin") {
      if (store.state.user.loginUser?.role !== "admin") {
        next("/noAuth");
        return;
      }
    }
    next();
  });
};

export default checkAccess;