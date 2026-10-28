import api from './axios'

export const getNotifications  = () => api.get('/notifications')
export const getUnreadCount    = () => api.get('/notifications/unread-count')
export const markAllRead       = () => api.patch('/notifications/mark-all-read')
export const markRead          = (id) => api.patch(`/notifications/${id}/read`)
