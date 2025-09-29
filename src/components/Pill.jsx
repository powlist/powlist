import React, { useRef, useEffect, useState } from 'react'

const Pill = ({ 
  children, 
  variant = 'default', 
  onRemove, 
  showRemove = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [contentWidth, setContentWidth] = useState(null)
  const contentRef = useRef(null)
  const pillRef = useRef(null)
  
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-colors duration-200"
  
  const variants = {
    default: "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300",
    system: "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed opacity-75",
    removable: "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
  }
  
  const variantClasses = variants[variant] || variants.default
  
  // Measure content width on mount and when content changes
  useEffect(() => {
    if (contentRef.current && showRemove) {
      const width = contentRef.current.offsetWidth
      setContentWidth(width)
    }
  }, [children, showRemove])
  
  return (
    <div
      ref={pillRef}
      className={`group relative ${baseClasses} ${variantClasses} ${className}`}
      style={{
        width: 'fit-content',
        maxWidth: '200px',
        minWidth: 'fit-content',
        flexShrink: 0
      }}
      {...props}
    >
      <span className="text-gray-500 text-sm flex-shrink-0">@</span>
      <span 
        ref={contentRef}
        className="truncate text-sm"
      >
        {children}
      </span>
      {showRemove && onRemove && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="h-full w-8 bg-gradient-to-r from-gray-100 via-gray-100 via-gray-100/80 via-gray-100/50 to-gray-100/0 flex items-center justify-end pr-1">
            <button
              onClick={onRemove}
              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-white rounded-full hover:bg-gray-100 shadow-sm border border-gray-200"
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pill
