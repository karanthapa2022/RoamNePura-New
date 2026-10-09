
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import {
    getAdminInquiries,
    updateInquiryStatus,
} from '../api/adminInquiries'

export const useInquiryStore = defineStore('inquiries', () => {
    // Inquiry state
    const inquiries = ref([])
    const loading = ref(false)
    const error = ref('')
    const updatingInquiryId = ref(null)
    const statusError = ref('')

    // Filter and pagination state
    const statusFilter = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Filter inquiries by status
    const filteredInquiries = computed(() => {
        if (statusFilter.value === 'all') {
            return inquiries.value
        }

        return inquiries.value.filter(
            (inquiry) => inquiry.status === statusFilter.value
        )
    })

    // Calculate pagination
    const totalPages = computed(() =>
        Math.max(
            1,
            Math.ceil(
                filteredInquiries.value.length / itemsPerPage.value
            )
        )
    )

    const paginatedInquiries = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value

        return filteredInquiries.value.slice(
            start,
            start + itemsPerPage.value
        )
    })

    const startItem = computed(() =>
        filteredInquiries.value.length === 0
            ? 0
            : (currentPage.value - 1) * itemsPerPage.value + 1
    )

    const endItem = computed(() =>
        Math.min(
            currentPage.value * itemsPerPage.value,
            filteredInquiries.value.length
        )
    )

    // Reset to page 1 when the status filter changes
    watch(statusFilter, () => {
        currentPage.value = 1
    })

    // Navigate between pages
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page
        }
    }

    // Fetch inquiries from the API
    const fetchInquiries = async () => {
        loading.value = true
        error.value = ''

        try {
            const response = await getAdminInquiries()
            inquiries.value = response.data
        } catch (err) {
            console.error('Unable to load inquiries:', err)

            error.value =
                err.response?.data?.message ||
                'Unable to load inquiries.'
        } finally {
            loading.value = false
        }
    }

    // Update an inquiry's status
    const changeInquiryStatus = async (inquiry, newStatus) => {
        if (inquiry.status === newStatus) return

        updatingInquiryId.value = inquiry.id
        statusError.value = ''

        try {
            const response = await updateInquiryStatus(
                inquiry.id,
                newStatus
            )

            const updatedInquiry = response.data.inquiry

            inquiries.value = inquiries.value.map((item) =>
                item.id === updatedInquiry.id
                    ? updatedInquiry
                    : item
            )

            return updatedInquiry
        } catch (err) {
            console.error('Unable to update inquiry status:', err)

            statusError.value =
                err.response?.data?.message ||
                'Unable to update inquiry status. Please try again.'

            throw err
        } finally {
            updatingInquiryId.value = null
        }
    }

    // Expose state, computed values, and actions
    return {
        inquiries,
        loading,
        error,
        updatingInquiryId,
        statusError,
        statusFilter,
        filteredInquiries,
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedInquiries,
        startItem,
        endItem,
        fetchInquiries,
        changeInquiryStatus,
        goToPage,
    }
})