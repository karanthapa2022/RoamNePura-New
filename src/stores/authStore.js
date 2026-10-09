
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
    // Restore the token if the admin has already logged in this session
    const token = ref(sessionStorage.getItem('admin_token') || '')

    // Check whether an admin is logged in
    const isAuthenticated = computed(() => Boolean(token.value))

    // Save the token after a successful login
    const setToken = (newToken) => {
        token.value = newToken
        sessionStorage.setItem('admin_token', newToken)
    }

    // Clear the token when the admin logs out
    const logout = () => {
        token.value = ''
        sessionStorage.removeItem('admin_token')
    }

    return {
        token,
        isAuthenticated,
        setToken,
        logout,
    }
})