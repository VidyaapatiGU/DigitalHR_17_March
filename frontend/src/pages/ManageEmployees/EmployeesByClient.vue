<style scoped>
.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }

.form-container {
  width: 100%; max-width: 960px; padding: 2rem; margin: auto;
  background: #fff; border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);
}

.form-title {
  font-weight: 600; color: var(--text-primary); font-size: 1.15rem; margin-bottom: 1.5rem;
}

.form-group label {
  font-size: 0.82rem; font-weight: 500; color: var(--text-secondary);
  margin-bottom: 0.25rem; display: block;
}

.btn-submit {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 2rem; font-size: 0.9rem; font-weight: 500;
  border-radius: var(--radius-md); border: none;
  background: var(--primary); color: #fff; cursor: pointer;
  transition: var(--transition-fast);
}
.btn-submit:hover { background: var(--primary-light); transform: translateY(-1px); }

.doc-link {
  color: var(--primary); text-decoration: none; font-size: 0.875rem; font-weight: 500;
}
.doc-link:hover { text-decoration: underline; }

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

.table-container {
  background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color); overflow: hidden;
}

.toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
}
.search-input { max-width: 280px; font-size: 0.875rem; border-radius: var(--radius-md) !important; }
.action-buttons { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.btn-action {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.9rem; font-size: 0.82rem; font-weight: 500;
  border-radius: var(--radius-md); border: 1px solid var(--border-color);
  background: #fff; color: var(--text-primary); cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }
.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: #f1f5f9; }

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title source-400 text-capitalize" id="ModalLabel">
            Update Password For {{ updateEmployee.name }}
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
            class="btn-action"
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
            Are you sure that you want to delete {{ updateEmployee.name }}
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
            @click="handleDelete(updateEmployee.user_id)"
            type="button"
            class="btn-action"
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
            v-if="updateEmployee.approved == true"
            class="modal-title source-400"
            id="ModalToogleApprovedLabel"
          >
            Are you sure that you want to disapprove
            <span class="text-capitalize">
              {{ updateEmployee.name }}
            </span>
          </h5>
          <h5 v-else class="modal-title source-400" id="ModalToogleApprovedLabel">
            Are you sure that you want to approve
            <span class="text-capitalize">
              {{ updateEmployee.name }}
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
            v-if="updateEmployee.approved == true"
            @click="toggleUserApproved(updateEmployee.user_id)"
            type="button"
            class="btn-action"
            data-bs-dismiss="modal"
          >
            Disapprove
          </button>
          <button
            v-else
            @click="toggleUserApproved(updateEmployee.user_id)"
            type="button"
            class="btn-action"
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
            Send notification to {{ updateEmployee.name }}
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
            class="btn-action"
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
  <div class="page-wrapper scroll">
    <div class="page-header-bar">
      <h5>Client : {{ client }}</h5>
      <div class="">
        <div class="position-relative" data-bs-toggle="modal" data-bs-target="#ModalNotification">
          <i class="bi bi-bell-fill pointer" style="font-size: 1.2rem"></i>
          <span
            v-if="notifications.length > 0"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            {{ notifications.length }}
          </span>
          <span
            v-if="notifications.length > 99"
            class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            99+
          </span>
        </div>
      </div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="mt-5 mb-3 d-flex justify-content-between px-2 gap-2">
            <div class="d-flex">
              <input
                v-model="search"
                class="border form-control form-control-sm"
                size="small"
                placeholder="Type to search"
              />
            </div>
          </div>
          <div class="table-container">
            <div class="w-100">
              <EasyDataTable
                table-class-name="customize-table text-capitalize"
                :headers="headers"
                :items="items"
                search-field="name"
                :search-value="search"
                :rows-per-page="10"
                border-cell
                buttons-pagination
              >
                <template #item-actions="item">
                  <div class="d-flex justify-content-evenly">
                    <div
                      class="table-icon action_icon_color"
                      @click="handleEmployeeUpdate(item._id)"
                    >
                      <el-tooltip content="Update " placement="bottom">
                        <i class="bi bi-pen-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div class="table-icon action_icon_color" @click="handleViewEmployee(item._id)">
                      <el-tooltip content="View " placement="bottom">
                        <i class="bi bi-eye-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      class="table-icon action_icon_color"
                      @click="updateEmployee = item"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalDelete"
                    >
                      <el-tooltip content="Delete " placement="bottom">
                        <i class="bi bi-trash-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      data-bs-toggle="modal"
                      data-bs-target="#ModalAddMessage"
                      @click="updateEmployee = JSON.parse(JSON.stringify(item))"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Send Notification" placement="bottom">
                        <i class="bi bi-bell-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>
                    <div
                      @click="updateEmployee = JSON.parse(JSON.stringify(item))"
                      data-bs-toggle="modal"
                      data-bs-target="#Modal"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Change Password" placement="bottom">
                        <i class="bi bi-key-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      @click="updateEmployee = item"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalToogleApproved"
                      v-if="!item.approved"
                      class="thumbs-down"
                    >
                      <el-tooltip content="Approve " placement="bottom">
                        <i class="bi bi-hand-thumbs-down-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <div
                      @click="updateEmployee = item"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalToogleApproved"
                      v-if="item.approved"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Disapprove " placement="bottom">
                        <i class="bi bi-hand-thumbs-up-fill pointer" style="font-size"></i>
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
  name: 'EmployeesByClient',
  components: {
    EasyDataTable,
    Multiselect,
  },

  props: {
    client: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      id: '',
      user: {},
      notifications: [],
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email' },
        { text: 'Designation', value: 'designation' },

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
      updateEmployee: {},
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
      const res = await axiosClient.get(
        `/api/v1/employee/get/employees/by/client/${this.clientId}`
      );
      console.log('res.data.data: ', res.data.data);
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
      this.form.to_user = this.updateEmployee.user_id;
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
        const res = await axiosClient.put(`/api/v1/employee/app_dis/${id}`);
        if (res) {
          toast.success(`Updated Client `, {
            autoClose: 1000,
          });
          for (let i in this.items) {
            if (this.items[i].user_id == id) {
              this.items.splice(i, 1);
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
        toast.info(`Password Must Contain At Least Characters`, {
          autoClose: 1500,
        });
        return;
      }

      try {
        const res = await axiosClient.put(
          `/api/v1/user/change/pass/${this.updateEmployee.user_id}`,
          {
            password: this.newPassword,
          }
        );
        if (res) {
          console.log('res: ', res);
          toast.success(`Password Changed `, {
            autoClose: 1000,
          });
        }
      } catch (err) {
        console.log('error: ', err);
        if (err.status == 404) {
          toast.error(`User Not Found`, {
            autoClose: 1500,
          });
        } else {
          toast.error(`Some Thing Went Wrong`, {
            autoClose: 1500,
          });
        }
      }
    },

    async handleDelete(id) {
      try {
        const res = await axiosClient.delete(`/api/v1/employee/delete/${id}`);
        if (res) {
          toast.success(`Client Deleted`, {
            autoClose: 1000,
          });
          this.items = this.items.filter((item) => item.user_id != id);
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

    handleEmployeeUpdate(id) {
      this.$router.push(`/update/employee/${id}`);
    },

    handleViewEmployee(id) {
      this.$router.push(`/view/employee/${id}`);
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
