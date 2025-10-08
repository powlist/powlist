import React, { useRef, useEffect, useState } from 'react'
import Tooltip from './Tooltip'
import Icon from './Icon'

/**
 * Pill Component with Dynamic Icons
 * 
 * Available Icons (from icons/ folder):
 * 
 * Marketing & Campaigns: banner, offer
 * Product & Development: content, code, conmponent, container
 * Design & UI/UX: color, grid_view, columns, carousel
 * Data & Analytics: data, number, decimal
 * Content & Media: media, file, page, text, title, richtext, short-text
 * Communication: email, Phone, link
 * Forms & Input: boolean, select single, multioption, date, time, price, sku
 * Navigation: menu, click
 * Dynamic & Interactive: dynamic, relation, content-block, split-label
 */
const Pill = ({ 
  children, 
  variant = 'default', 
  onRemove, 
  showRemove = false,
  disabled = false,
  className = '',
  removeTooltip = 'Remove',
  icon = null, // Icon name from icons/ folder
  iconColor = 'var(--pill-icon-color, #6B7280)', // Uses CSS custom property with fallback
  ...props 
}) => {
  const [contentWidth, setContentWidth] = useState(null)
  const contentRef = useRef(null)
  const pillRef = useRef(null)
  
  const baseClasses = "inline-flex items-center gap-0.5 pl-1 pr-3 h-8 text-sm rounded-full transition-colors duration-200"
  const iconSize = "w-4 h-4" // Single definition for all icon sizes
  
  const variants = {
    default: "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    removable: "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
  }
  
  const variantClasses = variants[variant] || variants.default
  
  // Apply disabled styles when disabled prop is true
  const disabledClasses = disabled ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed opacity-75" : ""
  
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
      className={`group relative ${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      style={{
        width: 'fit-content',
        maxWidth: '200px',
        minWidth: 'fit-content',
        flexShrink: 0
      }}
      {...props}
    >
      {/* Icon container with same size as button */}
      {showRemove && onRemove && !disabled ? (
        <Tooltip content={removeTooltip} position="top" disabled={disabled}>
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
            {/* Dynamic icon with @ fallback */}
            <Icon 
              name={icon} 
              className={`${iconSize} transition-opacity duration-200 group-hover:opacity-0`} 
              color={iconColor} 
            />
            
            {/* Remove button that appears on hover only for removable pills */}
            <button
              onClick={onRemove}
              className="absolute inset-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </Tooltip>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          {/* Dynamic icon with @ fallback */}
          <Icon 
            name={icon} 
            className={iconSize} 
            color={iconColor} 
          />
        </div>
      )}
      
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