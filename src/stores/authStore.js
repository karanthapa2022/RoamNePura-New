import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAdminProfile } from '../api/adminSettings'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(sessionStorage.getItem('admin_token') || '')

    const adminProfile = ref(null)

    const isAuthenticated = computed(() => Boolean(token.value))

    // Shared request prevents duplicate profile API calls.
    let profileRequest = null

    const setToken = (newToken) => {
        token.value = newToken
        sessionStorage.setItem('admin_token', newToken)
        adminProfile.value = null
    }

    const fetchAdminProfile = async () => {
        if (adminProfile.value) {
            return adminProfile.value
        }

        if (profileRequest) {
            return profileRequest
        }

        profileRequest = (async () => {
            try {
                const response = await getAdminProfile()
                const user = response.data.user || response.data

                adminProfile.value = user

                return user
            } finally {
                profileRequest = null
            }
        })()

        return profileRequest
    }

    const setAdminProfile = (user) => {
        if (user) {
            adminProfile.value = {
                ...adminProfile.value,
                ...user,
            }
        }
    }

    const logout = () => {
        token.value = ''
        adminProfile.value = null
        profileRequest = null

        sessionStorage.removeItem('admin_token')
    }

    return {
        token,
        adminProfile,
        isAuthenticated,
        setToken,
        fetchAdminProfile,
        setAdminProfile,
        logout,
    }
})
