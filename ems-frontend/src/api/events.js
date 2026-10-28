import api from './axios'

// Club
export const getClubEvents         = () => api.get('/club/events')
export const getClubEvent          = (id) => api.get(`/club/events/${id}`)
export const createEvent           = (formData) => api.post('/club/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const updateEvent           = (id, formData) => api.put(`/club/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
export const deleteEvent           = (id) => api.delete(`/club/events/${id}`)
export const getEventRegistrations = (id) => api.get(`/club/events/${id}/registrations`)

// Approver
export const getApproverStats = () => api.get('/approver/stats')
export const getAllEvents      = () => api.get('/approver/events')
export const reviewEvent      = (id, data) => api.patch(`/approver/events/${id}/review`, data)

// Student
export const getApprovedEvents = (params) => api.get('/student/events', { params })
export const registerEvent     = (id) => api.post(`/student/events/${id}/register`)
export const cancelEvent       = (id) => api.delete(`/student/events/${id}/cancel`)
export const getMyRegistrations= () => api.get('/student/registrations')

// Student Profile
export const getProfile       = () => api.get('/student/profile')
export const updateProfile    = (data) => api.put('/student/profile', data)
export const changePassword   = (data) => api.put('/student/profile/password', data)
