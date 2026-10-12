<script setup>
</script>

<template>
  <div class="hind-regular main">
    <div class="router h-100">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.main {
  min-height: 100vh;
}
</style>
