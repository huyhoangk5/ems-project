import { format, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm', { locale: vi })
  } catch {
    return dateStr
  }
}

export function formatDateOnly(dateStr) {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: vi })
  } catch {
    return dateStr
  }
}

export function toInputDateTime(dateStr) {
  if (!dateStr) return ''
  try {
    return format(parseISO(dateStr), "yyyy-MM-dd'T'HH:mm")
  } catch {
    return ''
  }
}

export function getStatusLabel(status) {
  const map = {
    PENDING:    'Chờ duyệt',
    APPROVED:   'Đã duyệt',
    REJECTED:   'Từ chối',
    ACTIVE:     'Hoạt động',
    LOCKED:     'Bị khóa',
    REGISTERED: 'Đã đăng ký',
    CANCELLED:  'Đã hủy',
    UPCOMING:   'Sắp diễn ra',
    ONGOING:    'Đang diễn ra',
    ENDED:      'Đã kết thúc',
  }
  return map[status] || status
}

export function getStatusClass(status) {
  const map = {
    PENDING:    'badge badge-warning',
    APPROVED:   'badge badge-success',
    REJECTED:   'badge badge-danger',
    ACTIVE:     'badge badge-success',
    LOCKED:     'badge badge-danger',
    REGISTERED: 'badge badge-success',
    CANCELLED:  'badge badge-danger',
    UPCOMING:   'badge badge-info',
    ONGOING:    'badge badge-success',
    ENDED:      'badge badge-secondary',
  }
  return map[status] || 'badge badge-secondary'
}

export function getRoleLabel(role) {
  const map = {
    ADMIN:    'Quản trị viên',
    APPROVER: 'Quản lý cấp cao',
    CLUB:     'CLB/Đội/Nhóm',
    STUDENT:  'Sinh viên',
  }
  return map[role] || role
}

export function getErrorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Đã xảy ra lỗi'
}

export function imgSrc(image) {
  if (!image) return null
  if (image.startsWith('http')) return image
  return `/uploads/${image}`
}
