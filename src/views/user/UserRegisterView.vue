<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 16px">用户注册</h2>
    <a-form
      style="max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        field="userPassword"
        tooltip="密码长度不小于 8 位"
        label="密码"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item
        field="userCheckPassword"
        tooltip="密码长度不小于 8 位"
        label="重复密码"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请重新输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          style="width: 210px; margin: 20px auto"
          >注册</a-button
        >
        <a href="http://localhost:8080/user/login">已有账号？去登陆</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Message from "@arco-design/web-vue/es/message";

const router = useRouter();
const store = useStore();

/**
 * 表单信息
 */
const form = reactive<UserRegisterRequest>({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (form.userPassword !== form.checkPassword) {
    message.error("两次密码输入不一致！");
    return;
  }

  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功，跳转到登录页
  if (res.code === 0) {
    Message.success("注册成功");
    await store.dispatch("getLoginUser");
    await store.dispatch("user/getRegisterUser");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    message.error("注册失败，" + res.message);
  }
};
</script>
