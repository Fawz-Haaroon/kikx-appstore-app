<template>
  <div
    class="relative flex-1 flex flex-col overflow-hidden bg-base-100 text-base-content"
  >
    <!-- View Toggle -->
    <button
      @click="displayJson = !displayJson"
      class="absolute z-10 top-3 right-3 btn btn-xs btn-ghost border border-base-300 bg-base-100/90"
    >
      {{ displayJson ? "UI" : "JSON" }}
    </button>

    <!-- Hero -->

    <div class="border-b border-base-200 bg-base-100">
      <div class="p-2 pr-16">
        <div class="flex items-center gap-2">
          <!-- App Icon -->
          <div
            class="size-20 shrink-0 rounded-2xl border border-base-200 bg-base-200/50 p-1 shadow-sm"
          >
            <img
              class="size-full rounded-xl object-cover"
              :src="iconUrl || getAppIcon(manifest.icon, manifest.name)"
              :alt="manifest.title"
            />
          </div>

          <!-- App Info -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h1 class="truncate text-xl font-semibold tracking-tight">
                {{ manifest.title }}
              </h1>
            </div>

            <p v-if="manifest.author" class="mt-1 text-sm text-base-content/60">
              {{ manifest.author }}
            </p>

            <p
              v-if="manifest.name"
              class="mt-1 truncate text-xs text-base-content/40"
            >
              {{ manifest.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- App Metadata -->
      <div class="grid grid-cols-3 border-t border-base-200 bg-base-50">
        <div class="border-r border-base-200 px-3 py-3 text-center">
          <p class="truncate text-sm font-semibold">
            {{ manifest.version }}
          </p>

          <p class="mt-0.5 text-xs text-base-content/50">Version</p>
        </div>

        <div class="border-r border-base-200 px-3 py-3 text-center">
          <p class="truncate text-sm font-semibold">
            {{ manifest.kikx_version }}
          </p>

          <p class="mt-0.5 text-xs text-base-content/50">KIKX Version</p>
        </div>

        <div class="px-3 py-3 text-center">
          <p class="truncate text-sm font-semibold">
            {{ manifest.services?.length || 0 }}
          </p>

          <p class="mt-0.5 text-xs text-base-content/50">Services</p>
        </div>
      </div>

      <!-- Sudo Warning -->
      <div
        v-if="manifest.sudo"
        class="m-2 flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 p-2 text-xs text-error"
      >
        <span class="font-semibold"> Elevated access </span>

        <span class="text-error/70"> This app uses sudo privileges. </span>
      </div>
    </div>

    <!-- JSON -->

    <pre
      v-if="displayJson"
      class="flex-1 overflow-auto bg-base-200/30 p-2 text-xs leading-relaxed"
      >{{ JSON.stringify(manifest, null, 2) }}</pre
    >

    <!-- Information -->

    <div v-else class="flex-1 overflow-y-auto bg-base-50 p-2">
      <!-- About -->
      <section
        v-if="manifest.description"
        class="mb-2 rounded-xl border border-base-200 bg-base-100 p-2"
      >
        <h2
          class="mb-2 text-xs font-semibold uppercase tracking-wider text-base-content/50"
        >
          About
        </h2>

        <p class="text-sm leading-6 text-base-content/75">
          {{ manifest.description }}
        </p>
      </section>

      <!-- Iframe -->

      <section
        v-if="iframeSecurity.length || iframeSettings.length"
        class="mb-3 rounded-xl border border-base-200 bg-base-100 p-2"
      >
        <div class="mb-4">
          <h2 class="text-sm font-semibold">Iframe</h2>

          <p class="mt-0.5 text-xs text-base-content/50">
            Browser security and iframe configuration
          </p>
        </div>

        <!-- Security -->
        <div v-if="iframeSecurity.length">
          <div class="mb-2 text-[11px] font-medium text-base-content/50">
            Security
          </div>

          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="name in iframeSecurity"
              :key="name"
              class="badge badge-sm border-info/20 bg-info/10"
            >
              {{ name }}
            </span>
          </div>
        </div>

        <!-- Settings -->
        <div v-if="iframeSettings.length" class="mt-4">
          <div class="mb-2 text-[11px] font-medium text-base-content/50">
            Settings
          </div>

          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="name in iframeSettings"
              :key="name"
              class="badge badge-sm border-base-300 bg-base-100 text-xs"
            >
              {{ name }}
            </span>
          </div>
        </div>

        <!-- Navigation -->
        <div
          v-if="manifest.iframe?.canGoBack !== undefined"
          class="mt-4 flex items-center justify-between rounded-md bg-base-200/40 px-2.5 py-2"
        >
          <div>
            <div class="text-xs font-medium">Navigation history</div>

            <div class="text-[10px] text-base-content/45">
              Allows app to navigate back
            </div>
          </div>

          <span
            class="badge badge-xs"
            :class="manifest.iframe.canGoBack ? 'badge-success' : 'badge-ghost'"
          >
            {{ manifest.iframe.canGoBack ? "Enabled" : "Disabled" }}
          </span>
        </div>
      </section>

      <!-- System Access -->
      <section
        v-if="accessList.length"
        class="mb-2 rounded-xl border border-base-200 bg-base-100 p-2"
      >
        <div class="mb-3">
          <h2 class="text-sm font-semibold">System Access</h2>

          <p class="mt-0.5 text-xs text-base-content/50">
            System capabilities requested by this application
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="name in accessList"
            :key="name"
            class="badge badge-sm border-primary/20 bg-primary/5 text-primary"
          >
            {{ name }}
          </span>
        </div>
      </section>
      
      <!-- Services -->
      <section
        v-if="manifest.services?.length"
        class="mb-2 rounded-xl border border-base-200 bg-base-100 p-2"
      >
        <div class="mb-2">
          <h2 class="text-sm font-semibold">Services</h2>
          <p class="mt-0.5 text-xs text-base-content/50">
            Services used by this application
          </p>
        </div>

        <div class="space-y-2">
          <div
            v-for="service in manifest.services"
            :key="service"
            class="overflow-hidden rounded-lg border border-base-200"
          >
            <!-- Service Header -->
            <div
              class="flex items-center justify-between border-b border-base-200 p-2"
            >
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md bg-base-200 text-xs font-semibold"
                >
                  {{ getServiceIcon(service) }}
                </div>

                <span class="text-sm font-medium">
                  {{ service }}
                </span>
              </div>

              <span class="badge badge-xs badge-success"> enabled </span>
            </div>

            <!-- FS -->
            <div
              v-if="service === 'fs' && manifest.service_config?.fs"
              class="p-3"
            >
              <div class="mb-2 text-[11px] font-medium text-base-content/50">
                Filesystem access
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="(value, name) in manifest.service_config.fs"
                  :key="name"
                  class="flex items-center justify-between gap-2 rounded-md bg-base-200/40 px-2.5 py-2"
                >
                  <span class="text-xs">
                    {{ name }}
                  </span>

                  <span
                    class="badge badge-xs"
                    :class="getPermissionBadge(value)"
                  >
                    {{ value }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Tasker -->
            <div
              v-else-if="
                service === 'tasker' && manifest.service_config?.tasker
              "
              class="p-3"
            >
              <div class="mb-3 text-[11px] font-medium text-base-content/50">
                Task configuration
              </div>

              <div class="space-y-2">
                <!-- Shell -->
                <div
                  class="flex items-center justify-between gap-3 rounded-md bg-base-200/40 px-2.5 py-2"
                >
                  <div class="min-w-0">
                    <div class="text-xs font-medium">Shell access</div>

                    <div class="text-[10px] text-base-content/45">
                      Allows tasks to use the system shell
                    </div>
                  </div>

                  <span
                    class="badge badge-xs shrink-0"
                    :class="
                      manifest.service_config.tasker.shell
                        ? 'badge-warning'
                        : 'badge-ghost'
                    "
                  >
                    {{
                      manifest.service_config.tasker.shell
                        ? "Enabled"
                        : "Disabled"
                    }}
                  </span>
                </div>

                <!-- KIKX Env -->
                <div
                  class="flex items-center justify-between gap-3 rounded-md bg-base-200/40 px-2.5 py-2"
                >
                  <div class="min-w-0">
                    <div class="text-xs font-medium">KIKX environment</div>

                    <div class="text-[10px] text-base-content/45">
                      Exposes KIKX environment variables
                    </div>
                  </div>

                  <span
                    class="badge badge-xs shrink-0"
                    :class="
                      manifest.service_config.tasker.kikx_env
                        ? 'badge-success'
                        : 'badge-ghost'
                    "
                  >
                    {{
                      manifest.service_config.tasker.kikx_env
                        ? "Enabled"
                        : "Disabled"
                    }}
                  </span>
                </div>

                <!-- Sandbox -->
                <div
                  class="flex items-center justify-between gap-3 rounded-md bg-base-200/40 px-2.5 py-2"
                >
                  <div class="min-w-0">
                    <div class="text-xs font-medium">Program sandbox</div>

                    <div class="text-[10px] text-base-content/45">
                      Runs tasks in a sandboxed environment
                    </div>
                  </div>

                  <span
                    class="badge badge-xs shrink-0"
                    :class="
                      manifest.service_config.tasker.sandbox
                        ? 'badge-info'
                        : 'badge-ghost'
                    "
                  >
                    {{
                      manifest.service_config.tasker.sandbox
                        ? "Enabled"
                        : "Disabled"
                    }}
                  </span>
                </div>

                <!-- Environment Variables -->
                <div
                  v-if="
                    Object.keys(manifest.service_config.tasker.env ?? {}).length
                  "
                  class="rounded-md bg-base-200/40 px-2.5 py-2"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div>
                      <div class="text-xs font-medium">
                        Environment variables
                      </div>

                      <div class="text-[10px] text-base-content/45">
                        Custom variables supplied to tasks
                      </div>
                    </div>

                    <span class="badge badge-xs badge-neutral">
                      {{
                        Object.keys(manifest.service_config.tasker.env ?? {})
                          .length
                      }}
                    </span>
                  </div>

                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span
                      v-for="name in Object.keys(
                        manifest.service_config.tasker.env ?? {}
                      )"
                      :key="name"
                      class="badge badge-xs badge-outline"
                    >
                      {{ name }}
                    </span>
                  </div>
                </div>

                <!-- Main Command -->
                <div
                  v-if="manifest.service_config.tasker.main"
                  class="rounded-md border border-base-200 bg-base-200/30 p-2.5"
                >
                  <div
                    class="mb-1 text-[10px] font-medium uppercase tracking-wide text-base-content/45"
                  >
                    Task command
                  </div>

                  <code
                    class="block overflow-x-auto whitespace-nowrap rounded bg-base-300/40 px-2 py-1.5 text-[10px] text-base-content/70"
                  >
                    {{ manifest.service_config.tasker.main }}
                  </code>
                </div>
              </div>
            </div>

            <!-- Micro -->
            <div
              v-else-if="service === 'micro' && manifest.service_config?.micro"
              class="p-3.5"
            >
              <h3 class="mb-3 text-xs font-semibold text-base-content/60">
                Micro configuration
              </h3>

              <div class="space-y-3">
                <article
                  v-for="(config, name) in manifest.service_config.micro"
                  :key="name"
                  class="overflow-hidden rounded-lg border border-base-200"
                >
                  <!-- Micro name -->
                  <div
                    class="flex items-center justify-between gap-3 border-b border-base-200 px-3 py-3"
                  >
                    <div class="min-w-0">
                      <h4 class="truncate text-sm font-semibold">
                        {{ name }}
                      </h4>

                      <p class="mt-0.5 text-xs text-base-content/50">
                        Micro service
                      </p>
                    </div>
                  </div>

                  <!-- Main -->
                  <div class="space-y-2.5 p-3">
                    <div
                      class="flex items-center justify-between gap-3 rounded-md bg-base-200/40 px-3 py-2.5"
                    >
                      <div class="min-w-0">
                        <h4 class="text-sm font-medium">Main file</h4>

                        <p class="mt-0.5 text-xs text-base-content/50">
                          Entry point for this micro service
                        </p>
                      </div>

                      <code
                        class="max-w-[55%] truncate rounded bg-base-300/50 px-2 py-1 text-xs"
                      >
                        {{ config.main }}
                      </code>
                    </div>

                    <!-- Stdout -->
                    <div
                      class="flex items-center justify-between gap-3 rounded-md bg-base-200/40 px-3 py-2.5"
                    >
                      <div class="min-w-0">
                        <h4 class="text-sm font-medium">Capture stdout</h4>

                        <p class="mt-0.5 text-xs text-base-content/50">
                          Captures and saves standard output
                        </p>
                      </div>

                      <span
                        class="badge badge-sm shrink-0"
                        :class="config.stdout ? 'badge-success' : 'badge-ghost'"
                      >
                        {{ config.stdout ? "Enabled" : "Disabled" }}
                      </span>
                    </div>

                    <!-- Persistent -->
                    <div
                      class="flex items-center justify-between gap-3 rounded-md bg-base-200/40 px-3 py-2.5"
                    >
                      <div class="min-w-0">
                        <h4 class="text-sm font-medium">Persistent</h4>

                        <p class="mt-0.5 text-xs text-base-content/50">
                          Keeps the micro service running persistently
                        </p>
                      </div>

                      <span
                        class="badge badge-sm shrink-0"
                        :class="
                          config.persistent ? 'badge-info' : 'badge-ghost'
                        "
                      >
                        {{ config.persistent ? "Enabled" : "Disabled" }}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <!-- Unknown / No Configuration -->
            <div v-else class="px-3 py-2.5 text-xs text-base-content/40">
              No additional configuration
            </div>
          </div>
        </div>
      </section>

      <!-- Source -->

      <section
        v-if="manifest.source && manifest.source !== 'local'"
        class="rounded-xl border border-base-200 bg-base-100 p-2"
      >
        <div class="mb-3">
          <h2 class="text-sm font-semibold">Source</h2>

          <p class="mt-0.5 text-xs text-base-content/50">
            Application source repository
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- GitHub Icon -->
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-base-200 bg-base-200/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 1024 1024"
            >
              <path d="M0 0h1024v1024H0z" fill="none" />
              <path
                fill="currentColor"
                d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5C64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9c26.4 39.1 77.9 32.5 104 26c5.7-23.5 17.9-44.5 34.7-60.8c-140.6-25.2-199.2-111-199.2-213c0-49.5 16.3-95 48.3-131.7c-20.4-60.5 1.9-112.3 4.9-120c58.1-5.2 118.5 41.6 123.2 45.3c33-8.9 70.7-13.6 112.9-13.6c42.4 0 80.2 4.9 113.5 13.9c11.3-8.6 67.3-48.8 121.3-43.9c2.9 7.7 24.7 58.3 5.5 118c32.4 36.8 48.9 82.7 48.9 132.3c0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9c177.1-59.7 304.6-227 304.6-424.1c0-247.2-200.4-447.3-447.5-447.3"
              />
            </svg>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="truncate text-sm font-semibold">
                {{ manifest.source.owner }}/{{ manifest.source.repo }}
              </span>

              <span
                v-if="manifest.source.tag"
                class="badge badge-xs border-primary/20 bg-primary/5 text-primary"
              >
                {{ manifest.source.tag }}
              </span>
            </div>

            <div
              v-if="manifest.source.url"
              class="mt-1 truncate text-xs text-base-content/40"
            >
              {{ manifest.source.url }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import { getAppIcon } from "@/api/config";

  const props = defineProps({
    manifest: {
      type: Object,
      required: true
    },

    isSystemApp: {
      type: Boolean,
      default: false
    },

    iconUrl: {
      type: String,
      required: false
    }
  });

  const displayJson = ref(false);

  /*
|--------------------------------------------------------------------------
| System Access
|--------------------------------------------------------------------------
*/

  const accessList = computed(() => [
    ...(props.manifest?.system?.access ?? [])
  ]);

  /*
|--------------------------------------------------------------------------
| Iframe
|--------------------------------------------------------------------------
*/

  const iframe = computed(() => props.manifest?.iframe ?? {});

  const iframeSecurity = computed(() => [
    ...(iframe.value.allowfullscreen ? ["allowfullscreen"] : []),

    ...(iframe.value.sandbox ?? [])
  ]);

  const iframeSettings = computed(() => [
    ...(iframe.value.allow ?? []),

    ...(iframe.value.loading ? [`loading: ${iframe.value.loading}`] : []),

    ...(iframe.value.referrerpolicy
      ? [`referrerpolicy: ${iframe.value.referrerpolicy}`]
      : [])
  ]);

  /*
|--------------------------------------------------------------------------
| Permission Styling
|--------------------------------------------------------------------------
*/

  const getPermissionBadge = value => {
    switch (value) {
      case "read-write":
        return "badge-error";

      case "write":
        return "badge-warning";

      case "read":
        return "badge-info";

      case "none":
      default:
        return "badge-ghost";
    }
  };

  /*
|--------------------------------------------------------------------------
| Service Icon
|--------------------------------------------------------------------------
*/

  const getServiceIcon = service => {
    switch (service) {
      case "fs":
        return "FS";

      case "kv":
        return "KV";

      case "os":
        return "OS";

      case "micro":
        return "MC";

      case "proxy":
        return "PX";

      case "tasker":
        return "TK";

      default:
        return service?.charAt(0)?.toUpperCase() || "?";
    }
  };
</script>
