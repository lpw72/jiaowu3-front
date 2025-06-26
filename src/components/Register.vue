<template>
  <!-- 注册页面 -->
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <!-- 用户名输入框 -->
        <input type="text" v-model="username" placeholder="Username" required />
        <!-- 密码输入框 -->
        <input type="password" v-model="password" placeholder="Password" required />
        <!-- 确认密码输入框 -->
        <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
        <!-- 邮箱输入框 -->
        <input type="email" v-model="email" placeholder="Email" required />
        <!-- 手机号输入框 -->
        <input type="text" v-model="mobile" placeholder="Mobile" required />
        <!-- 性别选择 -->
        <select v-model="gender">
          <option value="M">男</option>
          <option value="F">女</option>
        </select>
        <!-- 邀请码输入框 -->
        <input type="text" v-model="inviteCode" placeholder="Invite Code (optional)" />
        <button type="submit">Register</button>
      </form>
      <!-- 跳转登录按钮 -->
      <button class="login-btn" @click="$router.push('/login')" type="button">返回登录</button>
    </div>
  </div>
</template>

<script>
import api from '../utils/api..js'; // 导入自定义 api 工具

export default {
  name: 'AppRegister',
  data() {
    return {
      username: '', // 用户名
      password: '', // 密码
      confirmPassword: '', // 确认密码
      email: '', // 邮箱
      mobile: '', // 手机号
      gender: 'M', // 性别，默认男
      inviteCode: '', // 邀请码
    };
  },
  methods: {
    // 注册方法
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // 构造参数，inviteCode 为空时不传 invitation_code
      const params = {
        username: this.username,
        password1: this.password,
        password2: this.confirmPassword,
        email: this.email,
        mobile: this.mobile,
        gender: this.gender,
      };
      if (this.inviteCode) {
        params.invitation_code = this.inviteCode;
      }
      try {
        await api.post('/register/', params);
        alert('注册成功，请登录！');
        this.$router.push('/login');
      } catch (e) {
        // 输出后端详细报错内容
        let msg = '注册失败：';
        if (e.response && e.response.data) {
          if (typeof e.response.data === 'string') {
            msg += e.response.data;
          } else if (e.response.data.detail) {
            msg += e.response.data.detail;
          } else {
            msg += JSON.stringify(e.response.data);
          }
        } else {
          msg += e.message || e;
        }
        alert(msg);
      }
    },
  },
};
</script>

<style scoped>
/* 注册页面整体居中和背景渐变 */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
}
.register-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 40px 32px 32px 32px;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register-card h2 {
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
}
.register-card form {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.register-card input, .register-card select {
  margin-bottom: 18px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1em;
  transition: border 0.2s;
}
.register-card input:focus, .register-card select:focus {
  border-color: #6366f1;
  outline: none;
}
.register-card button[type="submit"] {
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
.register-card button[type="submit"]:hover {
  background: #4f46e5;
}
.login-btn {
  background: none;
  color: #6366f1;
  border: none;
  cursor: pointer;
  font-size: 1em;
  margin-top: 8px;
  text-decoration: underline;
}
.login-btn:hover {
  color: #4f46e5;
}
</style>