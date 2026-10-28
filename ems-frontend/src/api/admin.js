import api from './axios'

export const getAdminStats    = () => api.get('/admin/stats')
export const getAllUsers       = () => api.get('/admin/users')
export const createUser       = (data) => api.post('/admin/users', data)
export const updateUser       = (id, data) => api.put(`/admin/users/${id}`, data)
export const toggleUserStatus = (id) => api.patch(`/admin/users/${id}/toggle-status`)
export const deleteUser       = (id) => api.delete(`/admin/users/${id}`)
export const getOrganizations = () => api.get('/admin/organizations')
