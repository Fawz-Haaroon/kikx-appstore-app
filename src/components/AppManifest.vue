<template>
  <div class="relative flex-1 flex flex-col overflow-hidden">
    <div
      @click="displayJson = !displayJson"
      class="absolute w-12 top-2 right-2 btn btn-xs btn-info"
    >
      {{ displayJson ? "UI" : "Json" }}
    </div>
    <!-- Hero Section -->
    <div>
      <div class="p-2 flex gap-2 items-start">
        <!-- Icon -->
        <div class="w-24 h-24 flex items-center justify-center">
          <img
            class="w-20 h-20 rounded-lg"
            :src="iconUrl || getAppIcon(manifest.icon, manifest.name)"
          />
        </div>
        <!-- App Info -->
        <div class="flex-1 pt-2">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ manifest.title }}
          </h1>
          <div class="font-medium">
            {{ manifest.author }}
          </div>
          <p class="text-xs opacity-50 mt-1 space-x-1">
            {{ manifest.name }}
            <span v-if="isSystemApp()">( system )</span>
          </p>
        </div>
      </div>
      <!-- Key Info Grid -->
      <div
        class="shadow-lg grid grid-cols-3 gap-4 text-center bg-primary p-2 text-primary-content"
      >
        <div>
          <p class="text-lg font-semibold truncate">
            {{ manifest.version }}
          </p>
          <p class="text-xs opacity-50">Version</p>
        </div>
        <div>
          <p class="text-lg font-semibold truncate">
            {{ manifest.category || manifest.theme }}
          </p>
          <p class="text-xs opacity-50">
            {{ manifest.category ? "Category" : "Theme" }}
          </p>
        </div>
        <div>
          <p class="text-lg font-semibold truncate">
            {{ manifest.author }}
          </p>
          <p class="text-xs opacity-50">Author</p>
        </div>
      </div>
      <!-- Sudo -->
      <div
        v-if="manifest.sudo"
        class="my-2 p-2 bg-error text-error-content text-center opacity-80"
      >
        This app uses sudo privileges.
      </div>
    </div>
    <!-- Json -->
    <pre v-if="displayJson" class="text-sm overflow-auto">{{ manifest }}</pre>
    <!-- Information Section -->
    <div v-else class="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
      <!-- About -->
      <p
        v-if="manifest.description"
        class="text-sm leading-relaxed opacity-80 text-center line-clamp-6"
      >
        {{ manifest.description }}
      </p>
      <!-- Storage access -->
      <div>
        <div class="divider m-0">Storage</div>
        <div class="mt-1 flex gap-2 flex-wrap">
          <div
            v-for="(value, name) in manifest.storage"
            class="badge badge-sm"
            :class="getStorageBadge(value)"
          >
            {{ name }} {{ value ?? "" }}
          </div>
        </div>
      </div>
      <!-- Access -->
      <div v-if="accessList.length">
        <div class="divider m-0">Access</div>
        <div class="mt-2 flex gap-2 flex-wrap">
          <div v-for="name in accessList" class="badge badge-sm badge-primary">
            {{ name }}
          </div>
        </div>
      </div>
      <!-- Services -->
      <div v-if="servicesList.length">
        <div class="divider m-0">Services</div>
        <div class="mt-2 flex gap-2 flex-wrap">
          <div
            v-for="name in servicesList"
            class="badge badge-sm badge-primary"
          >
            {{ name }}
          </div>
        </div>
      </div>
      <!-- Iframe -->
      <div v-if="iframeList.length">
        <div class="divider m-0">Iframe</div>
        <div class="mt-2 flex gap-2 flex-wrap">
          <div v-for="name in iframeList" class="badge badge-sm badge-primary">
            {{ name }}
          </div>
        </div>
      </div>
      <!-- Source -->
      <div v-if="manifest.source && manifest.source !== 'local'">
        <div class="divider my-2">Source</div>

        <div class="card card-compact bg-base-200 border border-base-300">
          <div class="card-body">
            <div class="flex items-center gap-3">
              <!-- GitHub icon -->
              <div
                class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-base-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-5"
                >
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167
              6.839 9.489.5.092.682-.217.682-.483
              0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.342
              -3.369-1.342-.455-1.155-1.11-1.463-1.11-1.463
              -.908-.62.069-.608.069-.608 1.004.07
              1.532 1.03 1.532 1.03.892 1.529 2.341 1.087
              2.91.832.092-.647.35-1.087.636-1.338
              -2.22-.253-4.555-1.11-4.555-4.943
              0-1.091.39-1.984 1.03-2.683-.103-.253-.446-1.27.098-2.647
              0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844
              a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.748-1.025
              2.748-1.025.546 1.377.202 2.394.1 2.647.64.699
              1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566
              4.935.359.309.678.919.678 1.852 0 1.336-.012
              2.414-.012 2.743 0 .268.18.58.688.482A10.001
              10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z"
                  />
                </svg>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-semibold">
                    {{ manifest.source.owner }}/{{ manifest.source.repo }}
                  </span>

                  <span
                    v-if="manifest.source.tag"
                    class="badge badge-sm badge-primary font-mono"
                  >
                    {{ manifest.source.tag }}
                  </span>
                </div>

                <div class="mt-1 block truncate text-sm text-base-content/60">
                  {{ manifest.source.url }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { getAppIcon } from "@/api/config";

  const { manifest, iconUrl, isSystemApp } = defineProps([
    "manifest",
    "iconUrl",
    "isSystemApp"
  ]);

  const displayJson = ref(false);

  const getStorageBadge = value => {
    if (value === "*") return "badge-error";
    if (value === "write") return "badge-secondary";
    if (value === "read") return "badge-info";
    return "badge-primary opacity-30";
  };

  const servicesList = [
    ...(manifest?.proxy ? ["proxy"] : []),
    ...(manifest?.os ? ["os"] : []),
    ...(manifest?.kv ? ["kv"] : []),
    ...(manifest?.micro ? ["micro"] : []),
    ...(manifest?.tasker ? ["tasker"] : [])
  ];

  const accessList = [...(manifest?.system?.access ?? [])];

  const iframeList = [
    ...(manifest?.iframe?.allowfullscreen ? ["allowfullscreen"] : []),
    ...(manifest?.iframe?.sandbox ?? []),
    ...(manifest?.iframe?.allow ?? []),
    ...(manifest?.iframe?.loading ? [manifest.iframe.loading] : []),
    ...(manifest?.iframe?.referrerpolicy
      ? [manifest.iframe.referrerpolicy]
      : [])
  ];
</script>
