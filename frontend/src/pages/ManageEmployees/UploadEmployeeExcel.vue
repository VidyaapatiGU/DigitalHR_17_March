<style scoped>
.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--bg-surface);
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }

.form-container {
  width: 100%; max-width: 960px; padding: 2rem; margin: auto;
  background: var(--bg-surface); border-radius: var(--radius-lg);
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

.table-container {
  background: var(--bg-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
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
  background: var(--bg-surface); color: var(--text-primary); cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }
.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: var(--bg-body); }

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div class="page-wrapper scroll">
    <div class="page-header-bar">
      <h5>Upload Employee Excel</h5>
      <a class="doc-link" href="/templates/employee_upload_format.xlsx" download>
        <i class="bi bi-download me-1" aria-hidden="true"></i>Download Excel format
      </a>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4 h-100">
          <div v-if="isAdmin" class="alert alert-info" role="note">
            Choose a client for this upload. You can also use an optional <code>client_name</code> column
            in a custom workbook to import employees for multiple clients.
          </div>
          <div v-if="isAdmin" class="mb-3" style="max-width: 420px;">
            <label for="employeeUploadClient" class="form-label">Client for this upload</label>
            <select id="employeeUploadClient" v-model="selectedUploadClientId" class="form-select">
              <option value="">Select a client</option>
              <option v-for="client in clients" :key="client._id" :value="String(client._id)">
                {{ client.name }}{{ client.client_code ? ` (${client.client_code})` : '' }}
              </option>
            </select>
          </div>
          <div class="w-100 d-flex justify-content-center gap-3">
            <div class="row w-100">
              <div class="col-12 col-sm-6 col-md-3 d-flex align-items-center">
                <div>
                  <input
                    type="file"
                    class="form-control"
                    id="inputGroupFile04"
                    accept=".csv,.xlsx,.xls"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="Upload"
                    @change="handleFileUpload"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="employeesToSelect.length > 0 && showResponse == false"
            class="table-container mt-3"
          >
            <div class="w-100">
              <EasyDataTable
                table-class-name="customize-table text-capitalize"
                v-model:items-selected="itemsSelected"
                :headers="employeesToSelectHeaders"
                :items="employeesToSelect"
                search-field="name"
                :search-value="search"
                :rows-per-page="10"
                @row-click="getByRow"
                border-cell
                buttons-pagination
              ></EasyDataTable>
            </div>
          </div>
          <div class="col-12 col-sm-6 col-md-3 d-flex align-items-center" v-if="handleUploadButton">
            <div :key="showSpinner">
              <button
                v-if="showSpinner == false"
                type="button"
                class="btn-submit"
                @click="uploadFile"
              >
                <span>Upload</span>
              </button>
              <div v-if="showSpinner" class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>

          <div v-if="employeesNotToSelect.length > 0 && showResponse == false">
            <div class="p-2 mt-3 source-500">Rows Needing Correction</div>

            <div class="table-container">
              <div class="w-100">
                <EasyDataTable
                  table-class-name="customize-table text-capitalize"
                  :headers="employeesNotToSelectHeaders"
                  :items="employeesNotToSelect"
                  search-field="name"
                  :search-value="search"
                  :rows-per-page="10"
                  @row-click="getByRow"
                  border-cell
                  buttons-pagination
                >
                  <template #item-nameActions="item">
                    <div v-if="!item.name || item.name == '' || item.name == undefined">
                      <i class="bi bi-x-lg"></i>
                    </div>
                    <div v-else>
                      <i class="bi bi-check-lg"></i>
                    </div>
                  </template>

                  <template #item-emailActions="item">
                    <div v-if="!item.email || item.email == '' || item.email == undefined">
                      <i class="bi bi-x-lg"></i>
                    </div>
                    <div v-else>
                      <i class="bi bi-check-lg"></i>
                    </div>
                  </template>
                  <template #item-whatsappActions="item">
                    <div
                      v-if="
                        !item.whatsapp_no || item.whatsapp_no == '' || item.whatsapp_no == undefined
                      "
                    >
                      <i class="bi bi-x-lg"></i>
                    </div>
                    <div v-else>
                      <i class="bi bi-check-lg"></i>
                    </div>
                  </template>
                  <template #item-adhar_noActions="item">
                    <div
                      v-if="
                        !item.adhar_card || item.adhar_card == '' || item.adhar_card == undefined
                      "
                    >
                      <i class="bi bi-x-lg text-danger"></i>
                    </div>
                    <div v-else>
                      <i class="bi bi-check text-primary"></i>
                    </div>
                  </template>
                  <template #item-missingFields="item">
                    <div class="text-danger" style="font-size: 12px;">
                      {{ (item.missingFields || []).join(', ') }}
                    </div>
                  </template>
                </EasyDataTable>
              </div>
            </div>
          </div>
          <div v-if="savedEmployees.length > 0 && showResponse == true">
            <div class="p-2 mt-3 source-500">Saved Employess</div>

            <div class="table-container">
              <div class="w-100">
                <EasyDataTable
                  table-class-name="customize-table text-capitalize"
                  :headers="savedEmployeesHeaders"
                  :items="savedEmployees"
                  search-field="name"
                  :search-value="search"
                  :rows-per-page="10"
                  @row-click="getByRow"
                  border-cell
                  buttons-pagination
                ></EasyDataTable>
              </div>
            </div>
          </div>
          <div v-if="unSavedEmployees.length > 0 && showResponse == true">
            <div class="p-2 mt-3 source-500">Duplicate Entries</div>

            <div class="table-container">
              <div class="w-100">
                <EasyDataTable
                  table-class-name="customize-table text-capitalize"
                  :headers="employeesToSelectHeaders"
                  :items="unSavedEmployees"
                  search-field="name"
                  :search-value="search"
                  :rows-per-page="10"
                  @row-click="getByRow"
                  border-cell
                  buttons-pagination
                ></EasyDataTable>
              </div>
            </div>
          </div>
          <div v-if="uploadErrors.length > 0 && showResponse" class="alert alert-warning mt-3" role="status">
            <div class="fw-semibold">Some rows could not be saved</div>
            <ul class="mb-0 mt-1">
              <li v-for="(error, index) in uploadErrors" :key="`${index}-${error}`">{{ error }}</li>
            </ul>
          </div>
          <div v-if="showResponse == true">
            <div class="row w-100">
              <div class="col-12 col-sm-6 col-md-3 d-flex align-items-center"></div>
              <div class="col-12 col-sm-6 col-md-3"></div>
              <div class="col-12 col-sm-6 col-md-3"></div>

              <div class="col-12 col-sm-6 col-md-3 d-flex align-items-center justify-content-end">
                <router-link to="/manage/employees">
                  <button type="button" class="btn-submit">
                    <span>Done</span>
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import 'vue-multiselect/dist/vue-multiselect.css';
import EasyDataTable from 'vue3-easy-data-table';

import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axiosClient from '../../axiosClient';
import { de } from 'element-plus/es/locales.mjs';

export default {
  name: 'UploadXl',
  components: {
    EasyDataTable,
    VueDatePicker,
    Multiselect,
  },

  data() {
    return {
      id: '',
      user: {},
      role: '',
      handleUploadButton: false,

      showResponse: false,
      showSpinner: false,
      itemsSelected: [],
      employeesToSelectHeaders: [
        { text: 'Client', value: 'client_name' },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email' },
        { text: 'Designation', value: 'designation' },
        { text: 'Adhar_Card', value: 'adhar_card' },
      ],
      savedEmployeesHeaders: [
        { text: 'Client', value: 'client_name' },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Username', value: 'username' },
        { text: 'Employee code', value: 'emp_no' },
        { text: 'Email', value: 'email' },
        { text: 'Designation', value: 'designation' },
      ],
      employeesNotToSelectHeaders: [
        { text: 'Client', value: 'client_name' },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email' },
        { text: 'Name', value: 'nameActions', sortable: false, width: 250 },
        { text: 'Email', value: 'emailActions', sortable: false, width: 250 },
        { text: 'Whatsapp', value: 'whatsappActions', sortable: false, width: 250 },
        { text: 'Adhar Card', value: 'adhar_cardActions', sortable: false, width: 250 },
        { text: 'Missing', value: 'missingFields', sortable: false, width: 300 },
      ],
      employeesToSelect: [],
      employeesNotToSelect: [],
      savedEmployees: [],
      unSavedEmployees: [],
      uploadErrors: [],

      month_year: {
        month: new Date().getMonth() - 1,
        year: new Date().getFullYear(),
      },
      excelData: [],
      rawExcelData: [],
      form: {
        employeeData: [],
        client_user_id: '',
        client_id: '',
        team: '',
        roleType: '',
      },
      file: null,
      roles: [],
      teams: [],
      departments: [],
      clients: [],
      currentClient: null,
      selectedUploadClientId: '',
      selected_roleType: '',
      selected_team: '',
      selected_department: '',
    };
  },

  computed: {
    isAdmin() {
      return ['admin', 'super_admin'].includes(this.role);
    },
  },

  watch: {
    selectedUploadClientId() {
      if (this.rawExcelData.length) this.refreshEmployeeRows();
    },
  },

  async created() {
    await this.getCurrent();

    try {
      const [roles, departments, teams] = await Promise.all([
        axiosClient.get('/api/v1/role/getall'),
        axiosClient.get('/api/v1/department/getall'),
        axiosClient.get('/api/v1/team/getall'),
      ]);
      this.roles = roles.data.data || [];
      this.departments = departments.data.data || [];
      this.teams = teams.data.data || [];

      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i].name === 'employee') {
          this.selected_roleType = this.roles[i];
          break;
        }
      }

      for (let i = 0; i < this.departments.length; i++) {
        if (this.departments[i].name == 'Employee') {
          this.selected_department = this.departments[i];
        }
      }

      for (let i = 0; i < this.teams.length; i++) {
        if (this.teams[i].name == 'Employee') {
          this.selected_team = this.teams[i];
        }
      }

    } catch (err) {
      console.log('error: ', err);
    }
  },

  async getByRow(row) {
    console.log(row);
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
    async handleFileUpload(event) {
      this.handleUploadButton = true;
      this.file = event.target.files[0];
      // Clearing the native input after capturing the File lets users retry the same file.
      event.target.value = '';
      this.showSpinner = true;
      this.employeesToSelect = [];
      this.employeesNotToSelect = [];
      this.itemsSelected = [];
      this.excelData = [];
      this.rawExcelData = [];
      this.savedEmployees = [];
      this.unSavedEmployees = [];
      this.uploadErrors = [];
      setTimeout(async () => {
        this.showResponse = false;
        await this.extractEmployeesFromExcel();
      }, 200);
    },
    async extractEmployeesFromExcel() {
      if (!this.file) {
        toast.info(`Select File`, {
          autoClose: 1500,
        });
        this.showSpinner = false;
        return;
      }

      try {
        const isCsv = /\.csv$/i.test(this.file.name);
        if (!isCsv && !/\.(xlsx|xls)$/i.test(this.file.name)) {
          throw new Error('Choose a .csv, .xlsx, or .xls file.');
        }
        const data = isCsv
          ? await this.file.text()
          : new Uint8Array(await this.file.arrayBuffer());
        const workbook = XLSX.read(data, { type: isCsv ? 'string' : 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error('The file has no data sheet.');
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        this.rawExcelData = jsonData.map((row, index) => {
          const normalizedRow = this.normalizeRow(row);
          normalizedRow._excelRow = index + 2;
          return normalizedRow;
        });
        this.refreshEmployeeRows();
      } catch (error) {
        toast.error(error.message || 'Unable to read the file.');
        this.showSpinner = false;
      }
    },

    normalizeRow(row) {
      const normalized = {};
      Object.keys(row || {}).forEach((key) => {
        const cleanKey = key
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');

        const mappedKey = this.mapExcelKey(cleanKey);
        normalized[mappedKey] = row[key];
      });
      // Normalize common numeric fields
      if (normalized.gross !== undefined) {
        normalized.gross = this.toNumber(normalized.gross);
      }
      // Coerce booleans coming in as strings
      if (normalized.lwf !== undefined) {
        normalized.lwf = this.toBoolean(normalized.lwf);
      }
      if (normalized.esi !== undefined) {
        normalized.esi = this.toBoolean(normalized.esi);
      }
      // Normalize gender values
      if (normalized.gender) {
        normalized.gender = this.normalizeGender(normalized.gender);
      }
      // Normalize date_of_joining from Excel serials or strings
      if (normalized.date_of_joining) {
        normalized.date_of_joining = this.normalizeDate(normalized.date_of_joining);
      }
      // Make ip_number optional: remove empty strings to avoid validation errors
      if (normalized.ip_number !== undefined && String(normalized.ip_number).trim() === '') {
        delete normalized.ip_number;
      }
      // If esic_no provided and ip_number missing, use it as ip_number when 10 digits
      if (!normalized.ip_number && normalized.esic_no) {
        const esicCandidate = String(normalized.esic_no).trim();
        if (/^\d{10}$/.test(esicCandidate)) {
          normalized.ip_number = esicCandidate;
        }
      }
      return normalized;
    },

    prepareRowForUpload(row) {
      const reference = String(row.client_name || '').trim().toLowerCase();
      if (this.isAdmin) {
        if (!reference) {
          const selectedClient = this.clients.find(
            (client) => String(client._id) === String(this.selectedUploadClientId)
          );
          if (!selectedClient) return { ...row, _clientError: 'select a client for this upload' };
          return { ...row, client_name: selectedClient.name, _clientId: String(selectedClient._id) };
        }
        const matches = this.clients.filter((client) =>
          [client.name, client.client_code].some((value) => String(value || '').trim().toLowerCase() === reference)
        );
        if (matches.length !== 1) {
          return { ...row, _clientError: matches.length ? 'client name is ambiguous' : 'active client was not found' };
        }
        return { ...row, client_name: matches[0].name, _clientId: String(matches[0]._id) };
      }

      if (!this.currentClient) return { ...row, _clientError: 'No active client is linked to this login' };
      return { ...row, client_name: this.currentClient.name, _clientId: String(this.currentClient._id) };
    },

    refreshEmployeeRows() {
      const normalizedData = this.rawExcelData.map((row) =>
        this.prepareRowForUpload({ ...row })
      );
      this.excelData = normalizedData;
      this.employeesToSelect = [];
      this.employeesNotToSelect = [];

      for (const normalizedRow of normalizedData) {
        if (normalizedRow._skipForCurrentClient) continue;
        const missingFields = this.getMissingRequiredFields(normalizedRow);
        if (missingFields.length === 0) {
          this.employeesToSelect.push(normalizedRow);
        } else {
          this.employeesNotToSelect.push({ ...normalizedRow, missingFields });
        }
      }

      this.itemsSelected = [...this.employeesToSelect];
      this.showSpinner = false;
      if (!this.employeesToSelect.length && !this.employeesNotToSelect.length) {
        this.handleUploadButton = false;
        toast.info(this.isAdmin
          ? 'No employee rows are available for this upload.'
          : 'No employee rows are available for this client.');
      }
    },

    getMissingRequiredFields(row) {
      const missing = [];
      if (!row._clientId) missing.push(row._clientError || 'active client');
      if (!row.name) missing.push('name');
      if (!row.email) missing.push('email');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email).trim())) missing.push('email (invalid format)');
      if (!row.whatsapp_no) missing.push('whatsapp_no');
      else if (!/^\d+$/.test(String(row.whatsapp_no).trim())) missing.push('whatsapp_no (digits only)');
      if (!row.adhar_card) missing.push('adhar_card');
      else if (!/^\d+$/.test(String(row.adhar_card).trim())) missing.push('adhar_card (digits only)');
      if (!row.gender) missing.push('gender');
      if (!row.date_of_joining) missing.push('date_of_joining');
      else if (Number.isNaN(new Date(row.date_of_joining).getTime())) missing.push('date_of_joining (invalid date)');
      if (!row.address) missing.push('address');
      if (row.gross === undefined || row.gross === null || row.gross === '') missing.push('gross');
      else if (!Number.isFinite(Number(row.gross)) || Number(row.gross) < 0) missing.push('gross (must be a non-negative number)');
      return missing;
    },

    mapExcelKey(cleanKey) {
      if (['client', 'client_code', 'company', 'company_name'].includes(cleanKey)) return 'client_name';
      if (['name', 'employee_name', 'employee', 'emp_name', 'fullname', 'full_name'].includes(cleanKey)) {
        return 'name';
      }
      if (['whatsapp', 'whatsapp_no', 'whatsappnumber', 'whatsapp_number', 'mobile', 'mobile_no', 'mobile_number'].includes(cleanKey)) {
        return 'whatsapp_no';
      }
      if (['adhar', 'aadhar', 'aadhaar', 'adhar_card', 'aadhar_card', 'adhar_no', 'aadhar_no'].includes(cleanKey)) {
        return 'adhar_card';
      }
      if (['email', 'email_address', 'emailid', 'e_mail'].includes(cleanKey)) {
        return 'email';
      }
      if (['designation', 'job_title', 'title', 'position'].includes(cleanKey)) {
        return 'designation';
      }
      if (['father_husband_name', 'father_husband', 'father_name', 'husband_name'].includes(cleanKey)) {
        return 'fatherHusband_name';
      }
      if (['date_of_joining', 'joining_date', 'dateofjoining', 'doj', 'date_joined'].includes(cleanKey)) {
        return 'date_of_joining';
      }
      if (['gender', 'sex'].includes(cleanKey)) {
        return 'gender';
      }
      if (['address', 'current_address', 'residential_address'].includes(cleanKey)) {
        return 'address';
      }
      if (['gross', 'gross_salary', 'gross_pay', 'gross_wage'].includes(cleanKey)) {
        return 'gross';
      }
      if (['esic_no', 'esic_number', 'esic', 'esicnumber', 'ip_number', 'ip_no'].includes(cleanKey)) {
        return 'esic_no';
      }
      return cleanKey;
    },

    toBoolean(value) {
      if (typeof value === 'boolean') return value;
      const normalized = String(value).trim().toLowerCase();
      if (['true', 'yes', '1', 'y'].includes(normalized)) return true;
      if (['false', 'no', '0', 'n'].includes(normalized)) return false;
      return Boolean(value);
    },

    toNumber(value) {
      if (typeof value === 'number') return value;
      const normalized = String(value).replace(/,/g, '').trim();
      if (normalized === '') return value;
      const parsed = Number(normalized);
      return Number.isNaN(parsed) ? value : parsed;
    },

    normalizeGender(value) {
      const normalized = String(value).trim().toLowerCase();
      if (['m', 'male'].includes(normalized)) return 'Male';
      if (['f', 'female'].includes(normalized)) return 'Female';
      if (['o', 'other'].includes(normalized)) return 'Other';
      return value;
    },

    normalizeDate(value) {
      // Excel serial date
      if (typeof value === 'number' && value > 25569) {
        const utcDays = Math.floor(value - 25569);
        const date = new Date(utcDays * 86400 * 1000);
        return date.toISOString().slice(0, 10);
      }
      // If already Date or ISO-ish string, pass through
      return value;
    },

    async uploadFile() {
      this.form.team = this.selected_team?._id;
      this.form.department = this.selected_department?._id;
      this.form.roleType = this.selected_roleType?._id;
      if (this.validateForm() == false) return;

      const selectedRows = this.itemsSelected.length ? this.itemsSelected : this.employeesToSelect;
      const groups = this.isAdmin
        ? [...selectedRows.reduce((grouped, row) => {
            if (!grouped.has(row._clientId)) grouped.set(row._clientId, []);
            grouped.get(row._clientId).push(row);
            return grouped;
          }, new Map())].map(([clientId, rows]) => ({
            client: this.clients.find((client) => String(client._id) === clientId),
            rows,
          }))
        : [{ client: this.currentClient, rows: selectedRows }];

      this.showSpinner = true;
      this.savedEmployees = [];
      this.unSavedEmployees = [];
      this.uploadErrors = [];
      for (const group of groups) {
        if (!group.client) {
          this.uploadErrors.push('An active client could not be resolved for selected rows.');
          continue;
        }
        const employeeData = group.rows.map(({
          _clientId,
          _clientError,
          _skipForCurrentClient,
          selected,
          ...row
        }) => row);
        try {
          const response = await axiosClient.post('/api/v1/employee/add/employees/excel', {
            ...this.form,
            client_user_id: group.client._id,
            client_id: group.client._id,
            employeeData,
          });
          this.savedEmployees.push(...(response.data.newUsers || []).map((employee) => ({
            ...employee,
            client_name: group.client.name,
          })));
          this.unSavedEmployees.push(...(response.data.existingUsers || []).map((employee) => ({
            ...employee,
            client_name: group.client.name,
          })));
          this.uploadErrors.push(...(response.data.Errors || []).map(
            (error) => `${group.client.name}: ${error}`
          ));
        } catch (error) {
          this.uploadErrors.push(
            `${group.client.name}: ${error.response?.data?.message || 'Unable to import employees'}`
          );
        }
      }

      this.showSpinner = false;
      if (this.uploadErrors.length) {
        toast.warning(`${this.savedEmployees.length} added; ${this.uploadErrors.length} issue(s) need attention`, { autoClose: 2500 });
      } else {
        toast.success(`${this.savedEmployees.length} employees added; ${this.unSavedEmployees.length} duplicates skipped`, { autoClose: 2000 });
      }
      this.handleUploadButton = false;
      this.showResponse = true;
    },

    handleEmployeeUpdate(id) {
      this.$router.push(`/update/employee/${id}`);
    },

    handleViewEmployee(id) {
      this.$router.push(`/view/employee/${id}`);
    },

    validateForm() {
      if (!this.file) {
        toast.info(`Select Excel File`, {
          autoClose: 1500,
        });
        return false;
      }

      if (this.employeesToSelect.length <= 0) {
        toast.info(`No valid rows found in Excel`, {
          autoClose: 1500,
        });
        return false;
      }

      if (this.form.team == '' || this.form.team == undefined) {
        toast.info(`Select Team`, {
          autoClose: 1500,
        });
        return false;
      }

      if (this.form.department == '' || this.form.department == undefined) {
        toast.info(`Select Department`, {
          autoClose: 1500,
        });
        return false;
      }

      if (this.itemsSelected.length <= 0 && this.employeesToSelect.length > 0) {
        // If nothing is manually selected, we will upload all valid rows
        this.itemsSelected = [...this.employeesToSelect];
      }

      if (this.itemsSelected.length <= 0) {
        toast.info(`Select Employees`, {
          autoClose: 1500,
        });
        return false;
      }

      return true;
    },

    async getCurrent() {
      try {
        const response = await axiosClient.get('/api/v1/user/getCurrent/');
        this.user = response.data.user || {};
        this.role = this.user.roleType?.name || this.user.role || (this.user.industry_type ? 'client' : '');
      } catch (err) {
        this.$router.push('/login');
        return;
      }

      try {
        if (this.isAdmin) {
          const response = await axiosClient.get('/api/v1/client/get/all/clients');
          this.clients = (response.data.data || []).filter((client) =>
            client.active !== false && client.approved !== false && !client.deletedAt
          );
          this.selectedUploadClientId = '';
          return;
        }

        const response = await axiosClient.get(`/api/v1/client/get/${this.user._id}`);
        this.currentClient = response.data.data?.[0] || null;
        if (this.currentClient) {
          this.form.client_user_id = this.currentClient._id;
          this.form.client_id = this.currentClient._id;
        }
      } catch (err) {
        console.error('Could not load client for employee upload:', err.response?.data?.message || err.message);
      }
    },
  },
};
</script>
