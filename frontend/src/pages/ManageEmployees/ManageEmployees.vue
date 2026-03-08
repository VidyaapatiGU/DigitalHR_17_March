<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.customize-table {
  --easy-table-header-font-size: 0.8125rem;
  --easy-table-header-font-color: #475569;
  --easy-table-header-background-color: #f8fafc;
  --easy-table-body-row-font-size: 0.875rem;
  --easy-table-body-row-font-color: #1e293b;
  --easy-table-body-row-hover-background-color: #eff6ff;
  --easy-table-border-color: #e2e8f0;
  --easy-table-row-border: 1px solid #f1f5f9;
  --easy-table-footer-background-color: #f8fafc;
  --easy-table-footer-font-color: #64748b;
  --easy-table-footer-font-size: 0.8125rem;
}

.page-wrapper {
  background: var(--bg-body, #f1f5f9);
}

.page-header-bar {
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header-bar h5 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  letter-spacing: -0.025em;
  margin: 0;
}

.table-container {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--border-color, #e2e8f0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  max-width: 240px;
  font-size: 0.8125rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-action {
  background: var(--primary, #1e3a5f);
  color: #ffffff;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 150ms ease;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  text-decoration: none;
}

.btn-action:hover {
  background: var(--primary-light, #2563eb);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.2);
  color: #ffffff;
}

.format-link {
  font-size: 0.75rem;
  color: var(--primary-light, #2563eb);
  text-decoration: none;
  font-weight: 500;
}

.format-link:hover {
  text-decoration: underline;
}

.table-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  transition: all 150ms ease;
  color: var(--text-secondary, #64748b);
}

.table-icon:hover {
  background: var(--primary-50, #eff6ff);
  color: var(--primary-light, #2563eb);
}

.table-icon.action_icon_color {
  color: var(--primary, #1e3a5f);
}

.thumbs-down {
  color: var(--danger, #ef4444);
}

.notification-badge {
  position: relative;
  cursor: pointer;
}

@media (max-width: 576px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-input {
    max-width: 100%;
  }
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
            @click="handleDelete(updateEmployee._id)"
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
            class="modal-title source-400"
            id="ModalToogleApprovedLabel"
            v-if="updateEmployee.approved == true"
          >
            Are you sure that you want to disapprove
            <span class="text-capitalize">
              {{ updateEmployee.name }}
            </span>
          </h5>
          <h5 class="modal-title source-400" id="ModalToogleApprovedLabel" v-else>
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
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Disapprove
          </button>
          <button
            v-else
            @click="toggleUserApproved(updateEmployee.user_id)"
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
  <div class="source-400 pt-0 h-100 scroll page-wrapper">
    <div class="page-header-bar">
      <h5>Manage Employees</h5>
      <div class="notification-badge" data-bs-toggle="modal" data-bs-target="#ModalNotification">
        <i class="bi bi-bell-fill pointer" style="font-size: 1.1rem; color: var(--text-secondary)"></i>
        <span
          v-if="notifications.length > 0 && notifications.length <= 99"
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

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="toolbar mb-4">
            <input
              v-model="search"
              class="form-control search-input"
              size="small"
              placeholder="Search employees..."
            />
            <div v-if="role != 'super_admin'" class="action-buttons">
              <a href="https://technirmitisoftwares.com/Employees_format.xlsx" class="format-link">
                Download Format
              </a>
              <el-tooltip content="Upload Employee Excel" placement="bottom">
                <router-link to="/upload/employee/excel" class="text-decoration-none">
                  <button type="button" class="btn-action">
                    <i class="bi bi-file-earmark-arrow-up"></i>
                    Upload Excel
                  </button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Add Employee" placement="bottom">
                <router-link to="/add/employee" class="text-decoration-none">
                  <button type="button" class="btn-action">
                    <i class="bi bi-person-fill-add"></i>
                    Add Employee
                  </button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="Download Employee Excel" placement="bottom">
                <button
                  type="button"
                  @click="downloadExcel"
                  class="btn-action"
                >
                  <i class="bi bi-download"></i>
                  Export
                </button>
              </el-tooltip>
            </div>
          </div>
          <div class="table-container">
            <div class="w-100">
              <!-- table-class-name="customize-table text-capitalize" -->
              <EasyDataTable
                table-class-name="customize-table"
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
                    <div class="table-icon action_icon_color" @click="handleViewEmployee(item._id)">
                      <el-tooltip content="View " placement="bottom">
                        <i class="bi bi-eye-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>
                    <div
                      class="table-icon action_icon_color"
                      @click="handleEmployeeUpdate(item._id)"
                    >
                      <el-tooltip content="Update " placement="bottom">
                        <i class="bi bi-pen-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>

                    <!-- <div
                      data-bs-toggle="modal"
                      data-bs-target="#ModalAddMessage"
                      @click="updateEmployee = JSON.parse(JSON.stringify(item))"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Send Notification" placement="bottom">
                        <i class="bi bi-bell-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div> -->
                    <!-- <div
                      @click="updateEmployee = JSON.parse(JSON.stringify(item))"
                      data-bs-toggle="modal"
                      data-bs-target="#Modal"
                      class="table-icon action_icon_color"
                    >
                      <el-tooltip content="Change Password" placement="bottom">
                        <i class="bi bi-key-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div> -->

                    <div
                      class="table-icon action_icon_color"
                      @click="updateEmployee = JSON.parse(JSON.stringify(item))"
                    >
                      <el-tooltip content="Salary Slip" placement="bottom">
                        <router-link
                          :to="'/wage/slip/of/months/' + item._id"
                          style="text-decoration: none"
                        >
                          <i
                            class="bi bi-receipt-cutoff pointer action_icon_color"
                            style="font-size"
                          ></i>
                        </router-link>
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
import * as XLSX from 'xlsx'; // Import the XLSX library
import { saveAs } from 'file-saver'; // Import the file-saver library
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import EasyDataTable from 'vue3-easy-data-table';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axiosClient from '../../axiosClient';

export default {
  name: 'ManageEmployees',
  components: {
    EasyDataTable,
    Multiselect,
  },

  data() {
    return {
      id: '',
      user: {},
      role: '',

      notifications: [],
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Employee Code', value: 'emp_no' },
        { text: 'Username', value: 'username' },
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
        `/api/v1/employee/client/${this.user._id}`
      );
      //console.log('res.data.data: ', res.data.data);
      this.originalItems = res.data.data;
      const notifications = await axiosClient.get(`/api/v1/notification/getall/${this.user._id}`);
      this.notifications = notifications.data.data;
      //console.log(' this.notifications: ', this.notifications);
    } catch (err) {
      console.log('error: ', err);
    }
    this.items = this.originalItems;
    //console.log('Users: ', this.items);
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
    downloadExcel() {
      let tempItems = [];

      for (let i = 0; i < this.originalItems.length; i++) {
        tempItems.push({
          employer_name: this.user.name,
          emp_no: this.originalItems[i].emp_no,
          name: this.originalItems[i].name,
          email: this.originalItems[i].email,
          fatherHusband_name: this.originalItems[i].fatherHusband_name,
          designation: this.originalItems[i].designation,
          whatsapp_no: this.originalItems[i].whatsapp_no,
          date_of_joining: this.originalItems[i].date_of_joining,
          city: this.originalItems[i].city,
          address: this.originalItems[i].address,
          state: this.originalItems[i].state,
          country: this.originalItems[i].country,
          pin_code: this.originalItems[i].pin_code,
          adhar_card: this.originalItems[i].adhar_card,
          uan_no: this.originalItems[i].uan_no,
          pf_no: this.originalItems[i].pf_no,
          esic_no: this.originalItems[i].esic_no,
          bank_name: this.originalItems[i].bank_name,
          bank_ac_no: this.originalItems[i].bank_ac_no,
          bank_ifsc: this.originalItems[i].bank_ifsc,
          basic: this.originalItems[i].basic,
          da: this.originalItems[i].da,
          hra: this.originalItems[i].hra,
          food_allow: this.originalItems[i].food_allow,
          conveyance: this.originalItems[i].conveyance,
          gross: this.originalItems[i].gross,
          lwf: this.originalItems[i].lwf,
          esi: this.originalItems[i].esi,
        });
      }

      const worksheet = XLSX.utils.json_to_sheet(tempItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const filename = this.user.name.split(' ')[0] + '_AllEmployees.xlsx';
      saveAs(blob, filename);
    },

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

      if (this.newPassword.length < 5) {
        toast.info(`Password Must Contain At Least Characters`, {
          autoClose: 1500,
        });
        return;
      }

      try {
        const res = await axiosClient.put(
          `/api/v1/employee/change/password/${this.updateEmployee._id}`,
          {
            password: this.newPassword,
          }
        );
        if (res) {
          console.log('res: ', res);
          toast.success(`Password Changed `, {
            autoClose: 1000,
          });
          this.newPassword = '';
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
      console.log('handleDelete');
      console.log(id);
      try {
        const res = await axiosClient.delete(`/api/v1/employee/delete/${id}`);
        if (res) {
          toast.success(`Client Deleted`, {
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

    handleEmployeeUpdate(id) {
      this.$router.push(`/update/employee/${id}`);
    },

    handleViewEmployee(id) {
      this.$router.push(`/view/employee/${id}`);
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);

        this.user = token.data.user;

        //this.role = this.user.roleType.name;
        //if (!token.data.user.industry_type) {
        //  this.role = this.user.roleType.name;
        //} else {
        //  this.role = 'client';
        //}
        if (token.data.user.industry_type) {
          this.role = 'client';
        } else if (token.data.user.designation) {
          this.role = 'employee';
        } else {
          this.role = this.user.roleType.name;
        }
        //console.log('user', this.user, ' this.role ', this.role);
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
