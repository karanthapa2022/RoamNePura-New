<script setup>
import { onMounted, ref } from "vue";
import { getAdminInquiries } from "../../api/adminInquiries";

const inquiries = ref([]);
const loading = ref(false);
const error = ref("");

const fetchInquiries = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response = await getAdminInquiries();

        inquiries.value = response.data;

        console.log("Admin inquiries:", response.data);
    } catch (err) {
        console.error(err);

        error.value =
            err.response?.data?.message ||
            "Unable to load inquiries.";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchInquiries();
});
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="mb-6">
            <p
                class="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5c3f]"
            >
                Customer Messages
            </p>

            <h2 class="mt-1 font-serif text-3xl text-[#1c2a22]">
                Inquiries
            </h2>

            <p class="mt-2 text-sm text-[#6b756e]">
                View and manage inquiries submitted by visitors.
            </p>
        </div>

        <!-- Loading -->
        <div
            v-if="loading"
            class="rounded-xl border border-[#e7e3da] bg-white p-8 text-center text-sm text-[#6b756e]"
        >
            Loading inquiries...
        </div>

        <!-- Error -->
        <div
            v-else-if="error"
            class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
            {{ error }}
        </div>

        <!-- Empty -->
        <div
            v-else-if="inquiries.length === 0"
            class="rounded-xl border border-[#e7e3da] bg-white p-10 text-center"
        >
            <p class="font-medium text-[#1c2a22]">
                No inquiries yet
            </p>

            <p class="mt-1 text-sm text-[#6b756e]">
                Customer inquiries will appear here.
            </p>
        </div>

        <!-- Table -->
        <div
            v-else
            class="overflow-hidden rounded-xl border border-[#e7e3da] bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="min-w-[900px] w-full text-left">
                    <thead class="border-b border-[#e7e3da] bg-[#f7f5f0]">
                        <tr>
                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Name
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Email
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Destination
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Message
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Status
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Date
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-[#e7e3da]">
                        <tr
                            v-for="inquiry in inquiries"
                            :key="inquiry.id"
                            class="hover:bg-[#faf9f6]"
                        >
                            <td class="px-5 py-4">
                                <p class="font-semibold text-[#1c2a22]">
                                    {{ inquiry.name }}
                                </p>
                            </td>

                            <td class="px-5 py-4 text-sm text-[#6b756e]">
                                {{ inquiry.email }}
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    v-if="inquiry.destination"
                                    class="text-sm font-medium text-[#1f5c3f]"
                                >
                                    {{ inquiry.destination.name }}
                                </span>

                                <span
                                    v-else
                                    class="text-sm text-[#6b756e]"
                                >
                                    General Inquiry
                                </span>
                            </td>

                            <td class="max-w-[280px] px-5 py-4">
                                <p
                                    class="truncate text-sm text-[#6b756e]"
                                    :title="inquiry.message"
                                >
                                    {{ inquiry.message }}
                                </p>
                            </td>

                            <td class="px-5 py-4">
                                <span
                                    class="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-700"
                                >
                                    {{ inquiry.status }}
                                </span>
                            </td>

                            <td class="px-5 py-4 text-sm text-[#6b756e]">
                                {{ new Date(inquiry.created_at).toLocaleDateString() }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>