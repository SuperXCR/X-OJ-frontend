import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("登陆用户信息", store.state.user.loginUser);

  let loginUser = store.state.user.loginUser;
  // 如果之前没有登录过，自动登录
  if (!loginUser || !loginUser.userRole) {
    // 加await 是等用户登录成功之后，再执行后续代码
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }
  const needAccess = (to?.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 要跳转的页面需要登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没有登录，跳转到登录页
    if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      next(`/user/getLoginUser?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登陆了，但是权限不足
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }

  next();
});
