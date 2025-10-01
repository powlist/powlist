import React, { useRef, useEffect, useState } from 'react'
import IconButton from './IconButton'

const Pill = ({ 
  children, 
  variant = 'default', 
  onRemove, 
  showRemove = false,
  disabled = false,
  className = '',
  removeTooltip = 'Remove',
  ...props 
}) => {
  const [contentWidth, setContentWidth] = useState(null)
  const contentRef = useRef(null)
  const pillRef = useRef(null)
  
  const baseClasses = "inline-flex items-center gap-0.5 pl-1 pr-3 h-8 text-sm rounded-full transition-colors duration-200"
  
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
      {/* Icon container with same size as button */}
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
        {/* @ icon that gets replaced on hover only for removable pills */}
        <span className={`text-gray-400 text-sm transition-opacity duration-200 ${showRemove && onRemove && !disabled ? 'group-hover:opacity-0' : ''}`}>@</span>
        
        {/* Remove button that appears on hover only for removable pills */}
        {showRemove && onRemove && !disabled && (
          <IconButton
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            tooltip={removeTooltip}
            tooltipPosition="top"
            disabled={disabled}
            onClick={onRemove}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            size="sm"
            variant="ghost"
          />
        )}
      </div>
      
      <span 
        ref={contentRef}
        className="truncate text-sm"
      >
        {children}
      </span>
    </div>
  )
}

export default Pill