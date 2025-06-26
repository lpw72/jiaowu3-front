<template>
  <!-- 角色列表页面 -->
  <div class="role-list">
    <h2>Role List</h2>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- 遍历角色数据渲染表格 -->
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.name }}</td>
            <td>
              <!-- 权限名映射显示 -->
              {{ Array.isArray(role.permissions) ? role.permissions.map(pid => {
                const p = permissions.find(per => per.id === pid);
                return p ? p.name : pid;
              }).join(', ') : '' }}
            </td>
            <td>
              <button @click="editRole(role)">Edit</button>
              <button @click="deleteRole(role.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button @click="showAddForm = true">Add Role</button>

    <!-- 新增/编辑角色表单 -->
    <div v-if="showAddForm">
      <form @submit.prevent="addOrEditRole">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="formData.name" required />
        </div>
        <div>
          <label for="permissions">Permissions:</label>
          <div class="permission-list">
            <span
              v-for="permission in permissions"
              :key="permission.id"
              :class="['permission-item', formData.permission_ids.includes(String(permission.id)) ? 'selected' : '']"
              @click="togglePermission(permission.id)"
            >
              {{ permission.name }}
              <span v-if="permission.desc">（{{ permission.desc }}）</span>
            </span>
          </div>
        </div>
        <button type="submit">{{ editing ? 'Save Changes' : 'Add Role' }}</button>
        <button @click="cancelForm" type="button">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../utils/api..js'; // 导入自定义 api 工具

export default {
  data() {
    return {
      roles: [], // 角色列表
      permissions: [], // 权限列表
      formData: {
        name: '', // 角色名
        permission_ids: [], // 选中的权限id数组
      },
      showAddForm: false, // 是否显示表单
      editing: false, // 是否编辑状态
      currentId: null, // 当前编辑的角色id
    };
  },
  async mounted() {
    // 页面加载时获取角色和权限列表
    try {
      await this.fetchRoles();
    } catch (e) {
      console.error('角色列表加载失败', e);
    }
    try {
      await this.fetchPermissions();
    } catch (e) {
      console.error('权限列表加载失败', e);
    }
    // 强制保证 permission_ids 为数组
    if (!Array.isArray(this.formData.permission_ids)) {
      this.formData.permission_ids = [];
    }
  },
  methods: {
    // 获取角色列表
    async fetchRoles() {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        const res = await api.get('/roles/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.roles = res.data.data.roles;
      } catch (e) {
        alert('获取角色列表失败');
        console.error(e);
      }
    },
    // 获取权限列表
    async fetchPermissions() {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        const res = await api.get('/permissions/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.permissions = res.data.data.permissions;
      } catch (e) {
        alert('获取权限列表失败');
        console.error(e);
      }
    },
    // 编辑角色
    editRole(role) {
      this.showAddForm = true;
      this.editing = true;
      this.currentId = role.id;
      // 保证 permission_ids 始终为字符串数组
      let ids = [];
      if (Array.isArray(role.permissions)) {
        ids = role.permissions.map(pid => String(pid));
      } else if (role.permissions !== undefined && role.permissions !== null) {
        ids = [String(role.permissions)];
      }
      if (!Array.isArray(ids)) ids = [];
      this.formData = {
        name: role.name,
        permission_ids: ids,
      };
    },
    // 删除角色
    async deleteRole(id) {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        await api.delete(`/roles/${id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.fetchRoles();
      } catch (e) {
        alert('删除角色失败：' + (e.response?.data?.detail || JSON.stringify(e.response?.data) || e.message || e));
        console.error(e);
      }
    },
    // 取消表单
    cancelForm() {
      this.showAddForm = false;
      this.editing = false;
      this.currentId = null;
      this.resetFormData();
    },
    // 重置表单
    resetFormData() {
      this.formData = {
        name: '',
        permission_ids: [],
      };
    },
    // 新增或编辑角色
    async addOrEditRole() {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      const url = this.editing ? `/roles/${this.currentId}/` : '/roles/create/';
      const method = this.editing ? 'put' : 'post';
      // 前端校验
      if (!this.formData.name.trim()) {
        alert('角色名不能为空');
        return;
      }
      if (!this.formData.permission_ids.length) {
        alert('请至少选择一个权限');
        return;
      }
      // payload 字段名为 permissions，后端如需数字数组则 map(Number)
      const payload = {
        name: this.formData.name,
        permissions: this.formData.permission_ids.map(id => Number(id)),
      };
      try {
        await api[method](url, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.cancelForm();
        await this.fetchRoles();
      } catch (e) {
        alert('操作失败：' + (e.response?.data?.detail || JSON.stringify(e.response?.data) || e.message || e));
        console.error(e);
      }
    },
    // 权限单击选中/取消
    togglePermission(id) {
      id = String(id);
      const idx = this.formData.permission_ids.indexOf(id);
      if (idx === -1) {
        this.formData.permission_ids.push(id);
      } else {
        this.formData.permission_ids.splice(idx, 1);
      }
    },
  },
};
</script>

<style scoped>
/* 角色列表卡片样式 */
.role-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

button {
  padding: 8px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #f0f0f0;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
}

input, select {
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input:focus, select:focus {
  border-color: #007bff;
  outline: none;
}

.error {
  color: red;
  margin-top: -12px;
  margin-bottom: 12px;
}

.permission-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.permission-item {
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #f4f4f4;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s, border 0.2s, color 0.2s;
}
.permission-item.selected {
  background: #6366f1;
  color: #fff;
  border-color: #6366f1;
}
.permission-item:hover {
  border-color: #6366f1;
}
</style>


