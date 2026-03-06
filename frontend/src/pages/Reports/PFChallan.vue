<template>
  <div class="pf-challan-bg container-fluid mt-4" style="max-height: 90vh; overflow-y: auto; padding-right: 15px;">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="reports-title mb-0">PF Challan Generator</h1>
      <button class="btn btn-outline-secondary btn-sm" @click="$router.push('/reports')">
        <i class="bi bi-arrow-left me-1"></i> Back to Reports
      </button>
    </div>

    <!-- Step 1: Select Month/Year and Load Data -->
    <div class="reports-section mb-4" v-if="!challanLoaded">
      <h5 class="reports-section-title mb-3">📋 Step 1: Select Period & Generate Challan</h5>
      <div class="row align-items-end">
        <div class="col-md-3">
          <label class="form-label fw-semibold">Month</label>
          <select class="form-select form-select-sm" v-model="selectedMonth">
            <option v-for="(m, i) in monthNames" :key="i" :value="i + 1">{{ m }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label fw-semibold">Year</label>
          <select class="form-select form-select-sm" v-model="selectedYear">
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="col-md-3 mt-2">
          <button class="btn btn-primary btn-sm w-100" @click="generateChallan" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-gear me-1"></i>
            Generate PF Challan
          </button>
        </div>
      </div>
      <div v-if="errorMsg" class="alert alert-danger mt-3 py-2">{{ errorMsg }}</div>
    </div>

    <!-- Step 2: Editable Table -->
    <div v-if="challanLoaded">
      <div class="reports-section mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="reports-section-title mb-0">
            ✏️ Step 2: Review & Edit — {{ monthNames[selectedMonth - 1] }} {{ selectedYear }}
          </h5>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-warning btn-sm" @click="resetChallan">
              <i class="bi bi-arrow-counterclockwise me-1"></i> Reset
            </button>
            <button class="btn btn-outline-info btn-sm" @click="addEmptyRow">
              <i class="bi bi-plus-circle me-1"></i> Add Row
            </button>
          </div>
        </div>

        <div class="table-responsive" style="max-height: 55vh; overflow-y: auto;">
          <table class="table table-bordered table-hover table-sm align-middle">
            <thead class="table-dark sticky-top">
              <tr>
                <th style="min-width: 40px;">#</th>
                <th style="min-width: 140px;">UAN</th>
                <th style="min-width: 200px;">Name</th>
                <th style="min-width: 100px;">Gross Wages</th>
                <th style="min-width: 100px;">EPF Wages</th>
                <th style="min-width: 100px;">EPS Wages</th>
                <th style="min-width: 100px;">EDLI Wages</th>
                <th style="min-width: 80px;">EPF Contri (12%)</th>
                <th style="min-width: 80px;">EPS Contri (8.33%)</th>
                <th style="min-width: 80px;">EPF-EPS Diff</th>
                <th style="min-width: 80px;">NCP Days</th>
                <th style="min-width: 80px;">Refund</th>
                <th style="min-width: 50px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in challanRows" :key="idx">
                <td class="text-center text-muted">{{ idx + 1 }}</td>
                <td><input type="text" class="form-control form-control-sm" v-model="row.uan" @input="onEdit(idx)" /></td>
                <td><input type="text" class="form-control form-control-sm" v-model="row.name" @input="onEdit(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.gross" @input="recalcRow(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.epfWages" @input="recalcContributions(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.epsWages" @input="recalcContributions(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.edliWages" @input="onEdit(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.epfContri" @input="onEdit(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.epsContri" @input="onEdit(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.epfEpsDiff" @input="onEdit(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.ncpDays" @input="onEdit(idx)" /></td>
                <td><input type="number" class="form-control form-control-sm" v-model.number="row.refund" @input="onEdit(idx)" /></td>
                <td class="text-center">
                  <button class="btn btn-outline-danger btn-sm py-0 px-1" @click="removeRow(idx)" title="Delete row">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="table-secondary fw-bold">
              <tr>
                <td colspan="3" class="text-end">TOTALS:</td>
                <td>{{ totals.gross }}</td>
                <td>{{ totals.epfWages }}</td>
                <td>{{ totals.epsWages }}</td>
                <td>{{ totals.edliWages }}</td>
                <td>{{ totals.epfContri }}</td>
                <td>{{ totals.epsContri }}</td>
                <td>{{ totals.epfEpsDiff }}</td>
                <td>{{ totals.ncpDays }}</td>
                <td>{{ totals.refund }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Step 3: Preview & Download -->
      <div class="reports-section mb-4">
        <h5 class="reports-section-title mb-3">📥 Step 3: Download Hash Format</h5>
        <div class="d-flex gap-2 mb-3">
          <button class="btn btn-success btn-sm" @click="downloadHashFile">
            <i class="bi bi-download me-1"></i> Download .txt (Hash Format)
          </button>
          <button class="btn btn-outline-primary btn-sm" @click="showPreview = !showPreview">
            <i class="bi bi-eye me-1"></i> {{ showPreview ? 'Hide' : 'Show' }} Preview
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="copyToClipboard">
            <i class="bi bi-clipboard me-1"></i> Copy to Clipboard
          </button>
        </div>

        <div v-if="showPreview" class="bg-dark text-light p-3 rounded" style="max-height: 40vh; overflow-y: auto; font-family: monospace; font-size: 0.85rem; white-space: pre-wrap;">{{ hashPreview }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import axiosClient from '../../axiosClient';

export default {
  name: 'PFChallan',
  data() {
    return {
      user: {},
      loading: false,
      challanLoaded: false,
      showPreview: false,
      errorMsg: '',
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ],
      challanRows: [],
    };
  },
  computed: {
    yearOptions() {
      const curr = new Date().getFullYear();
      return Array.from({ length: 6 }, (_, i) => curr - i);
    },
    totals() {
      const sum = (key) => this.challanRows.reduce((s, r) => s + (Number(r[key]) || 0), 0);
      return {
        gross: sum('gross'),
        epfWages: sum('epfWages'),
        epsWages: sum('epsWages'),
        edliWages: sum('edliWages'),
        epfContri: sum('epfContri'),
        epsContri: sum('epsContri'),
        epfEpsDiff: sum('epfEpsDiff'),
        ncpDays: sum('ncpDays'),
        refund: sum('refund'),
      };
    },
    hashPreview() {
      return this.challanRows.map((r) => {
        return [
          r.uan || '',
          r.name || '',
          r.gross || 0,
          r.epfWages || 0,
          r.epsWages || 0,
          r.edliWages || 0,
          r.epfContri || 0,
          r.epsContri || 0,
          r.epfEpsDiff || 0,
          r.ncpDays || 0,
          r.refund || 0,
        ].join('##');
      }).join('\n');
    },
  },
  async created() {
    await this.getCurrent();
  },
  methods: {
    async getCurrent() {
      try {
        const token = await axiosClient.get('api/v1/user/getCurrent/');
        this.user = token.data.user;
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    },

    async generateChallan() {
      this.loading = true;
      this.errorMsg = '';
      try {
        // Fetch employees for this client
        const empRes = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
        const employees = empRes.data.data || [];
        if (!employees.length) {
          this.errorMsg = 'No employees found for this client.';
          this.loading = false;
          return;
        }

        // Fetch attendance for the selected month/year
        const month = this.selectedMonth;
        const year = this.selectedYear;
        const monthName = this.monthNames[month - 1];
        const paddedMonth = String(month).padStart(2, '0');

        let attendanceRecords = [];
        try {
          let attRes = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}?year=${year}&month=${month}`);
          attendanceRecords = attRes.data.data || [];
          if (!attendanceRecords.length) {
            attRes = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}?year=${year}&month=${paddedMonth}`);
            attendanceRecords = attRes.data.data || [];
          }
          if (!attendanceRecords.length) {
            attRes = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}?year=${year}&month=${monthName}`);
            attendanceRecords = attRes.data.data || [];
          }
        } catch (err) {
          console.warn('Attendance fetch error:', err);
        }

        // Build attendance map: emp_no -> { present, totalWorkingDays }
        const attMap = {};
        attendanceRecords.forEach((rec) => {
          const empNo = rec.emp_no || '';
          if (!empNo) return;
          attMap[empNo] = {
            present: Number(rec.present) || 0,
            totalWorkingDays: Number(rec.totalWorkingDays) || 0,
          };
        });

        // PF wage ceiling
        const PF_CEILING = 15000;

        // Build challan rows
        this.challanRows = employees
          .filter((emp) => emp.active !== false)
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
          .map((emp) => {
            const uan = emp.uan_no || '';
            const name = (emp.name || '').toUpperCase();
            const gross = Number(emp.gross) || 0;
            const empNo = emp.emp_no || '';

            // Get attendance data
            const att = attMap[empNo] || { present: 0, totalWorkingDays: 0 };
            const totalDays = att.totalWorkingDays || 30;
            const presentDays = att.present || totalDays;
            const ncpDays = Math.max(0, totalDays - presentDays);

            // Calculate proportional wages if NCP days exist
            let actualGross = gross;
            if (ncpDays > 0 && totalDays > 0) {
              actualGross = Math.round((gross * presentDays) / totalDays);
            }

            // EPF wages — capped at 15000
            const pfBasic = Number(emp.pf_basic) || 0;
            const epfWagesBase = pfBasic > 0 ? pfBasic : Math.min(actualGross, PF_CEILING);
            const epfWages = Math.min(epfWagesBase, PF_CEILING);
            const epsWages = epfWages;
            const edliWages = epfWages;

            // Contributions
            const epfContri = Math.round(epfWages * 0.12);       // 12% employee EPF
            const epsContri = Math.round(epsWages * 0.0833);      // 8.33% EPS from employer
            const epfEpsDiff = epfContri - epsContri;             // Employer EPF share (3.67%)
            const refund = 0;

            return {
              uan,
              name,
              gross: actualGross,
              epfWages,
              epsWages,
              edliWages,
              epfContri,
              epsContri,
              epfEpsDiff,
              ncpDays,
              refund,
            };
          });

        this.challanLoaded = true;
        toast.success(`PF Challan generated for ${monthName} ${year} — ${this.challanRows.length} employees`, { autoClose: 2000 });
      } catch (err) {
        console.error('Generate PF Challan error:', err);
        this.errorMsg = 'Failed to generate PF Challan. Please check console for details.';
        toast.error('Failed to generate PF Challan!', { autoClose: 2000 });
      } finally {
        this.loading = false;
      }
    },

    recalcRow(idx) {
      const row = this.challanRows[idx];
      const PF_CEILING = 15000;
      row.epfWages = Math.min(row.gross, PF_CEILING);
      row.epsWages = row.epfWages;
      row.edliWages = row.epfWages;
      this.recalcContributions(idx);
    },

    recalcContributions(idx) {
      const row = this.challanRows[idx];
      row.epfContri = Math.round(row.epfWages * 0.12);
      row.epsContri = Math.round(row.epsWages * 0.0833);
      row.epfEpsDiff = row.epfContri - row.epsContri;
    },

    onEdit() {
      // placeholder for any tracking/dirty state if needed
    },

    addEmptyRow() {
      this.challanRows.push({
        uan: '',
        name: '',
        gross: 0,
        epfWages: 0,
        epsWages: 0,
        edliWages: 0,
        epfContri: 0,
        epsContri: 0,
        epfEpsDiff: 0,
        ncpDays: 0,
        refund: 0,
      });
    },

    removeRow(idx) {
      this.challanRows.splice(idx, 1);
    },

    resetChallan() {
      this.challanLoaded = false;
      this.challanRows = [];
      this.showPreview = false;
      this.errorMsg = '';
    },

    downloadHashFile() {
      if (!this.challanRows.length) {
        toast.error('No data to download!', { autoClose: 1500 });
        return;
      }
      const content = this.hashPreview;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      const paddedMonth = String(this.selectedMonth).padStart(2, '0');
      link.href = URL.createObjectURL(blob);
      link.download = `PF_CHALLAN_${paddedMonth}_${this.selectedYear}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PF Challan downloaded in hash format!', { autoClose: 1500 });
    },

    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.hashPreview);
        toast.success('Copied to clipboard!', { autoClose: 1000 });
      } catch (err) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = this.hashPreview;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast.success('Copied to clipboard!', { autoClose: 1000 });
      }
    },
  },
};
</script>

<style scoped>
.pf-challan-bg {
  background: linear-gradient(135deg, #f4f6fa 0%, #e9ecef 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(79, 140, 255, 0.08);
  padding: 2rem 2.5rem;
}
.reports-title {
  font-size: 2rem;
  font-weight: 700;
  color: #22223b;
  letter-spacing: 1px;
}
.reports-section {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(79, 140, 255, 0.06);
  padding: 1.5rem;
}
.reports-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0c1526;
}
.table input.form-control-sm {
  padding: 0.2rem 0.4rem;
  font-size: 0.82rem;
}
.table th {
  font-size: 0.78rem;
  white-space: nowrap;
}
.table td {
  font-size: 0.82rem;
}
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
