<style scoped>
.dashboard-shell {
  --sidebar-expanded-width: clamp(240px, 20vw, 280px);
  --sidebar-collapsed-width: 84px;
  --sidebar-current-width: var(--sidebar-expanded-width);
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
  height: 100vh;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  transition: width var(--transition-base), min-width var(--transition-base);
  z-index: 30;
}

.content-area {
  min-width: 0;
  flex: 1;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-body, #f1f5f9);
}

.route-wrapper {
  min-height: 100vh;
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

@media (max-width: 991.98px) {
  .content-area {
    padding-top: 0.35rem;
  }
}

@media (min-width: 992px) {
  .mobile-sidebar,
  .mobile-toggle,
  .sidebar-backdrop {
    display: none;
  }
}
</style>

<template>
  <div class="dashboard-shell" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <aside v-if="isDesktop" class="desktop-sidebar">
      <SideMenu :collapsed="isSidebarCollapsed" @navigate="handleMenuNavigation" />
    </aside>

    <aside v-else class="mobile-sidebar" :class="{ open: isMobileSidebarOpen }">
      <SideMenu @navigate="closeMobileSidebar" />
    </aside>

    <button
      v-if="!isDesktop && !isMobileSidebarOpen"
      class="mobile-toggle"
      type="button"
      @click="toggleMobileSidebar"
      aria-label="Open sidebar"
      title="Open sidebar"
    >
      <i class="bi bi-chevron-right"></i>
    </button>

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
      <div class="route-wrapper">
        <router-view class="h-100" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import SideMenu from '../components/SideMenu.vue';

const DESKTOP_BREAKPOINT = 992;

const isDesktop = ref(true);
const isSidebarCollapsed = ref(false);
const isMobileSidebarOpen = ref(false);

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
