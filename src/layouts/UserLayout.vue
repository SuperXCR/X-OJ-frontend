<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-telayout-header class="header">
        <a-space>
          <img src="../assets/oj-logo.svg" class="logo" />
          <div style="font-size: 26px">X-OJ</div>
        </a-space>
      </a-telayout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">X OJ by xxx</a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  margin-top: 16px;
  margin-bottom: 16px;
}

#userLayout .content {
  margin-bottom: 20px;
  padding-left: 20px;
}

#userLayout .footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 22px;
  color: gray;
}
</style>

<script></script>
