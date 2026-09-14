<template>
  <div class="bg-base-100 fixed fullscreen inset-0 z-60 flex flex-col gap-2">
    <Header
      v-if="appInfo"
      :title="appInfo.manifest.title"
      @close="emit('close')"
    />

    <AppManifest
      v-if="appInfo"
      :manifest="appInfo.manifest"
      :isSystemApp="isSystemApp"
    />

    <Loading v-if="loading" label="Uninstalling" />
    <div v-else>
      <div
        v-if="errorText"
        class="p-2 py-4 bg-base-200 text-lg flex items-center justify-center"
      >
        <h1 class="font-semibold text-error text-sm">{{ errorText }}</h1>
      </div>
      <div v-else class="p-2 pb-4">
        <label class="w-full flex justify-center label cursor-pointer p-2">
          <input
            type="checkbox"
            v-model="keepData"
            class="checkbox checkbox-primary checkbox-sm"
          />
          <span class="label-text">Keep Data</span>
        </label>
        <SlideButton
          @complete="uninstallApp"
          label="Slide to uninstall"
          color="error"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount } from "vue";
  import { kpm } from "@/api";

  import AppManifest from "@/components/AppManifest.vue";
  import SlideButton from "@/components/ui/SlideButton.vue";

  import Header from "@/components/ui/Header.vue";
  import Loading from "@/components/ui/Loading.vue";

  const props = defineProps({
    appName: {
      type: String,
      required: true
    }
  });
  const emit = defineEmits(["close"]);

  const appInfo = ref(null);
  const loading = ref(false);
  const errorText = ref(null);
  const keepData = ref(false);

  const isSystemApp = computed(() => appInfo.value?.meta.system);

  async function fetchAppInfo() {
    const { data, error } = await kpm.getAppInfo(props.appName);
    if (error) {
      throw new Error(error.detail);
    }

    appInfo.value = data;
  }

  async function uninstallApp() {
    try {
      errorText.value = null;
      loading.value = true;

      await kpm.uninstallApp(props.appName, keepData.value);

      emit("close");
    } catch (err) {
      errorText.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  }

  onBeforeMount(fetchAppInfo);
</script>
