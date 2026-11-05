<script setup>
import { ref, onMounted } from "vue";
import { getSiteSettings } from "../api/siteSettings";

const settings = ref({
  site_name: "RoamNePura",
  contact_email: "",
  contact_phone: "",
  address: "",
  description: "",
  facebook_url: "",
  instagram_url: "",
  tiktok_url: "",
  youtube_url: "",
});

const currentYear = new Date().getFullYear();

async function loadSettings() {
  try {
    const response = await getSiteSettings();
    const data = response.data.settings || response.data;

    settings.value = {
      site_name: data.site_name || "RoamNePura",
      contact_email: data.contact_email || "",
      contact_phone: data.contact_phone || "",
      address: data.address || "",
      description: data.description || "",
      facebook_url: data.facebook_url || "",
      instagram_url: data.instagram_url || "",
      tiktok_url: data.tiktok_url || "",
      youtube_url: data.youtube_url || "",
    };
  } catch (error) {
    console.error("Unable to load footer settings:", error);
  }
}

const socialLinks = [
  { name: "Facebook", key: "facebook_url" },
  { name: "Instagram", key: "instagram_url" },
  { name: "TikTok", key: "tiktok_url" },
  { name: "YouTube", key: "youtube_url" },
];

onMounted(loadSettings);
</script>

<template>
  <footer class="bg-[#10271e] text-white">
    <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Brand -->
        <div class="lg:col-span-2">
          <h2 class="font-serif text-3xl text-[#dfc99d]">
            {{ settings.site_name }}
          </h2>

          <p class="mt-5 max-w-md text-sm leading-7 text-white/65">
            {{ settings.description || "Discover Nepal's extraordinary landscapes, cultures and unforgettable journeys with us." }}
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.key"
              v-show="settings[social.key]"
              :href="settings[social.key]"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 transition hover:border-[#dfc99d] hover:text-[#dfc99d]"
            >
              {{ social.name }}
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="mb-5 font-serif text-xl text-[#dfc99d]">
            Explore
          </h3>

          <ul class="space-y-3 text-sm text-white/65">
            <li>
              <RouterLink to="/" class="transition hover:text-[#dfc99d]">
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/destinations" class="transition hover:text-[#dfc99d]">
                Destinations
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/tours" class="transition hover:text-[#dfc99d]">
                Tours
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/about" class="transition hover:text-[#dfc99d]">
                About Us
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="transition hover:text-[#dfc99d]">
                Contact
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="mb-5 font-serif text-xl text-[#dfc99d]">
            Get in Touch
          </h3>

          <ul class="space-y-4 text-sm text-white/65">
            <li v-if="settings.address">
              <span class="mb-1 block text-xs uppercase tracking-wider text-[#dfc99d]">
                Address
              </span>
              {{ settings.address }}
            </li>

            <li v-if="settings.contact_email">
              <span class="mb-1 block text-xs uppercase tracking-wider text-[#dfc99d]">
                Email
              </span>
              <a
                :href="`mailto:${settings.contact_email}`"
                class="transition hover:text-[#dfc99d]"
              >
                {{ settings.contact_email }}
              </a>
            </li>

            <li v-if="settings.contact_phone">
              <span class="mb-1 block text-xs uppercase tracking-wider text-[#dfc99d]">
                Phone
              </span>
              <a
                :href="`tel:${settings.contact_phone}`"
                class="transition hover:text-[#dfc99d]"
              >
                {{ settings.contact_phone }}
              </a>
            </li>

            <li v-if="!settings.address && !settings.contact_email && !settings.contact_phone">
              Contact information coming soon.
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-14 border-t border-white/15 pt-7">
        <div class="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p class="text-xs text-white/50">
            © {{ currentYear }} {{ settings.site_name }}. All rights reserved.
          </p>

          <p class="text-xs text-white/50">
            Made with care for travellers exploring Nepal.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
