/**
 * Reusable search bar component dùng chung cho Admin, Approver.
 * Giống hệt thanh tìm kiếm ở trang Sinh viên.
 */
export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Tìm kiếm...' }) {
  return (
    <form
      onSubmit={e => { e.preventDefault(); if (onSubmit) onSubmit() }}
      style={{ display: 'inline-flex' }}
    >
      <div className="search-bar-inner">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <button type="submit" className="search-bar-btn" title="Tìm kiếm">
          {/* Magnifier — Unicode U+1F50D, an toàn với mọi bundler */}
          <span style={{ fontSize: 15, lineHeight: 1, userSelect: 'none' }}>🔍</span>
        </button>
      </div>
    </form>
  )
}
