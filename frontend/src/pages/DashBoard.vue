<style scoped>
::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dashboard-page {
  background: var(--bg-body, #f1f5f9);
}

.dashboard-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  letter-spacing: -0.025em;
  padding: 1.25rem 1.5rem 0;
}

.dashboard-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-card {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 200ms ease;
  border: 1px solid var(--border-color, #e2e8f0);
}

.dashboard-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-wrapper.clients {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
}

.card-icon-wrapper.employees {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #059669;
}

.card-icon-wrapper i {
  font-size: 1.25rem;
}

.card-content {
  flex-grow: 1;
}

.card-content .card-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted, #94a3b8);
  margin-bottom: 0.25rem;
}

.card-content .card-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  line-height: 1.2;
}

.card-content .card-desc {
  font-size: 0.75rem;
  color: var(--text-secondary, #64748b);
  margin-top: 0.125rem;
}

@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
  .dashboard-header {
    padding: 1rem 1rem 0;
  }
  .dashboard-subtitle {
    padding: 0 1rem;
  }
}
</style>

<template>
  <div class="main source-400 pt-2 h-100 dashboard-page">
    <div class="dashboard-header">Dashboard</div>
    <div class="dashboard-subtitle">Welcome back! Here's an overview of your workspace.</div>
    <div class="overflow-y-hidden pb-5 h-100">
      <div class="h-100 overflow-y-auto">
        <div v-if="role == 'super_admin'" class="dashboard-cards">
          <div class="dashboard-card">
            <div class="card-icon-wrapper clients">
              <i class="fas fa-building"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Clients</div>
              <div class="card-value">{{ clients.length }}</div>
              <div class="card-desc">Registered organizations</div>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="card-icon-wrapper employees">
              <i class="fas fa-users"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Total Employees</div>
              <div class="card-value">{{ employees.length }}</div>
              <div class="card-desc">Active workforce</div>
            </div>
          </div>
        </div>

        <div v-if="role == 'client'" class="dashboard-cards">
          <div class="dashboard-card">
            <div class="card-icon-wrapper employees">
              <i class="fas fa-users"></i>
            </div>
            <div class="card-content">
              <div class="card-label">Employees</div>
              <div class="card-value">{{ employees.length }}</div>
              <div class="card-desc">Your workforce</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axiosClient from '../axiosClient';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Font Awesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css';

import BarGraph from '../components/BarGraph.vue';
import PieChart from '../components/PieChart.vue';
import DoughnutChart from '../components/DoughnutChart.vue';
import LineChart from '../components/LineChart.vue';
import 'chartjs-plugin-annotation';

export default {
  name: 'DashBoard',
  components: {
    PieChart,
    BarGraph,
    DoughnutChart,
    LineChart,
  },
  data() {
    return {
      user: {},
      role: '',
      employees: [],
      clients: [],
      graphData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: ['rgba(255, 99, 132, 1)'],

            borderRadius: 5,
          },
          {
            label: 'Dataset 2',
            data: [5, 3, 12, 7, 19, 3],
            backgroundColor: ['rgba(0, 255, 64, 1)'],

            borderRadius: 5,
          },
          {
            label: 'Dataset 3',
            data: [7, 6, 10, 15, 14, 5],
            backgroundColor: ['rgba(100 , 0, 255, 1)'],

            borderRadius: 5,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
      },
      pieData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(201, 203, 207, 1)',
            ],
            borderColor: 'white',
            borderWidth: 1,
          },
        ],
      },
    };
  },

  async created() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
      return;
    }
    await this.getCurrent();

    if (this.role === 'super_admin') {
      try {
        const res = await axiosClient.get(`/api/v1/employee/getall`);

        this.employees = res.data.data;

        const clientRes = await axiosClient.get(`/api/v1/client/get/all/clients`);

        this.clients = clientRes.data.data;
      } catch (err) {
        console.log('error: ', err);
      }
    }

    if (this.role === 'client') {
      try {
        const res = await axiosClient.get(
          `/api/v1/employee/client/${this.user._id}`
        );

        this.employees = res.data.data;
      } catch (err) {
        console.log('error: ', err);
      }
    }
  },

  mounted() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.scroll', {
      opacity: 0.3,
      y: 50,
      duration: 1.2,
      scrollTrigger: {
        trigger: '#bar_graph, #doughnut, #pie, #line',
        delay: 0.2,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });
  },

  methods: {
    async getCurrent() {
      const tokenInStorage = localStorage.getItem('token');
      if (!tokenInStorage) {
        this.$router.push('/login');
        return;
      }
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);
        console.log('Token : ', token);
        this.user = token.data.user;
        if (token.data.user.industry_type) {
          this.role = 'client';
        } else if (token.data.user.designation) {
          this.role = 'employee';
        } else {
          this.role = this.user.roleType.name;
        }

        if (!token) {
          this.$router.push('/login');
        }
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
      return;
    },
  },
};
</script>
