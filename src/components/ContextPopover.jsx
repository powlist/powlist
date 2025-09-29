import React, { useRef, useEffect } from 'react'

const ContextPopover = ({ 
  isOpen, 
  onClose, 
  items = [], 
  onItemSelect, 
  searchValue, 
  onSearchChange,
  className = ''
}) => {
  const popoverRef = useRef(null)

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={popoverRef}
      className={`absolute top-16 left-0 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-lg ${className}`}
    >
      {/* Search input */}
      <div className="p-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search context..."
          value={searchValue}
          onChange={onSearchChange}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>
      
      {/* Items list */}
      <div className="max-h-60 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              key={index}
              onClick={() => onItemSelect(item)}
              className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="truncate text-sm">{item}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-3 py-1.5 text-center text-sm text-gray-500">
            {searchValue ? 'No items found' : 'No recent items'}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContextPopover
