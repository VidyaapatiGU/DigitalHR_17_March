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

.wage-filter-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.wage-filter-field {
  flex: 0 1 315px;
  min-width: 240px;
}

.wage-filter-field :deep(.dp__main),
.wage-filter-field :deep(.dp__input) {
  width: 100%;
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

@media (max-width: 576px) {
  .wage-filter-bar { align-items: stretch; }
  .wage-filter-field,
  .wage-filter-bar > div:last-child {
    flex: 1 1 100%;
    min-width: 0;
  }
  .wage-filter-bar > div:last-child .btn-submit {
    width: 100%;
    justify-content: center;
  }
  .joining-period-note {
    width: 100%;
    text-align: center;
  }
}

@media print {
  .page-header-bar { display: none; }
}
</style>

<template>
  <!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
  <div class="page-wrapper hind-regular h-100 scroll">
    <div class="page-header-bar">
      <h5>Wage Slip</h5>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div v-auto-animate class="content-section">
          <div class="wage-filter-bar">
            <div class="wage-filter-field">
              <VueDatePicker
                v-model="from"
                month-picker
                auto-apply
                :min-date="employeeJoiningMonthDate"
                teleport="body"
                @update-month-year="handlePickerYearChange('from', $event)"
                placeholder="Select From"
              />
            </div>
            <div class="wage-filter-field">
              <VueDatePicker
                v-model="to"
                month-picker
                auto-apply
                :min-date="employeeJoiningMonthDate"
                teleport="body"
                @update-month-year="handlePickerYearChange('to', $event)"
                placeholder="Select To"
              />
            </div>

            <small v-if="joiningMonthLabel" class="joining-period-note text-muted align-self-center">
              Available from {{ joiningMonthLabel }}
            </small>

            <div>
              <button
                type="button"
                class="btn-submit"
                @click="handleGenerateSlip"
              >
                Generate
              </button>
            </div>
          </div>

          <div v-for="(attendance, i) in attendanceData" :key="i">
            <div class="my-3">
              <div
                v-if="showSlip"
                class="d-flex justify-content-center gap-2 py-2"
                :id="'slip' + i"
              >
                <div class="slip-container overflow-hidden">
                  <div class="py-1 border-bottom border-dark text-center source-700 font18">
                    Wage Slip
                  </div>
                  <div class="py-1 border-bottom border-dark text-center source-700 font18">
                    Form IX (Rule 29 (2))
                  </div>
                  <div class="py-1 border-bottom border-dark text-center source-700 font18">
                    Name of the Establishment - {{ client.name }}
                  </div>
                  <div
                    class="py-1 border-bottom border-dark text-center source-700 font18"
                    style="font-size: 15px; font-weight: 400"
                  >
                    {{
                      (client.city ? client.city + ', ' : '') +
                      (client.address ? client.address + ', ' : '') +
                      (client.state ? client.state + ', ' : '') +
                      (client.country ? client.country + ', ' : '') +
                      (client.pin_code ? client.pin_code : '')
                    }}
                  </div>
                  <div class="border-bottom border-dark"></div>
                  <div class="border-bottom border-dark" style="padding: 0 11px">
                    <div class="row">
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Name of Employee
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ employee.name }}
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        UAN No
                      </div>
                      <div class="col-3 d-flex align-items-center source-500">
                        {{ employee.uan_no ? employee.uan_no : '-' }}
                      </div>
                    </div>
                  </div>
                  <div class="border-bottom border-dark" style="padding: 0 11px">
                    <div class="row">
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Fathers/Husbands Name
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ employee.fatherHusband_name }}
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        PF No
                      </div>
                      <div class="col-3 d-flex align-items-center source-500 font12">
                        {{ employee.pf_no ? employee.pf_no : '-' }}
                      </div>
                    </div>
                  </div>
                  <div class="border-bottom border-dark" style="padding: 0 11px">
                    <div class="row">
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Designation
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ employee.designation ? employee.designation : '-' }}
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        ESIC No
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ employee.esic_no ? employee.esic_no : '-' }}
                      </div>
                    </div>
                  </div>
                  <div class="border-bottom border-dark" style="padding: 0 11px">
                    <div class="row">
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Wage Period
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ attendance.wagePeriod }}
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Bank A/C No
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ employee.bank_ac_no }}
                      </div>
                    </div>
                  </div>
                  <div class="border-bottom border-dark" style="padding: 0 11px">
                    <div class="row">
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Days in Month
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ attendance.totalWorkingDays }}
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-700"
                      >
                        Total Attendance
                      </div>
                      <div
                        class="border-end border-dark col-3 d-flex align-items-center source-500"
                      >
                        {{ attendance.present }}
                      </div>
                    </div>
                  </div>
                  <div class="border-bottom border-dark"></div>
                  <div class="" style="padding: 0 11px">
                    <div class="row">
                      <div class="col-5 border-end border-dark" style="padding: 0 11px">
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            PF Basic
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.pfBasic }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            Basic
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.payableBasic }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            D.A
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.payableDA }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            HRA
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.payableHra }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            Food Allow
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.payableFoodAllow }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            Conveyance
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.payableConveyance }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            Reimbursement
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.reimbursement }}
                          </div>
                        </div>
                        <div class="row border-bottom border-dark">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            Overtime Wages
                          </div>
                          <div class="col-5 d-flex align-items-center source-500">
                            {{ attendance.otEarnings }}
                          </div>
                        </div>
                        <div class="row">
                          <div
                            class="border-end border-dark col-7 d-flex align-items-center source-700"
                          >
                            Gross Wages
                          </div>
                          <div class="col-5 d-flex align-items-center source-700">
                            {{ attendance.grossSalary }}
                          </div>
                        </div>
                      </div>
                      <div class="col-7" style="padding: 0 11px">
                        <div class="row">
                          <div
                            class="border-end border-bottom border-dark col-6"
                            style="padding: 0 11px"
                          >
                            <div class="row">
                              <div class="border-bottom border-dark col-12 source-700 text-center">
                                Employee's Contribution
                              </div>

                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                EPF
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.pf }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                ESIC
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.esi }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                LWF
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.lwf }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                Advances
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.advances }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                Other Ded
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.tdsOther }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                Total Ded
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-700"
                              >
                                {{ attendance.totalDeduction }}
                              </div>
                              <div
                                class="border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                Net Wages
                              </div>
                              <div class="border-dark col-5 d-flex align-items-center source-700">
                                {{ attendance.netWages }}
                              </div>
                            </div>
                          </div>
                          <div class="col-6" style="padding: 0 11px">
                            <div class="row border-bottom border-dark">
                              <div class="border-bottom border-dark col-12 source-700 text-center">
                                Employer's Contribution
                              </div>

                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                E_EPF
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.e_pf }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                E_ESIC
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ attendance.e_esic }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                E_LWF
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-500"
                              >
                                {{ e_lfw }}
                              </div>
                              <div
                                class="border-bottom border-end border-dark col-7 d-flex align-items-center source-700"
                              >
                                Total
                              </div>
                              <div
                                class="border-bottom border-dark col-5 d-flex align-items-center source-700"
                              >
                                {{ attendance.e_pf + attendance.e_esic + e_lfw }}
                              </div>
                              <div class="col-12 source-700 text-center" style="height: 99px">
                                Employer's Signature
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="border-top border-dark text-center source-700">
                    This is a computer generated slip, seal & signature not required.
                  </div>
                </div>
              </div>
              <div class="mt-2 mb-1 px-5 d-flex justify-content-center">
                <button
                  type="button"
                  class="btn-submit"
                  @click="handleDownloadWageSlip(i)"
                >
                  <i class="bi bi-download mx-1"></i>
                  {{ attendance.wagePeriod }}
                </button>
              </div>
            </div>
            <div
              v-if="i != attendanceData.length - 1"
              class="border-top border-secondary border-opacity-25 mb-3"
            ></div>
          </div>
          <div
            v-if="showSlip && attendanceData.length > 1"
            class="mt-4 mb-2 px-5 d-flex justify-content-center"
          >
            <button
              type="button"
              class="btn-submit px-5"
              @click="handleDownloadAllWageSlips"
            >
              Download All
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ////////////////////////////////////////Modal////////////////////////////////////////////// -->
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { getDaysInMonth, months } from '../../months';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axiosClient from '../../axiosClient';
import { calculatePayroll, roundCurrency } from '../../utils/payroll';

export default {
  name: 'WageSlip',
  components: {
    VueDatePicker,
  },

  props: {
    employeeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      id: '',
      client: '',
      user: {},
      showSlip: false,
      months: [],
      month: '',
      year: '',
      attendance: {},
      attendanceData: '',
      employee: '',
      employeeJoiningMonth: null,
      columns: [
        { title: 'Name', field: 'name', sortable: true },
        { title: 'Actions', field: 'actions', sortable: false, slot: 'actions' },
      ],
      from: {
        month: '0',
        year: new Date().getFullYear().toString(),
      },
      to: {
        month: '11',
        year: new Date().getFullYear().toString(),
      },
      form: {
        name: '',
        from: '',
        to: '',
      },
      newPassword: '',
      updateUser: {},
      showDeleteModal: false,
      e_lfw: 30,
      search: '',
      entries: 0,
      entriesPerPage: 5,
      entriesPerPageOptions: [5, 10, 15, 20],
      page: 1,
      items: [],
      originalItems: [],

      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email' },
        { text: 'Department', value: 'department.name' },
        { text: 'Team', value: 'team.name' },
        { text: 'Role', value: 'roleType.name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },

  async created() {
    this.getCurrent();
    this.getMonths();
    console.log('months', months);

    try {
      const employee = await axiosClient.get(`/api/v1/employee/get/${this.employeeId}`);
      this.employee = employee.data.data;
      this.employeeJoiningMonth = this.getMonthPickerValue(this.employee.date_of_joining);
      this.clampDateRangeToJoiningMonth();

      console.log('employee: ', this.employee);

      const client = await axiosClient.get(`/api/v1/client/get/${this.employee.client_user_id}`);
      this.client = client.data.data[0];
      console.log('client: ', this.client);
    } catch (err) {
      console.log('error: ', err);
    }

    //console.log(this.items);
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

  computed: {
    employeeJoiningMonthDate() {
      if (!this.employeeJoiningMonth) return null;

      return new Date(
        Number(this.employeeJoiningMonth.year),
        Number(this.employeeJoiningMonth.month),
        1
      );
    },

    joiningMonthLabel() {
      if (!this.employeeJoiningMonth) return '';

      const month = months[Number(this.employeeJoiningMonth.month)];
      return `${month?.name || ''} ${this.employeeJoiningMonth.year}`.trim();
    },
  },

  methods: {
    getMonthPickerValue(dateValue) {
      const match = String(dateValue || '').match(/^(\d{4})-(\d{2})/);
      if (!match) return null;

      return {
        month: String(Number(match[2]) - 1),
        year: match[1],
      };
    },

    compareMonths(left, right) {
      if (!left || !right) return 0;
      const leftValue = Number(left.year) * 12 + Number(left.month);
      const rightValue = Number(right.year) * 12 + Number(right.month);
      return leftValue - rightValue;
    },

    clampDateRangeToJoiningMonth() {
      if (!this.employeeJoiningMonth) return;

      if (this.compareMonths(this.from, this.employeeJoiningMonth) < 0) {
        this.from = { ...this.employeeJoiningMonth };
      }

      if (this.compareMonths(this.to, this.employeeJoiningMonth) < 0) {
        this.to = { ...this.employeeJoiningMonth };
      }

      if (this.compareMonths(this.from, this.to) > 0) {
        this.to = { ...this.from };
      }
    },

    handlePickerYearChange(field, payload) {
      // The date picker changes its internal year before a month is selected.
      // Reflect that year immediately while preserving the currently selected month.
      if (!payload || payload.fromNav || payload.year === undefined) return;

      const selectedMonth = payload.month === undefined
        ? this[field].month
        : String(payload.month);

      this[field] = {
        month: selectedMonth,
        year: String(payload.year),
      };
      this.clampDateRangeToJoiningMonth();
    },

    hasUsableAttendanceData(row) {
      if (!row || !row.month_year) return false;

      const present = Number(row.present);
      const leaveDays = [
        row.numberOfLOP,
        row.numberOfCL,
        row.numberOfPL,
        row.numberOfSL,
      ].some((value) => Number(value) > 0);
      const otherPayData = [
        row.gross,
        row.otEarnings,
        row.overtime,
        row.reimbursement,
        row.advances,
      ].some((value) => Number(value) > 0);

      // totalWorkingDays alone is not enough: zero-attendance rows otherwise
      // render as completely empty wage slips with every amount equal to zero.
      return (
        present > 0 ||
        leaveDays ||
        otherPayData
      );
    },

    async handleGenerateSlip() {
      console.log('this.from: ', this.from, ' this.to: ', this.to);

      if (
        this.employeeJoiningMonth &&
        (this.compareMonths(this.from, this.employeeJoiningMonth) < 0 ||
          this.compareMonths(this.to, this.employeeJoiningMonth) < 0)
      ) {
        this.clampDateRangeToJoiningMonth();
        toast.info(`Salary slip is available from ${this.joiningMonthLabel}.`, {
          autoClose: 1800,
        });
        return;
      }

      let temp = parseInt(this.to.month);
      const toMonth = temp + 1;
      if (temp >= 9) {
        this.form.to = this.to.year + '-' + toMonth + '-' + getDaysInMonth(this.to.year, toMonth);
      } else {
        this.form.to = this.to.year + '-' + '0' + toMonth + '-' + getDaysInMonth(this.to.year, toMonth);
      }
      console.log('form: ', this.form);
      temp = parseInt(this.from.month);

      if (temp >= 9) {
        this.form.from = this.from.year + '-' + (temp + 1) + '-' + '01';
      } else {
        this.form.from = this.from.year + '-' + '0' + (temp + 1) + '-' + '01';
      }

      console.log('form: ', this.form);

      if (this.validateForm() == false) {
        return;
      }

      try {
        this.showSlip = false;

        const response = await axiosClient.post(
          `/api/v1/attendance/get/from/to/${this.user._id}/${this.employee.email}`,
          this.form
        );

        console.log('response.data: ', response.data);
        const fromDate = this.form.from.slice(5, 7);
        const toDate = this.form.to.slice(5, 7);
        console.log('fromDate: ', fromDate, ' toDate: ', toDate);
        let totalDays = 0;
        let totalPresent = 0;
        for (let i = fromDate - 1; i < toDate; i++) {
          totalDays += getDaysInMonth(this.from.year, i + 1);
        }
        this.attendance.totalDays = totalDays;
        const attendanceRows = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        const joiningMonthKey = this.employeeJoiningMonth
          ? `${this.employeeJoiningMonth.year}-${String(Number(this.employeeJoiningMonth.month) + 1).padStart(2, '0')}`
          : '';

        // Do not render blank or pre-joining months even if old attendance data exists.
        this.attendanceData = attendanceRows.filter((row) => {
          if (!this.hasUsableAttendanceData(row)) return false;
          if (!joiningMonthKey) return true;
          return String(row.month_year).slice(0, 7) >= joiningMonthKey;
        });

        if (this.attendanceData.length === 0) {
          this.showSlip = false;
          toast.info('No attendance data is available for the selected period.', {
            autoClose: 1500,
          });
          return;
        }

        for (let i = 0; i < this.attendanceData.length; i++) {
          this.attendanceData[i].month_year = this.attendanceData[i].month_year.slice(0, 10);

          const attendanceYear = Number(this.attendanceData[i].month_year.slice(0, 4));
          const attendanceMonth = Number(this.attendanceData[i].month_year.slice(5, 7));
          this.attendanceData[i].totalDays = getDaysInMonth(attendanceYear, attendanceMonth);
          const temp = parseInt(this.attendanceData[i].present);

          this.attendanceData[i].wagePeriod =
            months[parseInt(this.attendanceData[i].month_year.slice(5, 7)) - 1].short +
            '-' +
            this.attendanceData[i].month_year.slice(2, 4);
          totalPresent += temp;
        }

        // Calculate each month with the same guarded payroll rules used by the single slip.
        for (let i = 0; i < this.attendanceData.length; i++) {
          const gross = this.attendanceData[i].gross;
          const days = this.attendanceData[i].totalWorkingDays;
          const attendance = this.attendanceData[i].present;

          const payroll = calculatePayroll({
            components: {
              basic: this.employee.basic,
              hra: this.employee.hra,
              da: this.employee.da,
              conveyance: this.employee.conveyance,
              foodAllow: this.employee.food_allow,
            },
            periodDays: days,
            payableDays: attendance,
            esiEligible: true,
            lwfEligible: this.employee.lwf === true,
          });

          this.attendanceData[i].minimum_basic = payroll.minimumBasic;
          this.attendanceData[i].minimum_hra = payroll.minimumHra;
          this.attendanceData[i].minimum_DA = payroll.minimumDA;
          this.attendanceData[i].minimum_conveyance = payroll.minimumConveyance;
          this.attendanceData[i].minimum_FoodAllow = payroll.minimumFoodAllow;
          this.attendanceData[i].minimum_gross = gross;
          this.attendanceData[i].pfBasic = payroll.pfBasic;
          this.attendanceData[i].pf = payroll.pf;
          this.attendanceData[i].e_pf = roundCurrency(payroll.pfBasic * 0.13);
          this.attendanceData[i].e_esic = 0;
          this.attendanceData[i].daysInMonth = days;
          this.attendanceData[i].attendance = payroll.payableDays;
          this.attendanceData[i].payableBasic = payroll.payableBasic;
          this.attendanceData[i].payableDA = payroll.payableDA;
          this.attendanceData[i].payableHra = payroll.payableHra;
          this.attendanceData[i].payableConveyance = payroll.payableConveyance;
          this.attendanceData[i].payableFoodAllow = payroll.payableFoodAllow;
          this.attendanceData[i].payableOtherAllowance = payroll.payableOtherAllowance;
          this.attendanceData[i].otEarnings = payroll.otEarnings;
          this.attendanceData[i].reimbursement = payroll.reimbursement;
          this.attendanceData[i].grossSalary = payroll.grossSalary;
          this.attendanceData[i].esi = payroll.esi;
          this.attendanceData[i].pf = payroll.pf;
          this.attendanceData[i].lwf = payroll.lwf;
          this.attendanceData[i].tdsOther = payroll.tdsOther;
          this.attendanceData[i].totalDeduction = payroll.totalDeduction;
          this.attendanceData[i].netWages = payroll.netWages;
          this.attendanceData[i].advances = payroll.advances;
        }

        // Remove rows that still produce an all-zero wage slip after payroll calculation.
        this.attendanceData = this.attendanceData.filter((row) =>
          Number(row.present) > 0 ||
          Number(row.grossSalary) > 0 ||
          Number(row.totalDeduction) > 0 ||
          Number(row.reimbursement) > 0 ||
          Number(row.otEarnings) > 0
        );

        if (this.attendanceData.length === 0) {
          this.showSlip = false;
          toast.info('No wage slip data is available for the selected period.', {
            autoClose: 1500,
          });
          return;
        }

        console.log('this.attendanceData: ', this.attendanceData);
        this.attendance.totalPresent = totalPresent;

        //creating wage period
        this.attendance.wagePeriod =
          this.months[fromDate - 1].short +
          '-' +
          this.form.from.slice(2, 4) +
          ' to ' +
          this.months[toDate - 1].short +
          '-' +
          this.form.to.slice(2, 4);
        console.log('totalDays: ', totalDays, ' totalPresent: ', totalPresent);
        console.log('response: ', this.attendanceData);
        this.showSlip = true;
      } catch (err) {
        console.log('error: ', err);
        this.attendanceData = [];
        this.showSlip = false;
        const message = err.response?.status === 404
          ? 'No attendance data is available for the selected period.'
          : 'Unable to generate the salary slip.';
        toast.info(message, {
          autoClose: 1500,
        });
      }
    },

    async handleDownloadAllWageSlips() {
      for (let i = 0; i < this.attendanceData.length; i++) {
        const element = document.getElementById('slip' + i);
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better resolution
        });
        const imgData = canvas.toDataURL('image/png');

        // Get element's width and height in pixels
        const elementWidth = canvas.width;
        const elementHeight = canvas.height;

        // A4 paper size dimensions in mm (portrait)
        const a4Width = 210;
        const a4Height = 297;

        // Calculate the aspect ratio of the element
        const aspectRatio = elementWidth / elementHeight;

        // Calculate PDF width and height based on A4 dimensions and the element's aspect ratio
        let pdfWidth = a4Width;
        let pdfHeight = a4Width / aspectRatio;

        // If the calculated height is larger than A4, adjust to fit within A4
        if (pdfHeight > a4Height) {
          pdfHeight = a4Height;
          pdfWidth = a4Height * aspectRatio;
        }

        // Create a PDF with A4 format and portrait orientation
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4', // Standard A4 format
        });

        // Add the image to the PDF, centered within the A4 dimensions
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.employee.name}-${this.attendanceData[i].wagePeriod}.pdf`);
      }
    },

    async handleDownloadWageSlip(i) {
      const element = document.getElementById('slip' + i);
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better resolution
      });
      const imgData = canvas.toDataURL('image/png');

      const elementWidth = canvas.width;
      const elementHeight = canvas.height;

      const a4Width = 210;
      const a4Height = 297;

      const aspectRatio = elementWidth / elementHeight;

      let pdfWidth = a4Width;
      let pdfHeight = a4Width / aspectRatio;

      if (pdfHeight > a4Height) {
        pdfHeight = a4Height;
        pdfWidth = a4Height * aspectRatio;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4', // Standard A4 format
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.employee.name}-${this.attendanceData[i].wagePeriod}.pdf`);
    },

    getMonths() {
      const months = [
        { month: 1, name: 'January', short: 'Jan', days: 31 },
        { month: 2, name: 'February', short: 'Feb', days: 28 },
        { month: 3, name: 'March', short: 'Mar', days: 31 },
        { month: 4, name: 'April', short: 'Apr', days: 30 },
        { month: 5, name: 'May', short: 'May', days: 31 },
        { month: 6, name: 'June', short: 'Jun', days: 30 },
        { month: 7, name: 'July', short: 'Jul', days: 31 },
        { month: 8, name: 'August', short: 'Aug', days: 31 },
        { month: 9, name: 'September', short: 'Sep', days: 30 },
        { month: 10, name: 'October', short: 'Oct', days: 31 },
        { month: 11, name: 'November', short: 'Nov', days: 30 },
        { month: 12, name: 'December', short: 'Dec', days: 31 },
      ];
      this.months = months;
    },

    validateForm() {
      if (this.form.from == '') {
        toast.info('Please select from date');
        return false;
      }

      if (this.form.from == '') {
        toast.info('Please select from date');
        return false;
      }

      if (this.form.to == '') {
        toast.info('Please select to date');
        return false;
      }

      return true;
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        console.log('Token : ', token);
        this.user = token.data.user;
        this.id = this.user._id;
        if (!token) {
          this.$router.push('/login');
        }
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
    },
  },
};
</script>
