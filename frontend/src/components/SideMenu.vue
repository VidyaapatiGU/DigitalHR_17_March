<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.main {
  width: 100%;
}

.profile-image {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: cover;
  border: 2px solid rgba(148, 163, 184, 0.3);
  transition: all 150ms ease;
}

.footer {
  height: auto;
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.header {
  padding: 1.25rem 0.75rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.body {
  background-color: transparent;
}

.sidebar-main {
  background: linear-gradient(180deg, #0f172a 0%, #1a1f35 100%);
}

.card-body,
.multiCollapseExample1 {
  background: rgba(30, 41, 59, 0.5);
  border: none;
}

.card {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.card-body {
  padding: 0.25rem 0 !important;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--sidebar-text);
  transition: all 150ms ease;
  font-size: 0.8125rem;
  font-weight: 450;
  cursor: pointer;
  gap: 0.5rem;
}

.nav-item:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-text-active);
}

.nav-item.active {
  background: linear-gradient(135deg, var(--sidebar-active), #2563eb);
  color: var(--sidebar-text-active);
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.35);
  font-weight: 500;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 0.9375rem;
  opacity: 0.85;
}

.nav-item.active i {
  opacity: 1;
}

.nav-item-label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: var(--sidebar-text);
  transition: all 150ms ease;
  font-size: 0.8125rem;
  font-weight: 450;
  cursor: pointer;
}

.section-header:hover {
  background: var(--sidebar-hover);
  color: var(--sidebar-text-active);
}

.section-header i.bi-chevron-down {
  font-size: 0.625rem;
  transition: transform 200ms ease;
}

.section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(148, 163, 184, 0.5);
  padding: 0.75rem 0.75rem 0.375rem;
  margin-top: 0.25rem;
}

.sidebar-logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-logo .logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #e2e8f0;
}

.user-email {
  font-size: 0.6875rem;
  color: var(--sidebar-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-logout {
  font-size: 0.6875rem;
  color: var(--sidebar-text);
  cursor: pointer;
  transition: color 150ms ease;
}

.user-logout:hover {
  color: #ef4444;
}

.icon-only {
  justify-content: center;
  width: 40px;
  margin: 0 auto;
  padding: 0.55rem;
}

.icon-only i {
  width: auto;
  font-size: 1rem;
}

.main.collapsed .header {
  padding: 1rem 0.5rem 0.85rem;
}

.main.collapsed .body {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

.main.collapsed .footer {
  padding: 0.75rem 0.5rem;
}

.main.collapsed .sidebar-logo {
  justify-content: center;
  margin-bottom: 0.75rem !important;
}

.main.collapsed .profile-image {
  width: 2rem;
  height: 2rem;
}

.main.collapsed .user-row {
  justify-content: center;
}
</style>

<template>
  <div
    class="main font-14px h-100 rounded-3 sidebar-main overflow-y-hidden"
    :class="{ collapsed }"
  >
    <div class="d-flex h-100 justify-content-between flex-column">
      <div class="header">
        <div class="sidebar-logo mb-3">
          <div class="logo-icon">D</div>
          <span v-if="!collapsed">DigitalHR</span>
        </div>
        <div class="d-flex align-items-center gap-2 user-row">
          <div @click="handleRedirect('account')" class="flex-shrink-0">
            <img
              v-if="profile"
              class="img-account-profile profile-image pointer rounded-circle"
              :src="profile"
              alt="Profile Picture"
            />
            <img
              v-else
              class="img-account-profile profile-image pointer rounded-circle"
              src="../assets/profile-circle copy.svg"
              alt="Default Profile Picture"
            />
          </div>
          <div v-if="!collapsed" class="overflow-hidden flex-grow-1">
            <div class="user-name text-capitalize">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
            <div class="user-logout" @click="handleLogOut">Sign out</div>
          </div>
        </div>
      </div>

      <div class="body px-2 pt-3 h-100 overflow-y-auto">
        <div v-if="!collapsed" class="d-flex flex-column gap-1">
          <div class="section-label">Main</div>
          <div
            @click="handleRedirect('dashboard')"
            class="nav-item"
            :class="{ active: isMenuActive('dashboard') }"
          >
            <i class="bi bi-grid-1x2-fill"></i>
            <span class="nav-item-label">Dashboard</span>
          </div>

          <template v-if="isAdminRole">
            <div class="section-label">Management</div>
            <div
              data-bs-toggle="collapse"
              class="section-header"
              href="#multiCollapseUser"
              aria-expanded="false"
              aria-controls="multiCollapseUser"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-people-fill" style="font-size: 0.9375rem"></i>
                <span class="nav-item-label">Users</span>
              </div>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="w-100">
              <div class="collapse multi-collapse" id="multiCollapseUser">
                <div class="card card-body">
                  <div
                    @click="handleRedirect('manage/users')"
                    class="nav-item"
                    :class="{ active: isMenuActive('manage/users') }"
                  >
                    <i class="bi bi-card-list"></i>
                    <span class="nav-item-label">Manage Users</span>
                  </div>
                  <div
                    @click="handleRedirect('teams')"
                    class="nav-item"
                    :class="{ active: isMenuActive('teams') }"
                  >
                    <i class="bi bi-people-fill"></i>
                    <span class="nav-item-label">Teams</span>
                  </div>
                  <div
                    @click="handleRedirect('role')"
                    class="nav-item"
                    :class="{ active: isMenuActive('role') }"
                  >
                    <i class="bi bi-award-fill"></i>
                    <span class="nav-item-label">Role</span>
                  </div>
                  <div
                    @click="handleRedirect('department')"
                    class="nav-item"
                    :class="{ active: isMenuActive('department') }"
                  >
                    <i class="bi bi-building-fill"></i>
                    <span class="nav-item-label">Department</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              data-bs-toggle="collapse"
              class="section-header"
              href="#multiCollapseClient"
              aria-expanded="false"
              aria-controls="multiCollapseClient"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-briefcase-fill" style="font-size: 0.9375rem"></i>
                <span class="nav-item-label">Clients</span>
              </div>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="w-100">
              <div class="collapse multi-collapse" id="multiCollapseClient">
                <div class="card card-body">
                  <div
                    @click="handleRedirect('manage/clients')"
                    class="nav-item"
                    :class="{ active: isMenuActive('manage/clients') }"
                  >
                    <i class="bi bi-person-rolodex"></i>
                    <span class="nav-item-label">Manage Clients</span>
                  </div>
                  <div
                    @click="handleRedirect('add/client')"
                    class="nav-item"
                    :class="{ active: isMenuActive('add/client') }"
                  >
                    <i class="bi bi-person-fill-add"></i>
                    <span class="nav-item-label">Add Client</span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-if="role == 'client'">
            <div class="section-label">Workforce</div>
            <div
              data-bs-toggle="collapse"
              class="section-header"
              href="#multiCollapseEmployee"
              aria-expanded="false"
              aria-controls="multiCollapseEmployee"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-person-badge-fill" style="font-size: 0.9375rem"></i>
                <span class="nav-item-label">Employees</span>
              </div>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="w-100">
              <div class="collapse multi-collapse" id="multiCollapseEmployee">
                <div class="card card-body">
                  <div
                    @click="handleRedirect('add/employee')"
                    class="nav-item"
                    :class="{ active: isMenuActive('add/employee') }"
                  >
                    <i class="bi bi-person-fill-add"></i>
                    <span class="nav-item-label">Add Employee</span>
                  </div>
                  <div
                    @click="handleRedirect('manage/employees')"
                    class="nav-item"
                    :class="{ active: isMenuActive('manage/employees') }"
                  >
                    <i class="bi bi-person-rolodex"></i>
                    <span class="nav-item-label">Manage Employees</span>
                  </div>
                  <div
                    @click="handleRedirect('manage/attendance')"
                    class="nav-item"
                    :class="{ active: isMenuActive('manage/attendance') }"
                  >
                    <i class="bi bi-calendar-check-fill"></i>
                    <span class="nav-item-label">Manage Attendance</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="section-label">Analytics</div>
            <div
              @click="handleRedirect('reports')"
              class="nav-item"
              :class="{ active: isMenuActive('reports') }"
            >
              <i class="bi bi-bar-chart-fill"></i>
              <span class="nav-item-label">Reports</span>
            </div>
          </template>
        </div>

        <div v-else class="d-flex flex-column gap-2">
          <div
            v-for="item in collapsedMenuItems"
            :key="item.link"
            class="nav-item icon-only"
            :class="{ active: isMenuActive(item.link) }"
            :title="item.label"
            @click="handleRedirect(item.link)"
          >
            <i :class="item.icon"></i>
          </div>
        </div>
      </div>

      <div class="footer">
        <div
          @click="handleRedirect('setting')"
          class="nav-item"
          :class="{ active: isMenuActive('setting'), 'icon-only': collapsed }"
          :title="collapsed ? 'Settings' : null"
        >
          <i class="bi bi-gear-fill"></i>
          <span v-if="!collapsed" class="nav-item-label">Settings</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from '../axiosClient';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'SideMenu',
  emits: ['navigate'],
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      user: {},
      role: '',
      profile: '',
      glowMenuItem: 'dashboard',
      bootstrap: {
        multiCollapseExample1: false,
      },
    };
  },

  computed: {
    isAdminRole() {
      return this.role === 'super_admin' || this.role === 'admin';
    },

    collapsedMenuItems() {
      const items = [
        {
          link: 'dashboard',
          icon: 'bi bi-grid-1x2-fill',
          label: 'Dashboard',
        },
      ];

      if (this.isAdminRole) {
        items.push(
          {
            link: 'manage/users',
            icon: 'bi bi-card-list',
            label: 'Manage Users',
          },
          {
            link: 'teams',
            icon: 'bi bi-people-fill',
            label: 'Teams',
          },
          {
            link: 'role',
            icon: 'bi bi-award-fill',
            label: 'Role',
          },
          {
            link: 'department',
            icon: 'bi bi-building-fill',
            label: 'Department',
          },
          {
            link: 'manage/clients',
            icon: 'bi bi-person-rolodex',
            label: 'Manage Clients',
          },
          {
            link: 'add/client',
            icon: 'bi bi-person-fill-add',
            label: 'Add Client',
          },
        );
      }

      if (this.role === 'client') {
        items.push(
          {
            link: 'add/employee',
            icon: 'bi bi-person-fill-add',
            label: 'Add Employee',
          },
          {
            link: 'manage/employees',
            icon: 'bi bi-person-rolodex',
            label: 'Manage Employees',
          },
          {
            link: 'manage/attendance',
            icon: 'bi bi-calendar-check-fill',
            label: 'Manage Attendance',
          },
          {
            link: 'reports',
            icon: 'bi bi-bar-chart-fill',
            label: 'Reports',
          },
        );
      }

      return items;
    },
  },

  watch: {
    '$route.path'(newPath) {
      this.glowMenuItem = (newPath || '').replace(/^\/+/, '') || 'dashboard';
    },
  },

  async created() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    await this.getCurrent();

    const currPage = this.$route?.path
      ? this.$route.path.replace(/^\/+/, '')
      : this.getcurrentPage();

    if (currPage) {
      this.glowMenuItem = currPage;
    }
  },

  methods: {
    getcurrentPage() {
      const currentPageUrl = window.location.href;
      const currentPageUrlArray = currentPageUrl.split('/');
      let finalPageUrl = '';
      for (let i = 3; i < currentPageUrlArray.length; i += 1) {
        finalPageUrl += currentPageUrlArray[i];
        if (i !== currentPageUrlArray.length - 1) {
          finalPageUrl += '/';
        }
      }

      return finalPageUrl;
    },

    isMenuActive(link) {
      const current = this.glowMenuItem || '';

      if (link === 'manage/users') {
        return (
          current === 'manage/users' ||
          /^update\/user\/.*/.test(current) ||
          /^view\/user\/.*/.test(current) ||
          /^add\/user\/.*/.test(current)
        );
      }

      if (link === 'manage/clients') {
        return (
          current === 'manage/clients' ||
          /^update\/client\/.*/.test(current) ||
          /^view\/client\/.*/.test(current) ||
          /^update\/client\/documents\/.*/.test(current) ||
          /^view\/document\/.*/.test(current)
        );
      }

      if (link === 'add/client') {
        return current === 'add/client' || /^add\/client\/.*/.test(current);
      }

      if (link === 'add/employee') {
        return current === 'add/employee' || /^add\/employee\/.*/.test(current);
      }

      if (link === 'manage/employees') {
        return (
          current === 'manage/employees' ||
          /^update\/employee\/.*/.test(current) ||
          /^view\/employee\/.*/.test(current) ||
          /^manage\/employees\/by\/client\/.*/.test(current) ||
          /^update\/employee\/documents\/.*/.test(current) ||
          /^view\/employee\/document\/.*/.test(current) ||
          /^wage\/slip\/.*/.test(current)
        );
      }

      if (link === 'manage/attendance') {
        return current === 'manage/attendance' || /^employee\/attendance\/.*/.test(current);
      }

      if (link === 'reports') {
        return current === 'reports' || /^reports\/.*/.test(current);
      }

      return current === link;
    },

    handleRedirect(link) {
      this.glowMenuItem = link;

      if (this.$route.path !== `/${link}`) {
        this.$router.push(`/${link}`);
      }

      localStorage.setItem('currPage', link);
      this.$emit('navigate');
    },

    async getCurrent() {
      const tokenInStorage = localStorage.getItem('token');
      if (!tokenInStorage) return;
      try {
        const token = await axiosClient.get('api/v1/user/getCurrent/');

        if (!token) {
          this.$router.push('/login');
        }
        this.user = token.data.user;
        this.profile = this.user.profile_url || this.user.profile || '';
        if (token.data.user.industry_type) {
          this.role = 'client';
        } else if (token.data.user.designation) {
          this.role = 'employee';
        } else {
          this.role = this.user.roleType.name;
        }
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
    },

    async handleLogOut() {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('You Are Already Logged Out', {
          autoClose: 1500,
        });
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } else {
        localStorage.removeItem('token');
        toast.info('Log Out Sucessfull', {
          autoClose: 1500,
        });
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      }

      this.$emit('navigate');
    },
  },
};
</script>
