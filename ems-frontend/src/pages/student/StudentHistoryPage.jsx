import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getMyRegistrations } from '../../api/events'
import { formatDate, getErrorMessage } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function StudentHistoryPage() {
  const [regs, setRegs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    getMyRegistrations()
      .then(r => setRegs(r.data.data || []))
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const displayed = filter === 'ALL' ? regs : regs.filter(r => r.status === filter)
  const statusCls = { REGISTERED: 'registered', CANCELLED: 'cancelled' }
  const statusLbl = { REGISTERED: 'Đã đăng ký', CANCELLED: 'Đã hủy' }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2>📖 Lịch sử đăng ký sự kiện</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['ALL', 'REGISTERED', 'CANCELLED'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
                  {s === 'ALL' ? 'Tất cả' : s === 'REGISTERED' ? '✅ Đã đăng ký' : '❌ Đã hủy'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : displayed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <p>Bạn chưa đăng ký sự kiện nào</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <colgroup>
                  <col style={{width:'5%'}}/><col style={{width:'25%'}}/><col style={{width:'15%'}}/>
                  <col style={{width:'18%'}}/><col style={{width:'15%'}}/><col style={{width:'12%'}}/><col style={{width:'10%'}}/>
                </colgroup>
                <thead>
                  <tr>
                    <th>STT</th><th>Tên sự kiện</th><th>CLB tổ chức</th>
                    <th>Thời gian sự kiện</th><th>Ngày đăng ký</th><th>Ngày hủy</th><th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map((r, i) => (
                    <tr key={r.idRegistration}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{r.eventName}</td>
                      <td style={{ fontSize: 13, color: '#6c757d' }}>{r.clubName || '—'}</td>
                      <td style={{ fontSize: 12, lineHeight: 1.6 }}>
                        {formatDate(r.eventStartDate)}<br />→ {formatDate(r.eventEndDate)}
                      </td>
                      <td style={{ fontSize: 13 }}>{formatDate(r.registrationDate)}</td>
                      <td style={{ fontSize: 13 }}>{r.cancelledDate ? formatDate(r.cancelledDate) : '—'}</td>
                      <td><span className={`status ${statusCls[r.status] || ''}`}>{statusLbl[r.status] || r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
