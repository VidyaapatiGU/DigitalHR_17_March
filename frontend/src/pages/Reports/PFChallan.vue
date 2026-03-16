<template>
  <div class="page-wrapper" style="max-height: 90vh; overflow-y: auto;">
    <div class="page-header-bar">
      <h5>PF Challan Generator</h5>
      <button class="btn-action" @click="$router.push('/reports')">
        <i class="bi bi-arrow-left me-1"></i> Back to Reports
      </button>
    </div>
    <div class="content-section">

    <!-- Step 1: Select Month/Year and Load Data -->
    <div class="reports-section mb-4" v-if="!challanLoaded">
      <h5 class="reports-section-title mb-3">📋 Step 1: Select Period & Generate Challan</h5>
      <div class="row align-items-end">
        <div class="col-md-4">
          <label class="form-label fw-semibold">Period</label>
          <select class="form-select form-select-sm" v-model="selectedPeriod">
            <option v-if="periodsLoading" :value="null" disabled>Loading periods...</option>
            <option v-else-if="!availablePeriods.length" :value="null" disabled>No attendance periods</option>
            <option v-for="opt in availablePeriods" :key="opt.label" :value="opt">{{ opt.label }}</option>
          </select>
        </div>
        <div class="col-md-3 mt-2">
          <button class="btn btn-primary btn-sm w-100" @click="generateChallan" :disabled="loading || periodsLoading || !selectedPeriod">
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
            ✏️ Step 2: Review & Edit — {{ selectedPeriodLabel }}
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
      availablePeriods: [],
      periodsLoading: false,
      selectedPeriod: null,
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
    selectedPeriodLabel() {
      if (!this.selectedPeriod) return '';
      return `${this.selectedPeriod.monthName} ${this.selectedPeriod.year}`;
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
        ].join('#~#');
      }).join('\n');
    },
  },
  async created() {
    await this.getCurrent();
    await this.loadAvailablePeriods();
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

    async loadAvailablePeriods() {
      this.periodsLoading = true;
      try {
        let res;
        try {
          res = await axiosClient.get(`/api/v1/attendance/get/all/${this.user._id}`);
        } catch (err) {
          console.warn('Primary attendance endpoint failed, trying client attendance endpoint', err);
        }

        if (!res || (!res.data && !res.data?.length && !res.data?.data)) {
          try {
            res = await axiosClient.get(`/api/v1/attendance/client/${this.user._id}`);
          } catch (err) {
            console.warn('Fallback attendance endpoint also failed', err);
          }
        }

        let records = [];
        if (!res) {
          records = [];
        } else if (Array.isArray(res.data)) {
          records = res.data;
        } else if (Array.isArray(res.data?.data)) {
          records = res.data.data;
        } else {
          records = res.data?.data || res.data || [];
        }

        const monthNames = this.monthNames;
        const map = {};

        records.forEach((a) => {
          let m = null;
          let y = null;

          if (a.year && a.month) {
            y = Number(a.year);
            if (typeof a.month === 'number' || String(a.month).match(/^\d+$/)) {
              m = Number(a.month);
            } else if (typeof a.month === 'string') {
              const idx = monthNames.findIndex((n) => n.toLowerCase() === a.month.toLowerCase());
              if (idx !== -1) m = idx + 1;
            }
          } else if (a.month_year) {
            const d = new Date(a.month_year);
            if (!isNaN(d)) {
              m = d.getMonth() + 1;
              y = d.getFullYear();
            } else {
              const mmYYYY = /^(\d{2})-(\d{4})$/;
              const yyyyMM = /^(\d{4})-(\d{2})$/;
              if (mmYYYY.test(a.month_year)) {
                const [, mm, yy] = a.month_year.match(mmYYYY);
                m = Number(mm);
                y = Number(yy);
              } else if (yyyyMM.test(a.month_year)) {
                const [, yy, mm] = a.month_year.match(yyyyMM);
                m = Number(mm);
                y = Number(yy);
              }
            }
          }

          if (m && y) {
            const label = `${monthNames[m - 1]} ${y}`;
            if (!map[label]) {
              map[label] = {
                label,
                month: m,
                year: y,
                monthName: monthNames[m - 1],
                padded: String(m).padStart(2, '0'),
              };
            }
          }
        });

        const opts = Object.values(map).sort((a, b) => b.year - a.year || b.month - a.month);
        this.availablePeriods = opts;

        if (!this.selectedPeriod && opts.length) {
          this.selectedPeriod = opts[0];
          this.selectedMonth = opts[0].month;
          this.selectedYear = opts[0].year;
        }
      } catch (err) {
        console.error('Failed to load attendance periods:', err);
        this.availablePeriods = [];
      } finally {
        this.periodsLoading = false;
      }
    },

    async generateChallan() {
      this.loading = true;
      this.errorMsg = '';
      try {
        if (!this.selectedPeriod) {
          this.errorMsg = 'Select an available period before generating.';
          this.loading = false;
          return;
        }

        // Fetch employees for this client
        const empRes = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
        const employees = empRes.data.data || [];

        // Fetch attendance for the selected month/year
        const month = this.selectedPeriod.month;
        const year = this.selectedPeriod.year;
        const monthName = this.selectedPeriod.monthName;
        const paddedMonth = this.selectedPeriod.padded;

        this.selectedMonth = month;
        this.selectedYear = year;

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

        if (!attendanceRecords.length) {
          this.errorMsg = `No attendance data found for ${monthName} ${year}.`;
          this.loading = false;
          return;
        }

        const normalize = (v) => (v == null ? '' : String(v).trim());

        // Build attendance map: emp_no -> { present, totalWorkingDays, name, gross }
        const attMap = new Map();
        let periodTotalDays = 0;
        attendanceRecords.forEach((rec) => {
          const empNo = normalize(rec.emp_no);
          if (!empNo) return;
          const present = Number(rec.present) || 0;
          const totalWorkingDays = Number(rec.totalWorkingDays) || 0;
          const name = normalize(rec.name);
          const gross = Number(rec.gross) || 0;

          periodTotalDays = Math.max(periodTotalDays, totalWorkingDays || 0);

          if (!attMap.has(empNo)) {
            attMap.set(empNo, {
              present,
              totalWorkingDays,
              name,
              gross,
            });
          } else {
            const existing = attMap.get(empNo);
            existing.present += present;
            existing.totalWorkingDays = Math.max(existing.totalWorkingDays, totalWorkingDays);
            if (!existing.name && name) existing.name = name;
            if (!existing.gross && gross) existing.gross = gross;
          }
        });

        // PF wage ceiling
        const PF_CEILING = 15000;

        const employeesByEmpNo = new Map(
          employees.map((emp) => [normalize(emp.emp_no), emp]).filter(([key]) => key)
        );

        // Build challan rows using attendance as the source of truth for the selected period
        this.challanRows = Array.from(attMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([empNo, att]) => {
            const emp = employeesByEmpNo.get(empNo) || {};

            const uan = emp.uan_no || '';
            const name = (emp.name || att.name || '').toUpperCase();

            const totalDays = att.totalWorkingDays || periodTotalDays || 30;
            const presentDays = att.present || 0;
            const ncpDays = Math.max(0, totalDays - presentDays);

            const grossBase = Number(att.gross || emp.gross) || 0;
            let actualGross = grossBase;
            if (ncpDays > 0 && totalDays > 0) {
              actualGross = Math.round((grossBase * presentDays) / totalDays);
            }

            let pfBasic = Number(emp.pf_basic) || 0;
            if (pfBasic > 0 && ncpDays > 0 && totalDays > 0) {
              pfBasic = Math.round((pfBasic * presentDays) / totalDays);
            }

            // EPF wages — capped at 15000
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
              empNo,
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
      const paddedMonth = this.selectedPeriod?.padded || String(this.selectedMonth).padStart(2, '0');
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
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.page-wrapper { height: 100%; }
.page-header-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }

.content-section {
  padding: 1.5rem;
}

.section-card {
  background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color); padding: 1.5rem; margin-bottom: 1.25rem;
}

.section-card h5, .section-card h4 {
  font-weight: 600; color: var(--text-primary); margin-bottom: 1rem;
}

.btn-submit {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.6rem 2rem; font-size: 0.9rem; font-weight: 500;
  border-radius: var(--radius-md); border: none;
  background: var(--primary); color: #fff; cursor: pointer;
  transition: var(--transition-fast);
}
.btn-submit:hover { background: var(--primary-light); transform: translateY(-1px); }

.btn-action {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.45rem 0.9rem; font-size: 0.82rem; font-weight: 500;
  border-radius: var(--radius-md); border: 1px solid var(--border-color);
  background: #fff; color: var(--text-primary); cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }

.form-group label {
  font-size: 0.82rem; font-weight: 500; color: var(--text-secondary);
  margin-bottom: 0.25rem; display: block;
}

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

.slip-container {
  width: 100%; max-width: 1000px; margin: auto;
  background: #fff; border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); overflow: hidden;
}

@media (max-width: 768px) {
  .content-section { padding: 1rem; }
  .section-card { padding: 1rem; }
}

@media print {
  .page-header-bar { display: none; }
}
</style>
