<template>
  <main class="dashboard-page">
    <div class="dashboard-scroll">
      <header class="dashboard-hero">
        <div>
          <div class="eyebrow">DIGITALHR WORKSPACE</div>
          <h1>Good {{ greeting }}, {{ firstName }}</h1>
          <p v-if="isAdmin">A live snapshot of your clients, users, employees and monthly payroll.</p>
          <p v-else>A live snapshot of your people and monthly payroll.</p>
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
                <p>{{ monthlyJoiners.description }}</p>
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

export default {
  name: 'DashBoard',
  data() {
    return {
      user: {},
      role: '',
      employees: [],
      clients: [],
      users: [],
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
      return this.employees.filter(employee => {
        const isActive = employee.active !== false && employee.approved !== false;
        return isActive && (!this.isAdmin || this.employeeBelongsToActiveClient(employee));
      });
    },
    isAdmin() {
      return this.role === 'admin' || this.role === 'super_admin';
    },
    activeClients() {
      return this.clients.filter(client =>
        client.active !== false && client.approved !== false && !client.deletedAt
      );
    },
    activeClientIds() {
      return new Set(this.activeClients.flatMap(client => [client._id, client.user_id]
        .filter(Boolean)
        .map(id => String(typeof id === 'object' ? id._id : id))));
    },
    activeUsers() {
      const clientDocumentIds = new Set(this.activeClients.map(client => String(client._id)));
      return this.users.filter(user => {
        const clientId = user.client_id?._id || user.client_id;
        return user.active !== false && user.approved !== false && clientDocumentIds.has(String(clientId || ''));
      });
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
      if (this.isAdmin) {
        return [
          { label: 'Active clients', value: this.activeClients.length, note: 'Approved organizations on the platform', icon: 'bi-buildings', tone: 'blue' },
          { label: 'Active users', value: this.activeUsers.length, note: 'Users linked to active clients', icon: 'bi-person-lines-fill', tone: 'green' },
          { label: 'Active employees', value: this.activeEmployees.length, note: 'Employees of active clients', icon: 'bi-person-check', tone: 'amber' },
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
      const currentMonths = Array.from({ length: 6 }, (_, index) => new Date(now.getFullYear(), now.getMonth() - 5 + index, 1));
      const validJoinDates = this.activeEmployees
        .map(employee => new Date(employee.date_of_joining))
        .filter(date => !Number.isNaN(date.getTime()));
      const countInMonths = months => months.map(month => validJoinDates.filter(joined =>
        joined.getMonth() === month.getMonth() && joined.getFullYear() === month.getFullYear()
      ).length);
      const currentValues = countInMonths(currentMonths);
      const latestJoinDate = validJoinDates.reduce((latest, date) => date > latest ? date : latest, null);
      const useLatestRecordedPeriod = Boolean(
        latestJoinDate &&
        !currentValues.some(count => count > 0) &&
        latestJoinDate < currentMonths[0]
      );
      const months = useLatestRecordedPeriod
        ? Array.from({ length: 6 }, (_, index) => new Date(latestJoinDate.getFullYear(), latestJoinDate.getMonth() - 5 + index, 1))
        : currentMonths;
      const monthLabel = date => new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
      const description = validJoinDates.length === 0
        ? 'Employee joining dates are needed to show hiring trends.'
        : useLatestRecordedPeriod
          ? `No hires in the last six months. Showing the latest hiring period: ${monthLabel(months[0])} – ${monthLabel(months[5])}.`
          : 'Employees who joined in the last six months.';
      return {
        labels: months.map(monthLabel),
        values: useLatestRecordedPeriod ? countInMonths(months) : currentValues,
        description,
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
  mounted() {
    window.addEventListener('digitalhr-theme-change', this.handleThemeChange);
  },
  beforeUnmount() {
    window.removeEventListener('digitalhr-theme-change', this.handleThemeChange);
    this.destroyCharts();
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 1, notation: 'compact' }).format(amount || 0);
    },
    async loadDashboard() {
      this.isLoading = true;
      this.destroyCharts();
      this.employees = [];
      this.clients = [];
      this.users = [];
      try {
        if (!localStorage.getItem('token')) {
          this.$router.push('/login');
          return;
        }
        const current = await axiosClient.get('/api/v1/user/getCurrent/');
        this.user = current.data.user;
        this.role = this.user?.industry_type ? 'client' : this.user?.designation ? 'employee' : this.user?.roleType?.name || '';

        if (this.isAdmin) {
          const [employeeResponse, clientResponse, userResponse] = await Promise.all([
            axiosClient.get('/api/v1/employee/getall'),
            axiosClient.get('/api/v1/client/get/all/clients'),
            axiosClient.get('/api/v1/user/getall'),
          ]);
          this.employees = employeeResponse.data.data || [];
          this.clients = clientResponse.data.data || [];
          this.users = userResponse.data.data || [];
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
    employeeBelongsToActiveClient(employee) {
      const clientRefs = [employee.client_id, employee.client_user_id, employee.user_id]
        .filter(Boolean)
        .map(id => String(typeof id === 'object' ? id._id : id));
      return clientRefs.some(id => this.activeClientIds.has(id));
    },
    destroyCharts() {
      this.joinersChart?.destroy();
      this.designationChart?.destroy();
      this.joinersChart = null;
      this.designationChart = null;
    },
    themeColor(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },
    handleThemeChange() {
      if (this.activeEmployees.length) this.renderCharts();
    },
    renderCharts() {
      this.destroyCharts();
      if (!this.activeEmployees.length) return;

      const chartColors = Array.from({ length: 6 }, (_, index) =>
        this.themeColor(`--chart-series-${index + 1}`)
      );
      const primary = this.themeColor('--primary-light');
      const primaryHover = this.themeColor('--primary-700');
      const textMuted = this.themeColor('--text-muted');
      const borderLight = this.themeColor('--border-light');

      if (this.$refs.joinersCanvas) {
        this.joinersChart = markRaw(new Chart(this.$refs.joinersCanvas, {
          type: 'bar',
          data: {
            labels: this.monthlyJoiners.labels,
            datasets: [{ label: 'New employees', data: this.monthlyJoiners.values, backgroundColor: primary, hoverBackgroundColor: primaryHover, borderRadius: 8, maxBarThickness: 38 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { displayColors: false, callbacks: { label: context => `${context.parsed.y} ${context.parsed.y === 1 ? 'joiner' : 'joiners'}` } } },
            scales: {
              x: { grid: { display: false }, border: { display: false }, ticks: { color: textMuted, autoSkip: true, maxTicksLimit: 6 } },
              y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1, color: textMuted }, grid: { color: borderLight }, border: { display: false } },
            },
          },
        }));
      }

      if (this.$refs.designationCanvas && this.designationMix.length) {
        this.designationChart = markRaw(new Chart(this.$refs.designationCanvas, {
          type: 'doughnut',
          data: {
            labels: this.designationMix.map(([label]) => label),
            datasets: [{ data: this.designationMix.map(([, count]) => count), backgroundColor: chartColors, borderColor: this.themeColor('--bg-surface'), borderWidth: 4, hoverOffset: 7 }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', padding: 18, color: textMuted, boxWidth: 8 } }, tooltip: { displayColors: false } },
          },
        }));
      }
    },
  },
};
</script>

<style scoped>
.dashboard-page { height: 100%; min-height: 0; background: var(--bg-body); color: var(--text-primary); transition: background-color var(--transition-base), color var(--transition-base); }
.dashboard-scroll { height: 100%; overflow: auto; padding: 28px clamp(16px, 3vw, 38px) 36px; }
.dashboard-hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 25px; }
.eyebrow, .footer-kicker { color: var(--text-muted); font-size: 10px; font-weight: 800; letter-spacing: .14em; }
.dashboard-hero h1 { margin: 7px 0 5px; color: var(--text-primary); font-size: clamp(24px, 3vw, 32px); font-weight: 750; letter-spacing: -.04em; }
.dashboard-hero p { margin: 0; color: var(--text-muted); font-size: 14px; }
.hero-actions { display: flex; align-items: center; gap: 10px; }
.today-chip, .refresh-button { display: inline-flex; align-items: center; gap: 8px; min-height: 38px; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-surface); padding: 0 12px; color: var(--text-secondary); font-size: 12px; font-weight: 650; white-space: nowrap; }
.refresh-button { color: var(--primary-light); cursor: pointer; }
.refresh-button:disabled { opacity: .6; cursor: wait; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.dashboard-loading { min-height: 220px; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--text-muted); }
.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 17px; }
.metric-card { display: flex; align-items: center; gap: 14px; min-width: 0; padding: 18px; border: 1px solid var(--border-color); border-radius: 15px; background: var(--bg-surface); box-shadow: var(--shadow-sm); transition: background-color var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base); }
.metric-icon { display: grid; place-items: center; width: 46px; height: 46px; flex: 0 0 46px; border-radius: 14px; font-size: 19px; }
.metric-icon.blue { color: var(--primary-light); background: var(--primary-50); }
.metric-icon.green { color: var(--success); background: var(--success-light); }
.metric-icon.amber { color: var(--warning); background: var(--warning-light); }
.metric-icon.violet { color: var(--primary-700); background: var(--primary-100); }
.metric-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.metric-label { color: var(--text-muted); font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.metric-copy strong { overflow: hidden; color: var(--text-primary); font-size: clamp(19px, 2vw, 25px); line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
.metric-copy small { overflow: hidden; color: var(--text-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.chart-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(320px, .85fr); gap: 16px; }
.chart-card { min-width: 0; min-height: 345px; padding: 21px 22px 17px; border: 1px solid var(--border-color); border-radius: 16px; background: var(--bg-surface); box-shadow: var(--shadow-sm); transition: background-color var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base); }
.chart-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.chart-heading h2, .dashboard-footer h2 { margin: 0; color: var(--text-primary); font-size: 15px; font-weight: 720; }
.chart-heading p { margin: 5px 0 0; color: var(--text-muted); font-size: 11px; }
.chart-tag { display: inline-flex; align-items: center; gap: 6px; padding: 7px 9px; border-radius: 8px; color: var(--primary-light); background: var(--primary-50); font-size: 10px; font-weight: 700; white-space: nowrap; }
.chart-canvas { position: relative; margin-top: 17px; height: 255px; }
.chart-canvas-doughnut { height: 270px; max-width: 430px; margin: 14px auto 0; }
.chart-empty { min-height: 260px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 7px; color: var(--text-muted); text-align: center; }
.chart-empty strong { color: var(--text-secondary); font-size: 13px; }
.chart-empty span:last-child { font-size: 11px; }
.empty-icon { display: grid; place-items: center; width: 42px; height: 42px; margin-bottom: 4px; border-radius: 13px; color: var(--primary-lighter); background: var(--primary-50); font-size: 19px; }
.dashboard-footer { display: grid; grid-template-columns: minmax(180px, .7fr) 1.3fr; align-items: center; gap: 24px; margin-top: 17px; padding: 20px 22px; border: 1px solid var(--border-color); border-radius: 16px; background: var(--bg-surface); box-shadow: var(--shadow-sm); }
.dashboard-footer h2 { margin-top: 7px; font-size: 16px; }
.quick-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.quick-link { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 12px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-surface); color: inherit; text-decoration: none; transition: transform .15s ease, box-shadow .15s ease, background-color var(--transition-base); }
.quick-link:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); color: inherit; }
.quick-link > span:nth-child(2) { display: flex; min-width: 0; flex: 1; flex-direction: column; gap: 3px; }
.quick-link strong { overflow: hidden; color: var(--text-primary); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.quick-link small { overflow: hidden; color: var(--text-muted); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.quick-link > i { color: var(--primary-light); font-size: 13px; }
.quick-link-icon { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; border-radius: 10px; color: var(--primary-light); background: var(--primary-50); }
.quick-link-icon.reports { color: var(--success); background: var(--success-light); }
@media (max-width: 1050px) { .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .chart-grid { grid-template-columns: minmax(0, 1fr); } .chart-card { min-height: 320px; } }
@media (max-width: 650px) { .dashboard-scroll { padding: 19px 14px 26px; } .dashboard-hero { align-items: flex-start; flex-direction: column; } .hero-actions { width: 100%; justify-content: space-between; } .metric-grid { gap: 9px; } .metric-card { align-items: flex-start; gap: 9px; padding: 12px 10px; } .metric-icon { width: 36px; height: 36px; flex-basis: 36px; border-radius: 11px; font-size: 16px; } .metric-copy strong { font-size: 18px; } .metric-copy small { white-space: normal; } .chart-card { padding: 17px 14px 12px; } .chart-grid { gap: 10px; } .chart-heading { flex-direction: column; } .chart-canvas { height: 220px; } .chart-canvas-doughnut { height: 240px; } .dashboard-footer { grid-template-columns: 1fr; gap: 15px; padding: 18px 14px; } .quick-links { grid-template-columns: 1fr; } }
</style>
