<style scoped>
.dashboard-shell {
  --sidebar-expanded-width: clamp(240px, 20vw, 280px);
  --sidebar-collapsed-width: 84px;
  --sidebar-current-width: var(--sidebar-expanded-width);
  height: 100vh;
  min-height: 100vh;
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  background: var(--bg-body);
}

.dashboard-shell.sidebar-collapsed {
  --sidebar-current-width: var(--sidebar-collapsed-width);
}

.desktop-sidebar {
  width: var(--sidebar-current-width);
  min-width: var(--sidebar-current-width);
  flex: 0 0 var(--sidebar-current-width);
  height: 100vh;
  min-height: 0;
  position: sticky;
  top: 0;
  overflow: hidden;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  transition: width var(--transition-base), min-width var(--transition-base);
  z-index: 30;
}

.content-area {
  min-width: 0;
  flex: 1;
  height: 100vh;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-body);
}

.content-topbar {
  min-height: 72px;
  padding: 0.9rem clamp(1rem, 3vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg-surface);
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 90%, transparent);
  backdrop-filter: blur(16px);
}

.content-topbar__context {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.content-topbar__labels {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.content-topbar__menu {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-xs);
}

.content-topbar__kicker {
  display: block;
  color: var(--text-muted);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-transform: uppercase;
}

.content-topbar__title {
  display: block;
  overflow: hidden;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-topbar__status {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex: 0 0 auto;
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
}

.content-topbar__status::before {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 4px var(--success-light);
  content: '';
}

.content-topbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 0 0 auto;
}

.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.35rem;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-surface);
  box-shadow: var(--shadow-xs);
}

.theme-switcher__swatch {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.18);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.theme-switcher__swatch:hover {
  transform: scale(1.12);
}

.theme-switcher__swatch:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 3px;
}

.theme-switcher__swatch:disabled {
  cursor: wait;
}

.theme-switcher__swatch[aria-pressed='true'] {
  box-shadow: 0 0 0 2px var(--text-primary);
}

.theme-switcher__swatch--ocean { background: var(--primary-light); }
.theme-switcher__swatch--forest { background: #0f766e; }
.theme-switcher__swatch--plum { background: #7652a7; }

.notification-menu {
  position: relative;
}

.notification-trigger {
  position: relative;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: 999px;
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-xs);
  font-size: 1rem;
}

.notification-trigger:hover,
.notification-trigger[aria-expanded='true'] {
  color: var(--primary);
  border-color: var(--primary-light);
}

.notification-count {
  position: absolute;
  top: -0.25rem;
  right: -0.3rem;
  min-width: 1.15rem;
  height: 1.15rem;
  padding: 0 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-light);
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
}

.notification-panel {
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 90;
  width: min(430px, calc(100vw - 1.5rem));
  max-height: min(78vh, 720px);
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  box-shadow: var(--shadow-lg);
}

.notification-panel__header,
.notification-item,
.broadcast-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.notification-panel__header h2,
.broadcast-heading h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.notification-panel__header small,
.notification-meta,
.broadcast-help {
  color: var(--text-muted);
  font-size: 0.73rem;
}

.notification-panel__close,
.notification-dismiss {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
}

.notification-panel__close:hover,
.notification-dismiss:hover {
  background: var(--bg-body);
  color: var(--text-primary);
}

.broadcast-launch {
  width: 100%;
  margin: 0.9rem 0;
  padding: 0.6rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--primary-200);
  border-radius: var(--radius-md);
  background: var(--primary-50);
  color: var(--primary-600);
  font-size: 0.82rem;
  font-weight: 650;
}

.broadcast-form {
  margin: 0.85rem 0 1rem;
  padding: 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-muted);
}

.broadcast-form label,
.broadcast-label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-weight: 650;
}

.broadcast-form .form-control,
.broadcast-form .form-select {
  margin-bottom: 0.7rem;
  font-size: 0.8rem;
}

.audience-options {
  max-height: 130px;
  margin: 0.4rem 0 0.7rem;
  padding: 0.4rem 0.55rem;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-surface);
}

.audience-option {
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  margin: 0 !important;
  padding: 0.32rem 0;
  color: var(--text-primary) !important;
  font-size: 0.78rem !important;
  font-weight: 500 !important;
}

.broadcast-submit {
  width: 100%;
}

.notification-feedback {
  margin: 0.6rem 0;
  padding: 0.55rem 0.65rem;
  border-radius: 8px;
  background: var(--primary-50);
  color: var(--primary-700);
  font-size: 0.76rem;
}

.notification-feedback.error {
  background: #fef2f2;
  color: #b91c1c;
}

.notification-list {
  display: grid;
  gap: 0.55rem;
  margin-top: 0.75rem;
}

.notification-card {
  padding: 0.7rem 0.75rem;
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--primary);
  border-radius: 9px;
  background: var(--bg-surface);
}

.notification-card.warning { border-left-color: #f59e0b; }
.notification-card.success { border-left-color: #16a34a; }
.notification-card.danger { border-left-color: #dc2626; }

.notification-item p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.82rem;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.notification-empty {
  padding: 1.2rem 0.5rem;
  color: var(--text-muted);
  font-size: 0.82rem;
  text-align: center;
}

.route-wrapper {
  min-height: calc(100vh - 72px);
}

.sidebar-arrow {
  position: fixed;
  left: calc(var(--sidebar-current-width) - 13px);
  top: 50%;
  transform: translateY(-50%);
  width: 26px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: var(--bg-surface);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
  z-index: 60;
  transition: left var(--transition-base), background var(--transition-fast);
}

.sidebar-arrow:hover {
  background: var(--primary-50);
}

.sidebar-arrow i {
  font-size: 0.75rem;
}

.desktop-collapse-zone {
  position: fixed;
  top: 0;
  bottom: 0;
  left: var(--sidebar-current-width);
  width: 16px;
  background: transparent;
  z-index: 55;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(82vw, 300px);
  transform: translateX(-105%);
  transition: transform var(--transition-base);
  z-index: 1050;
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.mobile-toggle {
  position: fixed;
  left: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: var(--bg-surface);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.15);
  z-index: 1060;
}

.mobile-toggle i {
  font-size: 0.75rem;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1040;
}

.sidebar-backdrop,
.mobile-sidebar,
.sidebar-arrow,
.content-topbar__menu {
  will-change: transform;
}

@media (max-width: 991.98px) {
  .content-area {
    height: 100vh;
    padding-top: 0.35rem;
  }

  .route-wrapper {
    min-height: calc(100vh - 64px);
  }

  .content-topbar {
    min-height: 64px;
    padding-block: 0.7rem;
  }
}

@media (min-width: 992px) {
  .mobile-sidebar,
  .mobile-toggle,
  .content-topbar__menu,
  .sidebar-backdrop {
    display: none;
  }
}

@media (max-width: 575.98px) {
  .content-topbar__status {
    display: none;
  }

  .content-topbar__title {
    font-size: 0.92rem;
  }
}
</style>

<template>
  <div class="dashboard-shell" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <aside v-if="isDesktop" class="desktop-sidebar">
      <SideMenu :collapsed="isSidebarCollapsed" @navigate="handleMenuNavigation" />
    </aside>

    <aside
      v-else
      id="mobile-navigation"
      class="mobile-sidebar"
      :class="{ open: isMobileSidebarOpen }"
      aria-label="Main navigation"
    >
      <SideMenu @navigate="closeMobileSidebar" />
    </aside>

    <button
      v-if="isDesktop && isSidebarCollapsed"
      class="sidebar-arrow"
      type="button"
      @click="toggleDesktopSidebar"
      aria-label="Expand sidebar"
      title="Expand sidebar"
    >
      <i class="bi bi-chevron-right"></i>
    </button>

    <div
      v-if="isDesktop && !isSidebarCollapsed"
      class="desktop-collapse-zone"
      @click="collapseDesktopSidebar"
    ></div>

    <div
      v-if="!isDesktop && isMobileSidebarOpen"
      class="sidebar-backdrop"
      @click="closeMobileSidebar"
    ></div>

    <main class="content-area">
      <header class="content-topbar">
        <div class="content-topbar__context">
          <button
            v-if="!isDesktop"
            class="content-topbar__menu"
            type="button"
            @click="toggleMobileSidebar"
            :aria-expanded="isMobileSidebarOpen"
            aria-controls="mobile-navigation"
            aria-label="Open navigation menu"
          >
            <i class="bi bi-list" aria-hidden="true"></i>
          </button>
          <div class="content-topbar__labels">
            <span class="content-topbar__kicker">DigitalHR workspace</span>
            <span class="content-topbar__title">{{ pageTitle }}</span>
          </div>
        </div>
        <div class="content-topbar__actions">
          <div v-if="currentUser._id" class="theme-switcher" role="group" aria-label="Workspace color theme">
            <button
              v-for="theme in themes"
              :key="theme.id"
              class="theme-switcher__swatch"
              :class="`theme-switcher__swatch--${theme.id}`"
              type="button"
              :aria-label="`${theme.name} theme`"
              :aria-pressed="currentTheme === theme.id"
              :title="theme.name"
              :disabled="isSavingTheme"
              @click="saveTheme(theme.id)"
            ></button>
          </div>
          <span class="content-topbar__status">Connected</span>
          <div v-if="currentUser._id" class="notification-menu">
            <button
              class="notification-trigger"
              type="button"
              :aria-expanded="isNotificationPanelOpen"
              aria-label="Open notifications"
              @click="toggleNotificationPanel"
            >
              <i class="bi bi-bell-fill" aria-hidden="true"></i>
              <span v-if="notifications.length" class="notification-count">
                {{ notifications.length > 99 ? '99+' : notifications.length }}
              </span>
            </button>

            <section v-if="isNotificationPanelOpen" class="notification-panel" aria-label="Notifications">
              <div class="notification-panel__header">
                <div>
                  <h2>Notifications</h2>
                  <small>{{ notifications.length }} unread</small>
                </div>
                <button class="notification-panel__close" type="button" aria-label="Close notifications" @click="isNotificationPanelOpen = false">
                  <i class="bi bi-x-lg" aria-hidden="true"></i>
                </button>
              </div>

              <template v-if="isAdminUser">
                <button
                  v-if="!isComposingBroadcast"
                  class="broadcast-launch"
                  type="button"
                  @click="openBroadcastForm"
                >
                  <i class="bi bi-megaphone-fill" aria-hidden="true"></i>
                  Create a broadcast
                </button>

                <form v-if="isComposingBroadcast" class="broadcast-form" @submit.prevent="sendBroadcast">
                  <div class="broadcast-heading mb-2">
                    <h3>New broadcast</h3>
                    <button class="notification-panel__close" type="button" aria-label="Cancel broadcast" @click="isComposingBroadcast = false">
                      <i class="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </div>
                  <label for="broadcastText">Message</label>
                  <textarea
                    id="broadcastText"
                    v-model="broadcastForm.text"
                    class="form-control"
                    rows="3"
                    maxlength="2000"
                    placeholder="Write an update for your audience"
                    required
                  ></textarea>

                  <label for="broadcastType">Type</label>
                  <select id="broadcastType" v-model="broadcastForm.type" class="form-select">
                    <option value="info">Information</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="danger">Urgent</option>
                  </select>

                  <label for="broadcastAudience">Audience</label>
                  <select id="broadcastAudience" v-model="broadcastForm.audienceType" class="form-select" @change="broadcastForm.audienceIds = []">
                    <option value="all_clients">All active clients</option>
                    <option value="departments">Departments</option>
                    <option value="roles">Roles</option>
                  </select>

                  <template v-if="broadcastForm.audienceType !== 'all_clients'">
                    <span class="broadcast-label">Select {{ broadcastForm.audienceType }}</span>
                    <div class="audience-options">
                      <label v-for="option in broadcastAudienceOptions" :key="option._id" class="audience-option">
                        <input v-model="broadcastForm.audienceIds" type="checkbox" :value="String(option._id)" />
                        <span>{{ option.name }}</span>
                      </label>
                      <div v-if="!broadcastAudienceOptions.length" class="notification-meta py-2">
                        No active {{ broadcastForm.audienceType }} are available.
                      </div>
                    </div>
                    <p v-if="broadcastForm.audienceType === 'departments'" class="broadcast-help mb-2">
                      Sends to members of these departments and clients assigned to them in Manage Clients.
                    </p>
                    <p v-else class="broadcast-help mb-2">
                      Sends to accounts with these roles and clients assigned those roles in Manage Clients. “Client accounts” targets every active client.
                    </p>
                  </template>

                  <button class="btn btn-primary btn-sm text-white broadcast-submit" type="submit" :disabled="isSendingBroadcast">
                    <span v-if="isSendingBroadcast" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                    {{ isSendingBroadcast ? 'Sending…' : 'Send broadcast' }}
                  </button>
                </form>
              </template>

              <div v-if="notificationFeedback" class="notification-feedback" :class="{ error: notificationFeedbackIsError }" role="status">
                {{ notificationFeedback }}
              </div>
              <div v-if="isLoadingNotifications" class="notification-empty" role="status">Loading notifications…</div>
              <div v-else-if="!notifications.length" class="notification-empty">You’re all caught up.</div>
              <div v-else class="notification-list">
                <article v-for="notification in notifications" :key="notification._id" class="notification-card" :class="notification.type">
                  <div class="notification-item">
                    <p>{{ notification.text }}</p>
                    <button class="notification-dismiss" type="button" aria-label="Dismiss notification" @click="dismissNotification(notification._id)">
                      <i class="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div class="notification-meta">{{ formatNotificationDate(notification.createDate) }}</div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </header>
      <div class="route-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import SideMenu from '../components/SideMenu.vue';
import axiosClient from '../axiosClient';

const DESKTOP_BREAKPOINT = 992;

const isDesktop = ref(true);
const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);
const route = useRoute();
const currentUser = ref({});
const themes = [
  { id: 'ocean', name: 'Ocean blue' },
  { id: 'forest', name: 'Evergreen' },
  { id: 'plum', name: 'Soft plum' },
];
const currentTheme = ref('ocean');
const isSavingTheme = ref(false);
const notifications = ref([]);
const roles = ref([]);
const departments = ref([]);
const isNotificationPanelOpen = ref(false);
const isLoadingNotifications = ref(false);
const isComposingBroadcast = ref(false);
const isSendingBroadcast = ref(false);
const notificationFeedback = ref('');
const notificationFeedbackIsError = ref(false);
const broadcastForm = reactive({
  text: '',
  type: 'info',
  audienceType: 'all_clients',
  audienceIds: [],
});

const isAdminUser = computed(() => ['admin', 'super_admin'].includes(currentUser.value?.roleType?.name));
const broadcastAudienceOptions = computed(() => {
  if (broadcastForm.audienceType === 'departments') return departments.value;
  if (broadcastForm.audienceType === 'roles') {
    const nonClientRoles = roles.value.filter((role) => String(role.name || '').toLowerCase() !== 'client');
    return [{ _id: 'client', name: 'Client accounts' }, ...nonClientRoles];
  }
  return [];
});

const pageTitle = computed(() => {
  const path = route.path;
  const titles = [
    [/^\/dashboard$/, 'Dashboard'],
    [/^\/reports/, 'Reports'],
    [/^\/setting$/, 'Settings'],
    [/^\/account$/, 'My account'],
    [/^\/manage\/users|^\/(add|update|view)\/user/, 'User management'],
    [/^\/manage\/clients|^\/(add|update|view)\/client|^\/documents/, 'Client management'],
    [/^\/manage\/employees|^\/(add|update|view)\/employee|^\/wage\//, 'Employee management'],
    [/^\/manage\/attendance|^\/employee\/attendance/, 'Attendance'],
    [/^\/(teams|role|department)$/, 'Organization'],
  ];

  return titles.find(([pattern]) => pattern.test(path))?.[1] || 'Workspace';
});

const applyTheme = (theme) => {
  const supportedTheme = themes.some((item) => item.id === theme) ? theme : 'ocean';
  currentTheme.value = supportedTheme;
  document.documentElement.dataset.cardTheme = supportedTheme;
};

const saveTheme = async (theme) => {
  if (theme === currentTheme.value || isSavingTheme.value) return;
  const previousTheme = currentTheme.value;
  isSavingTheme.value = true;
  applyTheme(theme);
  currentUser.value.theme = theme;
  try {
    const response = await axiosClient.put('/api/v1/user/theme', { theme });
    applyTheme(response.data.theme || theme);
    currentUser.value.theme = currentTheme.value;
  } catch (error) {
    applyTheme(previousTheme);
    currentUser.value.theme = previousTheme;
  } finally {
    isSavingTheme.value = false;
  }
};

const syncViewportState = () => {
  const desktopNow = window.innerWidth >= DESKTOP_BREAKPOINT;
  isDesktop.value = desktopNow;

  if (desktopNow) {
    isMobileSidebarOpen.value = false;
    return;
  }

  isSidebarCollapsed.value = false;
};

const toggleDesktopSidebar = () => {
  if (!isDesktop.value) return;
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const collapseDesktopSidebar = () => {
  if (!isDesktop.value) return;
  isSidebarCollapsed.value = true;
};

const toggleMobileSidebar = () => {
  if (isDesktop.value) return;
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false;
};

const handleMenuNavigation = () => {
  if (!isDesktop.value) {
    closeMobileSidebar();
  }
};

const loadNotifications = async () => {
  if (!currentUser.value?._id) return;
  isLoadingNotifications.value = true;
  try {
    const response = await axiosClient.get(`/api/v1/notification/getall/${currentUser.value._id}`);
    notifications.value = response.data.data || [];
  } catch (error) {
    notificationFeedback.value = error.response?.data?.message || 'Unable to load notifications.';
    notificationFeedbackIsError.value = true;
  } finally {
    isLoadingNotifications.value = false;
  }
};

const loadDashboardNotifications = async () => {
  if (!localStorage.getItem('token')) return;
  try {
    const response = await axiosClient.get('/api/v1/user/getCurrent/');
    currentUser.value = response.data.user || {};
    applyTheme(currentUser.value.theme);
    await loadNotifications();
    if (isAdminUser.value) {
      const [roleResponse, departmentResponse] = await Promise.all([
        axiosClient.get('/api/v1/role/getall'),
        axiosClient.get('/api/v1/department/getall'),
      ]);
      roles.value = roleResponse.data.data || [];
      departments.value = departmentResponse.data.data || [];
    }
  } catch (error) {
    notificationFeedback.value = error.response?.data?.message || 'Unable to load dashboard notifications.';
    notificationFeedbackIsError.value = true;
  }
};

const toggleNotificationPanel = async () => {
  isNotificationPanelOpen.value = !isNotificationPanelOpen.value;
  notificationFeedback.value = '';
  notificationFeedbackIsError.value = false;
  if (isNotificationPanelOpen.value) {
    await loadNotifications();
  }
};

const openBroadcastForm = () => {
  isComposingBroadcast.value = true;
  notificationFeedback.value = '';
  broadcastForm.text = '';
  broadcastForm.type = 'info';
  broadcastForm.audienceType = 'all_clients';
  broadcastForm.audienceIds = [];
};

const sendBroadcast = async () => {
  const text = broadcastForm.text.trim();
  if (!text) {
    notificationFeedback.value = 'Enter a message before sending.';
    notificationFeedbackIsError.value = true;
    return;
  }
  if (broadcastForm.audienceType !== 'all_clients' && !broadcastForm.audienceIds.length) {
    notificationFeedback.value = `Select at least one ${broadcastForm.audienceType.slice(0, -1)}.`;
    notificationFeedbackIsError.value = true;
    return;
  }

  isSendingBroadcast.value = true;
  notificationFeedback.value = '';
  notificationFeedbackIsError.value = false;
  try {
    const response = await axiosClient.post('/api/v1/notification/add', {
      text,
      type: broadcastForm.type,
      audience: {
        type: broadcastForm.audienceType,
        ids: broadcastForm.audienceIds,
      },
    });
    notificationFeedback.value = response.data.message || `Broadcast sent to ${response.data.recipientCount} account(s).`;
    isComposingBroadcast.value = false;
    broadcastForm.text = '';
  } catch (error) {
    notificationFeedback.value = error.response?.data?.message || 'Unable to send broadcast.';
    notificationFeedbackIsError.value = true;
  } finally {
    isSendingBroadcast.value = false;
  }
};

const dismissNotification = async (id) => {
  try {
    await axiosClient.put(`/api/v1/notification/dismiss/${id}`);
    notifications.value = notifications.value.filter((notification) => notification._id !== id);
  } catch (error) {
    notificationFeedback.value = error.response?.data?.message || 'Unable to dismiss notification.';
    notificationFeedbackIsError.value = true;
  }
};

const formatNotificationDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

onMounted(() => {
  syncViewportState();
  window.addEventListener('resize', syncViewportState);
  loadDashboardNotifications();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportState);
});
</script>
