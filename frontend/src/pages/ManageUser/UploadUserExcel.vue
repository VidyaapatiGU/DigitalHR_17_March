<style scoped>
.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--bg-surface);
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }
.content-container { max-width: 1120px; margin: 0 auto; padding: 1.5rem; }
.upload-card, .results-card {
  background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); padding: 1.25rem; margin-top: 1rem;
}
.notice { border-radius: var(--radius-md); padding: 1rem 1.1rem; }
.table-wrap { overflow-x: auto; }
.table { min-width: 700px; }
.btn-submit {
  display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1.2rem;
  font-size: 0.9rem; font-weight: 500; border-radius: var(--radius-md); border: none;
  background: var(--primary); color: #fff; cursor: pointer; transition: var(--transition-fast);
}
.btn-submit:hover:not(:disabled) { background: var(--primary-light); transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.download-link { color: var(--primary); font-weight: 600; text-decoration: none; white-space: nowrap; }
.download-link:hover { text-decoration: underline; }
@media (max-width: 576px) {
  .page-header-bar { padding: 0.75rem 1rem; }
  .content-container { padding: 1rem; }
  .upload-card, .results-card { padding: 1rem; }
}
</style>

<template>
  <div class="page-wrapper">
    <div class="page-header-bar">
      <button type="button" class="btn btn-light btn-sm" @click="$router.push('/manage/users')">
        <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Users
      </button>
      <h5>Bulk Upload Users</h5>
      <a class="download-link" href="/templates/user_upload_format.xlsx" download>
        <i class="bi bi-download me-1" aria-hidden="true"></i>Download Excel format
      </a>
    </div>

    <div class="h-100 overflow-y-auto">
      <main class="content-container">
        <section class="upload-card">
          <label class="form-label fw-semibold" for="userWorkbook">Choose a user workbook</label>
          <input
            id="userWorkbook"
            ref="fileInput"
            type="file"
            class="form-control"
            accept=".xlsx,.xls"
            :disabled="isParsing || isUploading"
            @change="handleFileUpload"
          />
          <div v-if="isParsing" class="mt-3 small text-secondary" role="status">
            <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Reading workbook…
          </div>
        </section>

        <section v-if="usersToSelect.length && !showResults" class="upload-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h6 class="mb-1">Ready to import</h6>
              <div class="small text-secondary">
                {{ selectedCount }} of {{ usersToSelect.length }} valid user row(s) selected
              </div>
            </div>
            <button class="btn btn-outline-secondary btn-sm" type="button" @click="toggleAllRows">
              {{ selectedCount === usersToSelect.length ? 'Deselect all' : 'Select all' }}
            </button>
          </div>

          <div class="table-wrap">
            <table class="table table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col"><span class="visually-hidden">Select</span></th>
                  <th scope="col">Excel row</th>
                  <th scope="col">User</th>
                  <th scope="col">Username</th>
                  <th scope="col">Client</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usersToSelect" :key="user._excelRow">
                  <td><input v-model="user.selected" type="checkbox" :aria-label="`Select ${user.name}`" /></td>
                  <td>{{ user._excelRow }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.username }}</td>
                  <td>{{ user.client_code }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            class="btn-submit mt-3"
            type="button"
            :disabled="isUploading || selectedCount === 0"
            @click="uploadFile"
          >
            <span v-if="isUploading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            {{ isUploading ? 'Creating users…' : `Create ${selectedCount} user(s)` }}
          </button>
        </section>

        <section v-if="invalidUsers.length && !showResults" class="upload-card">
          <h6 class="mb-3">Rows to fix</h6>
          <div class="table-wrap">
            <table class="table table-sm align-middle mb-0">
              <thead><tr><th>Excel row</th><th>User</th><th>Issue</th></tr></thead>
              <tbody>
                <tr v-for="row in invalidUsers" :key="row._excelRow">
                  <td>{{ row._excelRow }}</td>
                  <td>{{ row.name || '—' }}</td>
                  <td class="text-danger">{{ row.validationError }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section v-if="showResults" class="results-card">
          <h6 class="mb-1">Upload results</h6>
          <p class="text-secondary small mb-3">
            {{ createdUsers.length }} user(s) created, {{ failedUsers.length }} row(s) need attention.
          </p>

          <div v-if="createdUsers.length" class="table-wrap mb-4">
            <table class="table table-sm align-middle mb-0">
              <thead><tr><th>User</th><th>Username</th><th>Client</th><th>Email</th></tr></thead>
              <tbody>
                <tr v-for="user in createdUsers" :key="user.id">
                  <td>{{ user.name }}</td><td>{{ user.username }}</td><td>{{ user.client }}</td><td>{{ user.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="failedUsers.length" class="table-wrap mb-3">
            <table class="table table-sm align-middle mb-0">
              <thead><tr><th>Excel row</th><th>User</th><th>Issue</th></tr></thead>
              <tbody>
                <tr v-for="row in failedUsers" :key="`${row.rowNumber}-${row.name}`">
                  <td>{{ row.rowNumber }}</td><td>{{ row.name || '—' }}</td><td class="text-danger">{{ row.message }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button class="btn-submit" type="button" @click="$router.push('/manage/users')">Done</button>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axiosClient from '../../axiosClient';

const normalizeHeader = (value) => String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
const normalizeCell = (value) => (value === null || value === undefined ? '' : String(value).trim());
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const aliases = {
  client: 'client_code',
  client_name: 'client_code',
  role_name: 'role',
  role_type: 'role',
  department_name: 'department',
  team_name: 'team',
  aadhaar: 'adhar_card',
  aadhaar_number: 'adhar_card',
  phone_number: 'whatsapp_no',
  job_title: 'designation',
  pincode: 'pin_code',
};

const requiredFields = [
  'name', 'username', 'email', 'password', 'client_code', 'role', 'department', 'team',
  'designation', 'adhar_card', 'whatsapp_no', 'address', 'city', 'state', 'country', 'pin_code',
];

export default {
  name: 'UploadUserExcel',
  data() {
    return {
      usersToSelect: [],
      invalidUsers: [],
      createdUsers: [],
      failedUsers: [],
      isParsing: false,
      isUploading: false,
      showResults: false,
    };
  },
  computed: {
    selectedCount() {
      return this.usersToSelect.filter((user) => user.selected).length;
    },
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files?.[0];
      this.resetUploadState();
      if (!file) return;
      if (!/\.(xlsx|xls)$/i.test(file.name)) {
        toast.error('Choose an .xlsx or .xls workbook.');
        event.target.value = '';
        return;
      }

      this.isParsing = true;
      try {
        const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error('The workbook has no sheets.');
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { defval: '', raw: false });

        rows.forEach((sourceRow, index) => {
          const row = {};
          Object.entries(sourceRow).forEach(([header, value]) => {
            const key = normalizeHeader(header);
            row[aliases[key] || key] = normalizeCell(value);
          });
          if (Object.values(row).every((value) => value === '')) return;
          requiredFields.forEach((field) => { row[field] = row[field] || ''; });
          row._excelRow = index + 2;

          if (row.name.length < 3) row.validationError = 'Name must be at least 3 characters.';
          else if (row.username.length < 3 || row.username.length > 50) row.validationError = 'Username must be 3 to 50 characters.';
          else if (!validEmail(row.email)) row.validationError = 'A valid email is required.';
          else if (row.password.length < 5) row.validationError = 'Password must be at least 5 characters.';
          else if (!/^\d{12}$/.test(row.adhar_card)) row.validationError = 'Aadhaar number must contain 12 digits.';
          else if (!/^\d+$/.test(row.whatsapp_no)) row.validationError = 'WhatsApp number must contain digits only.';
          else if (!/^\d+$/.test(row.pin_code)) row.validationError = 'Pin code must contain digits only.';
          else {
            const missing = requiredFields.filter((field) => !row[field]);
            if (missing.length) row.validationError = `Required fields missing: ${missing.join(', ')}.`;
          }

          if (row.validationError) this.invalidUsers.push(row);
          else this.usersToSelect.push({ ...row, selected: true });
        });

        if (!this.usersToSelect.length && !this.invalidUsers.length) {
          toast.info('No user rows were found in the first sheet.');
        }
      } catch (error) {
        toast.error(error.message || 'Unable to read the workbook.');
      } finally {
        this.isParsing = false;
      }
    },

    resetUploadState() {
      this.usersToSelect = [];
      this.invalidUsers = [];
      this.createdUsers = [];
      this.failedUsers = [];
      this.showResults = false;
    },

    toggleAllRows() {
      const shouldSelect = this.selectedCount !== this.usersToSelect.length;
      this.usersToSelect.forEach((user) => { user.selected = shouldSelect; });
    },

    async uploadFile() {
      if (this.isUploading) return;
      const selectedRows = this.usersToSelect.filter((user) => user.selected);
      if (!selectedRows.length) {
        toast.info('Select at least one valid user row.');
        return;
      }

      this.isUploading = true;
      try {
        const userData = selectedRows.map((row) => {
          const payload = {};
          requiredFields.forEach((field) => { payload[field] = row[field]; });
          payload._excelRow = row._excelRow;
          return payload;
        });
        const response = await axiosClient.post('/api/v1/user/upload', { userData });
        this.createdUsers = response.data.created || [];
        this.failedUsers = response.data.failed || [];
        this.showResults = true;
        if (this.createdUsers.length) toast.success(`${this.createdUsers.length} user(s) created.`);
        if (this.failedUsers.length) toast.warning(`${this.failedUsers.length} row(s) could not be created.`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Bulk upload failed.');
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>
