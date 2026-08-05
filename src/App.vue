<script setup>
  import { ref, onBeforeMount } from "vue";
  import { app } from "@/api";

  import BottomNavigation from "@/components/BottomNavigation.vue";
  import Loading from "@/components/Loading.vue";

  import HomeScreen from "@/components/screens/HomeScreen.vue";
  import InstallScreen from "@/components/screens/InstallScreen.vue";
  import AppsScreen from "@/components/screens/AppsScreen.vue";

  // Init loading
  const loading = ref(true);

  // Active Screen [ home / install / apps ]
  const currentScreen = ref("install");
  const invokeAppUrl = ref(null);

  // Chane active screen
  function changeScreen(name) {
    currentScreen.value = name;
  }

  // Init
  async function init() {
    const info = await app.fetchAppInfo();
    const url = info.options.query.url;

    // Open github link
    if (url && typeof url === "string") {
      invokeAppUrl.value = url;
    }

    loading.value = false;
  }

  onBeforeMount(init);
</script>

<template>
  <div data-theme="light" class="h-dvh flex flex-col overflow-hidden">
    <!-- Title -->
    <div
      class="py-3 flex gap-1 items-center px-2 bg-base-100 text-base-content shadow font-bold text-lg"
    >
      <img src="@/assets/icon.png" class="w-6 aspect-square" />
      <h1>AppStore</h1>
    </div>

    <Loading v-if="loading" />
    <!-- Screens -->
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <HomeScreen
        v-if="currentScreen === 'home'"
        @changeScreen="changeScreen"
      />
      <InstallScreen
        v-if="currentScreen === 'install'"
        :invokeAppUrl="invokeAppUrl"
        @changeScreen="changeScreen"
      />
      <AppsScreen v-if="currentScreen === 'apps'" />
    </div>
    <!-- Bottom Navigation -->
    <BottomNavigation
      :currentScreen="currentScreen"
      @changeScreen="changeScreen"
    />
  </div>
</template>

<style scoped></style>
