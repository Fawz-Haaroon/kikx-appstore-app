<template>
  <div class="bg-base-100 fixed fullscreen inset-0 z-60 flex flex-col gap-2">
    <Header :title="manifest.title" :close="onClose" />

    <AppManifest
      :manifest="manifest"
      :uninstallApp="uninstallApp"
      :isSystemApp="isSystemApp"
    />

    <Loading v-if="loading" label="Uninstalling" />
    <div v-else>
      <div
        v-if="errorText"
        class="p-2 py-6 bg-base-200 text-lg flex items-center justify-center"
      >
        <h1 class="font-semibold text-error text-sm">{{ errorText }}</h1>
      </div>
      <div v-else class="p-2 pb-4">
        <label class="w-full flex justify-center label cursor-pointer p-2">
          <input
            type="checkbox"
            v-model="keepData"
            class="checkbox checkbox-primary"
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
  import { ref } from "vue";
  import { app } from "@/api";

  import AppManifest from "@/components/AppManifest.vue";
  import SlideButton from "@/components/SlideButton.vue";

  import Header from "@/components/ui/Header.vue";
  import Loading from "@/components/ui/Loading.vue";

  const props = defineProps(["manifest", "systemApps"]);
  const emit = defineEmits(["close"]);

  const loading = ref(false);
  const errorText = ref(null);
  const keepData = ref(false);

  const isSystemApp = () => props.systemApps.includes(props.manifest.name);

  function onClose() {
    emit("close");
  }

  async function uninstallApp() {
    try {
      errorText.value = null;
      loading.value = true;

      const res = await app.system.request(
        `app/uninstall?app_name=${props.manifest.name}&keep_data=${keepData.value}`,
        "DELETE"
      );

      if (!res.ok) {
        throw new Error(res.error.detail);
      }
      onClose();
    } catch (err) {
      errorText.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  }
</script>
