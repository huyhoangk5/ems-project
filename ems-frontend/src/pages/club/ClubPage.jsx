import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getClubEvents, createEvent, updateEvent, deleteEvent, getEventRegistrations } from '../../api/events'
import { getStatusLabel, formatDate, getErrorMessage, imgSrc, toInputDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

// Professional SVG icons
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

const STATUS_LBL = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' }
const STATUS_CLS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' }
const EMPTY_FORM = {
  nameEvent: '', description: '', startDate: '', endDate: '',
  location: '', registrationDeadline: '', maxRegistration: ''
}

export default function ClubPage() {
  const [events, setEvents]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [modal, setModal]           = useState(null)
  const [selected, setSelected]     = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [imageFile, setImageFile]   = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [members, setMembers]       = useState([])
  const [confirmEv, setConfirmEv]   = useState(null)
  const [saving, setSaving]         = useState(false)

  // Realtime date validation errors
  const dateErrors = {
    endDate: form.startDate && form.endDate && form.endDate <= form.startDate
      ? 'Thời gian kết thúc phải sau thời gian bắt đầu' : '',
    registrationDeadline: form.startDate && form.registrationDeadline && form.registrationDeadline >= form.startDate
      ? 'Hạn đăng ký phải trước thời gian bắt đầu' : '',
  }
  const hasDateError = !!(dateErrors.endDate || dateErrors.registrationDeadline)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const r = await getClubEvents()
      setEvents(r.data.data || [])
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setLoading(false) }
  }

  function openCreate() {
    setForm(EMPTY_FORM); setImageFile(null); setImagePreview(null)
    setSelected(null); setModal('create')
  }

  function openEdit(ev) {
    setSelected(ev)
    setForm({
      nameEvent: ev.nameEvent || '',
      description: ev.description || '',
      startDate: toInputDateTime(ev.startDate) || '',
      endDate: toInputDateTime(ev.endDate) || '',
      location: ev.location || '',
      registrationDeadline: toInputDateTime(ev.registrationDeadline) || '',
      maxRegistration: ev.maxRegistration || '',
    })
    setImageFile(null)
    setImagePreview(imgSrc(ev.image))
    setModal('edit')
  }

  async function openMembers(ev) {
    setSelected(ev); setMembers([]); setModal('members')
    try {
      const r = await getEventRegistrations(ev.idEvent)
      setMembers(r.data.data || [])
    } catch {}
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.nameEvent || !form.startDate || !form.endDate || !form.registrationDeadline || !form.location)
      return toast.error('Vui lòng nhập đầy đủ thông tin')
    // Max registration check on edit
    if (modal === 'edit' && selected && form.maxRegistration && Number(form.maxRegistration) < (selected.numberOfRegistration || 0)) {
      return toast.error('Số người tối đa không được nhỏ hơn số người đã đăng ký')
    }
    // Time validation
    if (form.startDate && form.endDate && form.endDate <= form.startDate)
      return toast.error('Thời gian kết thúc phải sau thời gian bắt đầu')
    if (form.startDate && form.registrationDeadline && form.registrationDeadline >= form.startDate)
      return toast.error('Hạn đăng ký phải trước thời gian bắt đầu')
    const fd = new FormData()
    fd.append('event', new Blob([JSON.stringify({
      nameEvent: form.nameEvent, description: form.description,
      startDate: form.startDate, endDate: form.endDate,
      location: form.location, registrationDeadline: form.registrationDeadline,
      maxRegistration: form.maxRegistration ? Number(form.maxRegistration) : null,
    })], { type: 'application/json' }))
    if (imageFile) fd.append('image', imageFile)
    setSaving(true)
    try {
      if (modal === 'create') {
        await createEvent(fd); toast.success('Đăng tải thành công')
      } else {
        await updateEvent(selected.idEvent, fd); toast.success('Cập nhật thành công')
      }
      setModal(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    try {
      await deleteEvent(confirmEv.idEvent)
      toast.success('Xóa thành công')
      setConfirmEv(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  function handleExportExcel() {
    if (!members || members.length === 0) return toast.error('Không có dữ liệu để xuất')
    const registeredMembers = members.filter(m => m.status === 'REGISTERED')
    
    const dataToExport = registeredMembers.map((m, i) => ({
      'STT': i + 1,
      'Họ tên': m.studentName || '',
      'Mã sinh viên': m.studentCode || '',
      'Mã lớp': m.classCode || '',
      'Giới tính': m.gender || '',
      'Số điện thoại': m.phoneNumber || '',
      'Thời gian đăng ký': formatDate(m.registrationDate)
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách Đăng ký')
    
    const wscols = [{wch: 5}, {wch: 25}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 15}, {wch: 20}]
    worksheet['!cols'] = wscols
    
    XLSX.writeFile(workbook, `Danh_sach_DK_${selected?.nameEvent?.substring(0, 20)}.xlsx`)
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2>Danh sách sự kiện của CLB</h2>
            <button className="btn btn-primary" onClick={openCreate}>
              Đăng tải sự kiện mới
            </button>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>Chưa có sự kiện nào. Hãy đăng tải sự kiện đầu tiên!</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <colgroup>
                  <col style={{ width: '4%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '9%' }} />
                  {/* Thao tac: 4 icon buttons */}
                  <col style={{ width: '17%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sự kiện</th>
                    <th>Thời gian</th>
                    <th>Hạn đăng ký</th>
                    <th>Địa điểm</th>
                    <th>Đăng ký</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev, i) => (
                    <tr key={ev.idEvent}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="td-wrap" style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'normal', lineHeight: 1.4 }}>
                          {ev.nameEvent}
                        </div>
                        {ev.rejectionReason && (
                          <div style={{ fontSize: 12, color: '#dc3545', marginTop: 3, lineHeight: 1.4 }}>
                            {ev.rejectionReason.substring(0, 60)}…
                          </div>
                        )}
                      </td>
                      <td style={{ lineHeight: 1.6, fontSize: 13 }}>
                        {formatDate(ev.startDate)}<br />
                        <span style={{ color: '#6c757d' }}>→ {formatDate(ev.endDate)}</span>
                      </td>
                      <td style={{ fontSize: 13 }}>{formatDate(ev.registrationDeadline)}</td>
                      <td className="td-wrap" style={{ fontSize: 13 }}>{ev.location || '—'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 14 }}>
                        {ev.numberOfRegistration || 0}
                        {ev.maxRegistration
                          ? <span style={{ color: '#6c757d', fontWeight: 400, fontSize: 13 }}>/{ev.maxRegistration}</span>
                          : ''}
                      </td>
                      <td>
                        <span className={`status ${STATUS_CLS[ev.status] || ''}`}>
                          {STATUS_LBL[ev.status] || ev.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-cell">
                          <button className="btn-icon" title="Xem chi tiết"
                            onClick={() => { setSelected(ev); setModal('detail') }}>
                            <IconEye />
                          </button>
                          <button className="btn-icon" title="Chỉnh sửa"
                            onClick={() => openEdit(ev)}
                            disabled={ev.status === 'REJECTED' || ev.status === 'APPROVED'}
                            style={(ev.status === 'REJECTED' || ev.status === 'APPROVED') ? { opacity: 0.35, cursor: 'not-allowed' } : {}}>
                            <IconEdit />
                          </button>
                          <button className="btn-icon" title="Danh sách đăng ký"
                            onClick={() => openMembers(ev)}
                            disabled={ev.status === 'REJECTED'}
                            style={ev.status === 'REJECTED' ? { opacity: 0.35, cursor: 'not-allowed' } : {}}>
                            <IconUsers />
                          </button>
                          <button className="btn-icon"
                            title="Xóa sự kiện"
                            style={ev.status === 'REJECTED'
                              ? { borderColor: '#f5c6cb', color: '#dc3545' }
                              : { borderColor: '#f5c6cb', color: '#dc3545' }}
                            onClick={() => setConfirmEv(ev)}>
                            <IconTrash />
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

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay open" onClick={() => setModal(null)}>
          <div className="modal-content" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              {modal === 'create' ? 'Đăng tải sự kiện mới' : 'Chỉnh sửa sự kiện'}
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Tên sự kiện *</label>
                <input type="text" value={form.nameEvent}
                  onChange={e => setForm(f => ({ ...f, nameEvent: e.target.value }))}
                  placeholder="Nhập tên sự kiện" />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về sự kiện..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Thời gian bắt đầu *</label>
                  <input type="datetime-local" value={form.startDate}
                    onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Thời gian kết thúc *</label>
                  <input type="datetime-local" value={form.endDate}
                    onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    style={dateErrors.endDate ? { borderColor: '#dc3545' } : {}} />
                  {dateErrors.endDate && (
                    <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>⚠ {dateErrors.endDate}</div>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hạn đăng ký *</label>
                  <input type="datetime-local" value={form.registrationDeadline}
                    onChange={e => setForm(f => ({ ...f, registrationDeadline: e.target.value }))}
                    style={dateErrors.registrationDeadline ? { borderColor: '#dc3545' } : {}} />
                  {dateErrors.registrationDeadline && (
                    <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>⚠ {dateErrors.registrationDeadline}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>Số người tối đa</label>
                  <input type="number" min={1} value={form.maxRegistration}
                    onChange={e => setForm(f => ({ ...f, maxRegistration: e.target.value }))}
                    placeholder="Để trống nếu không giới hạn" />
                </div>
              </div>
              <div className="form-group">
                <label>Địa điểm tổ chức *</label>
                <input type="text" value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Hội trường A — Học viện Ngân hàng" />
              </div>
              <div className="form-group">
                <label>Hình ảnh sự kiện</label>
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                  onChange={e => {
                    const file = e.target.files[0]
                    if (file) {
                      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
                      if (!validTypes.includes(file.type)) {
                        e.target.value = ''
                        return toast.error('Định dạng ảnh không hợp lệ')
                      }
                      if (file.size > 3 * 1024 * 1024) {
                        e.target.value = ''
                        return toast.error('Dung lượng ảnh vượt quá 3MB')
                      }
                      setImageFile(file); setImagePreview(URL.createObjectURL(file))
                    }
                  }} />
                {imagePreview && (
                  <img src={imagePreview} alt="preview"
                    style={{ marginTop: 8, width: 130, height: 90, objectFit: 'cover', borderRadius: 6, border: '1px solid #dee2e6' }} />
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving || hasDateError}>
                  {saving ? 'Đang lưu...' : (modal === 'create' ? 'Đăng tải' : 'Lưu thay đổi')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {modal === 'detail' && selected && (
        <div className="modal-overlay open" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              Chi tiết sự kiện
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            {selected.image && (
              <img src={imgSrc(selected.image)} alt=""
                style={{ width: '100%', height: 210, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            )}
            <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12 }}>{selected.nameEvent}</h3>
            {selected.description && (
              <p style={{ marginBottom: 16, lineHeight: 1.75, fontSize: 15, color: '#444' }}>{selected.description}</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                ['Thời gian bắt đầu', formatDate(selected.startDate)],
                ['Thời gian kết thúc', formatDate(selected.endDate)],
                ['Hạn đăng ký', formatDate(selected.registrationDeadline)],
                ['Địa điểm', selected.location],
                ['Đã đăng ký', `${selected.numberOfRegistration || 0}${selected.maxRegistration ? ' / ' + selected.maxRegistration : ''}`],
                ['Trạng thái', STATUS_LBL[selected.status] || selected.status],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '11px 14px', background: '#f7f9fc', borderRadius: 7, border: '1px solid #e9ecef' }}>
                  <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            {selected.rejectionReason && (
              <div style={{ marginTop: 14, padding: 14, background: '#fff3cd', borderRadius: 7, fontSize: 14 }}>
                <strong>Lý do từ chối:</strong> {selected.rejectionReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Members Modal */}
      {modal === 'members' && selected && (
        <div className="modal-overlay open" onClick={() => setModal(null)}>
          <div className="modal-content" style={{ maxWidth: 1000 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              Danh sách đăng ký — {selected.nameEvent}
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <p style={{ marginBottom: 14, fontSize: 14, color: '#6c757d', display: 'flex', justifyContent: 'space-between' }}>
              {/* Số từ server (countRegisteredByEventId) — luôn chính xác */}
              <span>
                Đã đăng ký: <strong style={{ color: '#1a3a8a' }}>{selected.numberOfRegistration ?? 0}</strong>
                {selected.maxRegistration ? ` / ${selected.maxRegistration}` : ''}
                {members.length > 0 && members.filter(m => m.status === 'REGISTERED').length !== (selected.numberOfRegistration ?? 0) && (
                  <span style={{ color: '#6c757d', marginLeft: 6, fontSize: 12 }}>
                    (đang hiển thị {members.filter(m => m.status === 'REGISTERED').length})
                  </span>
                )}
              </span>
              <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: 13 }} onClick={handleExportExcel}>Xuất Excel</button>
            </p>
            {members.filter(m => m.status === 'REGISTERED').length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>Chưa có sinh viên đăng ký</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ tableLayout: 'auto', minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 48, textAlign: 'center' }}>STT</th>
                      <th style={{ minWidth: 160 }}>Họ tên</th>
                      <th style={{ minWidth: 120 }}>Mã sinh viên</th>
                      <th style={{ minWidth: 140 }}>Lớp</th>
                      <th style={{ minWidth: 80, textAlign: 'center' }}>Giới tính</th>
                      <th style={{ minWidth: 120 }}>Số điện thoại</th>
                      <th style={{ minWidth: 160 }}>Thời điểm đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.filter(m => m.status === 'REGISTERED').map((m, i) => (
                      <tr key={m.idRegistration}>
                        <td style={{ textAlign: 'center' }}>{i + 1}</td>
                        <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{m.studentName}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{m.studentCode}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{m.classCode}</td>
                        <td style={{ textAlign: 'center' }}>{m.gender}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{m.phoneNumber}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{formatDate(m.registrationDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmEv && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Bạn có chắc chắn muốn xóa sự kiện<br /><strong>"{confirmEv.nameEvent}"</strong>?</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmEv(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
