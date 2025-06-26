<template>
  <!-- 学生详情页面 -->
  <div class="student-details">
    <h2>Student Details</h2>
    <template v-if="student">
      <!-- 展示学生基本信息 -->
      <p>Name: {{ student.name }}</p>
      <p>Email: {{ student.email }}</p>
      <p>Gender: {{ student.gender }}</p>
      <p>Mobile: {{ student.mobile }}</p>
      <p>User ID: {{ student.user }}</p>
      <p>Roles: {{ student.roles && student.roles.join(', ') }}</p>
    </template>
    <template v-else>
      <p>正在加载学生信息...</p>
    </template>
    <!-- 修改密码表单 -->
    <form class="password-form" @submit.prevent="changePassword">
      <h3>修改密码</h3>
      <input type="password" v-model="newPassword" placeholder="新密码" required autocomplete="new-password" />
      <input type="password" v-model="confirmPassword" placeholder="确认新密码" required autocomplete="new-password" />
      <button type="submit">修改密码</button>
    </form>
  </div>
</template>

<script>
import api from '../utils/api..js'; // 导入自定义 api 工具

export default {
  data() {
    return {
      student: null, // 当前学生信息
      newPassword: '', // 新密码
      confirmPassword: '', // 确认新密码
    };
  },
  async mounted() {
    // 页面加载时获取学生详情
    try {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      const res = await api.get('/student/detail/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.student = res.data.data;
    } catch (e) {
      alert('获取学生信息失败');
    }
  },
  methods: {
    // 修改密码方法
    changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // 这里需要调用API进行密码修改
      console.log('Changing password to:', this.newPassword);
    },
  },
};
</script>

<style scoped>
/* 学生详情卡片样式 */
.student-details {
  max-width: 420px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 32px 28px 28px 28px;
}
.student-details h2 {
  text-align: center;
  margin-bottom: 18px;
}
.student-details p {
  margin: 8px 0;
}
.password-form {
  margin-top: 32px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 24px 18px 18px 18px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.password-form h3 {
  margin-bottom: 18px;
  color: #6366f1;
  font-weight: 600;
}
.password-form input {
  width: 100%;
  margin-bottom: 16px;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1em;
  transition: border 0.2s;
}
.password-form input:focus {
  border-color: #6366f1;
  outline: none;
}
.password-form button[type="submit"] {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}
.password-form button[type="submit"]:hover {
  background: #4f46e5;
}
</style>