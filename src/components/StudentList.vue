<template>
  <!-- 学生列表页面 -->
  <div class="student-list">
    <h2>Student List</h2>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Mobile</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- 遍历学生数据渲染表格 -->
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.name }}</td>
          <td>{{ student.email }}</td>
          <td>{{ student.gender }}</td>
          <td>{{ student.mobile }}</td>
          <td>
            <!-- 角色名映射显示，兼容多种字段 -->
            {{
              roleMap[student.role] ||
              roleMap[student.role_id] ||
              (Array.isArray(student.roles) && student.roles.length ? student.roles.map(rid => roleMap[rid] || rid).join(', ') : '-')
            }}
          </td>
          <td>
            <button @click="editStudent(student)">Edit</button>
            <button @click="deleteStudent(student)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="showAddForm = true">Add Student</button>

    <!-- 新增学生表单 -->
    <div v-if="showAddForm">
      <form @submit.prevent="addStudent">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="newStudent.name" required autocomplete="off" />
        </div>
         <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="newStudent.password" required autocomplete="new-password" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="newStudent.email" required autocomplete="off" />
        </div>
        <div>
          <label for="gender">Gender:</label>
          <select id="gender" v-model="newStudent.gender">
            <option value="M">男</option>
            <option value="F">女</option>
          </select>
        </div>
        <div>
          <label for="mobile">Mobile:</label>
          <input type="text" id="mobile" v-model="newStudent.mobile" required autocomplete="off" />
        </div>
        <div>
          <label for="role">Role:</label>
          <select id="role" v-model="newStudent.role" required>
            <option value="" disabled>请选择角色</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>
        <button type="submit">Add Student</button>
        <button @click="cancelForm" type="button">Cancel</button>
      </form>
    </div>

    <!-- 编辑学生表单 -->
    <div v-if="showEditForm" class="edit-modal">
      <div class="edit-modal-content">
        <h3>Edit Student</h3>
        <form @submit.prevent="saveEditStudent">
          <div>
            <label for="edit-name">Name:</label>
            <input type="text" id="edit-name" v-model="editStudentData.name" required autocomplete="off" />
          </div>
          <div>
            <label for="edit-email">Email:</label>
            <input type="email" id="edit-email" v-model="editStudentData.email" required autocomplete="off" />
          </div>
          <div>
            <label for="edit-gender">Gender:</label>
            <select id="edit-gender" v-model="editStudentData.gender">
              <option value="M">男</option>
              <option value="F">女</option>
            </select>
          </div>
          <div>
            <label for="edit-mobile">Mobile:</label>
            <input type="text" id="edit-mobile" v-model="editStudentData.mobile" required autocomplete="off" />
          </div>
          <div>
            <label for="edit-role">Role:</label>
            <select id="edit-role" v-model="editStudentData.role" required>
              <option value="" disabled>请选择角色</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
            </select>
          </div>
          <button type="submit">Save</button>
          <button @click="cancelEditForm" type="button">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../utils/api..js'; // 导入自定义 api 工具

export default {
  data() {
    return {
      students: [], // 学生列表数据
      roles: [], // 角色列表数据
      newStudent: {
        name: '',
        password: '',
        email: '',
        gender: 'M',
        mobile: '',
        role: '',
      },
      showAddForm: false, // 是否显示新增表单
      // 编辑相关
      showEditForm: false, // 是否显示编辑表单
      editStudentData: {
        id: null,
        name: '',
        email: '',
        gender: 'M',
        mobile: '',
        role: '',
      },
    };
  },
  async mounted() {
    // 页面加载时获取学生和角色列表
    const token = this.$store.getters.getToken || localStorage.getItem('token');
    try {
      const res = await api.get('/students/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.students = res.data.data.students;
    } catch (e) {
      alert('获取学生列表失败：' + (e.response?.data?.detail || e.message || e));
    }
    // 拉取角色列表
    try {
      const res = await api.get('/roles/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.roles = res.data.data.roles;
    } catch (e) {
      alert('获取角色列表失败：' + (e.response?.data?.detail || e.message || e));
    }
  },
  methods: {
    // 新增学生
    async addStudent() {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        // 构造与注册接口一致的参数
        const payload = {
          username: this.newStudent.name, // 用户名
          password1: this.newStudent.password, // 密码
          password2: this.newStudent.password, // 确认密码
          email: this.newStudent.email,
          gender: this.newStudent.gender,
          mobile: this.newStudent.mobile,
          role: Number(this.newStudent.role),
        };
        await api.post('/students/create/', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 重新获取学生列表
        const res = await api.get('/students/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.students = res.data.data.students.map(s => {
          if (!s.role && s.role_id) s.role = s.role_id;
          if (!s.role && Array.isArray(s.roles) && s.roles.length) s.role = s.roles[0];
          if (s.name === payload.username && s.email === payload.email && s.mobile === payload.mobile) {
            s.role = payload.role;
            s.role_id = payload.role;
            s.roles = [payload.role];
          }
          return s;
        });
        this.newStudent = { name: '', email: '', gender: 'M', mobile: '', role: '', password: '' };
        this.showAddForm = false;
      } catch (e) {
        alert('添加学生失败：' + (e.response?.data?.detail || e.message || e));
      }
    },
    // 点击编辑按钮，弹出编辑表单
    editStudent(student) {
      this.editStudentData = { ...student };
      // role 字段兼容 role/role_id/roles
      this.editStudentData.role = student.role || student.role_id || (Array.isArray(student.roles) ? student.roles[0] : '');
      this.showEditForm = true;
    },
    // 保存编辑后的学生信息
    async saveEditStudent() {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        const payload = { ...this.editStudentData };
        payload.role = Number(payload.role);
        payload.role_id = payload.role; // 兼容后端不同字段
        // 如后端要求 roles 为数组，也一并传递
        payload.roles = [payload.role];
        await api.put(`/students/${this.editStudentData.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // 重新获取学生列表
        const res = await api.get('/students/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.students = res.data.data.students;
        this.showEditForm = false;
        this.editStudentData = { id: null, name: '', email: '', gender: 'M', mobile: '', role: '' };
      } catch (e) {
        alert('保存学生信息失败：' + (e.response?.data?.detail || e.message || e));
      }
    },
    // 删除学生
    async deleteStudent(student) {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        await api.delete(`/students/${student.id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.students = this.students.filter(s => s.id !== student.id);
      } catch (e) {
        alert('删除学生失败：' + (e.response?.data?.detail || e.message || e));
      }
    },
    // 取消新增表单
    cancelForm() {
      this.showAddForm = false;
      this.newStudent = { name: '', email: '', gender: 'M', mobile: '', role: '', password: '' };
    },
    // 取消编辑表单
    cancelEditForm() {
      this.showEditForm = false;
      this.editStudentData = { id: null, name: '', email: '', gender: 'M', mobile: '', role: '' };
    },
  },
  computed: {
    // 角色 id 到角色名的映射
    roleMap() {
      const map = {};
      this.roles.forEach(r => { map[r.id] = r.name; });
      return map;
    }
  }
};
</script>

<style scoped>
/* 学生列表表格样式 */
.student-list table {
  width: 100%;
  border-collapse: collapse;
}

.student-list th, .student-list td {
  border: 1px solid #ddd;
  padding: 8px;
}

.student-list th {
  background-color: #f2f2f2;
}

.student-list form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.student-list input, .student-list select {
  margin-bottom: 10px;
}

.edit-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.edit-modal-content {
  background: #fff;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  min-width: 320px;
}
</style>