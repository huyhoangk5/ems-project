import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getApprovedEvents, registerEvent, cancelEvent, getMyRegistrations } from '../../api/events'
import api from '../../api/axios'
import { formatDate, getErrorMessage, imgSrc } from '../../utils/helpers'
import toast from 'react-hot-toast'

const TIME_STATUS = {
  UPCOMING: { label: 'Sắp diễn ra', cls: 'upcoming' },
  ONGOING:  { label: 'Đang diễn ra', cls: 'ongoing'  },
  ENDED:    { label: 'Đã kết thúc',  cls: 'ended'    },
}

const metaLabel = { fontWeight: 600, color: '#495057', marginRight: 2 }

export default function StudentEventsPage() {
  const [tab, setTab] = useState('events')

  // Events
  const [events, setEvents]         = useState([])
  const [clubs, setClubs]           = useState([])
  const [loadingEv, setLoadingEv]   = useState(true)
  const [detail, setDetail]         = useState(null)
  const [actLoading, setActLoading] = useState(null)
  const [filters, setFilters] = useState({
    keyword: '', clubId: '', startDate: '', endDate: '', timeStatus: 'ALL'
  })
  const [searchInput, setSearchInput] = useState('')

  // History
  const [regs, setRegs]               = useState([])
  const [loadingHist, setLoadingHist] = useState(false)
  const [histFilter, setHistFilter]   = useState('ALL')

  useEffect(() => {
    api.get('/events/public/clubs').then(r => setClubs(r.data.data || [])).catch(() => {})
    fetchEvents()
  }, [])

  async function fetchEvents(overrideFilters) {
    setLoadingEv(true)
    const f = overrideFilters || filters
    try {
      const params = {}
      if (f.clubId)    params.clubId    = f.clubId
      if (f.keyword)   params.keyword   = f.keyword
      if (f.startDate) params.startDate = f.startDate + ':00'
      if (f.endDate)   params.endDate   = f.endDate   + ':00'
      const r = await getApprovedEvents(params)
      setEvents(r.data.data || [])
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setLoadingEv(false) }
  }

  async function fetchHistory() {
    setLoadingHist(true)
    try {
      const r = await getMyRegistrations()
      setRegs(r.data.data || [])
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setLoadingHist(false) }
  }

  function handleTabChange(t) {
    setTab(t)
    if (t === 'history' && regs.length === 0) fetchHistory()
  }

  async function handleRegister(ev, e) {
    if (e) e.stopPropagation()
    setActLoading(ev.idEvent)
    try {
      await registerEvent(ev.idEvent)
      toast.success('Đăng ký thành công!')
      fetchEvents()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setActLoading(null) }
  }

  async function handleCancel(ev, e) {
    if (e) e.stopPropagation()
    setActLoading(ev.idEvent)
    try {
      await cancelEvent(ev.idEvent)
      toast.success('Đã hủy đăng ký!')
      fetchEvents()
      if (tab === 'history') fetchHistory()
    } catch (err) { toast.error(getErrorMessage(err)) }
    finally { setActLoading(null) }
  }

  function handleSearch(e) {
    e.preventDefault()
    const newF = { ...filters, keyword: searchInput }
    setFilters(newF)
    fetchEvents(newF)
  }

  function resetFilters() {
    const fresh = { keyword: '', clubId: '', startDate: '', endDate: '', timeStatus: 'ALL' }
    setFilters(fresh)
    setSearchInput('')
    fetchEvents(fresh)
  }

  function updateFilter(key, val) {
    const newF = { ...filters, [key]: val }
    setFilters(newF)
    // Auto-apply filter ngay khi thay doi select/date
    if (key !== 'keyword') fetchEvents(newF)
  }

  const displayed = filters.timeStatus === 'ALL'
    ? events
    : events.filter(ev => ev.timeStatus === filters.timeStatus)

  const displayedRegs = histFilter === 'ALL'
    ? regs
    : regs.filter(r => r.status === histFilter)

  const isFull = ev => ev.maxRegistration && ev.numberOfRegistration >= ev.maxRegistration

  return (
    <DashboardLayout>
      <div className="container">

        {/* TABS */}
        <div className="tab-bar">
          <button className={`tab-btn${tab === 'events' ? ' active' : ''}`}
            onClick={() => handleTabChange('events')}>
            Danh sách sự kiện{tab === 'events' ? ` (${displayed.length})` : ''}
          </button>
          <button className={`tab-btn${tab === 'history' ? ' active' : ''}`}
            onClick={() => handleTabChange('history')}>
            Lịch sử đăng ký
          </button>
        </div>

        {/* ===== DANH SÁCH SỰ KIỆN ===== */}
        {tab === 'events' && (
          <div className="student-layout">

            {/* Sidebar */}
            <aside className="sidebar">
              <h3>Bộ lọc</h3>
              <div className="filter-group">
                <label>CLB/Đội/Nhóm</label>
                <select value={filters.clubId} onChange={e => updateFilter('clubId', e.target.value)}>
                  <option value="">Tất cả CLB</option>
                  {clubs.map(c => (
                    <option key={c.idClub} value={c.idClub}>{c.shortName || c.clubName}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Từ ngày</label>
                <input type="datetime-local" value={filters.startDate}
                  onChange={e => updateFilter('startDate', e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Đến ngày</label>
                <input type="datetime-local" value={filters.endDate}
                  onChange={e => updateFilter('endDate', e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Trạng thái</label>
                <select value={filters.timeStatus}
                  onChange={e => updateFilter('timeStatus', e.target.value)}>
                  <option value="ALL">Tất cả</option>
                  <option value="UPCOMING">Sắp diễn ra</option>
                  <option value="ONGOING">Đang diễn ra</option>
                  <option value="ENDED">Đã kết thúc</option>
                </select>
              </div>
              <button type="button" className="btn btn-secondary"
                onClick={resetFilters}
                style={{ width: '100%', justifyContent: 'center', marginTop: 6, fontSize: 13 }}>
                Đặt lại bộ lọc
              </button>
            </aside>

            {/* Main */}
            <div className="main-content">
              {/* Search bar */}
              <form onSubmit={handleSearch} className="search-bar-wrap" style={{ marginBottom: 18 }}>
                <div className="search-bar-inner">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sự kiện..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="search-bar-btn" title="Tìm kiếm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                      style={{ width: 18, height: 18 }}>
                      <circle cx="11" cy="11" r="7"/>
                      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
                    </svg>
                  </button>
                </div>
              </form>

              {loadingEv ? (
                <div className="spinner-wrap"><div className="spinner" /></div>
              ) : displayed.length === 0 ? (
                <div className="empty-state" style={{ background: '#fff', borderRadius: 8, padding: 60 }}>
                  <div className="empty-icon">🎉</div>
                  <p>Không tìm thấy sự kiện phù hợp</p>
                </div>
              ) : (
                <div className="event-grid">
                  {displayed.map(ev => {
                    const ts   = TIME_STATUS[ev.timeStatus] || { label: ev.timeStatus, cls: '' }
                    const full = isFull(ev) && !ev.isRegistered
                    return (
                      <div key={ev.idEvent} className="event-card"
                        onClick={() => setDetail(ev)}
                        title="Bấm để xem chi tiết">
                        <div className="event-card-img">
                          {ev.image
                            ? <img src={imgSrc(ev.image)} alt={ev.nameEvent} />
                            : '🎉'}
                        </div>
                        <div className="event-card-body">
                          <span className={`status ${ts.cls}`}
                            style={{ marginBottom: 8, display: 'inline-block' }}>
                            {ts.label}
                          </span>
                          <h4>{ev.nameEvent}</h4>
                          <div className="meta"><span style={metaLabel}>Bắt đầu từ:</span> {formatDate(ev.startDate)}</div>
                          <div className="meta"><span style={metaLabel}>Địa điểm:</span> {ev.location || 'Chưa cập nhật'}</div>
                          <div className="meta"><span style={metaLabel}>Đơn vị tổ chức:</span> {ev.clubShortName || ev.clubName}</div>
                          <div className="meta">
                            <span style={metaLabel}>Đã đăng ký:</span>&nbsp;
                            {ev.numberOfRegistration || 0}
                            {ev.maxRegistration ? `/${ev.maxRegistration}` : ''} người
                            {full && <span style={{ color: '#dc3545', marginLeft: 6, fontSize: 12 }}>• Đã đủ</span>}
                            {ev.isRegistered && <span style={{ color: '#28a745', marginLeft: 6, fontSize: 12 }}>• Đã đăng ký</span>}
                          </div>
                        </div>
                        <div className="event-card-actions"
                          onClick={e => e.stopPropagation()}>
                          {ev.timeStatus !== 'ENDED' && (
                            ev.isRegistered ? (
                              <button className="btn btn-danger btn-sm"
                                disabled={actLoading === ev.idEvent}
                                onClick={e => handleCancel(ev, e)}>
                                {actLoading === ev.idEvent ? '...' : 'Hủy đăng ký'}
                              </button>
                            ) : (
                              <button className="btn btn-success btn-sm"
                                disabled={actLoading === ev.idEvent || full}
                                onClick={e => handleRegister(ev, e)}>
                                {actLoading === ev.idEvent ? '...' : 'Đăng ký ngay'}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== LỊCH SỬ ===== */}
        {tab === 'history' && (
          <div className="card">
            <div className="card-header">
              <h2>Lịch sử đăng ký sự kiện</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['ALL', 'Tất cả'], ['REGISTERED', 'Đã đăng ký'], ['CANCELLED', 'Đã hủy']].map(([v, l]) => (
                  <button key={v}
                    className={`btn btn-sm ${histFilter === v ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setHistFilter(v)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {loadingHist ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : displayedRegs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📖</div>
                <p>Chưa có lịch sử đăng ký</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <colgroup>
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '26%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '19%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>STT</th><th>Tên sự kiện</th><th>CLB tổ chức</th>
                      <th>Thời gian</th><th>Ngày đăng ký</th>
                      <th>Ngày hủy</th><th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRegs.map((r, i) => (
                      <tr key={r.idRegistration}>
                        <td>{i + 1}</td>
                        <td className="td-wrap" style={{ fontWeight: 600 }}>{r.eventName}</td>
                        <td style={{ color: '#6c757d' }}>{r.clubName || '—'}</td>
                        <td style={{ lineHeight: 1.6 }}>
                          {formatDate(r.eventStartDate)}<br />→ {formatDate(r.eventEndDate)}
                        </td>
                        <td>{formatDate(r.registrationDate)}</td>
                        <td>{r.cancelledDate ? formatDate(r.cancelledDate) : '—'}</td>
                        <td>
                          <span className={`status ${r.status === 'REGISTERED' ? 'registered' : 'cancelled'}`}>
                            {r.status === 'REGISTERED' ? 'Đã đăng ký' : 'Đã hủy'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL — mở khi click card */}
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
            <span className={`status ${(TIME_STATUS[detail.timeStatus] || {}).cls}`}
              style={{ marginBottom: 12, display: 'inline-block' }}>
              {(TIME_STATUS[detail.timeStatus] || {}).label}
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{detail.nameEvent}</h3>
            <p style={{ color: '#6c757d', fontSize: 14, marginBottom: 14 }}>
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
                ['Số người đăng ký', `${detail.numberOfRegistration || 0}${detail.maxRegistration ? ' / ' + detail.maxRegistration : ''}`],
                ['Trạng thái đăng ký', detail.isRegistered ? '✅ Đã đăng ký' : 'Chưa đăng ký'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '11px 14px', background: '#f7f9fc', borderRadius: 7, border: '1px solid #e9ecef' }}>
                  <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            {detail.timeStatus !== 'ENDED' && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetail(null)}>Đóng</button>
                {detail.isRegistered ? (
                  <button className="btn btn-danger"
                    onClick={e => { handleCancel(detail, e); setDetail(null) }}>
                    Hủy đăng ký
                  </button>
                ) : (
                  <button className="btn btn-success"
                    disabled={isFull(detail)}
                    onClick={e => { handleRegister(detail, e); setDetail(null) }}>
                    {isFull(detail) ? 'Đã đủ số lượng' : 'Đăng ký ngay'}
                  </button>
                )}
              </div>
            )}
            {detail.timeStatus === 'ENDED' && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetail(null)}>Đóng</button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
