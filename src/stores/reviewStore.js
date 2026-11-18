import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import {
    getAdminReviews,
    updateReviewApproval,
    deleteAdminReview,
} from '../api/adminReviews'

export const useReviewStore = defineStore('reviews', () => {
    // Review state
    const reviews = ref([])
    const loading = ref(false)
    const error = ref('')
    const updatingReviewId = ref(null)
    const deletingReviewId = ref(null)
    const actionError = ref('')

    // Filter and pagination state
    const statusFilter = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Filter reviews by approval status
    const filteredReviews = computed(() => {
        if (statusFilter.value === 'all') {
            return reviews.value
        }

        return reviews.value.filter((review) =>
            statusFilter.value === 'approved'
                ? Boolean(Number(review.is_approved))
                : !Boolean(Number(review.is_approved))
        )
    })

    // Pagination
    const totalPages = computed(() =>
        Math.max(
            1,
            Math.ceil(filteredReviews.value.length / itemsPerPage.value)
        )
    )

    const paginatedReviews = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value

        return filteredReviews.value.slice(
            start,
            start + itemsPerPage.value
        )
    })

    const startItem = computed(() =>
        filteredReviews.value.length === 0
            ? 0
            : (currentPage.value - 1) * itemsPerPage.value + 1
    )

    const endItem = computed(() =>
        Math.min(
            currentPage.value * itemsPerPage.value,
            filteredReviews.value.length
        )
    )

    watch(statusFilter, () => {
        currentPage.value = 1
    })

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
        }
    }

    // Fetch all reviews
    const fetchReviews = async () => {
        loading.value = true
        error.value = ''

        try {
            const response = await getAdminReviews()
            reviews.value = Array.isArray(response.data)
                ? response.data
                : []
        } catch (err) {
            console.error('Unable to load reviews:', err)

            error.value =
                err.response?.data?.message ||
                'Unable to load reviews.'
        } finally {
            loading.value = false
        }
    }

    // Approve or reject a review
    const changeReviewApproval = async (review, isApproved) => {
        if (Boolean(Number(review.is_approved)) === isApproved) return

        updatingReviewId.value = review.id
        actionError.value = ''

        try {
            const response = await updateReviewApproval(
                review.id,
                isApproved
            )

            const updatedReview = response.data.review

            reviews.value = reviews.value.map((item) =>
                item.id === updatedReview.id
                    ? updatedReview
                    : item
            )

            return updatedReview
        } catch (err) {
            console.error('Unable to update review:', err)

            actionError.value =
                err.response?.data?.message ||
                'Unable to update review. Please try again.'

            throw err
        } finally {
            updatingReviewId.value = null
        }
    }

    // Delete a review
    const removeReview = async (reviewId) => {
        deletingReviewId.value = reviewId
        actionError.value = ''

        try {
            await deleteAdminReview(reviewId)

            reviews.value = reviews.value.filter(
                (review) => review.id !== reviewId
            )

            return true
        } catch (err) {
            console.error('Unable to delete review:', err)

            actionError.value =
                err.response?.data?.message ||
                'Unable to delete review. Please try again.'

            throw err
        } finally {
            deletingReviewId.value = null
        }
    }

    return {
        reviews,
        loading,
        error,
        updatingReviewId,
        deletingReviewId,
        actionError,
        statusFilter,
        filteredReviews,
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedReviews,
        startItem,
        endItem,
        fetchReviews,
        changeReviewApproval,
        removeReview,
        goToPage,
    }
})
