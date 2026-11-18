
<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useReviewStore } from "../../stores/reviewStore";

const reviewStore = useReviewStore();

const {
    reviews,
    filteredReviews,
    paginatedReviews,
    currentPage,
    totalPages,
    startItem,
    endItem,
    statusFilter,
    loading,
    error,
    updatingReviewId,
    deletingReviewId,
    actionError,
} = storeToRefs(reviewStore);

const { goToPage } = reviewStore;

// Approve or reject a review.
const changeReviewApproval = async (review, isApproved) => {
    try {
        await reviewStore.changeReviewApproval(review, isApproved);
    } catch (err) {
        // The store records the error for the UI.
    }
};

// Delete a review.
const removeReview = async (review) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete the review from ${review.name}?`
    );

    if (!confirmed) return;

    try {
        await reviewStore.removeReview(review.id);
    } catch (err) {
        // The store records the error for the UI.
    }
};

onMounted(() => {
    reviewStore.fetchReviews();
});
</script>

<template>
    <div>
        <!-- Page Header -->
        <div class="mb-6">
            <p
                class="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5c3f]"
            >
                Customer Feedback
            </p>

            <h2 class="mt-1 font-serif text-3xl text-[#1c2a22]">
                Reviews
            </h2>

            <p class="mt-2 text-sm text-[#6b756e]">
                Review, approve, and manage customer feedback before it
                appears publicly on your website.
            </p>
        </div>

        <!-- Review Status Filters -->
        <div class="mb-5 flex flex-wrap gap-2">
            <button
                v-for="filter in [
                    { label: 'All', value: 'all' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Approved', value: 'approved' },
                ]"
                :key="filter.value"
                type="button"
                @click="statusFilter = filter.value"
                :class="
                    statusFilter === filter.value
                        ? 'border-[#1f5c3f] bg-[#1f5c3f] text-white'
                        : 'border-[#e7e3da] bg-white text-[#263b30] hover:bg-[#f7f5f0]'
                "
                class="rounded-lg border px-4 py-2 text-sm font-semibold transition"
            >
                {{ filter.label }}
            </button>
        </div>

        <!-- Action Error -->
        <div
            v-if="actionError"
            class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            {{ actionError }}
        </div>

        <!-- Loading -->
        <div
            v-if="loading"
            class="rounded-xl border border-[#e7e3da] bg-white p-8 text-center text-sm text-[#6b756e]"
        >
            Loading reviews...
        </div>

        <!-- Fetch Error -->
        <div
            v-else-if="error"
            class="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
            {{ error }}

            <button
                type="button"
                @click="reviewStore.fetchReviews()"
                class="ml-2 font-semibold underline"
            >
                Try again
            </button>
        </div>

        <!-- No Reviews -->
        <div
            v-else-if="reviews.length === 0"
            class="rounded-xl border border-[#e7e3da] bg-white p-10 text-center"
        >
            <p class="font-medium text-[#1c2a22]">
                No reviews yet
            </p>

            <p class="mt-1 text-sm text-[#6b756e]">
                Customer reviews will appear here when visitors submit them.
            </p>
        </div>

        <!-- No Filter Results -->
        <div
            v-else-if="filteredReviews.length === 0"
            class="rounded-xl border border-[#e7e3da] bg-white p-10 text-center"
        >
            <p class="font-medium text-[#1c2a22]">
                No {{ statusFilter }} reviews
            </p>

            <p class="mt-1 text-sm text-[#6b756e]">
                Try selecting another filter.
            </p>
        </div>

        <!-- Reviews Table -->
        <div
            v-else
            class="overflow-hidden rounded-xl border border-[#e7e3da] bg-white shadow-sm"
        >
            <div class="overflow-x-auto">
                <table class="min-w-[1050px] w-full text-left">
                    <thead class="border-b border-[#e7e3da] bg-[#f7f5f0]">
                        <tr>
                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Customer
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Tour
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Rating
                            </th>

                            <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#6b756e]">
                                Review
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
                            v-for="review in paginatedReviews"
                            :key="review.id"
                            class="hover:bg-[#faf9f6]"
                        >
                            <!-- Customer -->
                            <td class="px-5 py-4">
                                <p class="font-semibold text-[#1c2a22]">
                                    {{ review.name }}
                                </p>

                                <p class="mt-1 text-xs text-[#6b756e]">
                                    {{ review.email }}
                                </p>
                            </td>

                            <!-- Tour -->
                            <td class="px-5 py-4">
                                <span class="text-sm font-medium text-[#1f5c3f]">
                                    {{ review.tour }}
                                </span>
                            </td>

                            <!-- Rating -->
                            <td class="px-5 py-4">
                                <div class="flex items-center gap-1">
                                    <span class="text-sm text-amber-500">
                                        ★
                                    </span>

                                    <span class="text-sm font-semibold text-[#1c2a22]">
                                        {{ review.rating }}/5
                                    </span>
                                </div>
                            </td>

                            <!-- Comment -->
                            <td class="max-w-[280px] px-5 py-4">
                                <p
                                    class="line-clamp-3 text-sm leading-6 text-[#6b756e]"
                                    :title="review.comment"
                                >
                                    {{ review.comment }}
                                </p>
                            </td>

                            <!-- Status -->
                            <td class="px-5 py-4">
                                <span
                                    :class="
                                        Number(review.is_approved) === 1
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-amber-50 text-amber-700'
                                    "
                                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                                >
                                    {{
                                        Number(review.is_approved) === 1
                                            ? "Approved"
                                            : "Pending"
                                    }}
                                </span>
                            </td>

                            <!-- Date -->
                            <td class="px-5 py-4 text-sm text-[#6b756e]">
                                {{ new Date(review.created_at).toLocaleDateString() }}
                            </td>

                            <!-- Actions -->
                            <td class="px-5 py-4">
                                <div class="flex flex-col items-start gap-2">
                                    <button
                                        v-if="Number(review.is_approved) !== 1"
                                        type="button"
                                        :disabled="
                                            updatingReviewId === review.id ||
                                            deletingReviewId === review.id
                                        "
                                        @click="changeReviewApproval(review, true)"
                                        class="rounded-lg bg-[#1f5c3f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#194d35] disabled:cursor-wait disabled:opacity-50"
                                    >
                                        {{
                                            updatingReviewId === review.id
                                                ? "Saving..."
                                                : "Approve"
                                        }}
                                    </button>

                                    <button
                                        v-else
                                        type="button"
                                        :disabled="
                                            updatingReviewId === review.id ||
                                            deletingReviewId === review.id
                                        "
                                        @click="changeReviewApproval(review, false)"
                                        class="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:cursor-wait disabled:opacity-50"
                                    >
                                        {{
                                            updatingReviewId === review.id
                                                ? "Saving..."
                                                : "Reject"
                                        }}
                                    </button>

                                    <button
                                        type="button"
                                        :disabled="
                                            updatingReviewId === review.id ||
                                            deletingReviewId === review.id
                                        "
                                        @click="removeReview(review)"
                                        class="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                                    >
                                        {{
                                            deletingReviewId === review.id
                                                ? "Deleting..."
                                                : "Delete"
                                        }}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div
                    v-if="filteredReviews.length > 0"
                    class="flex flex-col gap-4 border-t border-[#e7e3da] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p class="text-sm text-[#6b756e]">
                        Showing
                        <span class="font-semibold text-[#1c2a22]">
                            {{ startItem }}–{{ endItem }}
                        </span>
                        of
                        <span class="font-semibold text-[#1c2a22]">
                            {{ filteredReviews.length }}
                        </span>
                        reviews
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
    </div>
</template>
