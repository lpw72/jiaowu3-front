<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <h2 class="sidebar-title">后台管理</h2>
      <ul>
        <li><router-link to="/admin-dashboard/student-details" active-class="active-link">Student Details</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin-dashboard/student-list" active-class="active-link">Student List</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin-dashboard/role-list" active-class="active-link">Role List</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin-dashboard/permission-list" active-class="active-link">Permission List</router-link></li>
      </ul>
      <button class="logout-btn" @click="logout">退出登录</button>
    </aside>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../utils/api..js';

export default {
  data() {
    return {
      isAdmin: false,
    };
  },
  computed: {
    ...mapGetters(['getUserRole']),
  },
  async mounted() {
    const token = this.$store.getters.getToken || localStorage.getItem('token');
    try {
      const res = await api.get('/students/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.isAdmin = res.data.data.is_admin;
    } catch (e) {
      this.isAdmin = false;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.replace('/login');
    },
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f6fa;
}

.sidebar {
  width: 220px;
  background: #2d3a4b;
  color: #fff;
  padding: 30px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
}

.sidebar-title {
  font-size: 1.5em;
  margin-bottom: 30px;
  letter-spacing: 2px;
  font-weight: bold;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  width: 100%;
}

.sidebar li {
  width: 100%;
  margin-bottom: 10px;
}

.sidebar a {
  display: block;
  width: 100%;
  padding: 12px 30px;
  color: #fff;
  text-decoration: none;
  border-radius: 0 20px 20px 0;
  transition: background 0.2s;
}

.sidebar a:hover,
.sidebar .active-link {
  background: #42b983;
  color: #fff;
}

.logout-btn {
  margin-top: 40px;
  width: 80%;
  padding: 10px 0;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}

.main-content {
  flex: 1;
  padding: 40px 40px 40px 40px;
  background: #fff;
  min-height: 100vh;
  box-shadow: 0 0 8px rgba(0,0,0,0.03);
}
</style>