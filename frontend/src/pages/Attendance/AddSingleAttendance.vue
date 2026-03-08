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
  border-radius: var(--radius-md); border: 1px solid var(--border-color);
  background: #fff; color: var(--text-primary); cursor: pointer; transition: var(--transition-fast); white-space: nowrap;
}
.btn-action:hover { background: var(--bg-body); border-color: var(--primary); color: var(--primary); }

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

@media (max-width: 576px) {
  .form-container { padding: 1.25rem; }
}
</style>

<template>
  <div class="page-wrapper source-400 scroll">
    <div class="page-header-bar">
      <div>
        <h5>Add Employee Attendance</h5>
      </div>
      <div class=""></div>
    </div>

    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div v-auto-animate class="p-4 h-100">
          <div class="w-100 d-flex justify-content-center align-items-center gap-3">
            <div class="">
              <div class="">
                <multiselect
                  v-model="selectedEmployee"
                  :options="employees"
                  placeholder="Select Employee"
                  label="name"
                  track-by="name"
                ></multiselect>
              </div>
            </div>
            <div>
              <VueDatePicker
                v-model="month_year"
                month-picker
                placeholder="Select Month and Year"
                @update:model-value="handleMonthDays"
              />
              <!-- <input type="date" class="form-control form-control-sm" v-model="form.month_year" /> -->
            </div>
            <div class="">
              <input
                v-model="form.totalWorkingDays"
                type="text"
                class="form-control border"
                id="state"
                placeholder="No. Of Total Working Days"
                @input="handleWorkingDays"
              />
            </div>
            <div class="">
              <input
                v-model="form.present"
                type="text"
                class="form-control border"
                id="state"
                placeholder="No. Of Days Present"
                @input="handlePresentDays"
              />
            </div>

            <div class="">
              <input
                v-model="form.remark"
                type="text"
                class="form-control border"
                id="state"
                placeholder="Add Remark"
              />
            </div>

            <div v-auto-animate>
              <button
                type="button"
                class="btn-submit"
                @click="handleAddSingleAttendance"
              >
                {{ items.length > 0 ? 'Add Another' : 'Add' }}
              </button>
            </div>
          </div>
          <div v-if="items.length > 0" class="table-container mt-3">
            <div class="w-100">
              <EasyDataTable
                table-class-name="customize-table text-capitalize"
                :headers="headers"
                :items="items"
                search-field="name"
                :search-value="search"
                :rows-per-page="10"
                border-cell
                buttons-pagination
              ></EasyDataTable>
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

import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';

import 'vue-multiselect/dist/vue-multiselect.css';
import EasyDataTable from 'vue3-easy-data-table';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axiosClient from '../../axiosClient';
import { months } from '../../months';

export default {
  name: 'AddSingleAttendance',
  components: {
    EasyDataTable,
    VueDatePicker,
    Multiselect,
  },

  data() {
    return {
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Present', value: 'present' },
        { text: 'Total Working Days', value: 'totalWorkingDays' },
        { text: 'Month', value: 'month' },
        { text: 'Year', value: 'year' },
        { text: 'Remark', value: 'remark' },
      ],
      maxDays: 0,
      items: [],
      id: '',
      user: {},
      role: '',
      employees: [],
      selectedEmployee: '',
      month_year: '',
      excelData: [],
      form: {
        client_user_id: '',
        name: '',
        email: '',
        month: '',
        year: '',
        present: '',
        month_year: '',
        totalWorkingDays: '',
        month: '',
        year: '',
        remark: '',
        gross: null,
      },
      file: null,
    };
  },

  async created() {
    await this.getCurrent();

    try {
      const res = await axiosClient.get(
        `/api/v1/employee/client${this.user._id}`
      );
      console.log('res.data.data: ', res.data.data);
      this.originalItems = res.data.data;
      this.employees = res.data.data;
      const notifications = await axiosClient.get(`/api/v1/notification/getall/${this.user._id}`);
      this.notifications = notifications.data.data;
      console.log(' this.notifications: ', this.notifications);
    } catch (err) {
      console.log('error: ', err);
    }

    console.log(' this.employees: ', this.employees);
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
    handleMonthDays() {
      const monthDays = {
        0: '31',
        1: '28',
        2: '31',
        3: '30',
        4: '31',
        5: '30',
        6: '31',
        7: '31',
        8: '30',
        9: '31',
        10: '30',
        11: '31',
      };
      this.maxDays = monthDays[this.month_year.month];
      console.log('MonthDays');
      console.log(this.month_year.month);
    },
    handlePresentDays() {
      if (this.maxDays < this.form.present) {
        toast.warn(`No. Of Days Present is Exceeded the Month Max Days!`, { autoClose: 2000 });
        this.form.present = '';
      }
    },
    handleWorkingDays() {
      if (this.maxDays < this.form.totalWorkingDays) {
        toast.warn(`No. Of Total Working Days is Exceeded the Month Max Days!`, {
          autoClose: 2000,
        });
        this.form.totalWorkingDays = '';
      }
    },
    async handleAddSingleAttendance() {
      console.log('this.selectedEmployee: ', this.selectedEmployee);
      console.log('months', months);
      // this.form.month_year = this.month_year.year + '-' + (this.month_year.month + 1) + '-' + '01';
      this.form.name = this.selectedEmployee.name;
      this.form.email = this.selectedEmployee.email;
      this.form.client_user_id = this.user._id;
      this.form.gross = this.selectedEmployee.gross;

      const temp = parseInt(this.month_year.month);
      if (temp >= 9) {
        this.form.month_year = this.month_year.year + '-' + (temp + 1) + '-' + '01';
      } else {
        this.form.month_year = this.month_year.year + '-' + '0' + (temp + 1) + '-' + '01';
      }

      this.form.month = months[temp].name;
      this.form.year = this.month_year.year;

      console.log('this.form: ', this.form);
      if (this.validateForm() == false) {
        return;
      }

      try {
        const res = await axiosClient.post(
          `/api/v1/attendance/add/single/${this.user._id}`,
          this.form
        );
        console.log('res: ', res);

        toast.success(`Attendance Added Successfully`, { autoClose: 1000 });
        this.selectedEmployee.present = this.form.present;
        console.log('this.selectedEmployee: ', this.selectedEmployee);
        this.items.push({
          name: this.selectedEmployee.name,
          present: this.form.present,
          email: this.selectedEmployee.email,
          totalWorkingDays: this.form.totalWorkingDays,
          month: this.form.month,
          year: this.form.year,
        });
        console.log(' this.item: ', this.item);
        this.selectedEmployee = '';
        this.form.present = '';

        this.employees = this.employees.filter((emp) => emp._id !== this.form.emp_id);
      } catch (err) {
        console.log('error: ', err);
      }

      console.log('this.form: ', this.form);
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

    validateForm() {
      console.log('validateForm');
      if (this.form.emp_id == '') {
        toast.info(`Select Employee`, { autoClose: 1000 });
        return false;
      }

      if (this.form.present == '') {
        toast.info(`Enter Present`, { autoClose: 1000 });
        return false;
      }

      if (this.form.month_year == '') {
        toast.info(`Enter Month Year`, { autoClose: 1000 });
        return false;
      }

      if (this.form.totalWorkingDays == '') {
        toast.info(`Enter Total Working Days`, { autoClose: 1000 });
        return false;
      }

      return true;
    },
  },
};
</script>
