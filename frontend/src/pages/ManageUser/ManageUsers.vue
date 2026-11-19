<style scoped>
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.customize-table {
  --easy-table-border: none;
  --easy-table-row-border: 1px solid var(--border-light);
  --easy-table-header-font-size: 13px;
  --easy-table-header-font-color: var(--text-secondary);
  --easy-table-header-background-color: var(--bg-muted);
  --easy-table-header-height: 44px;
  --easy-table-body-row-height: 52px;
  --easy-table-body-row-font-size: 13px;
  --easy-table-body-row-font-color: var(--text-primary);
  --easy-table-body-row-hover-background-color: var(--bg-muted);
  --easy-table-footer-background-color: var(--bg-muted);
  --easy-table-footer-font-color: var(--text-secondary);
  --easy-table-footer-font-size: 13px;
  --easy-table-footer-height: 44px;
}

.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-surface);
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }
.table-container {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.75rem;
}
.search-input {
  max-width: 280px; font-size: 0.875rem;
  border-radius: var(--radius-md) !important;
}
.action-buttons { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.btn-action {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.9rem; font-size: 0.82rem; font-weight: 500;
  border-radius: var(--radius-md); border: 1px solid var(--border-color);
  background: var(--bg-surface); color: var(--text-primary);
  cursor: pointer; transition: var(--transition-fast);
  white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }
.icon-action {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #fff;
  font-size: 1rem;
  text-decoration: none;
}
.icon-action:hover { color: #fff; }
.icon-action:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--primary) 35%, transparent);
  outline-offset: 2px;
}
.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: var(--bg-body); }

.thumbs-down {
  color: rgb(235, 46, 21);
}
.pending-dot {
  position: absolute;
  top: 2px;
  right: 1px;
  width: 7px;
  height: 7px;
  border: 1px solid #fff;
  border-radius: 50%;
  background: #f97316;
}
</style>

<template>
  <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title source-400 text-capitalize" id="ModalLabel">
            Update Password For {{ updateUser.name }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="">
            <input
              type="password"
              class="form-control"
              placeholder="Enter New Password"
              aria-label="Enter New Password"
              aria-describedby="addon-wrapping"
              autocomplete="new-password"
              v-model="newPassword"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleChangePassword"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="ModalDelete"
    tabindex="-1"
    aria-labelledby="ModalDeleteLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title source-400 text-capitalize" id="ModalDeleteLabel">
            Are you sure that you want to delete {{ updateUser.name }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body pt-0 text-secondary small">
          The account, uploaded documents, inbox notifications, and any directly linked employee
          records and attendance will be permanently deleted. Broadcasts already delivered to other
          users remain available, with this account removed as the author.
        </div>

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleDelete(updateUser._id)"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            :disabled="deletingUserId === updateUser._id"
          >
            <span v-if="deletingUserId === updateUser._id" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
            {{ deletingUserId === updateUser._id ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="ModalToogleApproved"
    tabindex="-1"
    aria-labelledby="ModalToogleApprovedLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-0 text-capitalize">
          <h5
            v-if="updateUser.approved == true"
            class="modal-title source-400"
            id="ModalToogleApprovedLabel"
          >
            disapprove
            <span class="text-capitalize">
              {{ updateUser.name }}
            </span>
          </h5>
          <h5 v-else class="modal-title source-400" id="ModalToogleApprovedLabel">
            approve
            <span class="text-capitalize">
              {{ updateUser.name }}
            </span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            v-if="updateUser.approved == true"
            @click="toggleUserApproved(updateUser._id)"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Disapprove
          </button>
          <button
            v-else
            @click="toggleUserApproved(updateUser._id)"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="ModalAddMessage"
    tabindex="-1"
    aria-labelledby="ModalAddMessageLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title source-400" id="ModalAddMessageLabel">
            Send notification to {{ updateUser.name }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="">
            <input
              type="text"
              class="form-control"
              placeholder="Enter Message"
              aria-label="Enter Message"
              aria-describedby="addon-wrapping"
              v-model="form.text"
            />
          </div>
          <div class="py-3">
            <multiselect
              v-model="form.type"
              :options="optionTypes"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              placeholder="Pick Notification Type"
            ></multiselect>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleSendMessage"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="ModalNotification"
    tabindex="-1"
    aria-labelledby="ModalNotificationLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title source-400" id="ModalNotificationLabel">Notification</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="w-100" v-for="notification in notifications" :key="notification">
            <div class="w-100 p-2">
              <div
                v-if="notification.type == 'success'"
                class="w-100 rounded d-flex align-items-center"
              >
                <div class="w-100 border border-success rounded-4 py-1 px-2">
                  {{ notification.text }}
                </div>
                <div class="p-2 pointer" @click="handleDismiss(notification._id)">
                  <i class="bi bi-x-lg"></i>
                </div>
              </div>
              <div
                v-if="notification.type == 'warning'"
                class="w-100 rounded d-flex align-items-center"
              >
                <div class="w-100 border border-warning rounded-4 py-1 px-2">
                  {{ notification.text }}
                </div>
                <div class="p-2 pointer" @click="handleDismiss(notification._id)">
                  <i class="bi bi-x-lg"></i>
                </div>
              </div>
              <div
                v-if="notification.type == 'danger'"
                class="w-100 rounded d-flex align-items-center"
              >
                <div class="w-100 border border-danger rounded-4 py-1 px-2">
                  {{ notification.text }}
                </div>
                <div class="p-2 pointer" @click="handleDismiss(notification._id)">
                  <i class="bi bi-x-lg"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <div class="page-wrapper source-400 scroll">
    <div class="page-header-bar">
      <div>
        <h5 class="source-500">Manage Users</h5>
      </div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="toolbar mb-4">
            <div class="d-flex align-items-center gap-3 flex-wrap">
              <input
                v-model="search"
                class="form-control search-input"
                size="small"
                placeholder="Search users..."
              />
              <div class="form-check form-switch mb-0">
                <input
                  v-model="showDisapprovedOnly"
                  class="form-check-input"
                  type="checkbox"
                  id="showDisapprovedUsers"
                />
                <label class="form-check-label" for="showDisapprovedUsers" style="font-size: 12px">
                  Show disapproved
                </label>
              </div>
            </div>
            <div class="action-buttons">
              <a
                href="/templates/user_upload_format.xlsx"
                download
                class="btn button_bg icon-action"
                aria-label="Download format"
                title="Download format"
              >
                <i class="bi bi-download" aria-hidden="true"></i>
              </a>
              <router-link
                to="/upload/user/excel"
                class="btn button_bg icon-action"
                aria-label="Upload Excel"
                title="Upload Excel"
              >
                <i class="bi bi-upload" aria-hidden="true"></i>
                <span class="visually-hidden">Upload Excel</span>
              </router-link>
              <router-link to="/add/user" class="d-flex align-items-center text-decoration-none">
                <button type="button" class="btn btn-primary border-0 button_bg source-400">
                  Add User
                </button>
              </router-link>
            </div>
          </div>
          <div class="table-container">
            <div v-auto-animate class="w-100">
              <EasyDataTable
                table-class-name="customize-table"
                :headers="headers"
                :items="filteredItems"
                search-field="name"
                :search-value="search"
                :rows-per-page="10"
                border-cell
                buttons-pagination
                v-auto-animate
              >
                <template v-auto-animate #item-actions="item">
                  <div class="d-flex justify-content-evenly">
                    <div class="table-icon action_icon_color" @click="handleViewUser(item._id)">
                      <el-tooltip content="View User" placement="bottom">
                        <i class="bi bi-eye-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div class="table-icon action_icon_color" @click="handleUserUpdate(item._id)">
                      <el-tooltip content="Update User" placement="bottom">
                        <i class="bi bi-pen-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      class="table-icon action_icon_color position-relative"
                      @click="handleUserDocuments(item._id)"
                    >
                      <el-tooltip content="Manage Documents" placement="bottom">
                        <i class="bi bi-file-earmark-arrow-up-fill pointer" aria-label="Manage Documents"></i>
                      </el-tooltip>
                      <span v-if="hasPendingUserDocuments(item)" class="pending-dot"></span>
                    </div>

                    <!-- <div
                      v-if="user.roleType.name == 'super_admin'"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalAddMessage"
                      @click="updateUser = JSON.parse(JSON.stringify(item))"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Send Notification" placement="bottom">
                        <i class="bi bi-bell-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div> -->
                    <div
                      @click="updateUser = JSON.parse(JSON.stringify(item))"
                      data-bs-toggle="modal"
                      data-bs-target="#Modal"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Change Password" placement="bottom">
                        <i class="bi bi-key-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      @click="updateUser = item"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalToogleApproved"
                      v-if="!item.approved"
                      class="thumbs-down"
                    >
                      <el-tooltip content="Approve User" placement="bottom">
                        <i class="bi bi-hand-thumbs-down-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      @click="updateUser = item"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalToogleApproved"
                      v-if="item.approved"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Disapprove User" placement="bottom">
                        <i class="bi bi-hand-thumbs-up-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      v-if="canDeleteUsers"
                      class="table-icon action_icon_color"
                      @click="updateUser = item"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalDelete"
                    >
                      <el-tooltip content="Delete User" placement="bottom">
                        <i class="bi bi-trash-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </EasyDataTable>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ////////////////////////////////////////Modal////////////////////////////////////////////// -->
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import EasyDataTable from 'vue3-easy-data-table';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Modal } from 'bootstrap';
import axiosClient from '../../axiosClient';

export default {
  name: 'VueDataTable',
  components: {
    EasyDataTable,
    Multiselect,
  },

  data() {
    return {
      user: {},
      notifications: [],
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email' },
        { text: 'Client', value: 'client_id.name', sortable: true },
        { text: 'Job Title', value: 'designation', sortable: true },
        { text: 'Department', value: 'department.name', sortable: true },
        { text: 'Team', value: 'team.name', sortable: true },
        { text: 'Role', value: 'roleType.name', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false, width: 300 },
      ],
      optionTypes: ['success', 'warning', 'danger'],
      form: {
        name: '',
        type: '',
        text: '',
        to_user: '',
        by_user: '',
      },
      newPassword: '',
      updateUser: {},
      showDeleteModal: false,
      deletingUserId: null,

      search: '',
      showDisapprovedOnly: false,
      entries: 0,
      entriesPerPage: 5,
      entriesPerPageOptions: [5, 10, 15, 20],
      page: 1,
      items: [],
      originalItems: [],
    };
  },

  async created() {
    await this.getCurrent();

    try {
      const res = await axiosClient.get(`/api/v1/user/getall`);
      this.originalItems = res.data.data;
      const notifications = await axiosClient.get(`/api/v1/notification/getall/${this.user._id}`);
      this.notifications = notifications.data.data;
      console.log(' this.notifications: ', this.notifications);
    } catch (err) {
      console.log('error: ', err);
    }

    this.items = this.originalItems;

    console.log('Users: ', this.items);
  },

  mounted() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.scroll', {
      opacity: 0,
      y: 50,
      duration: 1.2,
      scrollTrigger: {
        trigger: '.scroll',
        delay: 0.7,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });
  },

  setup() {},

  methods: {
    async handleDismiss(id) {
      console.log(id);
      try {
        const res = await axiosClient.put(`/api/v1/notification/dismiss/${id}`);
        if (res) {
          this.notifications = this.notifications.filter((notification) => notification._id != id);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
      }
    },

    async handleSendMessage() {
      this.form.to_user = this.updateUser._id;
      this.form.by_user = this.user._id;

      try {
        const res = await axiosClient.post(`/api/v1/notification/add`, this.form);
        if (res) {
          toast.success(`Notification Sent `, {
            autoClose: 1000,
          });
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
      }
    },

    async toggleUserApproved(id) {
      try {
        const res = await axiosClient.put(`/api/v1/user/app_dis/${id}`);
        if (res?.data?.data) {
          toast.success(`Updated User `, {
            autoClose: 1000,
          });
          const approved = res.data.data.approved;
          const updateApproval = (user) => user._id === id ? { ...user, approved } : user;
          this.items = this.items.map(updateApproval);
          this.originalItems = this.originalItems.map(updateApproval);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
      }
    },

    async handleChangePassword() {
      if (this.newPassword == '') {
        toast.info(`Enter Password`, {
          autoClose: 1500,
        });
        return;
      }

      if (this.newPassword.length < 6) {
        toast.info(`Password must contain at least 6 characters`, {
          autoClose: 1500,
        });
        return;
      }

      try {
        const res = await axiosClient.put(`/api/v1/user/change/pass/${this.updateUser._id}`, {
          password: this.newPassword,
        });
        if (res) {
          toast.success(`Password Updated! `, {
            autoClose: 1000,
          });
          this.newPassword = '';
          Modal.getOrCreateInstance(document.getElementById('Modal')).hide();
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Something Went Wrong!`);
      }
    },

    async handleDelete(id) {
      if (!id || this.deletingUserId) return;
      this.deletingUserId = id;
      try {
        const res = await axiosClient.put(`/api/v1/user/delete/${id}`);
        if (!res.data?.data || res.data.data.active !== false) {
          throw new Error(res.data?.message || 'Unable to delete user');
        }
        this.items = this.items.filter((item) => item._id !== id);
        this.originalItems = this.originalItems.filter((item) => item._id !== id);
        this.updateUser = {};
        Modal.getOrCreateInstance(document.getElementById('ModalDelete')).hide();
        toast.success('User deleted', { autoClose: 1200 });
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || 'Unable to delete user');
      } finally {
        this.deletingUserId = null;
      }
    },

    FilterByName() {
      console.log('Called FilterByName');

      if (!this.search) {
        this.items = [...this.originalItems];
        return;
      }

      this.items = this.items.filter((item) =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },

    handleUserUpdate(id) {
      this.$router.push(`/update/user/${id}`);
    },

    handleUserDocuments(id) {
      this.$router.push(`/update/user/documents/${id}`);
    },

    hasPendingUserDocuments(user) {
      return ['adhar', 'asci', 'bank'].some((type) => !user[`${type}_proof_url_id`]);
    },

    handleViewUser(id) {
      this.$router.push(`/view/user/${id}`);
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        if (!token) {
          this.$router.push('/login');
        }
        this.user = token.data.user;
        console.log(' this.user : ', this.user);
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }

      return;
    },
  },

  computed: {
    canDeleteUsers() {
      const roleType = this.user.roleType;
      const roleName = (typeof roleType === 'string' ? roleType : roleType?.name) || this.user.role;
      return ['admin', 'super_admin'].includes(String(roleName || '').trim().toLowerCase());
    },
    filteredItems() {
      if (this.showDisapprovedOnly) {
        return this.items.filter((user) => user.approved === false);
      }
      return this.items.filter((user) => user.approved !== false);
    },
  },
};
</script>
