<template>
  <div>
    <a-row id="globalHeader" align="center" :wrap="false">
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="title-bar">
              <img class="logo" src="../assets/oj-logo.svg" />
              <div class="title">X OJ</div>
            </div>
          </a-menu-item>
          <a-menu-item v-for="item in visibleRoutes" :key="item.path">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col
        flex="100px"
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px;
        "
      >
        <div style="margin-right: 10px">
          {{ store.state.user?.loginUser?.userName ?? "未登录" }}
        </div>
        <a-dropdown trigger="hover">
          <a-avatar shape="circle">
            <img
              alt="avatar"
              src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F10c93147-c811-48f6-abaa-9a87337635fc%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1706969557&t=8e258c810bba136bc53289bd6dd567b5"
              class="userAvatar"
            />
          </a-avatar>
          <template #content>
            <a-doption>
              <template #icon>
                <icon-user />
              </template>
              <template #default>
                <a-anchor-link @click="register">注册</a-anchor-link>
              </template>
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-poweroff />
              </template>
              <template #default>
                <a-anchor-link @click="logout">退出</a-anchor-link>
              </template>
            </a-doption>
          </template>
        </a-dropdown>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "../router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../generated";

const router = useRouter();
const store = useStore();

// 展示在主页展示的页面 computed 动态属性
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    //  根据权限过滤菜单
    if (
      !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/user/login"]);

// 路由跳后，更新选中的菜单项
router.afterEach((to, from, next) => {
  selectedKeys.value = [to.path];
});

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};

// setTimeout(() => {
//   store.dispatch("user/getLoginUser", {
//     userName: "管理员",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);
const logout = () => {
  UserControllerService.userLogoutUsingPost();
  router.push("/user/login");
};

const register = () => {
  router.push("/user/register");
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.title {
  color: #444;
  font-size: 22px;
  margin-left: 10px;
}
</style>
