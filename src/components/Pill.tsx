import React, { useRef, useEffect, useState, forwardRef } from 'react'
import Tooltip from './Tooltip.tsx'
import Icon from './Icon.tsx'

type PillVariant = 'default' | 'removable';

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: PillVariant;
  onRemove?: () => void;
  showRemove?: boolean;
  disabled?: boolean;
  className?: string;
  removeTooltip?: string;
  icon?: string | null;
  iconColor?: string;
}

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
const Pill = forwardRef<HTMLDivElement, PillProps>(({ 
  children, 
  variant = 'default', 
  onRemove, 
  showRemove = false,
  disabled = false,
  className = '',
  removeTooltip = 'Remove',
  icon = null,
  iconColor = 'var(--pill-icon-color, #6B7280)',
  ...props 
}, ref) => {
  const [contentWidth, setContentWidth] = useState<number | null>(null)
  const contentRef = useRef<HTMLSpanElement>(null)
  
  const baseClasses = "inline-flex items-center rounded-full transition-colors duration-200"
  const iconSize = "w-5 h-5"
  
  const variants: Record<PillVariant, string> = {
    default: "text-[#1f1f1f] bg-white hover:bg-gray-50",
    removable: "text-[#1f1f1f] bg-white hover:bg-gray-50"
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
      ref={ref}
      className={`group relative ${baseClasses} ${variantClasses} ${disabledClasses} ${className} w-fit max-w-[200px] shrink-0 h-8 border border-[#e0e0e0] pl-2 pr-3 py-1 gap-2`}
      {...props}
    >
      {/* Icon container with same size as button */}
      {showRemove && onRemove && !disabled ? (
        <Tooltip content={removeTooltip} position="top" disabled={disabled}>
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 relative">
            {/* Dynamic icon with @ fallback */}
            {icon && (
              <Icon 
                name={icon} 
                className={`${iconSize} transition-opacity duration-200 group-hover:opacity-0`} 
                color={iconColor} 
              />
            )}
            
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
          {icon && (
            <Icon 
              name={icon} 
              className={iconSize} 
              color={iconColor} 
            />
          )}
        </div>
      )}
      
      <span 
        ref={contentRef}
        className="truncate font-medium text-sm leading-5 tracking-[-0.14px] text-[#1f1f1f]"
      >
        {children}
      </span>
    </div>
  )
})

Pill.displayName = 'Pill'

export default Pill

