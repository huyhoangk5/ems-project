import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/auth'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import PasswordInput from '../../components/common/PasswordInput'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', username: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fullName || !form.username || !form.password) return toast.error('Vui lòng nhập đầy đủ thông tin')
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) return toast.error('Tên đăng nhập chỉ cho phép chữ cái, chữ số và dấu gạch dưới')
    if (form.password.length < 6) return toast.error('Mật khẩu phải có tối thiểu 6 ký tự')
    if (form.password !== form.confirm) return toast.error('Mật khẩu xác nhận không khớp')
    setLoading(true)
    try {
      await register({ fullName: form.fullName, username: form.username, password: form.password })
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>🏦 EMS</h1>
          <p style={styles.heroSub}>Hệ thống Quản lý Sự kiện</p>
          <p style={styles.heroDesc}>Học viện Ngân hàng</p>
        </div>
      </div>
      <div style={styles.formSide}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Đăng ký tài khoản</h2>
          <p style={styles.formSub}>Dành cho sinh viên</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên <span style={{ color: '#dc3545' }}>*</span></label>
              <input type="text" placeholder="Nguyễn Văn A"
                value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} autoFocus />
            </div>
            <div className="form-group">
              <label>Tên đăng nhập <span style={{ color: '#dc3545' }}>*</span></label>
              <input type="text" placeholder="Chọn tên đăng nhập"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Mật khẩu <span style={{ color: '#dc3545' }}>*</span></label>
              <PasswordInput placeholder="Tối thiểu 6 ký tự"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu <span style={{ color: '#dc3545' }}>*</span></label>
              <PasswordInput placeholder="Nhập lại mật khẩu"
                value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>
          <p style={styles.loginLink}>
            Đã có tài khoản? <Link to="/login" style={{ color: '#007bff' }}>Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  hero: { flex: 1, background: 'linear-gradient(135deg,#007bff 0%,#6610f2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 },
  heroContent: { color: '#fff', textAlign: 'center' },
  heroTitle: { fontSize: 60, margin: '0 0 12px' },
  heroSub: { fontSize: 24, fontWeight: 700, margin: '0 0 8px' },
  heroDesc: { fontSize: 16, opacity: 0.85 },
  formSide: { width: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#f8f9fa' },
  formBox: { background: '#fff', borderRadius: 14, padding: '36px 32px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  formTitle: { fontSize: 24, fontWeight: 700, margin: '0 0 4px', color: '#333' },
  formSub: { color: '#888', marginBottom: 24, fontSize: 14 },
  loginLink: { textAlign: 'center', marginTop: 18, fontSize: 14, color: '#666' },
}
