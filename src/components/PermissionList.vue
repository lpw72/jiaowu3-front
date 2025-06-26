<template>
  <div class="permission-list">
    <h2>Permission List</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="permission in permissions" :key="permission.id">
          <td>{{ permission.name }}</td>
          <td>{{ permission.code }}</td>
          <td>
            <button @click="editPermission(permission)">Edit</button>
            <button @click="deletePermission(permission.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button @click="showAddForm = true">Add Permission</button>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm">
      <form @submit.prevent="addOrEditPermission">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="formData.name" required />
        </div>
        <div>
          <label for="code">Code:</label>
          <input type="text" id="code" v-model="formData.code" required />
        </div>
        <button type="submit">{{ editing ? 'Save Changes' : 'Add Permission' }}</button>
        <button @click="cancelForm">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../utils/api..js';

export default {
  data() {
    return {
      permissions: [],
      formData: {
        name: '',
        code: '',
      },
      showAddForm: false,
      editing: false,
      currentId: null,
    };
  },
  async mounted() {
    try {
      await this.fetchPermissions();
    } catch (e) {
      console.error('权限列表加载失败', e);
    }
  },
  methods: {
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
    async addOrEditPermission() {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      const url = this.editing ? `/permissions/${this.currentId}/` : '/permissions/create/';
      const method = this.editing ? 'put' : 'post';
      try {
        await api[method](url, this.formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.cancelForm();
        await this.fetchPermissions();
      } catch (e) {
        alert('操作失败');
      }
    },
    editPermission(permission) {
      this.showAddForm = true;
      this.editing = true;
      this.currentId = permission.id;
      this.formData.name = permission.name;
      this.formData.code = permission.code;
    },
    async deletePermission(id) {
      const token = this.$store.getters.getToken || localStorage.getItem('token');
      try {
        await api.delete(`/permissions/${id}/delete/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await this.fetchPermissions();
      } catch (e) {
        alert('删除权限失败');
      }
    },
    cancelForm() {
      this.showAddForm = false;
      this.editing = false;
      this.currentId = null;
      this.resetFormData();
    },
    resetFormData() {
      this.formData = {
        name: '',
        code: '',
      };
    },
  },
};
</script>

<style scoped>
.permission-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

h2 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  margin-right: 5px;
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
  margin-bottom: 5px;
}

input {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>


