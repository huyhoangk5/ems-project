import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import {
  getAdminStats, getAllUsers, createUser, updateUser,
  toggleUserStatus, deleteUser, getOrganizations
} from '../../api/admin'
import { getStatusLabel, getRoleLabel, formatDateOnly, getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'
import PasswordInput from '../../components/common/PasswordInput'
import { useAuth } from '../../context/AuthContext'

const EMPTY_FORM = {
  username: '', password: '', fullName: '', role: 'CLUB',
  gender: '', phoneNumber: '', studentCode: '', classCode: '', dateOfBirth: '',
  clubName: '', clubShortName: '', description: '',
  leaderName: '', leaderPhone: '', leaderCode: '', idOrg: '',
  approverOrg: '', approverPhone: '', approverCode: '',
}

export default function AdminPage() {
  const { user: currentUser }       = useAuth()
  const [stats, setStats]           = useState({})
  const [users, setUsers]           = useState([])
  const [orgs, setOrgs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [isEdit, setIsEdit]         = useState(false)
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [confirmUser, setConfirmUser] = useState(null)
  const [filterRole, setFilterRole] = useState('ALL')
  const [searchInput, setSearch]    = useState('')
  const [searchKw, setSearchKw]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [s, u, o] = await Promise.all([getAdminStats(), getAllUsers(), getOrganizations()])
      setStats(s.data.data || {})
      setUsers(u.data.data || [])
      setOrgs(o.data.data || [])
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setLoading(false) }
  }

  const f = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  function openCreate() {
    setForm(EMPTY_FORM); setIsEdit(false); setEditId(null); setShowModal(true)
  }

  function openEdit(u) {
    setIsEdit(true); setEditId(u.idUser)
    setForm({
      ...EMPTY_FORM,
      username: u.username || '',
      fullName: u.fullName || '', role: u.role,
      gender: u.gender || '', phoneNumber: u.phoneNumber || '',
      studentCode: u.studentCode || '', classCode: u.classCode || '',
      dateOfBirth: u.dateOfBirth || '',
      clubName: u.clubName || '', clubShortName: u.clubShortName || '',
      description: u.clubDescription || '', leaderName: u.leaderName || '',
      leaderPhone: u.leaderPhone || '', leaderCode: u.leaderCode || '',
      idOrg: u.orgId || '',
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.username) return toast.error('Vui lòng nhập tên đăng nhập')
    if (!isEdit && !form.password) return toast.error('Mật khẩu không được để trống')
    if (!form.fullName || !form.fullName.trim()) return toast.error('Vui lòng nhập họ và tên')
    if (form.phoneNumber && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.phoneNumber)) {
      return toast.error('Số điện thoại không hợp lệ')
    }
    if (form.role === 'CLUB' && !form.clubName) return toast.error('Tên CLB không được để trống')
    if (form.leaderPhone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.leaderPhone)) {
      return toast.error('Số điện thoại không hợp lệ')
    }
    if (form.approverPhone && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.approverPhone)) {
      return toast.error('Số điện thoại không hợp lệ')
    }
    const payload = { ...form }
    if (form.role === 'APPROVER') {
      payload.phoneNumber = form.approverPhone || form.phoneNumber
      payload.studentCode = form.approverCode  || form.studentCode
    }
    setSaving(true)
    try {
      if (isEdit) { await updateUser(editId, payload); toast.success('Cập nhật tài khoản thành công') }
      else        { await createUser(payload);          toast.success('Tạo tài khoản thành công') }
      setShowModal(false); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  async function handleToggle(u) {
    if (currentUser && (u.username === currentUser.username || u.idUser === currentUser.userId)) {
      return toast.error('Không thể khóa tài khoản đang đăng nhập.')
    }
    try {
      await toggleUserStatus(u.idUser)
      toast.success(u.status === 'ACTIVE' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản')
      load()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  async function handleDelete() {
    if (currentUser && (confirmUser.username === currentUser.username || confirmUser.idUser === currentUser.userId)) {
      setConfirmUser(null)
      return toast.error('Không thể xóa tài khoản đang đăng nhập.')
    }
    try {
      await deleteUser(confirmUser.idUser)
      toast.success('Xóa tài khoản thành công')
      setConfirmUser(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  const filtered = users.filter(u => {
    const mr = filterRole === 'ALL' || u.role === filterRole
    const ms = !searchKw || [u.username, u.fullName, u.clubName]
      .some(v => v?.toLowerCase().includes(searchKw.toLowerCase()))
    return mr && ms
  })

  const statusStyle = s => s === 'ACTIVE'
    ? { background: '#d4edda', color: '#155724' }
    : { background: '#f8d7da', color: '#721c24' }

  return (
    <DashboardLayout>
      <div className="container">

        {/* Stats */}
        <div className="stats">
          {[
            ['Tổng tài khoản',   stats.totalUsers     ?? '—'],
            ['CLB/Đội/Nhóm',     stats.totalClubs     ?? '—'],
            ['Quản lý cấp cao',  stats.totalApprovers ?? '—'],
            ['Sinh viên',        stats.totalStudents  ?? '—'],
          ].map(([label, num]) => (
            <div key={label} className="stat-item">
              <div className="number">{num}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Danh sách tài khoản</h2>
            <button className="btn btn-success" onClick={openCreate}>Tạo tài khoản mới</button>
          </div>

          {/* Filter + Search */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
              style={styles.select}>
              <option value="ALL">Tất cả vai trò</option>
              <option value="CLUB">CLB/Đội/Nhóm</option>
              <option value="APPROVER">Quản lý cấp cao</option>
              <option value="STUDENT">Sinh viên</option>
            </select>
            <form onSubmit={e => { e.preventDefault(); setSearchKw(searchInput) }}
              style={{ display: 'flex', width: '33%', minWidth: 200 }}>
              <div className="search-bar-inner" style={{ width: '100%' }}>
                <input type="text" placeholder="Tìm tên, username, CLB..."
                  value={searchInput} onChange={e => setSearch(e.target.value)} />
                <button type="submit" className="search-bar-btn" title="Tìm kiếm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                    style={{ width: 17, height: 17 }}>
                    <circle cx="11" cy="11" r="7"/>
                    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : (
            <div className="table-wrap">
              <table>
                <colgroup>
                  <col style={{ width: '4%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '25%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>STT</th><th>Username</th><th>Họ tên / CLB</th>
                    <th>Vai trò</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-icon">👤</div>
                        <p>Không có dữ liệu</p>
                      </div>
                    </td></tr>
                  ) : filtered.map((u, i) => (
                    <tr key={u.idUser}>
                      <td>{i + 1}</td>
                      <td><code style={{ background: '#f0f2f5', padding: '2px 7px', borderRadius: 4, fontSize: 13 }}>{u.username}</code></td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{u.fullName}</div>
                        {u.clubName && <div style={{ fontSize: 13, color: '#6c757d' }}>{u.clubName}</div>}
                      </td>
                      <td>
                        <span className="status" style={{ background: '#e3eeff', color: '#1a3a8a' }}>
                          {getRoleLabel(u.role)}
                        </span>
                      </td>
                      <td>
                        <span className="status" style={statusStyle(u.status)}>
                          {getStatusLabel(u.status)}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: '#6c757d' }}>{formatDateOnly(u.createdDate)}</td>
                      <td>
                        <div className="action-cell">
                          <button className="btn btn-sm"
                            style={{ background: u.status === 'ACTIVE' ? '#fff3cd' : '#d4edda',
                                     color: u.status === 'ACTIVE' ? '#856404' : '#155724',
                                     border: '1px solid ' + (u.status === 'ACTIVE' ? '#ffc107' : '#28a745') }}
                            onClick={() => handleToggle(u)}>
                            {u.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
                          </button>
                          <button className="btn btn-sm"
                            style={{ background: '#e3eeff', color: '#1a3a8a', border: '1px solid #b3d4ff' }}
                            onClick={() => openEdit(u)}>
                            Sửa
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setConfirmUser(u)}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay open" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {isEdit ? 'Sửa tài khoản' : 'Tạo tài khoản mới'}
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên đăng nhập *</label>
                  <input type="text" value={form.username} onChange={f('username')} placeholder="username" />
                </div>
                <div className="form-group">
                  <label>Mật khẩu {!isEdit && '*'}</label>
                  <PasswordInput value={form.password} onChange={f('password')}
                    placeholder={isEdit ? 'Để trống nếu không đổi' : 'Mật khẩu'} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input type="text" value={form.fullName} onChange={f('fullName')} placeholder="Họ và tên đầy đủ" />
                </div>
                <div className="form-group">
                  <label>Vai trò *</label>
                  <select value={form.role} onChange={f('role')} disabled={isEdit}>
                    <option value="CLUB">CLB/Đội/Nhóm</option>
                    <option value="APPROVER">Quản lý cấp cao</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="text" value={form.phoneNumber} onChange={f('phoneNumber')} placeholder="0912345678" />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select value={form.gender} onChange={f('gender')}>
                    <option value="">-- Chọn --</option>
                    <option>Nam</option><option>Nữ</option><option>Khác</option>
                  </select>
                </div>
              </div>

              {form.role === 'CLUB' && (
                <>
                  <hr className="form-divider" />
                  <div className="form-section-title">Thông tin CLB / Đội / Nhóm</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tên đầy đủ *</label>
                      <input type="text" value={form.clubName} onChange={f('clubName')} placeholder="CLB Hướng nghiệp" />
                    </div>
                    <div className="form-group">
                      <label>Tên viết tắt</label>
                      <input type="text" value={form.clubShortName} onChange={f('clubShortName')} placeholder="CLB HN" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Người đứng đầu</label>
                      <input type="text" value={form.leaderName} onChange={f('leaderName')} placeholder="Tên người đại diện" />
                    </div>
                    <div className="form-group">
                      <label>Mã sinh viên / Cán bộ</label>
                      <input type="text" value={form.leaderCode} onChange={f('leaderCode')} placeholder="26A4020400" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>SĐT người đứng đầu</label>
                      <input type="text" value={form.leaderPhone} onChange={f('leaderPhone')} placeholder="0912345678" />
                    </div>
                    <div className="form-group">
                      <label>Đơn vị trực thuộc</label>
                      <select value={form.idOrg} onChange={f('idOrg')}>
                        <option value="">-- Chọn đơn vị --</option>
                        {orgs.map(o => <option key={o.idOrg} value={o.idOrg}>{o.orgName}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Mô tả</label>
                    <textarea rows={2} value={form.description} onChange={f('description')} />
                  </div>
                </>
              )}

              {form.role === 'APPROVER' && (
                <>
                  <hr className="form-divider" />
                  <div className="form-section-title">Thông tin Quản lý cấp cao</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tổ chức quản lý</label>
                      <input type="text" value={form.approverOrg} onChange={f('approverOrg')}
                        placeholder="Phòng Công tác sinh viên" />
                    </div>
                    <div className="form-group">
                      <label>Mã cán bộ</label>
                      <input type="text" value={form.approverCode} onChange={f('approverCode')}
                        placeholder="NHH00164" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại công tác</label>
                    <input type="text" value={form.approverPhone} onChange={f('approverPhone')}
                      placeholder="0981763425" />
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Tạo tài khoản')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmUser && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Bạn có chắc chắn muốn xóa tài khoản<br /><strong>"{confirmUser.username}"</strong>?</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmUser(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

const styles = {
  select: {
    padding: '8px 12px', border: '1.5px solid #ced4da',
    borderRadius: 6, fontSize: 14, fontFamily: 'Arial',
    background: '#fff', minWidth: 180,
  },
}
