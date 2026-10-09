<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useInquiryStore } from "../../stores/inquiryStore";

const inquiryStore = useInquiryStore();

const {
    inquiries,
    filteredInquiries,
    paginatedInquiries,
    currentPage,
    totalPages,
    startItem,
    endItem,
    statusFilter,
    loading,
    error,
    updatingInquiryId,
    statusError,
} = storeToRefs(inquiryStore);

const { goToPage } = inquiryStore;

const changeInquiryStatus = async (inquiry, newStatus) => {
    try {
        const updatedInquiry = await inquiryStore.changeInquiryStatus(
            inquiry,
            newStatus
        );

        if (updatedInquiry && selectedInquiry.value?.id === updatedInquiry.id) {
            selectedInquiry.value = updatedInquiry;
        }
    } catch (err) {
        // The store records the error message for the UI.
    }
};

const selectedInquiry = ref(null);
const showInquiryModal = ref(false);

const openInquiry = (inquiry) => {
    selectedInquiry.value = inquiry;
    showInquiryModal.value = true;
};

const closeInquiry = () => {
    showInquiryModal.value = false;
    selectedInquiry.value = null;
};


const fetchInquiries = async () => {
    await inquiryStore.fetchInquiries();
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


<!-- Inquiry Status Filters -->
<div class="mb-5 flex flex-wrap gap-2">
    <button
        v-for="filter in [
            { label: 'All', value: 'all' },
            { label: 'New', value: 'new' },
            { label: 'Read', value: 'read' },
            { label: 'Replied', value: 'replied' },
        ]"
        :key="filter.value"
        type="button"
        @click="statusFilter = filter.value"
        :class="statusFilter === filter.value
            ? 'border-[#1f5c3f] bg-[#1f5c3f] text-white'
            : 'border-[#e7e3da] bg-white text-[#263b30] hover:bg-[#f7f5f0]'"
        class="rounded-lg border px-4 py-2 text-sm font-semibold transition"
    >
        {{ filter.label }}
    </button>
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
                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                         Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-[#e7e3da]">
                        <tr
                            v-for="inquiry in paginatedInquiries"
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
    <select
        :value="inquiry.status"
        :disabled="updatingInquiryId === inquiry.id"
        @change="changeInquiryStatus(inquiry, $event.target.value)"
        class="rounded-lg border border-[#e7e3da] bg-white px-3 py-2 text-sm font-medium text-[#263b30] outline-none transition focus:border-[#1f5c3f] disabled:cursor-wait disabled:opacity-60"
    >
        <option value="new">New</option>
        <option value="read">Read</option>
        <option value="replied">Replied</option>
    </select>

    <span
        v-if="updatingInquiryId === inquiry.id"
        class="ml-2 text-xs text-gray-500"
    >
        Saving...
    </span>
</td>

                            <td class="px-5 py-4 text-sm text-[#6b756e]">
                                {{ new Date(inquiry.created_at).toLocaleDateString() }}
                            </td>
                            <td class="px-5 py-4">
                                <button
                                    type="button"
                                    @click="openInquiry(inquiry)"
                                    class="rounded-lg border border-[#e7e3da] px-3 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#e6f0ea]"
                                >
                                    View
                                </button>
                            </td>
                            
                        </tr>
                        
                    </tbody>
                </table>


                <!-- Pagination controls -->
                <div
                    v-if="filteredInquiries.length > 0"
                    class="flex flex-col gap-4 border-t border-[#e7e3da] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p class="text-sm text-[#6b756e]">
                        Showing
                        <span class="font-semibold text-[#1c2a22]">
                            {{ startItem }}–{{ endItem }}
                        </span>
                        of
                        <span class="font-semibold text-[#1c2a22]">
                            {{ filteredInquiries.length }}
                        </span>
                        inquiries
                    </p>

                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            @click="goToPage(currentPage - 1)"
                            :disabled="currentPage <= 1"
                            class="rounded-lg border border-[#e7e3da] px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#e6f0ea] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span class="whitespace-nowrap text-sm text-[#6b756e]">
                            Page {{ currentPage }} of {{ totalPages }}
                        </span>

                        <button
                            type="button"
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="rounded-lg border border-[#e7e3da] px-4 py-2 text-sm font-semibold text-[#1f5c3f] transition hover:bg-[#e6f0ea] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
        <div
    v-if="statusError"
    class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
>
    {{ statusError }}
</div>
        <!-- Full Inquiry Modal -->
<div
    v-if="showInquiryModal && selectedInquiry"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    @click.self="closeInquiry"
    @keydown.esc="closeInquiry"
>
    <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
    >
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-[#e7e3da] p-5 sm:p-6">
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5c3f]">
                    Customer Message
                </p>

                <h2
                    id="inquiry-modal-title"
                    class="mt-1 font-serif text-2xl text-[#1c2a22]"
                >
                    Inquiry Details
                </h2>
            </div>

            <button
                type="button"
                @click="closeInquiry"
                aria-label="Close inquiry details"
                class="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e3da] text-xl text-[#6b756e] hover:bg-[#f7f5f0]"
            >
                ×
            </button>
        </div>

        <!-- Modal Body -->
        <div class="space-y-6 p-5 sm:p-6">
            <div class="grid gap-5 sm:grid-cols-2">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                        Name
                    </p>
                    <p class="mt-1 break-words font-medium text-[#1c2a22]">
                        {{ selectedInquiry.name }}
                    </p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                        Email
                    </p>
                    <a
                        :href="`mailto:${selectedInquiry.email}`"
                        class="mt-1 block break-all font-medium text-[#1f5c3f] hover:underline"
                    >
                        {{ selectedInquiry.email }}
                    </a>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                        Phone
                    </p>
                    <p class="mt-1 break-words text-[#1c2a22]">
                        {{ selectedInquiry.phone || "Not provided" }}
                    </p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                        Destination
                    </p>
                    <p class="mt-1 break-words text-[#1c2a22]">
                        {{ selectedInquiry.destination?.name || "General Inquiry" }}
                    </p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                        Status
                    </p>
                    <p class="mt-1 capitalize text-[#1c2a22]">
                        {{ selectedInquiry.status }}
                    </p>
                </div>

                <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                        Submitted
                    </p>
                    <p class="mt-1 text-[#1c2a22]">
                        {{ new Date(selectedInquiry.created_at).toLocaleString() }}
                    </p>
                </div>
            </div>

            <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                    Full Message
                </p>

                <div class="mt-2 whitespace-pre-wrap break-words rounded-xl border border-[#e7e3da] bg-[#f7f5f0] p-4 leading-7 text-[#1c2a22]">{{ selectedInquiry.message }}</div>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end border-t border-[#e7e3da] p-5 sm:px-6">
            <button
                type="button"
                @click="closeInquiry"
                class="rounded-lg bg-[#1f5c3f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#194d35]"
            >
                Close
            </button>
        </div>
    </section>
</div>
    </div>
</template>