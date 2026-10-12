<template>
  <main class="dashboard-page">
    <div class="dashboard-scroll">
      <header class="dashboard-hero">
        <div>
          <div class="eyebrow">DIGITALHR WORKSPACE</div>
          <h1>Good {{ greeting }}, {{ firstName }}</h1>
          <p>A live snapshot of your people and monthly payroll.</p>
        </div>
        <div class="hero-actions">
          <span class="today-chip"><i class="bi bi-calendar3"></i>{{ todayLabel }}</span>
          <button class="refresh-button" type="button" :disabled="isLoading" @click="loadDashboard">
            <i :class="['bi', isLoading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise']"></i>
            Refresh
          </button>
        </div>
      </header>

      <div v-if="isLoading" class="dashboard-loading" role="status">
        <span class="spinner-border spinner-border-sm"></span> Updating workspace…
      </div>

      <template v-else>
        <section class="metric-grid" aria-label="Workspace summary">
          <article v-for="metric in metrics" :key="metric.label" class="metric-card">
            <div :class="['metric-icon', metric.tone]"><i :class="['bi', metric.icon]"></i></div>
            <div class="metric-copy">
              <span class="metric-label">{{ metric.label }}</span>
              <strong>{{ metric.value }}</strong>
              <small>{{ metric.note }}</small>
            </div>
          </article>
        </section>

        <section class="chart-grid" aria-label="Workforce analytics">
          <article class="chart-card">
            <div class="chart-heading">
              <div>
                <h2>Hiring momentum</h2>
                <p>Employees added across the last six months</p>
              </div>
              <span class="chart-tag"><i class="bi bi-graph-up-arrow"></i> New joiners</span>
            </div>
            <div v-if="!activeEmployees.length" class="chart-empty">
              <span class="empty-icon"><i class="bi bi-bar-chart-line"></i></span>
              <strong>No workforce data yet</strong>
              <span>Add employees to see monthly hiring trends.</span>
            </div>
            <div v-else class="chart-canvas chart-canvas-wide"><canvas ref="joinersCanvas" aria-label="Monthly employee joiners chart"></canvas></div>
          </article>

          <article class="chart-card">
            <div class="chart-heading">
              <div>
                <h2>Workforce mix</h2>
                <p>Active employees by designation</p>
              </div>
              <span class="chart-tag"><i class="bi bi-people"></i> {{ activeEmployees.length }} people</span>
            </div>
            <div v-if="!activeEmployees.length" class="chart-empty">
              <span class="empty-icon"><i class="bi bi-pie-chart"></i></span>
              <strong>Nothing to break down yet</strong>
              <span>Designation insights will appear as your team grows.</span>
            </div>
            <div v-else class="chart-canvas chart-canvas-doughnut"><canvas ref="designationCanvas" aria-label="Employee designation chart"></canvas></div>
          </article>
        </section>

        <section v-if="role !== 'admin' && role !== 'super_admin'" class="dashboard-footer">
          <div>
            <span class="footer-kicker">KEEP THINGS MOVING</span>
            <h2>Where would you like to go next?</h2>
          </div>
          <div class="quick-links">
            <router-link to="/manage/employees" class="quick-link">
              <span class="quick-link-icon"><i class="bi bi-person-lines-fill"></i></span>
              <span><strong>Manage employees</strong><small>View and update your team</small></span>
              <i class="bi bi-arrow-up-right"></i>
            </router-link>
            <router-link to="/reports" class="quick-link">
              <span class="quick-link-icon reports"><i class="bi bi-file-earmark-bar-graph"></i></span>
              <span><strong>Explore reports</strong><small>Open exports and compliance files</small></span>
              <i class="bi bi-arrow-up-right"></i>
            </router-link>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<script>
import { markRaw, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import axiosClient from '../axiosClient';

const chartColors = ['#536dfe', '#20b8a6', '#ffae55', '#a16eff', '#ed6b8a', '#48a7d8'];

export default {
  name: 'DashBoard',
  data() {
    return {
      user: {},
      role: '',
      employees: [],
      clients: [],
      isLoading: true,
      joinersChart: null,
      designationChart: null,
    };
  },
  computed: {
    firstName() {
      return this.user?.name?.trim()?.split(/\s+/)[0] || 'there';
    },
    greeting() {
      const hour = new Date().getHours();
      return hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    },
    todayLabel() {
      return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());
    },
    activeEmployees() {
      return this.employees.filter(employee => employee.active !== false && employee.approved !== false);
    },
    joinedThisMonth() {
      const now = new Date();
      return this.activeEmployees.filter(employee => {
        const joined = new Date(employee.date_of_joining);
        return !Number.isNaN(joined.getTime()) && joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
      }).length;
    },
    monthlyGross() {
      return this.activeEmployees.reduce((total, employee) => total + (Number(employee.gross) || 0), 0);
    },
    averageGross() {
      return this.activeEmployees.length ? this.monthlyGross / this.activeEmployees.length : 0;
    },
    metrics() {
      const people = this.role === 'admin' || this.role === 'super_admin';
      if (people) {
        return [
          { label: 'Total clients', value: this.clients.length, note: 'Organizations on the platform', icon: 'bi-buildings', tone: 'blue' },
          { label: 'Active workforce', value: this.activeEmployees.length, note: 'Currently active employees', icon: 'bi-person-check', tone: 'green' },
          { label: 'Joined this month', value: this.joinedThisMonth, note: 'Based on employee start dates', icon: 'bi-person-plus', tone: 'amber' },
          { label: 'Monthly gross', value: this.formatCurrency(this.monthlyGross), note: 'Combined gross salary estimate', icon: 'bi-currency-rupee', tone: 'violet' },
        ];
      }
      return [
        { label: 'Your employees', value: this.activeEmployees.length, note: 'Active people in your workspace', icon: 'bi-people', tone: 'blue' },
        { label: 'Joined this month', value: this.joinedThisMonth, note: 'Based on employee start dates', icon: 'bi-person-plus', tone: 'green' },
        { label: 'Average gross', value: this.formatCurrency(this.averageGross), note: 'Average monthly gross per employee', icon: 'bi-bar-chart-line', tone: 'amber' },
        { label: 'Monthly gross', value: this.formatCurrency(this.monthlyGross), note: 'Combined gross salary estimate', icon: 'bi-currency-rupee', tone: 'violet' },
      ];
    },
    monthlyJoiners() {
      const now = new Date();
      const months = Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
      return {
        labels: months.map(date => new Intl.DateTimeFormat('en', { month: 'short' }).format(date)),
        values: months.map(month => this.activeEmployees.filter(employee => {
          const joined = new Date(employee.date_of_joining);
          return !Number.isNaN(joined.getTime()) && joined.getMonth() === month.getMonth() && joined.getFullYear() === month.getFullYear();
        }).length),
      };
    },
    designationMix() {
      const counts = this.activeEmployees.reduce((result, employee) => {
        const designation = employee.designation?.trim() || 'Unspecified';
        result[designation] = (result[designation] || 0) + 1;
        return result;
      }, {});
      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      const visible = entries.slice(0, 5);
      if (entries.length > 5) visible.push(['Other roles', entries.slice(5).reduce((sum, entry) => sum + entry[1], 0)]);
      return visible;
    },
  },
  async created() {
    await this.loadDashboard();
  },
  beforeUnmount() {
    this.destroyCharts();
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 1, notation: 'compact' }).format(amount || 0);
    },
    async loadDashboard() {
      this.isLoading = true;
      this.destroyCharts();
      try {
        if (!localStorage.getItem('token')) {
          this.$router.push('/login');
          return;
        }
        const current = await axiosClient.get('/api/v1/user/getCurrent/');
        this.user = current.data.user;
        this.role = this.user?.industry_type ? 'client' : this.user?.designation ? 'employee' : this.user?.roleType?.name || '';

        if (this.role === 'admin' || this.role === 'super_admin') {
          const [employeeResponse, clientResponse] = await Promise.all([
            axiosClient.get('/api/v1/employee/getall'),
            axiosClient.get('/api/v1/client/get/all/clients'),
          ]);
          this.employees = employeeResponse.data.data || [];
          this.clients = clientResponse.data.data || [];
        } else if (this.role === 'client') {
          const response = await axiosClient.get(`/api/v1/employee/client/${this.user._id}`);
          this.employees = response.data.data || [];
        }
      } catch (error) {
        console.error('Could not refresh dashboard data:', error.response?.data?.message || error.message);
      } finally {
        this.isLoading = false;
        await nextTick();
        this.renderCharts();
      }
    },
    destroyCharts() {
      this.joinersChart?.destroy();
      this.designationChart?.destroy();
      this.joinersChart = null;
      this.designationChart = null;
    },
    renderCharts() {
      this.destroyCharts();
      if (!this.activeEmployees.length) return;

      if (this.$refs.joinersCanvas) {
        this.joinersChart = markRaw(new Chart(this.$refs.joinersCanvas, {
          type: 'bar',
          data: {
            labels: this.monthlyJoiners.labels,
            datasets: [{ label: 'New employees', data: this.monthlyJoiners.values, backgroundColor: '#6176f7', hoverBackgroundColor: '#4059e8', borderRadius: 8, maxBarThickness: 38 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { displayColors: false, callbacks: { label: context => `${context.parsed.y} ${context.parsed.y === 1 ? 'joiner' : 'joiners'}` } } },
            scales: {
              x: { grid: { display: false }, border: { display: false }, ticks: { color: '#8791a5' } },
              y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1, color: '#8791a5' }, grid: { color: '#edf0f6' }, border: { display: false } },
            },
          },
        }));
      }

      if (this.$refs.designationCanvas && this.designationMix.length) {
        this.designationChart = markRaw(new Chart(this.$refs.designationCanvas, {
          type: 'doughnut',
          data: {
            labels: this.designationMix.map(([label]) => label),
            datasets: [{ data: this.designationMix.map(([, count]) => count), backgroundColor: chartColors, borderColor: '#fff', borderWidth: 4, hoverOffset: 7 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 18, color: '#64748b', boxWidth: 8 } }, tooltip: { displayColors: false } },
          },
        }));
      }
    },
  },
};
</script>

<style scoped>
.dashboard-page { height: 100%; min-height: 0; background: #f4f6fb; color: #17243b; }
.dashboard-scroll { height: 100%; overflow: auto; padding: 28px clamp(16px, 3vw, 38px) 36px; }
.dashboard-hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 25px; }
.eyebrow, .footer-kicker { color: #7887a3; font-size: 10px; font-weight: 800; letter-spacing: .14em; }
.dashboard-hero h1 { margin: 7px 0 5px; color: #14213a; font-size: clamp(24px, 3vw, 32px); font-weight: 750; letter-spacing: -.04em; }
.dashboard-hero p { margin: 0; color: #78849a; font-size: 14px; }
.hero-actions { display: flex; align-items: center; gap: 10px; }
.today-chip, .refresh-button { display: inline-flex; align-items: center; gap: 8px; min-height: 38px; border: 1px solid #e3e8f1; border-radius: 10px; background: #fff; padding: 0 12px; color: #5c6982; font-size: 12px; font-weight: 650; white-space: nowrap; }
.refresh-button { color: #4258ce; cursor: pointer; }
.refresh-button:disabled { opacity: .6; cursor: wait; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.dashboard-loading { min-height: 220px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #77849b; }
.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 17px; }
.metric-card { display: flex; align-items: center; gap: 14px; min-width: 0; padding: 18px; border: 1px solid #e8ebf3; border-radius: 15px; background: #fff; box-shadow: 0 5px 18px rgba(34, 49, 84, .035); }
.metric-icon { display: grid; place-items: center; width: 46px; height: 46px; flex: 0 0 46px; border-radius: 14px; font-size: 19px; }
.metric-icon.blue { color: #536dfe; background: #edf0ff; }
.metric-icon.green { color: #13a989; background: #e6f8f3; }
.metric-icon.amber { color: #e39131; background: #fff4e5; }
.metric-icon.violet { color: #9461dd; background: #f3ebff; }
.metric-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.metric-label { color: #8390a5; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.metric-copy strong { overflow: hidden; color: #1d2b46; font-size: clamp(19px, 2vw, 25px); line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
.metric-copy small { overflow: hidden; color: #98a1b1; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.chart-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(320px, .85fr); gap: 16px; }
.chart-card { min-width: 0; min-height: 345px; padding: 21px 22px 17px; border: 1px solid #e8ebf3; border-radius: 16px; background: #fff; box-shadow: 0 5px 18px rgba(34, 49, 84, .035); }
.chart-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.chart-heading h2, .dashboard-footer h2 { margin: 0; color: #25334c; font-size: 15px; font-weight: 720; }
.chart-heading p { margin: 5px 0 0; color: #96a0b1; font-size: 11px; }
.chart-tag { display: inline-flex; align-items: center; gap: 6px; padding: 7px 9px; border-radius: 8px; color: #6576db; background: #f1f3ff; font-size: 10px; font-weight: 700; white-space: nowrap; }
.chart-canvas { position: relative; margin-top: 17px; height: 255px; }
.chart-canvas-doughnut { height: 270px; max-width: 430px; margin: 14px auto 0; }
.chart-empty { min-height: 260px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 7px; color: #8a95a8; text-align: center; }
.chart-empty strong { color: #4b5972; font-size: 13px; }
.chart-empty span:last-child { font-size: 11px; }
.empty-icon { display: grid; place-items: center; width: 42px; height: 42px; margin-bottom: 4px; border-radius: 13px; color: #8290dd; background: #f0f2ff; font-size: 19px; }
.dashboard-footer { display: grid; grid-template-columns: minmax(180px, .7fr) 1.3fr; align-items: center; gap: 24px; margin-top: 17px; padding: 20px 22px; border-radius: 16px; background: #eaf0ff; }
.dashboard-footer h2 { margin-top: 7px; font-size: 16px; }
.quick-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.quick-link { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 12px; border: 1px solid rgba(255,255,255,.8); border-radius: 12px; background: rgba(255,255,255,.75); color: inherit; text-decoration: none; transition: transform .15s ease, box-shadow .15s ease; }
.quick-link:hover { transform: translateY(-2px); box-shadow: 0 7px 20px rgba(63, 82, 157, .1); color: inherit; }
.quick-link > span:nth-child(2) { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 3px; }
.quick-link strong { overflow: hidden; color: #354461; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.quick-link small { overflow: hidden; color: #8290a8; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.quick-link > i { color: #7887c9; font-size: 13px; }
.quick-link-icon { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; border-radius: 10px; color: #536dfe; background: #edf0ff; }
.quick-link-icon.reports { color: #13a989; background: #e6f8f3; }
@media (max-width: 1050px) { .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .chart-grid { grid-template-columns: minmax(0, 1fr); } .chart-card { min-height: 320px; } }
@media (max-width: 650px) { .dashboard-scroll { padding: 19px 14px 26px; } .dashboard-hero { align-items: flex-start; flex-direction: column; } .hero-actions { width: 100%; justify-content: space-between; } .metric-grid { gap: 9px; } .metric-card { align-items: flex-start; gap: 9px; padding: 12px 10px; } .metric-icon { width: 36px; height: 36px; flex-basis: 36px; border-radius: 11px; font-size: 16px; } .metric-copy strong { font-size: 18px; } .metric-copy small { white-space: normal; } .chart-card { padding: 17px 14px 12px; } .chart-grid { gap: 10px; } .chart-heading { flex-direction: column; } .chart-canvas { height: 220px; } .chart-canvas-doughnut { height: 240px; } .dashboard-footer { grid-template-columns: 1fr; gap: 15px; padding: 18px 14px; } .quick-links { grid-template-columns: 1fr; } }
</style>
