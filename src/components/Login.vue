<template>
  <!-- 登录页面 -->
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <!-- 用户名输入框 -->
        <input type="text" v-model="username" placeholder="Username" required autocomplete="username" />
        <!-- 密码输入框 -->
        <input type="password" v-model="password" placeholder="Password" required autocomplete="current-password" />
        <button type="submit">Login</button>
      </form>
      <!-- 跳转注册按钮 -->
      <button class="register-btn" @click="$router.push('/register')" type="button">去注册</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'; // 导入 vuex 的 mapActions

export default {
  name: 'AppLogin',
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
    };
  },
  methods: {
    ...mapActions(['login']), // 映射 vuex 的 login action
    // 登录处理方法
    async handleLogin() {
      try {
        // 调用 vuex 的 login action，传递用户名和密码
        await this.login({ username: this.username, password: this.password });
        // 登录成功后跳转到后台首页
        this.$router.push('/admin-dashboard/student-details');
      } catch (error) {
        // 登录失败弹窗提示
        if (error.response && error.response.data && error.response.data.detail) {
          alert(error.response.data.detail);
        } else {
          alert('Invalid credentials');
        }
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
/* 登录页面整体居中和背景渐变 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}
/* 登录卡片样式 */
.login-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 40px 32px 32px 32px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-card h2 {
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
}
.login-card form {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.login-card input {
  margin-bottom: 18px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1em;
  transition: border 0.2s;
}
.login-card input:focus {
  border-color: #6366f1;
  outline: none;
}
.login-card button[type="submit"] {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.login-card button[type="submit"]:hover {
  background: #4f46e5;
}
.register-btn {
  background: none;
  color: #6366f1;
  border: none;
  cursor: pointer;
  font-size: 1em;
  margin-top: 8px;
  text-decoration: underline;
}
.register-btn:hover {
  color: #4f46e5;
}
</style>