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
  padding: 0.85rem 1.5rem; border-bottom: 1px solid var(--border-color); background: #fff;
}
.page-header-bar h5 { font-weight: 600; color: var(--text-primary); margin: 0; font-size: 1.05rem; }
.notification-badge { position: relative; cursor: pointer; padding: 0.25rem; }

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
  border-radius: var(--radius-md); border: none;
  background: var(--primary, #1e3a5f); color: #fff; cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--primary-light, #2563eb); color: #fff; }

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

.table-icon { cursor: pointer; font-size: 1rem; padding: 0.25rem; border-radius: 4px; transition: all 0.15s; }
.table-icon:hover { background: #f1f5f9; }

.format-icon {
  width: 38px;
  height: 38px;
  padding: 0;
  justify-content: center;
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
  background: #fff;
  border-radius: 12px;
  max-width: 960px;
  width: 90%;
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
          <div class="w-100 h-100 d-flex justify-content-center gap-3">
            <el-tooltip content="Download Format" placement="bottom">
              <a
                href="https://technirmitisoftwares.com/employeeAttendanceFormat.xlsx"
                class="btn-action format-icon"
                aria-label="Download format"
              >
                <i class="bi bi-download"></i>
              </a>
            </el-tooltip>
            <div>
              <input
                type="file"
                class="form-control"
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Upload"
                @change="handleFileUpload"
              />
            </div>
            <div class="">
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
            <div>
              <VueDatePicker v-model="month_year" month-picker />
              <!-- <input type="date" class="form-control form-control-sm" v-model="form.month_year" /> -->
            </div>

            <div>
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
        month: new Date().getMonth() - 1,
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
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async retrieveLeaveDefaults() {
      const parseDefaultBalance = (raw) => {
        if (raw == null) return 0;
        if (Array.isArray(raw)) return parseInt(raw[0], 10) || 0;
        if (typeof raw === 'object' && raw.balance != null) return parseInt(raw.balance, 10) || 0;
        return parseInt(raw, 10) || 0;
      };

      try {
        const res = await axiosClient.get("/api/v1/settings/get", {
          params: { client_id: this.user._id },
        });

        const record = Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
        this.leaveDefaults = {
          cl: parseDefaultBalance(record?.leaves?.cl),
          sl: parseDefaultBalance(record?.leaves?.sl),
          pl: parseDefaultBalance(record?.leaves?.pl),
        };
      } catch (err) {
        console.error("Error retrieving default leave balances:", err);
        this.leaveDefaults = { cl: 0, sl: 0, pl: 0 };
      }
    },
    reasonMenuAltPosition(inputEl) {
      // Clamp the teleported menu into the viewport so it can't render off-screen.
      if (!inputEl) return { top: 0, left: 0, transform: '' };

      const rect = inputEl.getBoundingClientRect();
      const margin = 8;
      const gap = 8;

      const viewportW = window.innerWidth || document.documentElement.clientWidth || 0;
      const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;

      // Rough menu size estimate; CSS max-* keeps the real menu within these bounds.
      const menuW = Math.min(340, Math.max(260, viewportW - margin * 2));
      const menuH = Math.min(340, Math.max(260, viewportH - margin * 2));

      const belowTop = rect.bottom + gap;
      const aboveTop = rect.top - gap - menuH;

      const fitsBelow = belowTop + menuH <= viewportH - margin;
      const fitsAbove = aboveTop >= margin;

      let top;
      if (fitsBelow) top = belowTop;
      else if (fitsAbove) top = aboveTop;
      else top = Math.max(margin, Math.min(viewportH - menuH - margin, belowTop));

      const centeredLeft = rect.left + rect.width / 2 - menuW / 2;
      const left = Math.max(margin, Math.min(viewportW - menuW - margin, centeredLeft));

      return { top, left, transform: '' };
    },
    requiresLastWorkingDay(code) {
      return [2, 3, 4, 5, 6, 10].includes(Number(code));
    },
    reasonNote(code) {
      const found = this.reasonOptions.find((r) => Number(r.code) === Number(code));
      return found ? found.note : '';
    },
    presentValue(row) {
      return Number(
        row.present ??
          row.Present ??
          row['present'] ??
          row['Present'] ??
          row['PRESENT'] ??
          0
      );
    },
    async uploadFile() {
      if (!this.file) {
        console.log("No file selected");
        toast.info("Select File", { autoClose: 1500 });
        return;
      }

      if (!Array.isArray(this.leavesBalanceData) || this.leavesBalanceData.length === 0) {
        await this.retrieveLeavesBalance();
      }

      // Prepare additional form details (month_year, month, year)
      console.log("this.month_year: ", this.month_year);
      const temp = parseInt(this.month_year.month);
      if (temp >= 9) {
        this.form.month_year = this.month_year.year + "-" + (temp + 1) + "-01";
      } else {
        this.form.month_year = this.month_year.year + "-0" + (temp + 1) + "-01";
      }
      console.log("this.month_year1: ", this.month_year);
      this.form.month = months[temp].name;
      this.form.year = this.month_year.year;
      console.log("Form data:", this.form);

      const reader = new FileReader();
      reader.onload = async (event) => {
        // Read and parse Excel data
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Excel Data:", jsonData);

        // Map Excel data to extract leave records using employee code as key
        const leaveRecords = jsonData.map((row) => ({
          emp_code:
            row["emp_code"] ||
            row["Emp Code"] ||
            row["Employee Code"] ||
            "",
          noofCL: Number(row["numberOfCL"] || row["NumberOfCL"] || row["NoOfCL"] || 0),
          noofSL: Number(row["numberOfSL"] || row["NumberOfSL"] || row["NoOfSL"] || 0),
          noofPL: Number(row["numberOfPL"] || row["NumberOfPL"] || row["NoOfPL"] || 0),

          absentDaysCL: row["absentDaysCL"] || "",
          absentDaysSL: row["absentDaysSL"] || "",
          absentDaysPL: row["absentDaysPL"] || ""
        }));
        console.log("Leave Records from Excel:", leaveRecords);

        const employeeCodes = new Set(
          (this.leavesBalanceData || []).map((e) => String(e.emp_no || "").trim()).filter(Boolean)
        );
        const sheetCodes = leaveRecords.map((r) => String(r.emp_code || "").trim()).filter(Boolean);
        const missingCodes = Array.from(new Set(sheetCodes.filter((c) => !employeeCodes.has(c))));
        if (missingCodes.length > 0) {
          const preview = missingCodes.slice(0, 6).join(", ");
          toast.error(
            `Emp codes not found in system: ${preview}${missingCodes.length > 6 ? " ..." : ""}`,
            { autoClose: 4000 }
          );
        }

        // Save the raw Excel data and assign employeeData
        this.excelData = jsonData;
        this.form.employeeData = jsonData;

        // If any employee has present = 0, collect reason before proceeding
        const zeroRows = jsonData.filter((row) => this.presentValue(row) === 0);
        if (zeroRows.length > 0) {
          this.pendingUpload = { jsonData, leaveRecords };
          this.zeroPresentRows = zeroRows.map((row) => ({
            emp_code:
              row["emp_code"] ||
              row["Emp Code"] ||
              row["Employee Code"] ||
              "",
            name: row["name"] || row["Name"] || "",
            email: row["email"] || row["Email"] || "",
            reasonCode: "",
            lastWorkingDay: "",
          }));
          this.reasonModalVisible = true;
          return;
        }

        await this.processAndUpload(jsonData, leaveRecords);
      };

      // Begin reading the file as an ArrayBuffer (triggers the onload callback)
      reader.readAsArrayBuffer(this.file);
    },

    async processAndUpload(jsonData, leaveRecords) {
      try {
        // First, upload the attendance sheet data if available
        if (this.form.employeeData.length > 0) {
          console.log("Uploading attendance data...");
          try {
            const res = await axiosClient.post(
              `/api/v1/attendance/add/${this.user._id}`,
              this.form
            );
            //toast.success("Attendance Data Added", { autoClose: 1500 });
            console.log("Attendance res.data: ", res.data);
          } catch (err) {
            console.log("Error uploading attendance data: ", err);
            toast.error("Something Went Wrong with Attendance Upload", { autoClose: 1500 });
          }
        }

        console.log("this.leavesBalanceData", this.leavesBalanceData);
        const selectedYear = Number(this.month_year?.year);
        const selectedMonth = Number(this.month_year?.month) + 1; // month picker is 0-indexed
        const monthStr = String(selectedMonth).padStart(2, "0");
        const monthPrefix = `${selectedYear}-${monthStr}-`;
        const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();

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

        const buildFallbackDates = (neededCount, alreadyIncluded = []) => {
          const set = new Set(alreadyIncluded);
          const fallback = [];
          for (let d = 1; d <= daysInSelectedMonth && fallback.length < neededCount; d++) {
            const iso = `${selectedYear}-${monthStr}-${String(d).padStart(2, "0")}`;
            if (!set.has(iso)) {
              fallback.push(iso);
              set.add(iso);
            }
          }
          return fallback;
        };

        const buildNextLeaveState = (type, parsedDates, countFromSheet, existingLeaves) => {
          const countInt = safeInt(countFromSheet);
          const existingBalance = safeInt(existingLeaves?.balance);
          const existingDates = Array.isArray(existingLeaves?.absentDates)
            ? existingLeaves.absentDates
            : [];

          const { inMonth: oldInMonth, other: oldOther } = splitMonthDates(existingDates);

          const hasInput = parsedDates.length > 0 || countInt > 0;

          let monthDates = parsedDates;
          let usedFallback = false;

          if (parsedDates.length === 0 && countInt > 0) {
            // No parsable dates but a count exists; synthesize deterministic dates so balance + UI stay in sync.
            monthDates = buildFallbackDates(countInt, []);
            usedFallback = true;
          }

          if (!hasInput) {
            // No data for this leave type in the sheet: keep existing month dates/balance unchanged.
            const inferredStart = existingBalance + existingDates.length;
            const base = Math.max(inferredStart, safeInt(this.leaveDefaults?.[type]));
            return {
              balance: String(base - existingDates.length),
              absentDates: dedupe(existingDates),
              usedFallback,
              missingBecauseEmpty: false,
            };
          }

          const combinedInMonth = monthDates;
          const combinedAllDates = dedupe([...oldOther, ...combinedInMonth]);

          // Infer the starting balance from current state (balance + total recorded dates), but never below defaults.
          const inferredStart = existingBalance + dedupe([...oldOther, ...oldInMonth]).length;
          const base = Math.max(inferredStart, safeInt(this.leaveDefaults?.[type]));
          const nextBalance = base - combinedAllDates.length;

          return {
            balance: String(nextBalance),
            absentDates: combinedAllDates,
            usedFallback,
            missingBecauseEmpty: parsedDates.length === 0 && countInt > 0,
          };
        };

        const missingDatesWarnings = [];

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

            if (clNext.missingBecauseEmpty) missingDatesWarnings.push(`${empCode} (CL)`);
            if (slNext.missingBecauseEmpty) missingDatesWarnings.push(`${empCode} (SL)`);
            if (plNext.missingBecauseEmpty) missingDatesWarnings.push(`${empCode} (PL)`);

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
        if (missingDatesWarnings.length > 0) {
          const preview = missingDatesWarnings.slice(0, 6).join(", ");
          toast.info(
            `Some leave rows had counts but no parsable absent days; we auto-filled day numbers so balance and dates stay aligned: ${preview}${missingDatesWarnings.length > 6 ? " ..." : ""}`,
            { autoClose: 5000 }
          );
        }
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

      // Handle an actual Date value coming from Excel.
      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const yyyy = value.getFullYear();
        const mm = value.getMonth() + 1;
        const dd = value.getDate();
        if (yyyy === year && mm === month && dd >= 1 && dd <= daysInMonth) {
          return [`${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`];
        }
        return [];
      }

      const valueStr = String(value).trim();
      if (!valueStr) return [];

      const tokens = valueStr
        .replace(/[;|]+/g, ",")
        .split(/[\s,]+/)
        .map((t) => t.trim())
        .filter(Boolean);

      const dayNumbers = [];
      for (const token of tokens) {
        // Support common list patterns:
        // - "4,6" -> ["4","6"] (already split)
        // - "4.6" (Excel numeric in some locales) -> [4, 6]
        // - "4-6" -> range [4,5,6]
        // - "YYYY-MM-DD" / "DD/MM/YYYY"
        const pushDay = (n) => {
          if (!Number.isFinite(n)) return;
          if (n < 1 || n > daysInMonth) return;
          dayNumbers.push(n);
        };

        if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(token)) {
          const parts = token.split("-");
          const dd = parseInt(parts[2], 10);
          pushDay(dd);
          continue;
        }

        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(token)) {
          const parts = token.split("/");
          const dd = parseInt(parts[0], 10);
          pushDay(dd);
          continue;
        }

        if (/^\d{1,2}-\d{1,2}$/.test(token)) {
          const [a, b] = token.split("-").map((p) => parseInt(p, 10));
          if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
          const start = Math.min(a, b);
          const end = Math.max(a, b);
          for (let d = start; d <= end; d++) pushDay(d);
          continue;
        }

        if (/^\d{1,2}(\.\d{1,2})+$/.test(token)) {
          // "4.6" or "4.06" etc -> treat each segment as a day number.
          token.split(".").forEach((seg) => pushDay(parseInt(seg, 10)));
          continue;
        }

        if (/^\d{1,2}$/.test(token)) {
          pushDay(parseInt(token, 10));
        }
      }

      const uniqueSorted = Array.from(new Set(dayNumbers)).sort((a, b) => a - b);
      const monthStr = String(month).padStart(2, "0");
      return uniqueSorted.map((d) => `${year}-${monthStr}-${String(d).padStart(2, "0")}`);
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
