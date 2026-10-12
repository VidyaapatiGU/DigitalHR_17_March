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
  background: var(--bg-body, #f1f5f9);
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
  background: var(--bg-body, #f1f5f9);
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
  background: rgba(241, 245, 249, 0.88);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
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
  background: #ffffff;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
  z-index: 60;
  transition: left var(--transition-base), background var(--transition-fast);
}

.sidebar-arrow:hover {
  background: #eff6ff;
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
  background: #ffffff;
  color: #0f172a;
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
        <span class="content-topbar__status">Connected</span>
      </header>
      <div class="route-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import SideMenu from '../components/SideMenu.vue';

const DESKTOP_BREAKPOINT = 992;

const isDesktop = ref(true);
const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);
const route = useRoute();

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

onMounted(() => {
  syncViewportState();
  window.addEventListener('resize', syncViewportState);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportState);
});
</script>
