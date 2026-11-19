<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.customize-table {
  --easy-table-header-font-size: 0.8125rem;
  --easy-table-header-font-color: var(--text-secondary);
  --easy-table-header-background-color: var(--bg-muted);
  --easy-table-body-row-font-size: 0.875rem;
  --easy-table-body-row-font-color: var(--text-primary);
  --easy-table-body-row-hover-background-color: var(--primary-50);
  --easy-table-border-color: var(--border-color);
  --easy-table-row-border: 1px solid var(--border-light);
  --easy-table-footer-background-color: var(--bg-muted);
  --easy-table-footer-font-color: var(--text-secondary);
  --easy-table-footer-font-size: 0.8125rem;
}

.page-wrapper {
  background: var(--bg-body);
}

.page-header-bar {
  padding: 1rem 1.5rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
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
  background: var(--bg-surface);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
  overflow-y: visible;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  justify-content: flex-start;
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
  background: var(--theme-button-bg);
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
  background: var(--theme-button-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
  color: #ffffff;
}

.format-link {
  font-size: 0.75rem;
  color: var(--primary-light);
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
  background: var(--primary-50);
  color: var(--primary-light);
}

.table-icon.action_icon_color {
  color: var(--primary);
}

.employee-actions {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 0.15rem;
  min-width: 220px;
}

.employee-proof-pending-dot {
  display: inline-block;
  width: 0.55rem;
  height: 0.55rem;
  flex: 0 0 0.55rem;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 0 2px #fff;
}
.employee-proof-button-dot {
  position: absolute;
  top: 1px;
  right: 1px;
  z-index: 1;
  pointer-events: none;
}

/* Keep row actions available while the wider employee table is swiped on mobile. */
.table-container :deep(.vue3-easy-data-table__header th:last-child),
.table-container :deep(.vue3-easy-data-table__body td:last-child) {
  position: sticky;
  right: 0;
  z-index: 2;
  box-shadow: -8px 0 12px -12px rgba(15, 23, 42, 0.55);
}

.table-container :deep(.vue3-easy-data-table__header th:last-child) {
  z-index: 3;
  background: var(--bg-muted);
}

.table-container :deep(.vue3-easy-data-table__body td:last-child) {
  background: var(--bg-surface);
}

.table-container :deep(.vue3-easy-data-table__body tr.even-row td:last-child) {
  background: var(--bg-muted);
}

.thumbs-down {
  color: var(--danger, #ef4444);
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
            @click="toggleUserApproved(updateEmployee._id || updateEmployee.user_id)"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Disapprove
          </button>
          <button
            v-else
            @click="toggleUserApproved(updateEmployee._id || updateEmployee.user_id)"
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
    id="ModalBulkDelete"
    tabindex="-1"
    aria-labelledby="ModalBulkDeleteLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title source-400 text-capitalize" id="ModalBulkDeleteLabel">
            Delete {{ bulkDeleteCount }} employees?
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body pt-0">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="includeDisapprovedOnDelete"
              v-model="includeDisapprovedOnDelete"
            />
            <label class="form-check-label" for="includeDisapprovedOnDelete">
              Also delete disapproved employees
            </label>
          </div>
        </div>

        <div class="modal-footer border-0">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">
            Close
          </button>
          <button
            @click="handleBulkDelete"
            type="button"
            class="btn text-light border-0 button_bg btn-sm"
            data-bs-dismiss="modal"
          >
            Delete Selected
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

  <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <div class="source-400 pt-0 h-100 scroll page-wrapper">
    <div class="page-header-bar">
      <h5>Manage Employees</h5>
      <div class="d-flex align-items-center gap-2">
        <el-tooltip content="Upload Employee Excel" placement="bottom">
          <router-link to="/upload/employee/excel" class="text-decoration-none">
            <button type="button" class="btn-action">
              <i class="bi bi-file-earmark-arrow-up"></i>
              Upload Excel
            </button>
          </router-link>
        </el-tooltip>
        <el-tooltip content="Download Excel format" placement="bottom">
          <a
            href="/templates/employee_upload_format.xlsx"
            download
            class="btn-action"
            style="padding: 0.45rem 0.6rem;"
          >
            <i class="bi bi-download"></i>
          </a>
        </el-tooltip>
      </div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4">
          <div class="toolbar mb-4">
            <input
              v-model="search"
              class="form-control search-input"
              placeholder="Search employees..."
            />
            <div v-if="role != 'super_admin'" class="action-buttons">
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
              <el-tooltip content="Delete selected employees" placement="bottom">
                <button
                  type="button"
                  class="btn-action"
                  :disabled="selectedIds.length === 0"
                  data-bs-toggle="modal"
                  data-bs-target="#ModalBulkDelete"
                >
                  <i class="bi bi-trash-fill"></i>
                  Delete Selected
                </button>
              </el-tooltip>
            </div>
            <div class="form-check form-switch ms-auto">
              <input class="form-check-input" type="checkbox" id="showDisapproved" v-model="showDisapprovedOnly">
              <label class="form-check-label" for="showDisapproved" style="font-size:12px;">Show disapproved</label>
            </div>
          </div>
          <div class="table-container">
            <div class="w-100">
              <!-- table-class-name="customize-table text-capitalize" -->
              <EasyDataTable
                table-class-name="customize-table"
                :headers="headers"
                :items="filteredItems"
                search-field="name"
                :search-value="search"
                :rows-per-page="10"
                border-cell
                buttons-pagination
              >
                <template #header-select>
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="allVisibleSelected"
                    :indeterminate="someVisibleSelected"
                    @change="toggleSelectAll($event.target.checked)"
                  />
                </template>
                <template #item-select="item">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="selectedIds.includes(item._id)"
                    @change="toggleSelect(item._id, $event.target.checked)"
                  />
                </template>
                <template #item-actions="item">
                  <div class="employee-actions">
                    <div class="table-icon action_icon_color" @click="handleViewEmployee(item._id)">
                      <el-tooltip placement="bottom" popper-class="mini-card-tooltip">
                        <template #content>
                          <div class="p-2" style="min-width:210px; font-size:12px; line-height:1.35;">
                            <div class="fw-semibold text-capitalize">{{ item.name || '—' }}</div>
                            <div class="text-muted">{{ item.designation || 'No designation' }}</div>
                            <div class="mt-1">Code: <strong>{{ item.emp_no || '—' }}</strong></div>
                            <div>Username: {{ item.username || '—' }}</div>
                            <div>📧 {{ item.email || 'No email' }}</div>
                            <div>📱 {{ item.whatsapp_no || 'No WhatsApp' }}</div>
                            <div>Dept: {{ item.department?.name || '—' }}</div>
                            <div>Team: {{ item.team?.name || '—' }}</div>
                            <div>City: {{ item.city || '—' }}</div>
                            <div class="text-wrap">Addr: {{ item.address || '—' }}</div>
                          </div>
                        </template>
                        <i class="bi bi-eye-fill pointer" style="font-size"></i>
                      </el-tooltip>
                    </div>
                    <div
                      class="table-icon action_icon_color position-relative"
                      @click="handleEmployeeUpdate(item._id)"
                    >
                      <el-tooltip
                        :content="pendingEmployeeProofLabels(item).length ? `Update — proof documents pending: ${pendingEmployeeProofLabels(item).join(', ')}` : 'Update'"
                        placement="bottom"
                      >
                        <i class="bi bi-pen-fill pointer" style="font-size"></i>
                      </el-tooltip>
                      <span
                        v-if="pendingEmployeeProofLabels(item).length"
                        class="employee-proof-pending-dot employee-proof-button-dot"
                        role="img"
                        :aria-label="`Proof documents pending: ${pendingEmployeeProofLabels(item).join(', ')}`"
                      ></span>
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
                      v-if="item.active !== false && item.approved !== false"
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

      headers: [
        { text: '', value: 'select', sortable: false, width: 40 },
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
      showDisapprovedOnly: false,
      entries: 0,
      entriesPerPage: 5,
      entriesPerPageOptions: [5, 10, 15, 20],
      page: 1,
      items: [],
      originalItems: [],
      selectedIds: [],
      includeDisapprovedOnDelete: false,
    };
  },

  async created() {
    await this.getCurrent();
    try {
      const res = await axiosClient.get(
        `/api/v1/employee/client/${this.user._id}?includeInactive=true`
      );
      //console.log('res.data.data: ', res.data.data);
      this.originalItems = res.data.data;
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
    pendingEmployeeProofLabels(employee) {
      return [
        { label: 'Aadhaar', field: 'adhar_proof' },
        { label: 'ASCI document', field: 'asci_proof' },
        { label: 'Bank proof', field: 'bank_proof' },
      ]
        .filter((document) => !employee?.[document.field])
        .map((document) => document.label);
    },

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
        if (res?.data?.data) {
          toast.success(`Employee status updated`, {
            autoClose: 1000,
          });
          const updateApproval = (emp) => emp._id === res.data.data._id
            ? { ...emp, approved: res.data.data.approved, active: res.data.data.active }
            : emp;
          this.items = this.items.map(updateApproval);
          this.originalItems = this.originalItems.map(updateApproval);
        } else {
          toast.error('Employee not found', { autoClose: 1500 });
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
          this.originalItems = this.originalItems.filter((item) => item._id != id);
          this.selectedIds = this.selectedIds.filter((selectedId) => selectedId != id);
        }
      } catch (err) {
        console.log('error: ', err);
        toast.error(`Some Thing Went Wrong`);
      }
    },

    toggleSelect(id, isChecked) {
      if (isChecked) {
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id);
        }
      } else {
        this.selectedIds = this.selectedIds.filter((selectedId) => selectedId !== id);
      }
    },

    toggleSelectAll(isChecked) {
      const visibleIds = this.filteredItems.map((item) => item._id);
      if (isChecked) {
        const merged = new Set([...this.selectedIds, ...visibleIds]);
        this.selectedIds = Array.from(merged);
      } else {
        this.selectedIds = this.selectedIds.filter((id) => !visibleIds.includes(id));
      }
    },

    async handleBulkDelete() {
      const disapprovedIds = this.includeDisapprovedOnDelete
        ? this.originalItems.filter((emp) => emp.approved === false).map((emp) => emp._id)
        : [];
      const idsToDelete = Array.from(new Set([...this.selectedIds, ...disapprovedIds]));
      if (idsToDelete.length === 0) return;
      const results = await Promise.allSettled(
        idsToDelete.map((id) => axiosClient.delete(`/api/v1/employee/delete/${id}`))
      );
      const failedIds = [];
      results.forEach((res, idx) => {
        if (res.status === 'rejected') failedIds.push(idsToDelete[idx]);
      });
      const deletedIds = idsToDelete.filter((id) => !failedIds.includes(id));

      if (deletedIds.length) {
        this.items = this.items.filter((item) => !deletedIds.includes(item._id));
        this.originalItems = this.originalItems.filter((item) => !deletedIds.includes(item._id));
      }

      this.selectedIds = failedIds;

      if (failedIds.length) {
        toast.error(`Failed to delete ${failedIds.length} employees`, { autoClose: 1500 });
      } else {
        toast.success(`Deleted ${deletedIds.length} employees`, { autoClose: 1500 });
      }
      this.includeDisapprovedOnDelete = false;
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

  computed: {
    filteredItems() {
      if (this.showDisapprovedOnly) {
        return this.items.filter((emp) => emp.approved === false || emp.active === false);
      }
      return this.items.filter((emp) => emp.approved !== false);
    },
    allVisibleSelected() {
      const visibleIds = this.filteredItems.map((item) => item._id);
      return visibleIds.length > 0 && visibleIds.every((id) => this.selectedIds.includes(id));
    },
    someVisibleSelected() {
      const visibleIds = this.filteredItems.map((item) => item._id);
      const selectedVisible = visibleIds.filter((id) => this.selectedIds.includes(id));
      return selectedVisible.length > 0 && selectedVisible.length < visibleIds.length;
    },
    bulkDeleteCount() {
      const disapprovedIds = this.includeDisapprovedOnDelete
        ? this.originalItems.filter((emp) => emp.approved === false).map((emp) => emp._id)
        : [];
      return Array.from(new Set([...this.selectedIds, ...disapprovedIds])).length;
    },
  },
};
</script>
