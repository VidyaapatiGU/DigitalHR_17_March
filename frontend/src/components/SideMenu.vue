<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.profile-image {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: cover;
  border: 2px solid rgba(148, 163, 184, 0.3);
}

.selected {
  background: linear-gradient(135deg, var(--sidebar-active), #2563eb);
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.35);
}

.offcanvas {
  width: 15rem;
  border: 1px solid black;
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

.text_shadow {
  /* removed heavy text shadows for cleaner look */
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

/* Nav item styling */
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

/* Section header / collapsible */
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

/* Sidebar logo area */
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

/* User info at top */
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

@media (max-width: 576px) {
  .side_bar {
    display: none;
  }
}

@media (min-width: 576px) {
  .side_bar {
    display: block;
  }
}
</style>

<template>
  <div class="main font-14px h-100 rounded-3 sidebar-main overflow-y-hidden">
    <div class="d-flex h-100 justify-content-between flex-column">
      <!-- Header: Logo + User Info -->
      <div class="header">
        <div class="sidebar-logo mb-3">
          <div class="logo-icon">D</div>
          <span>DigitalHR</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <div @click="handleRedirect(`account`)" class="flex-shrink-0">
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
          <div class="overflow-hidden flex-grow-1">
            <div class="user-name text-capitalize">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
            <div class="user-logout" @click="handleLogOut">Sign out</div>
          </div>
        </div>
      </div>

      <!-- Navigation Body -->
      <div class="body px-2 pt-3 h-100 overflow-y-auto">
        <div class="d-flex flex-column gap-1">
          <!-- Dashboard -->
          <div class="section-label">Main</div>
          <div
            @click="handleRedirect('dashboard')"
            class="nav-item"
            :class="{ active: glowMenuItem == 'dashboard' }"
          >
            <i class="bi bi-grid-1x2-fill"></i>
            Dashboard
          </div>

          <!-- Users Section (super_admin) -->
          <template v-if="role == 'super_admin'">
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
                Users
              </div>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="w-100">
              <div class="collapse multi-collapse" id="multiCollapseUser">
                <div class="card card-body">
                  <div
                    @click="handleRedirect('manage/users')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'manage/users' || glowMenuItem.match(/^update\/user\/.*/) || glowMenuItem.match(/^view\/user\/.*/) || glowMenuItem.match(/^add\/user\/.*/) }"
                  >
                    <i class="bi bi-card-list"></i>
                    Manage Users
                  </div>
                  <div
                    @click="handleRedirect('teams')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'teams' }"
                  >
                    <i class="bi bi-people-fill"></i>
                    Teams
                  </div>
                  <div
                    @click="handleRedirect('role')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'role' }"
                  >
                    <i class="bi bi-award-fill"></i>
                    Role
                  </div>
                  <div
                    @click="handleRedirect('department')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'department' }"
                  >
                    <i class="bi bi-building-fill"></i>
                    Department
                  </div>
                </div>
              </div>
            </div>

            <!-- Clients Section -->
            <div
              data-bs-toggle="collapse"
              class="section-header"
              href="#multiCollapseClient"
              aria-expanded="false"
              aria-controls="multiCollapseClient"
            >
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-briefcase-fill" style="font-size: 0.9375rem"></i>
                Clients
              </div>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="w-100">
              <div class="collapse multi-collapse" id="multiCollapseClient">
                <div class="card card-body">
                  <div
                    @click="handleRedirect('manage/clients')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'manage/clients' || glowMenuItem.match(/^update\/client\/.*/) || glowMenuItem.match(/^view\/client\/.*/) }"
                  >
                    <i class="bi bi-person-rolodex"></i>
                    Manage Clients
                  </div>
                  <div
                    @click="handleRedirect('add/client')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'add/client' || glowMenuItem.match(/^add\/client\/.*/) }"
                  >
                    <i class="bi bi-person-fill-add"></i>
                    Add Client
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Employee Section (client role) -->
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
                Employees
              </div>
              <i class="bi bi-chevron-down"></i>
            </div>

            <div class="w-100">
              <div class="collapse multi-collapse" id="multiCollapseEmployee">
                <div class="card card-body">
                  <div
                    v-if="role != 'super_admin'"
                    @click="handleRedirect('add/employee')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'add/employee' || glowMenuItem.match(/^add\/employee\/.*/) }"
                  >
                    <i class="bi bi-person-fill-add"></i>
                    Add Employee
                  </div>
                  <div
                    @click="handleRedirect('manage/employees')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'manage/employees' }"
                  >
                    <i class="bi bi-person-rolodex"></i>
                    Manage Employees
                  </div>
                  <div
                    v-if="role != 'super_admin'"
                    @click="handleRedirect('manage/attendance')"
                    class="nav-item"
                    :class="{ active: glowMenuItem == 'manage/attendance' }"
                  >
                    <i class="bi bi-calendar-check-fill"></i>
                    Manage Attendance
                  </div>
                </div>
              </div>
            </div>

            <!-- Reports -->
            <div class="section-label">Analytics</div>
            <div
              @click="handleRedirect('reports')"
              class="nav-item"
              :class="{ active: glowMenuItem == 'reports' }"
            >
              <i class="bi bi-bar-chart-fill"></i>
              Reports
            </div>
          </template>
        </div>
      </div>

      <!-- Footer: Settings -->
      <div class="footer">
        <div
          @click="handleRedirect('setting')"
          class="nav-item"
          :class="{ active: glowMenuItem == 'setting' }"
        >
          <i class="bi bi-gear-fill"></i>
          Settings
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

  data() {
    return {
      offcanvas: null,
      user: {},
      role: '',
      profile: '',
      glowMenuItem: 'dashboard',
      bootstrap: {
        multiCollapseExample1: false,
      },
    };
  },

  async created() {
    await this.getCurrent();
    const currPage = this.getcurrentPage();

    //const currPage = localStorage.getItem('currPage');
    if (currPage) {
      //this.$router.push(`/${currPage}`);
      this.glowMenuItem = currPage;
    }
  },

  mounted() {},

  methods: {
    getcurrentPage() {
      //console.log('getcurrentPage called');
      const currentPageUrl = window.location.href;
      const currentPageUrlArray = currentPageUrl.split('/');
      let finalPageUrl = '';
      for (let i = 3; i < currentPageUrlArray.length; i++) {
        finalPageUrl = finalPageUrl + currentPageUrlArray[i];
        if (i != currentPageUrlArray.length - 1) finalPageUrl += '/';
      }
      //console.log('finalPageUrl', finalPageUrl);
      //console.log('currentPageUrl: ', currentPageUrlArray);

      return finalPageUrl;
    },

    handleRedirect(link) {
      //console.log('link: ', link);
      this.glowMenuItem = link;

      this.$router.push(`/${link}`);
      localStorage.setItem('currPage', link);
      /* if (link == 'dashboard') {
        this.glowMenuItem = 'dashboard';

       
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }

      if (link == 'manage/users') {
        this.glowMenuItem = 'manage/users';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'manage/clients') {
        this.glowMenuItem = 'manage/clients';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'teams') {
        this.glowMenuItem = 'teams';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'role') {
        this.glowMenuItem = 'role';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'department') {
        this.glowMenuItem = 'department';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'add/client') {
        this.glowMenuItem = 'add/client';

        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'add/employee') {
        this.glowMenuItem = 'add/employee';

        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }
      if (link == 'manage/employees') {
        this.glowMenuItem = 'manage/employees';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }

      if (link == 'upload/xl') {
        this.glowMenuItem = 'upload/xl';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      }

      if (link == 'employee/attandance') {
        this.glowMenuItem = 'employee/attandance';
        this.$router.push(`/${link}`);
        localStorage.setItem('currPage', link);
        return;
      } */
    },

    async getCurrent() {
      try {
        const token = await axiosClient.get(`api/v1/user/getCurrent/`);

        if (!token) {
          this.$router.push('/login');
        }
        this.user = token.data.user;
        //this.role = token.data.user.roleType.name;
        if (token.data.user.industry_type) {
          this.role = 'client';
        } else if (token.data.user.designation) {
          this.role = 'employee';
        } else {
          this.role = this.user.roleType.name;
        }
        //console.log('User : ', this.user, ' role : ', this.role);
      } catch (err) {
        console.log('error: ', err);
        this.$router.push('/login');
      }
    },

    async handleLogOut() {
      //console.log('handleLogOut Called');
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
    },
  },
};
</script>
