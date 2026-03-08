<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.side_bar {
  width: var(--sidebar-width, 260px);
  flex-shrink: 0;
}

.content-area {
  background: var(--bg-body, #f1f5f9);
  min-height: 100vh;
}

@media (max-width: 576px) {
}

@media (min-width: 576px) {
}

@media (min-width: 768px) {
}

@media (min-width: 992px) {
}

@media (min-width: 1200px) {
}
</style>

<template>
  <div>
    <div class="d-flex vh-100 overflow-hidden">
      <div class="side_bar vh-100 d-none d-sm-block py-0 px-0">
        <SideMenu class="" />
      </div>
      <div class="content-area w-100 h-100 overflow-y-hidden">
        <div class="h-100">
          <div class="h-100">
            <router-view class="h-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '../components/SideBar.vue';
import Reports from '../pages/Reports/Reports.vue';
import SideMenu from '../components/SideMenu.vue';
import NavAndSideBar from '../components/NavAndSideBar.vue';
import Footer from '../components/Footer.vue';
</script>
