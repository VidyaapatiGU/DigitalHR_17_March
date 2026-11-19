Warning: truncated output (original token count: 12125)
Total output lines: 1293

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
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--bg-surface);
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }
.notification-badge { position: relative; cursor: pointer; padding: 0.25rem; }

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
  border-radius: var(--radius-md); border: none;
  background: var(--theme-button-bg); color: #fff; cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--theme-button-hover); color: #fff; }

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

.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: var(--bg-body); }

.format-icon {
  min-height: 38px;
  padding: 0.45rem 0.9rem;
  justify-content: center;
  white-space: nowrap;
}

.upload-toolbar {
  width: 100%;
  max-width: 1080px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.upload-field-file {
  flex: 1 1 280px;
  min-width: 240px;
}

.upload-field-days {
  flex: 0 1 230px;
  min-width: 190px;
}

.upload-field-month {
  flex: 0 1 220px;
  min-width: 190px;
}

.upload-field-submit {
  flex: 0 0 auto;
}

.upload-field-submit .btn-submit {
  width: 100%;
}

:deep(.upload-month-picker .dp__main) {
  width: 100%;
}

:deep(.upload-month-picker .dp__input) {
  width: 100%;
}

.overlay-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  background: var(--bg-surface);
  border-radius: 12px;
  max-width: min(960px, calc(100vw - 1rem));
  width: 100%;
  max-height: calc(100vh - 1rem);
  overflow: auto;
  padding: 1.25rem;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.2);
}

:deep(.dp--menu-wrapper) {
  position: fixed !important;
  z-index: 20000 !important;
}

:deep(.reason-date-menu) {
  z-index: 20000 !important;
  max-width: calc(100vw - 16px);
  max-height: min(340px, calc(100vh - 16px));
  overflow: auto;
}

.table-sm td, .table-sm th { padding: 0.35rem 0.5rem; }

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }

  .page-header-bar {
    padding: 0.75rem 1rem;
  }

  .page-wrapper .p-4 {
    padding: 1rem !important;
  }

  .upload-toolbar {
    justify-content: stretch;
    align-items: stretch;
  }

  .upload-field-file,
  .upload-field-days,
  .upload-field-month,
  .upload-field-submit {
    flex: 1 1 100%;
    min-width: 0;
  }

  .upload-field-submit .btn-submit {
    justify-content: center;
  }

  .format-icon {
    width: 100%;
    height: 40px;
  }

  .modal-card {
    border-radius: 10px;
    padding: 0.9rem;
  }

  .modal-card .table {
    min-width: 720px;
  }

  .modal-card .d-flex.justify-content-end {
    flex-direction: column;
  }

  .modal-card .d-flex.justify-content-end .btn {
    width: 100%;
  }
}
</style>

<template>
  <div class="page-wrapper source-400 scroll">
    <div class="page-header-bar">
      <div>
        <h5>Upload Excel</h5>
      </div>
      <div class=""></div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div class="p-4 h-100">
          <div class="upload-toolbar">
            <el-tooltip content="Download Format" placement="bottom">
              <button
                v-if="role === 'client'"
                type="button"
                @click="downloadAttendanceFormat"
                class="btn-action format-icon"
                aria-label="Download format"
              >
                <i class="bi bi-download"></i>
                <span>Input Format</span>
              </button>
              <a
                v-else
                href="/reports/employeeAttendanceFormat.xlsx"
                download
                class="btn-action format-icon"
                aria-label="Download format"
              >
                <i class="bi bi-download"></i>
                <span>Input Format</span>
              </a>
            </el-tooltip>
            <div class="upload-field-file">
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
            <div class="upload-field-days">
              <input
                v-model="form.totalWorkingDays"
                type="text"
                class="form-control border"
                id="state"
                placeholder="No. Of Total Working Days"
              />
            </div>
            <!-- <div class="">
              <input
                v-model="form.remark"
                type="text"
                class="form-control border"
                id="state"
                placeholder="Add Remark"
              />
            </div> -->
            <div class="upload-field-month">
              <VueDatePicker
                v-model="month_year"
                month-picker
                :auto-apply="true"
                class="upload-month-picker"
                :teleport="true"
                :alt-position="monthMenuAltPosition"
              />
              <!-- <input type="date" class="form-control form-control-sm" v-model="form.month_year" /> -->
            </div>

            <div class="upload-field-submit">
              <button type="button" class="btn-submit" @click="uploadFile">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reason capture modal -->
    <div v-if="reasonModalVisible" class="overlay-modal">
      <div class="modal-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">Provide reasons for 0 present days</h6>
          <button class="btn btn-sm btn-outline-secondary" @click="cancelReasonModal">Close</button>
        </div>
        <p class="text-muted mb-3" style="font-size: 0.9rem">
          For each employee with <strong>present = 0</strong>, select a reason code. If the note requires a
          last working day, please enter it as <code>dd/mm/yyyy</code>.
        </p>
        <div class="table-responsive">
          <table class="table table-sm align-middle">
            <thead class="table-light">
              <tr>
                <th>Emp Code</th>
                <th>Name</th>
                <th>Reason Code</th>
                <th>Last Working Day (dd/mm/yyyy)</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in zeroPresentRows" :key="idx">
                <td>{{ row.emp_code }}</td>
                <td>{{ row.name }}</td>
                <td style="min-width: 200px">
                  <select v-model="row.reasonCode" class="form-select form-select-sm">
                    <option disabled value="">Select reason</option>
                    <option v-for="opt in reasonOptions" :key="opt.code" :value="opt.code">
                      {{ opt.code }} - {{ opt.label }}
                    </option>
                  </select>
                </td>
                <td style="min-width: 180px">
                  <VueDatePicker
                    v-model="row.lastWorkingDay"
                    :enable-time-picker="false"
                    :format="'dd/MM/yyyy'"
                    model-type="dd/MM/yyyy"
                    placeholder="dd/mm/yyyy"
                    input-class-name="form-control form-control-sm"
                    :disabled="!requiresLastWorkingDay(row.reasonCode)"
                    :teleport="true"
                    :alt-position="reasonMenuAltPosition"
                    menu-class-name="reason-date-menu"
                  />
                </td>
                <td style="font-size: 0.82rem">{{ reasonNote(row.reasonCode) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-end gap-2 mt-2">
          <button class="btn btn-outline-secondary btn-sm" @click="cancelReasonModal">Cancel</button>
          <button class="btn btn-primary btn-sm" @click="confirmReasonModal">Confirm & Upload</button>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axiosClient from '../../axiosClient';
import { months } from '../../months';

export default {
  name: 'UploadXl',
  components: {
    EasyDataTable,
    VueDatePicker,
  },

  data() {
    return {
      id: '',
      user: {},
      role: '',
      items: [],
      originalItems: [],
      notifications: [],
      leavesBalanceData: [],
      leaveDefaults: { cl: 0, sl: 0, pl: 0 },

      month_year: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
      excelData: [],
      form: {
        employeeData: [],
        client_user_id: '',
        month: '',

        month_year: '',
        totalWorkingDays: '',
        month: '',
        year: '',
        remark: '',
      },
      file: null,
      reasonModalVisible: false,
      zeroPresentRows: [],
      pendingUpload: null,
      reasonOptions: [
        { code: 0, label: 'Without Reason', note: 'Leave last working day as blank' },
        { code: 1, label: 'On Leave', note: 'Leave last working day as blank' },
        { code: 2, label: 'Left Service', note: 'Provide last working day (dd/mm/yyyy). IP will not appear from next wage period' },
        { code: 3, label: 'Retired', note: 'Provide last working day (dd/mm/yyyy). IP will not appear from next wage period' },
        { code: 4, label: 'Out of Coverage', note: 'Provide last working day (dd/mm/yyyy). Valid for Apr/Oct; otherwise IP continues' },
        { code: 5, label: 'Expired', note: 'Provide last working day (dd/mm/yyyy). IP will not appear from next wage period' },
        { code: 6, label: 'Non Implemented area', note: 'Provide last working day (dd/mm/yyyy).' },
        { code: 7, label: 'Compliance by Immediate Employer', note: 'Leave last working day as blank' },
        { code: 8, label: 'Suspension of work', note: 'Leave last working day as blank' },
        { code: 9, label: 'Strike/Lockout', note: 'Leave last working day as blank' },
        { code: 10, label: 'Retrenchment', note: 'Provide last working day (dd/mm/yyyy). IP will not appear from next wage period' },
        { code: 11, label: 'No Work', note: 'Leave last working day as blank' },
        { code: 12, label: 'Doesnt Belong To This Employer', note: 'Leave last working day as blank' },
        { code: 13, label: 'Duplicate IP', note: 'Leave last working day as blank' },
      ],
    };
  },

  async created() {
    await this.getCurrent();

    await this.retrieveLeaveDefaults();

    try {
      const res = await axiosClient.get(
        `/api/v1/employee/client/${this.user._id}`
      );
      console.log('res.data.data: ', res.data.data);
      this.originalItems = res.data.data;
      this.leavesBalanceData = res.data.data;
      const notifications = await axiosClient.get(`/api/v1/notification/getall/${this.user._id}`);
      this.notifications = notifications.data.data;
      console.log(' this.notifications: ', this.notifications);
    } catch (err) {
      console.log('error: ', err);
    }

    this.items = this.originalItems;
    console.log('Employees: ', this.items);
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
    async downloadAttendanceFormat() {
      const employees = Array.isArray(this.originalItems) ? this.originalItems : [];
      if (employees.length === 0) {
        toast.info('No active employees are available for this client.', { autoClose: 2500 });
        return;
      }

      const selectedYear = Number(this.month_year?.year);
      const selectedMonthIndex = Number(this.month_year?.month);
      if (
        !Number.isInteger(selectedYear) ||
        !Number.isInteger(selectedMonthIndex) ||
        selectedMonthIndex < 0 ||
        selectedMonthIndex > 11
      ) {
        toast.info('Select an attendance month first.', { autoClose: 2000 });
        return;
      }

      const selectedMonthDate = new Date(selectedYear, selectedMonthIndex, 1);
      const selectedMonth = new Intl.DateTimeFormat('en', { month: 'long' }).format(selectedMonthDate);
      const monthYear = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}-01`;
      let savedAttendanceByCode = new Map();
      let savedAttendance = [];
      let scheduledDays = [];
      let totalWorkingDays = 0;
      try {
        const attendanceResponse = await axiosClient.get(
          `/api/v1/attendance/get/${encodeURIComponen…4125 tokens truncated…);
    },

    async processAndUpload(jsonData, leaveRecords) {
      try {
      // First, upload the attendance sheet data if available
      if (this.form.employeeData.length > 0) {
        const pickValue = (row, keys) => {
          for (const key of keys) {
            if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
              return row[key];
            }
          }
          return undefined;
        };
        const formatDateField = (row, keys) => this.parseAbsentDays(pickValue(row, keys)).join(',');
        const getCount = (row, keys, dates) => {
          const rawCount = pickValue(row, keys);
          return rawCount === undefined || rawCount === ""
            ? dates.split(',').filter(Boolean).length
            : Number(rawCount || 0);
        };
        this.form.employeeData = jsonData.map((row) => {
          const absentDaysLOP = formatDateField(row, [
            "LOP Dates (DD/MM/YYYY)", "absentDatesLOP", "Absent Dates LOP", "absentDaysLOP", "AbsentDaysLOP",
          ]);
          const absentDaysCL = formatDateField(row, [
            "CL Dates (DD/MM/YYYY)", "absentDatesCL", "Absent Dates CL", "absentDaysCL", "AbsentDaysCL",
          ]);
          const absentDaysSL = formatDateField(row, [
            "SL Dates (DD/MM/YYYY)", "absentDatesSL", "Absent Dates SL", "absentDaysSL", "AbsentDaysSL",
          ]);
          const absentDaysPL = formatDateField(row, [
            "PL Dates (DD/MM/YYYY)", "absentDatesPL", "Absent Dates PL", "absentDaysPL", "AbsentDaysPL",
          ]);
          return {
            ...row,
            emp_code: pickValue(row, ["emp_code", "Emp Code", "Employee Code"]),
            name: pickValue(row, ["name", "Name"]),
            email: pickValue(row, ["email", "Email"]),
            present: this.presentValue(row),
            numberOfLOP: getCount(row, ["numberOfLOP", "NumberOfLOP", "NoOfLOP"], absentDaysLOP),
            absentDaysLOP,
            numberOfCL: getCount(row, ["numberOfCL", "NumberOfCL", "NoOfCL"], absentDaysCL),
            absentDaysCL,
            numberOfSL: getCount(row, ["numberOfSL", "NumberOfSL", "NoOfSL"], absentDaysSL),
            absentDaysSL,
            numberOfPL: getCount(row, ["numberOfPL", "NumberOfPL", "NoOfPL"], absentDaysPL),
            absentDaysPL,
          };
        });

        try {
          const res = await axiosClient.post(
            `/api/v1/attendance/add/${this.user._id}`,
            this.form
          );
          if (Array.isArray(res.data.errors) && res.data.errors.length > 0) {
            toast.error(
              `Attendance saved for ${res.data.data?.length || 0} row(s); ${res.data.errors.length} row(s) failed.`,
              { autoClose: 4000 }
            );
            return;
          }
          toast.success(`Attendance uploaded for ${this.form.employeeData.length} employees.`, {
            autoClose: 2000,
          });
        } catch (err) {
          console.error("Attendance upload failed:", err);
          toast.error(
            err.response?.data?.message || "Attendance upload failed. Check the file and try again.",
            { autoClose: 3000 }
          );
          return;
        }
      }

        console.log("this.leavesBalanceData", this.leavesBalanceData);
        const selectedYear = Number(this.month_year?.year);
        const selectedMonth = Number(this.month_year?.month) + 1; // month picker is 0-indexed
        const monthStr = String(selectedMonth).padStart(2, "0");
        const monthPrefix = `${selectedYear}-${monthStr}-`;
        const safeInt = (value) => {
          const parsed = parseInt(value, 10);
          return Number.isFinite(parsed) ? parsed : 0;
        };

        const dedupe = (arr) => Array.from(new Set((arr || []).filter((v) => typeof v === "string" && v.trim() !== "")));

        const splitMonthDates = (dates) => {
          const all = Array.isArray(dates) ? dates : [];
          const inMonth = all.filter((d) => typeof d === "string" && d.startsWith(monthPrefix));
          const other = all.filter((d) => typeof d === "string" && !d.startsWith(monthPrefix));
          return { inMonth, other };
        };

        const buildNextLeaveState = (type, parsedDates, countFromSheet, existingLeaves) => {
          const countInt = safeInt(countFromSheet);
          const existingBalance = safeInt(existingLeaves?.balance);
          const existingDates = Array.isArray(existingLeaves?.absentDates)
            ? existingLeaves.absentDates
            : [];

          const { inMonth: oldInMonth, other: oldOther } = splitMonthDates(existingDates);

          const hasInput = parsedDates.length > 0 || countInt > 0;

          if (!hasInput) {
            // No data for this leave type in the sheet: keep existing month dates/balance unchanged.
            const inferredStart = existingBalance + existingDates.length;
            const base = Math.max(inferredStart, safeInt(this.leaveDefaults?.[type]));
            return {
              balance: String(base - existingDates.length),
              absentDates: dedupe(existingDates),
            };
          }

          const combinedInMonth = parsedDates;
          const combinedAllDates = dedupe([...oldOther, ...combinedInMonth]);

          // Infer the starting balance from current state (balance + total recorded dates), but never below defaults.
          const inferredStart = existingBalance + dedupe([...oldOther, ...oldInMonth]).length;
          const base = Math.max(inferredStart, safeInt(this.leaveDefaults?.[type]));
          const nextBalance = base - combinedAllDates.length;

          return {
            balance: String(nextBalance),
            absentDates: combinedAllDates,
          };
        };

        // For each employee in your stored leavesBalanceData, find the matching record from the Excel data
        const updatedLeaveData = this.leavesBalanceData.map((employee) => {
          const empCode = employee.emp_no;
          // Convert both to strings to ensure a proper match
          const record = leaveRecords.find((r) => String(r.emp_code) === String(empCode));
          if (record) {
            const newCLDates = this.parseAbsentDays(record.absentDaysCL);
            const newSLDates = this.parseAbsentDays(record.absentDaysSL);
            const newPLDates = this.parseAbsentDays(record.absentDaysPL);

            const clNext = buildNextLeaveState("cl", newCLDates, record.noofCL, employee?.leaves?.cl);
            const slNext = buildNextLeaveState("sl", newSLDates, record.noofSL, employee?.leaves?.sl);
            const plNext = buildNextLeaveState("pl", newPLDates, record.noofPL, employee?.leaves?.pl);

            return {
              emp_code: empCode,
              name: employee.name,
              updatedLeaves: {
                cl: {
                  balance: clNext.balance,
                  absentDates: clNext.absentDates,
                },
                sl: {
                  balance: slNext.balance,
                  absentDates: slNext.absentDates,
                },
                pl: {
                  balance: plNext.balance,
                  absentDates: plNext.absentDates,
                },
              },
            };
          } else {
            // If no matching record, leave the employee's leave data unchanged
            const cl = employee?.leaves?.cl || {};
            const sl = employee?.leaves?.sl || {};
            const pl = employee?.leaves?.pl || {};
            return {
              emp_code: empCode,
              name: employee.name,
              updatedLeaves: {
                cl: { balance: cl.balance || "0", absentDates: Array.isArray(cl.absentDates) ? cl.absentDates : [] },
                sl: { balance: sl.balance || "0", absentDates: Array.isArray(sl.absentDates) ? sl.absentDates : [] },
                pl: { balance: pl.balance || "0", absentDates: Array.isArray(pl.absentDates) ? pl.absentDates : [] },
              },
            };
          }
        });

        console.log("Updated Leave Data:", updatedLeaveData);

        // Submit the updated leave data to your backend
        await this.submitLeaveDays(updatedLeaveData);

        const date = Date();
        console.log("date: ", Date());

        // Redirect after both operations complete
        setTimeout(() => {
          this.$router.push("/manage/attendance");
        }, 2000);
      } catch (err) {
        console.log("Error in processAndUpload: ", err);
        toast.error("Upload failed", { autoClose: 1500 });
      }
    },

    async confirmReasonModal() {
      // Validate selections
      for (const row of this.zeroPresentRows) {
        if (row.reasonCode === "" || row.reasonCode === null) {
          toast.error("Select reason code for all zero-present employees", { autoClose: 1500 });
          return;
        }
        if (this.requiresLastWorkingDay(row.reasonCode) && !row.lastWorkingDay) {
          toast.error("Provide last working day where required", { autoClose: 1500 });
          return;
        }
      }

      // Inject reason data back into the pending upload rows
      if (this.pendingUpload) {
        const { jsonData, leaveRecords } = this.pendingUpload;
        this.zeroPresentRows.forEach((zr) => {
          const match = jsonData.find(
            (r) =>
              String(r["emp_code"] || r["Emp Code"] || r["Employee Code"] || "") ===
              String(zr.emp_code)
          );
          if (match) {
            match.reasonCode = zr.reasonCode;
            match.lastWorkingDay = zr.lastWorkingDay;
          }
        });
        this.reasonModalVisible = false;
        await this.processAndUpload(jsonData, leaveRecords);
      } else {
        this.reasonModalVisible = false;
      }
    },

    cancelReasonModal() {
      this.reasonModalVisible = false;
      this.pendingUpload = null;
      this.zeroPresentRows = [];
    },

    handleEmployeeUpdate(id) {
      this.$router.push(`/update/employee/${id}`);
    },

    handleViewEmployee(id) {
      this.$router.push(`/view/employee/${id}`);
    },

    async retrieveLeavesBalance() {
        try {
          const res = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
          console.log('Leaves Balance Data: ', res.data);
          this.leavesBalanceData = res.data.data;

        } catch (err) {
          console.log('Error retrieving leaves balance:', err);
          toast.error('Error retrieving leaves balance');
        }
    },

    async submitLeaveDays(updatedLeaveData) {
      try {
        const notFoundCodes = [];
        for (const emp of updatedLeaveData) {
          const employee = this.leavesBalanceData.find(
            (e) => String(e.emp_no) === String(emp.emp_code)
          );
          if (employee) {
            const payload = {
              leaves: {
                cl: emp.updatedLeaves.cl,
                sl: emp.updatedLeaves.sl,
                pl: emp.updatedLeaves.pl,
              },
            };
            console.log(`Updating leaves for employee ${emp.emp_code}:`, payload);
            const res = await axiosClient.put(
              `/api/v1/employee/updateempwithcode/${emp.emp_code}`,
              payload
            );
            console.log("Update response for employee", emp.emp_code, ":", res.data);
            if (res?.data?.message === "Employee Not Found") {
              notFoundCodes.push(emp.emp_code);
            }
          } else {
            console.warn("Employee not found for emp_code:", emp.emp_code);
            notFoundCodes.push(emp.emp_code);
          }
        }
        if (notFoundCodes.length > 0) {
          const preview = notFoundCodes.slice(0, 6).join(", ");
          toast.error(
            `Leaves not updated for emp codes: ${preview}${notFoundCodes.length > 6 ? " ..." : ""}`,
            { autoClose: 4000 }
          );
        } else {
          toast.success("Leave Days Updated Successfully!", { autoClose: 1000 });
        }
      } catch (err) {
        console.error("Error submitting leave days:", err);
        toast.error("Internal Error!", { autoClose: 1000 });
      }
    },
    
    parseAbsentDays(value) {
      const year = Number(this.month_year?.year);
      const monthIndex = Number(this.month_year?.month);
      if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) return [];

      const month = monthIndex + 1; // month picker is 0-indexed
      const daysInMonth = new Date(year, month, 0).getDate();
      if (value == null) return [];
      const isoDates = new Set();
      const addDate = (dateYear, dateMonth, dateDay) => {
        if (dateYear < 100) dateYear += 2000;
        if (dateYear !== year || dateMonth !== month || dateDay < 1 || dateDay > daysInMonth) return;
        const date = new Date(dateYear, dateMonth - 1, dateDay);
        if (
          date.getFullYear() !== dateYear ||
          date.getMonth() + 1 !== dateMonth ||
          date.getDate() !== dateDay
        ) return;
        isoDates.add(`${dateYear}-${String(dateMonth).padStart(2, "0")}-${String(dateDay).padStart(2, "0")}`);
      };
      const addDay = (day) => addDate(year, month, Number(day));
      const addExcelSerial = (serial) => {
        const date = new Date(Date.UTC(1899, 11, 30) + Number(serial) * 86400000);
        if (!Number.isNaN(date.getTime())) {
          addDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
        }
      };
      const handleToken = (token) => {
        if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(token)) {
          const [dateYear, dateMonth, dateDay] = token.split("-").map(Number);
          addDate(dateYear, dateMonth, dateDay);
          return;
        }
        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(token)) {
          const [dateDay, dateMonth, dateYear] = token.split("/").map(Number);
          addDate(dateYear, dateMonth, dateDay);
          return;
        }
        if (/^\d{1,2}-\d{1,2}$/.test(token)) {
          const [start, end] = token.split("-").map(Number);
          for (let day = Math.min(start, end); day <= Math.max(start, end); day += 1) addDay(day);
          return;
        }
        if (/^\d{1,2}(\.\d{1,2})+$/.test(token)) {
          token.split(".").forEach(addDay);
          return;
        }
        if (/^\d+(\.\d+)?$/.test(token)) {
          const numericValue = Number(token);
          if (numericValue > 31) addExcelSerial(numericValue);
          else addDay(numericValue);
        }
      };

      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        addDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
      } else if (typeof value === "number") {
        if (value > 31) addExcelSerial(value);
        else addDay(value);
      } else if (Array.isArray(value)) {
        value.forEach((entry) => this.parseAbsentDays(entry).forEach((date) => isoDates.add(date)));
      } else {
        String(value)
          .trim()
          .replace(/[;|]+/g, ",")
          .split(/[\s,]+/)
          .map((token) => token.trim())
          .filter(Boolean)
          .forEach(handleToken);
      }
      return Array.from(isoDates).sort();
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);

        this.user = token.data.user;
        if (token.data.user.industry_type) {
          this.role = 'client';
        } else if (token.data.user.designation) {
          this.role = 'employee';
        } else {
          this.role = this.user.roleType.name;
        }
        //this.role = this.user.roleType.name;
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
