import { createRouter, createWebHistory } from 'vue-router';
// import AppHome from '../views/Home.vue'; // 已删除 Home 页面
import AdminDashboard from '../views/AdminDashboard.vue';
import AppLogin from '../components/Login.vue';
import AppRegister from '../components/Register.vue';
import StudentDetails from '../components/StudentDetails.vue';
import StudentList from '../components/StudentList.vue';
import RoleList from '../components/RoleList.vue';
import PermissionList from '../components/PermissionList.vue';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'AppLogin',
    component: AppLogin,
  },
  {
    path: '/register',
    name: 'AppRegister',
    component: AppRegister,
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'student-details',
        component: StudentDetails,
      },
      {
        path: 'student-list',
        component: StudentList,
      },
      {
        path: 'role-list',
        component: RoleList,
      },
      {
        path: 'permission-list',
        component: PermissionList,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;