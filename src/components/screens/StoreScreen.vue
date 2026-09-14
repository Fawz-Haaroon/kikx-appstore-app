<template>
  <div class="flex-1 flex flex-col gap-2 py-2 overflow-y-auto">
    <!-- Mobile Container -->
    <div class="flex-1 flex flex-col bg-base-100 overflow-hidden">
      <!-- App List Section -->
      <div class="p-2">
        <input
          v-model="search"
          class="input input-sm rounded-lg w-full focus:outline-none"
          placeholder="Search..."
        />
      </div>

      <div class="flex-1 p-2 flex flex-col gap-2 overflow-y-auto scroll-smooth">
        <AppCardSmall
          v-for="app in filteredApps"
          :key="app.name"
          :app
          :icon="getIconUrl(app.icon)"
          :isUrl="true"
          @click="selectApp(app)"
        />
      </div>
    </div>

    <Transition name="fade-scale">
      <InstallerPanel
        v-if="showInstaller && assetData"
        :assetData="assetData"
        @close="closeInstaller"
      />
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount } from "vue";
  import { REPO_BASE_URL, getIconUrl } from "@/api/config";

  import AppCardSmall from "@/components/AppCardSmall.vue";

  import AppManagePanel from "@/components/panels/AppManagePanel.vue";
  import InstallerPanel from "@/components/panels/InstallerPanel.vue";

  const emit = defineEmits(["changeScreen"]);

  // Search model
  const search = ref("");
  const appsIndex = ref([]);

  const selectedApp = ref(null);

  const loading = ref(true);
  const showInstaller = ref(false);

  const assetData = computed(
    () =>
      selectedApp.value?.url && `https://github.com/${selectedApp.value.url}`
  );

  function selectApp(app) {
    selectedApp.value = app;
    showInstaller.value = true;
  }

  async function closeInstaller(success = false) {
    showInstaller.value = false;
    selectedApp.value = null;

    if (success) {
      emit("changeScreen", "apps");
    }
  }

  const filteredApps = computed(() => {
    if (!search.value) return appsIndex.value?.apps;

    const query = search.value.toLowerCase().trim();

    return appsIndex.value?.apps.filter(app =>
      [app.title, app.name, app.category, app.author].some(field =>
        field?.toString().toLowerCase().includes(query)
      )
    );
  });

  async function fetchIndex() {
    const response = await fetch(REPO_BASE_URL + "index.json");

    if (!response.ok) {
      throw new Error("Failed to fetch index.json");
    }

    loading.value = false;

    return await response.json();
  }

  onBeforeMount(async () => {
    appsIndex.value = await fetchIndex();
  });
</script>
