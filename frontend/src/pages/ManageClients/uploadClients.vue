<style scoped>
.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }
.content-container { max-width: 1120px; margin: 0 auto; padding: 1.5rem; }
.upload-card, .results-card {
  background: #fff; border: 1px solid var(--border-color); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); padding: 1.25rem; margin-top: 1rem;
}
.notice { border-radius: var(--radius-md); padding: 1rem 1.1rem; }
.table-wrap { overflow-x: auto; }
.table { min-width: 640px; }
.status-pill { display: inline-block; border-radius: 999px; padding: 0.2rem 0.65rem; font-size: 0.75rem; }
.status-ready { background: #dcfce7; color: #166534; }
.status-pending { background: #fef3c7; color: #92400e; }
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
      <button type="button" class="btn btn-light btn-sm" @click="$router.push('/manage/clients')">
        <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Clients
      </button>
      <h5>Bulk Upload Clients</h5>
      <a class="download-link" href="/templates/client_upload_format.xlsx" download>
        <i class="bi bi-download me-1" aria-hidden="true"></i>Download Excel format
      </a>
    </div>

    <div class="h-100 overflow-y-auto">
      <main class="content-container">
        <section class="upload-card">
          <label class="form-label fw-semibold" for="clientWorkbook">Choose a client workbook</label>
          <input
            id="clientWorkbook"
            ref="fileInput"
            type="file"
            class="form-control"
            accept=".csv,.xlsx,.xls"
            :disabled="isParsing || isUploading"
            @change="handleFileUpload"
          />
          <div v-if="isParsing" class="mt-3 small text-secondary" role="status">
            <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Reading workbook…
          </div>
        </section>

        <section v-if="clientsToSelect.length && !showResults" class="upload-card">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h6 class="mb-1">Ready to import</h6>
              <div class="small text-secondary">
                {{ selectedCount }} of {{ clientsToSelect.length }} valid client row(s) selected
              </div>
            </div>
            <button class="btn btn-outline-secondary btn-sm" type="button" @click="toggleAllRows">
              {{ selectedCount === clientsToSelect.length ? 'Deselect all' : 'Select all' }}
            </button>
          </div>

          <div class="table-wrap">
            <table class="table table-sm table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col"><span class="visually-hidden">Select</span></th>
                  <th scope="col">Excel row</th>
                  <th scope="col">Client name</th>
                  <th scope="col">Username prefix</th>
                  <th scope="col">Company email</th>
                  <th scope="col">Password</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="client in clientsToSelect" :key="client._excelRow">
                  <td><input v-model="client.selected" type="checkbox" :aria-label="`Select ${client.name}`" /></td>
                  <td>{{ client._excelRow }}</td>
                  <td>{{ client.name }}</td>
                  <td>{{ client.username_prefix || 'CL' }}</td>
                  <td>{{ client.email || '—' }}</td>
                  <td>••••••</td>
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
            {{ isUploading ? 'Creating clients…' : `Create ${selectedCount} client(s)` }}
          </button>
        </section>

        <section v-if="invalidClients.length && !showResults" class="upload-card">
          <h6 class="mb-3">Rows to fix</h6>
          <div class="table-wrap">
            <table class="table table-sm align-middle mb-0">
              <thead><tr><th>Excel row</th><th>Client name</th><th>Issue</th></tr></thead>
              <tbody>
                <tr v-for="row in invalidClients" :key="row._excelRow">
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
            {{ createdClients.length }} client(s) created, {{ failedClients.length }} row(s) need attention.
          </p>

          <div v-if="createdClients.length" class="table-wrap mb-4">
            <table class="table table-sm align-middle mb-0">
              <thead><tr><th>Client</th><th>Client code</th><th>Username</th></tr></thead>
              <tbody>
                <tr v-for="client in createdClients" :key="client.id">
                  <td>{{ client.name }}</td><td>{{ client.client_code }}</td><td>{{ client.username }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="failedClients.length" class="table-wrap mb-3">
            <table class="table table-sm align-middle mb-0">
              <thead><tr><th>Excel row</th><th>Client</th><th>Issue</th></tr></thead>
              <tbody>
                <tr v-for="row in failedClients" :key="`${row.rowNumber}-${row.name}`">
                  <td>{{ row.rowNumber }}</td><td>{{ row.name || '—' }}</td><td class="text-danger">{{ row.message }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button class="btn-submit" type="button" @click="$router.push('/manage/clients')">Done</button>
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

const CLIENT_UPLOAD_FIELDS = [
  'name', 'username_prefix', 'password', 'email', 'whatsapp_no', 'address', 'city', 'state',
  'country', 'pin_code', 'pan_card', 'adhar_card', 'gst_no', 'cin_no', 'industry_type',
  'employee_count_range', 'incorporation_type', 'pf_enable', 'esic_enable', 'contact_name',
  'contact_email', 'contact_number', 'contact_designation',
];

const normalizeHeader = (value) =>
  String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');

const normalizeCell = (value) => (value === null || value === undefined ? '' : String(value).trim());

export default {
  name: 'UploadClientExcel',
  data() {
    return {
      clientsToSelect: [],
      invalidClients: [],
      createdClients: [],
      failedClients: [],
      isParsing: false,
      isUploading: false,
      showResults: false,
    };
  },
  computed: {
    selectedCount() {
      return this.clientsToSelect.filter((client) => client.selected).length;
    },
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files?.[0];
      this.resetUploadState();
      if (!file) return;
      const isCsv = /\.csv$/i.test(file.name);
      if (!isCsv && !/\.(xlsx|xls)$/i.test(file.name)) {
        toast.error('Choose a .csv, .xlsx, or .xls file.');
        event.target.value = '';
        return;
      }

      this.isParsing = true;
      try {
        const fileData = isCsv
          ? await file.text()
          : await file.arrayBuffer();
        const workbook = XLSX.read(fileData, { type: isCsv ? 'string' : 'array' });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error('The workbook has no sheets.');
        const sheet = workbook.Sheets[firstSheetName];
        const parsedRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

        parsedRows.forEach((sourceRow, index) => {
          const row = Object.fromEntries(
            Object.entries(sourceRow).map(([key, value]) => [normalizeHeader(key), normalizeCell(value)])
          );
          if (Object.values(row).every((value) => value === '')) return;
          row._excelRow = index + 2;
          row.username_prefix = row.username_prefix || 'CL';
          if (!row.name) row.validationError = 'Name is required.';
          else if (!row.password) row.validationError = 'Password is required.';
          else if (row.password.length < 5) row.validationError = 'Password must be at least 5 characters.';
          else if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            row.validationError = 'Company email is not valid.';
          }

          if (row.validationError) this.invalidClients.push(row);
          else this.clientsToSelect.push({ ...row, selected: true });
        });

        if (!this.clientsToSelect.length && !this.invalidClients.length) {
          toast.info('No client rows were found in the first sheet.');
        }
      } catch (error) {
        toast.error(error.message || 'Unable to read the workbook.');
      } finally {
        this.isParsing = false;
      }
    },

    resetUploadState() {
      this.clientsToSelect = [];
      this.invalidClients = [];
      this.createdClients = [];
      this.failedClients = [];
      this.showResults = false;
    },

    toggleAllRows() {
      const shouldSelect = this.selectedCount !== this.clientsToSelect.length;
      this.clientsToSelect.forEach((client) => { client.selected = shouldSelect; });
    },

    async uploadFile() {
      if (this.isUploading) return;
      const selectedRows = this.clientsToSelect.filter((client) => client.selected);
      if (!selectedRows.length) {
        toast.info('Select at least one valid client row.');
        return;
      }

      const clientData = selectedRows.map((row) => {
        const payload = {};
        CLIENT_UPLOAD_FIELDS.forEach((field) => {
          if (row[field] !== undefined && row[field] !== '') payload[field] = row[field];
        });
        payload._excelRow = row._excelRow;
        return payload;
      });

      this.isUploading = true;
      try {
        const response = await axiosClient.post('/api/v1/client/upload', { clientData });
        this.createdClients = response.data.created || [];
        this.failedClients = response.data.failed || [];
        this.showResults = true;
        if (this.createdClients.length) {
          toast.success(`${this.createdClients.length} client(s) created.`);
        }
        if (this.failedClients.length) {
          toast.warning(`${this.failedClients.length} row(s) could not be created.`);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Bulk upload failed.');
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>
