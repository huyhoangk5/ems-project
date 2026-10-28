import { useState, useEffect } from 'react'
import { getProfile, updateProfile, changePassword } from '../../api/events'
import toast from 'react-hot-toast'
import PasswordInput from '../common/PasswordInput'
import { useAuth } from '../../context/AuthContext'

export default function ProfileModal({ onClose }) {
  const { updateUser } = useAuth()
  const [form, setForm] = useState({
    fullName: '', gender: '', dateOfBirth: '',
    phoneNumber: '', studentCode: '', classCode: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Change password state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [pwdForm, setPwdForm] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  })
  const [savingPwd, setSavingPwd] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const r = await getProfile()
      const data = r.data.data
      setForm({
        fullName: data.fullName || '',
        gender: data.gender || '',
        dateOfBirth: data.dateOfBirth || '',
        phoneNumber: data.phoneNumber || '',
        studentCode: data.studentCode || '',
        classCode: data.classCode || ''
      })
    } catch (err) {
      toast.error('Lỗi khi tải thông tin')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    if (!form.fullName || !form.fullName.trim()) return toast.error('Vui lòng nhập họ tên')
    if (form.phoneNumber && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.phoneNumber)) {
      return toast.error('Số điện thoại không hợp lệ')
    }
    setSaving(true)
    try {
      await updateProfile(form)
      updateUser({ fullName: form.fullName })
      toast.success('Cập nhật thông tin thành công')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (!pwdForm.oldPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      return toast.error('Vui lòng nhập đầy đủ thông tin')
    }
    if (pwdForm.newPassword.length < 6) {
      return toast.error('Mật khẩu phải có tối thiểu 6 ký tự')
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return toast.error('Mật khẩu xác nhận không khớp')
    }
    setSavingPwd(true)
    try {
      await changePassword(pwdForm)
      toast.success('Đổi mật khẩu thành công')
      setShowPasswordForm(false)
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra')
    } finally {
      setSavingPwd(false)
    }
  }

  if (loading) return null

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <div className="modal-title">
          Hồ sơ cá nhân
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!showPasswordForm ? (
          <form onSubmit={handleSaveProfile} className="form">
            <div className="form-group">
              <label>Họ tên *</label>
              <input type="text" className="input" value={form.fullName}
                     onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Giới tính</label>
                <select className="input" value={form.gender}
                        onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input type="date" className="input" value={form.dateOfBirth}
                       onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} />
              </div>
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Mã sinh viên</label>
                <input type="text" className="input" value={form.studentCode}
                       onChange={e => setForm({ ...form, studentCode: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Mã lớp</label>
                <input type="text" className="input" value={form.classCode}
                       onChange={e => setForm({ ...form, classCode: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="text" className="input" value={form.phoneNumber}
                     onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(true)}>
                Đổi mật khẩu
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="form">
            <div className="form-group">
              <label>Mật khẩu cũ *</label>
              <PasswordInput className="input" value={pwdForm.oldPassword}
                     onChange={e => setPwdForm({ ...pwdForm, oldPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới *</label>
              <PasswordInput className="input" value={pwdForm.newPassword}
                     onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới *</label>
              <PasswordInput className="input" value={pwdForm.confirmPassword}
                     onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
            </div>

            <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(false)}>Quay lại</button>
              <button type="submit" className="btn btn-primary" disabled={savingPwd}>
                {savingPwd ? 'Đang đổi...' : 'Xác nhận đổi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
