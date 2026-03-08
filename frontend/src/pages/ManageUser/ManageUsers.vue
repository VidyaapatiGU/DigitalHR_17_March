<style scoped>
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.customize-table {
  --easy-table-border: none;
  --easy-table-row-border: 1px solid #f1f5f9;
  --easy-table-header-font-size: 13px;
  --easy-table-header-font-color: #64748b;
  --easy-table-header-background-color: #f8fafc;
  --easy-table-header-height: 44px;
  --easy-table-body-row-height: 52px;
  --easy-table-body-row-font-size: 13px;
  --easy-table-body-row-font-color: #334155;
  --easy-table-body-row-hover-background-color: #f8fafc;
  --easy-table-footer-background-color: #f8fafc;
  --easy-table-footer-font-color: #64748b;
  --easy-table-footer-font-size: 13px;
  --easy-table-footer-height: 44px;
}

.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }
.notification-badge { position: relative; cursor: pointer; padding: 0.25rem; }

.table-container {
  background: #fff;
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
  background: #fff; color: var(--text-primary);
  cursor: pointer; transition: var(--transition-fast);
  white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }
.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: #f1f5f9; }

.thumbs-down {
  color: rgb(235, 46, 21);
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
              type="text"
              class="form-control"
              placeholder="Enter New Password"
              aria-label="Enter New Password"
              aria-describedby="addon-wrapping"
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
            data-bs-dismiss="modal"
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

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleDelete(updateUser._id)"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Delete
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
      <div class="notification-badge" data-bs-toggle="modal" data-bs-target="#ModalNotification">
        <div class="position-relative">
          <i class="bi bi-bell-fill pointer text-danger" style="font-size: 1.2rem"></i>
          <span
            v-if="notifications.length > 0"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark bg-gradient"
          >
            {{ notifications.length }}
          </span>
          <span
            v-if="notifications.length > 99"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark bg-gradient"
          >
            99+
          </span>
        </div>
      </div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="toolbar mb-4">
            <input
              v-model="search"
              class="form-control search-input"
              size="small"
              placeholder="Search users..."
            />
            <div class="action-buttons">
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
                :items="items"
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
                      v-if="user.roleType.name == 'super_admin'"
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
        { text: 'Department', value: 'department.name', sortable: true },
        { text: 'Team', value: 'team.name', sortable: true },
        { text: 'Role', value: 'roleType.name', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false, width: 250 },
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

      search: '',
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
        if (res) {
          toast.success(`Updated User `, {
            autoClose: 1000,
          });
          for (let i in this.items) {
            if (this.items[i]._id == id) {
              this.items[i].approved = !this.items[i].approved;
            }
          }
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
        toast.info(`Password Must Contain At Least 5 Characters`, {
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
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Something Went Wrong!`);
      }
    },

    async handleDelete(id) {
      try {
        const res = await axiosClient.put(`/api/v1/user/delete/${id}`);
        if (res) {
          toast.success(`User Deleted`, {
            autoClose: 1000,
          });
          this.items = this.items.filter((item) => item._id != id);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
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
};
</script>
