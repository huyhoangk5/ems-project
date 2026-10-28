import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getApproverStats, getAllEvents, reviewEvent } from '../../api/events'
import { getStatusLabel, formatDate, getErrorMessage, imgSrc } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_CLS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' }
const STATUS_LBL = { PENDING: 'Chờ duyệt', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối' }

export default function ApproverPage() {
  const [stats, setStats]         = useState({})
  const [events, setEvents]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [filterStatus, setFilter] = useState('ALL')
  const [searchInput, setSearch]  = useState('')
  const [searchKw, setSearchKw]   = useState('')
  const [detail, setDetail]       = useState(null)
  const [rejectEv, setRejectEv]   = useState(null)
  const [rejectReason, setReason] = useState('')
  const [saving, setSaving]       = useState(false)
  const [confirmApprove, setCA]   = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [s, e] = await Promise.all([getApproverStats(), getAllEvents()])
      setStats(s.data.data || {})
      setEvents(e.data.data || [])
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setLoading(false) }
  }

  const [rejectError, setRejectError] = useState('')

  async function handleApprove(ev) {
    setSaving(true)
    try {
      await reviewEvent(ev.idEvent, { action: 'APPROVE' })
      toast.success('Phê duyệt sự kiện thành công')
      setCA(null); setDetail(null); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      setRejectError('Vui lòng nhập lý do từ chối')
      return toast.error('Vui lòng nhập lý do từ chối')
    }
    setRejectError('')
    setSaving(true)
    try {
      await reviewEvent(rejectEv.idEvent, { action: 'REJECT', reason: rejectReason })
      toast.success('Đã từ chối sự kiện')
      setRejectEv(null); setReason(''); load()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setSaving(false) }
  }

  const filtered = events.filter(ev => {
    const ms = filterStatus === 'ALL' || ev.status === filterStatus
    const mk = !searchKw ||
      ev.nameEvent?.toLowerCase().includes(searchKw.toLowerCase()) ||
      ev.clubName?.toLowerCase().includes(searchKw.toLowerCase())
    return ms && mk
  })

  return (
    <DashboardLayout>
      <div className="container">

        {/* Stats */}
        <div className="stats">
          {[
            ['Tổng sự kiện',  stats.totalEvents    ?? '—'],
            ['Đã duyệt',      stats.approvedEvents ?? '—'],
            ['Chờ duyệt',     stats.pendingEvents  ?? '—'],
            ['Từ chối',       stats.rejectedEvents ?? '—'],
          ].map(([label, num]) => (
            <div key={label} className="stat-item">
              <div className="number">{num}</div>
              <div className="label">{label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Danh sách sự kiện</h2>
          </div>

          {/* Filter + Search */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={filterStatus} onChange={e => setFilter(e.target.value)}
              style={styles.select}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>

            <form onSubmit={e => { e.preventDefault(); setSearchKw(searchInput) }}
              style={{ display: 'flex', width: '33%', minWidth: 200 }}>
              <div className="search-bar-inner" style={{ width: '100%' }}>
                <input type="text" placeholder="Tìm sự kiện, CLB..."
                  value={searchInput}
                  onChange={e => setSearch(e.target.value)} />
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
                  <col style={{ width: '22%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '9%' }} />
                  <col style={{ width: '17%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sự kiện</th>
                    <th>CLB tổ chức</th>
                    <th>Thời gian</th>
                    <th>Địa điểm</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>Không có sự kiện nào</p>
                      </div>
                    </td></tr>
                  ) : filtered.map((ev, i) => (
                    <tr key={ev.idEvent}>
                      <td>{i + 1}</td>
                      <td className="td-wrap" style={{ fontWeight: 600 }}>{ev.nameEvent}</td>
                      <td>{ev.clubShortName || ev.clubName}</td>
                      <td style={{ lineHeight: 1.6 }}>
                        {formatDate(ev.startDate)}<br />
                        <span style={{ color: '#6c757d' }}>→ {formatDate(ev.endDate)}</span>
                      </td>
                      <td className="td-wrap">{ev.location || '—'}</td>
                      <td>
                        <span className={`status ${STATUS_CLS[ev.status] || ''}`}>
                          {STATUS_LBL[ev.status] || ev.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-cell">
                          {ev.status === 'PENDING' && (
                            <button className="btn btn-success btn-sm"
                              onClick={() => setCA(ev)}>
                              Duyệt
                            </button>
                          )}
                          {ev.status === 'PENDING' && (
                            <button className="btn btn-danger btn-sm"
                              onClick={() => { setRejectEv(ev); setReason('') }}>
                              Từ chối
                            </button>
                          )}
                          <button className="btn btn-sm"
                            style={{ background: '#e9ecef', color: '#343a40' }}
                            onClick={() => setDetail(ev)}>
                            Chi tiết
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

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay open" onClick={() => setDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              Chi tiết sự kiện
              <button className="modal-close" onClick={() => setDetail(null)}>✕</button>
            </div>
            {detail.image && (
              <img src={imgSrc(detail.image)} alt=""
                style={{ width: '100%', height: 210, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            )}
            <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{detail.nameEvent}</h3>
            <p style={{ color: '#6c757d', marginBottom: 14 }}>
              Tổ chức bởi: <strong style={{ color: '#1a3a8a' }}>{detail.clubName}</strong>
            </p>
            {detail.description && (
              <p style={{ marginBottom: 16, lineHeight: 1.75, fontSize: 15 }}>{detail.description}</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                ['Thời gian bắt đầu', formatDate(detail.startDate)],
                ['Thời gian kết thúc', formatDate(detail.endDate)],
                ['Hạn đăng ký', formatDate(detail.registrationDeadline)],
                ['Địa điểm', detail.location],
                ['Số lượng tối đa', detail.maxRegistration ?? 'Không giới hạn'],
                ['Trạng thái', STATUS_LBL[detail.status] || detail.status],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '11px 14px', background: '#f7f9fc', borderRadius: 7, border: '1px solid #e9ecef' }}>
                  <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            {detail.rejectionReason && (
              <div style={{ padding: 14, background: '#fff3cd', borderRadius: 7, marginBottom: 14, fontSize: 14 }}>
                <strong>Lý do từ chối:</strong> {detail.rejectionReason}
              </div>
            )}
            {detail.status === 'PENDING' && (
              <div className="modal-footer">
                <button className="btn btn-danger"
                  onClick={() => { setDetail(null); setRejectEv(detail); setReason('') }}>
                  Từ chối
                </button>
                <button className="btn btn-success"
                  onClick={() => { setDetail(null); setCA(detail) }}>
                  Phê duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectEv && (
        <div className="modal-overlay open" onClick={() => setRejectEv(null)}>
          <div className="modal-content sm" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              Từ chối sự kiện
              <button className="modal-close" onClick={() => setRejectEv(null)}>✕</button>
            </div>
            <p style={{ fontSize: 15, color: '#555', marginBottom: 14 }}>
              Sự kiện: <strong>{rejectEv.nameEvent}</strong>
            </p>
            <div className="form-group">
              <label>Lý do từ chối *</label>
              <textarea rows={4} value={rejectReason}
                onChange={e => { setReason(e.target.value); if (rejectError) setRejectError('') }}
                style={rejectError ? { borderColor: '#dc3545' } : {}}
                placeholder="Nhập lý do để CLB/Đội/Nhóm có thể điều chỉnh..." />
              {rejectError && <div style={{ color: '#dc3545', fontSize: 13, marginTop: 4 }}>{rejectError}</div>}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setRejectEv(null)}>Hủy</button>
              <button className="btn btn-danger" onClick={handleReject} disabled={saving}>
                {saving ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve */}
      {confirmApprove && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Phê duyệt sự kiện<br /><strong>"{confirmApprove.nameEvent}"</strong>?</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setCA(null)}>Hủy</button>
              <button className="btn btn-success" onClick={() => handleApprove(confirmApprove)} disabled={saving}>
                {saving ? '...' : 'Phê duyệt'}
              </button>
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
