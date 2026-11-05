<script setup>
import { ref, onMounted } from "vue";

import {
  changeAdminPassword,
  getAdminProfile,
  updateAdminProfile,
} from "../../api/adminSettings";

import {
  getSiteSettings,
  updateSiteSettings,
} from "../../api/siteSettings";

// Website Information
const siteSettings = ref({
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

const siteSettingsLoading = ref(false);
const siteSettingsSaving = ref(false);
const siteSettingsSuccess = ref("");
const siteSettingsError = ref("");

// Admin profile
const profileName = ref("");
const profileEmail = ref("");
const profileLoading = ref(false);
const profileSaving = ref(false);
const profileSuccess = ref("");
const profileError = ref("");

// Password
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const showPasswords = ref(false);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const settingsSections = [
  {
    number: "01",
    title: "Admin Profile",
    description:
      "Manage your administrator name, email address and account information.",
    icon: "👤",
    status: "Profile settings",
  },
  {
    number: "02",
    title: "Security",
    description:
      "Change your admin password and keep your administrator account secure.",
    icon: "🔐",
    status: "Account security",
  },
  {
    number: "03",
    title: "Website Information",
    description:
      "Manage RoamNePura's contact details, website identity and business information.",
    icon: "🌐",
    status: "Website configuration",
  },
  {
    number: "04",
    title: "Notifications",
    description:
      "Manage preferences for booking, inquiry and other administrative notifications.",
    icon: "🔔",
    status: "Notification preferences",
  },
];

// Load website information
async function loadSiteSettings() {
  siteSettingsLoading.value = true;
  siteSettingsError.value = "";

  try {
    const response = await getSiteSettings();
    const settings = response.data.settings || response.data;

    siteSettings.value = {
      site_name: settings.site_name || "RoamNePura",
      contact_email: settings.contact_email || "",
      contact_phone: settings.contact_phone || "",
      address: settings.address || "",
      description: settings.description || "",
      facebook_url: settings.facebook_url || "",
      instagram_url: settings.instagram_url || "",
      tiktok_url: settings.tiktok_url || "",
      youtube_url: settings.youtube_url || "",
    };
  } catch (error) {
    siteSettingsError.value =
      error.response?.data?.message ||
      "Unable to load website information. Please refresh the page.";
  } finally {
    siteSettingsLoading.value = false;
  }
}

// Save website information
async function submitSiteSettings() {
  siteSettingsSuccess.value = "";
  siteSettingsError.value = "";

  if (!siteSettings.value.site_name.trim()) {
    siteSettingsError.value = "Website name is required.";
    return;
  }

  siteSettingsSaving.value = true;

  try {
    const response = await updateSiteSettings({
      ...siteSettings.value,
      site_name: siteSettings.value.site_name.trim(),
    });

    const settings = response.data.settings || response.data;

    siteSettings.value = {
      site_name: settings.site_name || "RoamNePura",
      contact_email: settings.contact_email || "",
      contact_phone: settings.contact_phone || "",
      address: settings.address || "",
      description: settings.description || "",
      facebook_url: settings.facebook_url || "",
      instagram_url: settings.instagram_url || "",
      tiktok_url: settings.tiktok_url || "",
      youtube_url: settings.youtube_url || "",
    };

    siteSettingsSuccess.value =
      response.data.message ||
      "Website information updated successfully.";
  } catch (error) {
    const validationErrors = error.response?.data?.errors;

    siteSettingsError.value = validationErrors
      ? Object.values(validationErrors).flat().join(" ")
      : error.response?.data?.message ||
        "Unable to update website information. Please try again.";
  } finally {
    siteSettingsSaving.value = false;
  }
}

// Load logged-in admin profile
async function loadAdminProfile() {
  profileLoading.value = true;
  profileError.value = "";

  try {
    const response = await getAdminProfile();
    const user = response.data.user || response.data;

    profileName.value = user.name || "";
    profileEmail.value = user.email || "";
  } catch (error) {
    profileError.value =
      error.response?.data?.message ||
      "Unable to load admin profile. Please refresh the page.";
  } finally {
    profileLoading.value = false;
  }
}

// Save admin profile
async function submitProfileUpdate() {
  profileSuccess.value = "";
  profileError.value = "";

  if (!profileName.value.trim() || !profileEmail.value.trim()) {
    profileError.value = "Please enter both your name and email address.";
    return;
  }

  profileSaving.value = true;

  try {
    const response = await updateAdminProfile({
      name: profileName.value.trim(),
      email: profileEmail.value.trim(),
    });

    const user = response.data.user || response.data;

    profileName.value = user.name || profileName.value;
    profileEmail.value = user.email || profileEmail.value;

    window.dispatchEvent(
      new CustomEvent("admin-profile-updated", {
        detail: user,
      })
    );

    profileSuccess.value =
      response.data.message || "Admin profile updated successfully.";
  } catch (error) {
    const validationErrors = error.response?.data?.errors;

    profileError.value = validationErrors
      ? Object.values(validationErrors).flat().join(" ")
      : error.response?.data?.message ||
        "Unable to update profile. Please try again.";
  } finally {
    profileSaving.value = false;
  }
}

// Change password
async function submitPasswordChange() {
  successMessage.value = "";
  errorMessage.value = "";

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = "Please complete all password fields.";
    return;
  }

  if (newPassword.value.length < 8) {
    errorMessage.value = "Your new password must be at least 8 characters.";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "New password and confirmation do not match.";
    return;
  }

  if (newPassword.value === currentPassword.value) {
    errorMessage.value =
      "Your new password must be different from the current password.";
    return;
  }

  loading.value = true;

  try {
    const response = await changeAdminPassword({
      current_password: currentPassword.value,
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    });

    successMessage.value =
      response.data.message || "Password changed successfully.";

    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error) {
    const validationErrors = error.response?.data?.errors;

    errorMessage.value =
      error.response?.data?.message ||
      (validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : "Unable to change password. Please try again.");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadAdminProfile();
  loadSiteSettings();
});
</script>

<template>
  <main class="min-h-screen bg-[#f8f7f2] p-4 sm:p-6 lg:p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9b8051]">
        Administration
      </p>

      <h1 class="font-serif text-3xl font-medium text-[#193b2b] sm:text-4xl">
        Settings
      </h1>

      <p class="mt-3 max-w-2xl text-sm leading-6 text-[#788279]">
        Manage your RoamNePura administrator account, website information,
        security and notification preferences from one place.
      </p>
    </div>

    <!-- Introduction -->
    <section class="mb-8 overflow-hidden rounded-2xl bg-[#193b2b] p-6 text-white shadow-sm sm:p-8">
      <div class="max-w-2xl">
        <span class="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[#dfc99d]">
          Control Centre
        </span>

        <h2 class="mt-4 font-serif text-2xl sm:text-3xl">
          Manage your platform
        </h2>

        <p class="mt-3 text-sm leading-6 text-white/70">
          Keep your administrator account and website configuration
          organized as RoamNePura grows.
        </p>
      </div>
    </section>

    <!-- General Settings -->
    <section>
      <div class="mb-5">
        <h2 class="font-serif text-2xl text-[#193b2b]">
          General Settings
        </h2>

        <p class="mt-1 text-sm text-[#788279]">
          Choose the settings area you want to configure.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <article
          v-for="item in settingsSections"
          :key="item.number"
          class="rounded-2xl border border-[#e8e7df] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#c9b78e] hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeee7] text-2xl">
              {{ item.icon }}
            </div>

            <span class="text-xs font-semibold tracking-wider text-[#b5a27a]">
              {{ item.number }}
            </span>
          </div>

          <h3 class="mt-5 font-serif text-xl text-[#193b2b]">
            {{ item.title }}
          </h3>

          <p class="mt-2 min-h-[48px] text-sm leading-6 text-[#788279]">
            {{ item.description }}
          </p>

          <div class="mt-5 border-t border-[#eeeee7] pt-4">
            <span class="text-xs font-medium uppercase tracking-wider text-[#9b8051]">
              {{ item.status }}
            </span>
          </div>
        </article>
      </div>
    </section>

    <!-- Website Information -->
    <section class="mt-10">
      <div class="mb-5">
        <h2 class="font-serif text-2xl text-[#193b2b]">
          Website Information
        </h2>

        <p class="mt-1 text-sm text-[#788279]">
          Manage your website identity, business contact details and social media links.
        </p>
      </div>

      <div class="max-w-4xl rounded-2xl border border-[#e8e7df] bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeee7] text-2xl">
            🌐
          </div>

          <div>
            <h3 class="font-serif text-xl text-[#193b2b]">
              Website Configuration
            </h3>

            <p class="mt-1 text-xs text-[#788279]">
              These details are stored in your website settings.
            </p>
          </div>
        </div>

        <div
          v-if="siteSettingsSuccess"
          class="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {{ siteSettingsSuccess }}
        </div>

        <div
          v-if="siteSettingsError"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {{ siteSettingsError }}
        </div>

        <div v-if="siteSettingsLoading" class="py-6 text-sm text-[#788279]">
          Loading website information...
        </div>

        <form
          v-else
          @submit.prevent="submitSiteSettings"
          class="space-y-6"
        >
          <!-- Basic Information -->
          <div>
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9b8051]">
              Basic Information
            </h4>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  Website Name
                </label>

                <input
                  v-model="siteSettings.site_name"
                  type="text"
                  required
                  maxlength="255"
                  placeholder="RoamNePura"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  Contact Email
                </label>

                <input
                  v-model="siteSettings.contact_email"
                  type="email"
                  maxlength="255"
                  placeholder="hello@example.com"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  Contact Phone
                </label>

                <input
                  v-model="siteSettings.contact_phone"
                  type="tel"
                  maxlength="30"
                  placeholder="+977 98XXXXXXXX"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  Business Address
                </label>

                <input
                  v-model="siteSettings.address"
                  type="text"
                  maxlength="1000"
                  placeholder="Kathmandu, Nepal"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>
            </div>

            <div class="mt-5">
              <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                Website Description
              </label>

              <textarea
                v-model="siteSettings.description"
                rows="4"
                maxlength="2000"
                placeholder="Write a short description about RoamNePura..."
                class="w-full resize-y rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
              ></textarea>
            </div>
          </div>

          <!-- Social Media -->
          <div class="border-t border-[#eeeee7] pt-6">
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9b8051]">
              Social Media Links
            </h4>

            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  Facebook URL
                </label>

                <input
                  v-model="siteSettings.facebook_url"
                  type="url"
                  maxlength="255"
                  placeholder="https://facebook.com/yourpage"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  Instagram URL
                </label>

                <input
                  v-model="siteSettings.instagram_url"
                  type="url"
                  maxlength="255"
                  placeholder="https://instagram.com/yourpage"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  TikTok URL
                </label>

                <input
                  v-model="siteSettings.tiktok_url"
                  type="url"
                  maxlength="255"
                  placeholder="https://tiktok.com/@yourpage"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-medium text-[#193b2b]">
                  YouTube URL
                </label>

                <input
                  v-model="siteSettings.youtube_url"
                  type="url"
                  maxlength="255"
                  placeholder="https://youtube.com/@yourchannel"
                  class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-[#eeeee7] pt-5">
            <button
              type="submit"
              :disabled="siteSettingsSaving"
              class="rounded-xl bg-[#193b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10271e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ siteSettingsSaving ? "Saving Website Information..." : "Save Website Information" }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Admin Profile -->
    <section class="mt-10">
      <div class="mb-5">
        <h2 class="font-serif text-2xl text-[#193b2b]">
          Admin Profile
        </h2>

        <p class="mt-1 text-sm text-[#788279]">
          Update your administrator name and email address.
        </p>
      </div>

      <div class="max-w-2xl rounded-2xl border border-[#e8e7df] bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeee7] text-2xl">
            👤
          </div>

          <div>
            <h3 class="font-serif text-xl text-[#193b2b]">
              Account Information
            </h3>

            <p class="mt-1 text-xs text-[#788279]">
              Your updated details will be saved to your admin account.
            </p>
          </div>
        </div>

        <div
          v-if="profileSuccess"
          class="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {{ profileSuccess }}
        </div>

        <div
          v-if="profileError"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {{ profileError }}
        </div>

        <div v-if="profileLoading" class="py-6 text-sm text-[#788279]">
          Loading admin profile...
        </div>

        <form v-else @submit.prevent="submitProfileUpdate" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-[#193b2b]">
              Admin Name
            </label>

            <input
              v-model="profileName"
              type="text"
              autocomplete="name"
              placeholder="Enter your name"
              required
              maxlength="255"
              class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#193b2b]">
              Email Address
            </label>

            <input
              v-model="profileEmail"
              type="email"
              autocomplete="email"
              placeholder="Enter your email address"
              required
              maxlength="255"
              class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
            />
          </div>

          <div class="border-t border-[#eeeee7] pt-5">
            <button
              type="submit"
              :disabled="profileSaving"
              class="rounded-xl bg-[#193b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10271e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ profileSaving ? "Saving Profile..." : "Save Profile Changes" }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Change Password -->
    <section class="mt-10">
      <div class="mb-5">
        <h2 class="font-serif text-2xl text-[#193b2b]">
          Security & Password
        </h2>

        <p class="mt-1 text-sm text-[#788279]">
          Update your administrator account password.
        </p>
      </div>

      <div class="max-w-2xl rounded-2xl border border-[#e8e7df] bg-white p-6 shadow-sm sm:p-8">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeee7] text-2xl">
            🔐
          </div>

          <div>
            <h3 class="font-serif text-xl text-[#193b2b]">
              Change Password
            </h3>

            <p class="mt-1 text-xs text-[#788279]">
              Choose a strong password with at least 8 characters.
            </p>
          </div>
        </div>

        <div
          v-if="successMessage"
          class="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="errorMessage"
          class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {{ errorMessage }}
        </div>

        <form @submit.prevent="submitPasswordChange" class="space-y-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-[#193b2b]">
              Current Password
            </label>

            <input
              v-model="currentPassword"
              :type="showPasswords ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your current password"
              class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#193b2b]">
              New Password
            </label>

            <input
              v-model="newPassword"
              :type="showPasswords ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Enter your new password"
              class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#193b2b]">
              Confirm New Password
            </label>

            <input
              v-model="confirmPassword"
              :type="showPasswords ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Confirm your new password"
              class="w-full rounded-xl border border-[#deded4] bg-[#f8f7f2] px-4 py-3 text-sm outline-none transition focus:border-[#9b8051] focus:ring-2 focus:ring-[#9b8051]/10"
            />
          </div>

          <label class="flex cursor-pointer items-center gap-2 text-sm text-[#788279]">
            <input
              v-model="showPasswords"
              type="checkbox"
              class="h-4 w-4 accent-[#193b2b]"
            />
            Show passwords
          </label>

          <div class="border-t border-[#eeeee7] pt-5">
            <button
              type="submit"
              :disabled="loading"
              class="rounded-xl bg-[#193b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10271e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loading ? "Updating Password..." : "Update Password" }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Information Notice -->
    <section class="mt-8 rounded-xl border border-[#e8dfc9] bg-[#f2eee3] p-5">
      <div class="flex items-start gap-3">
        <span class="text-xl">ℹ️</span>

        <div>
          <h3 class="text-sm font-semibold text-[#193b2b]">
            Account security
          </h3>

          <p class="mt-1 text-sm leading-6 text-[#788279]">
            Your new password is securely hashed by Laravel before it is saved.
            You must enter your current password to authorize this change.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
