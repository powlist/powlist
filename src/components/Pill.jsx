import React, { useRef, useEffect, useState } from 'react'
import Tooltip from './Tooltip'

// Icon component to handle SVG icons
const Icon = ({ name, className = "w-4 h-4", color = "currentColor" }) => {
  const [svgContent, setSvgContent] = useState(null)
  
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/icons/${name}.svg`)
        const svgText = await response.text()
        setSvgContent(svgText)
      } catch (error) {
        console.warn(`Failed to load icon: ${name}`)
        setSvgContent(null)
      }
    }
    
    if (name) {
      loadSvg()
    }
  }, [name])
  
  // If no SVG content loaded, show a simple tag icon as fallback
  if (!svgContent) {
    return (
      <div className={className} style={{ color }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10 1.75C5.44365 1.75 1.75 5.44365 1.75 10C1.75 14.5563 5.44365 18.25 10 18.25C14.5563 18.25 18.25 14.5563 18.25 10C18.25 5.44365 14.5563 1.75 10 1.75ZM3.25 10C3.25 6.27208 6.27208 3.25 10 3.25C13.7279 3.25 16.75 6.27208 16.75 10C16.75 13.7279 13.7279 16.75 10 16.75C6.27208 16.75 3.25 13.7279 3.25 10Z" fill="currentColor"/>
        </svg>
      </div>
    )
  }
  
  // Replace fill colors and add size constraints to the SVG
  let coloredSvg = svgContent.replace(/fill="#[^"]*"/g, `fill="${color}"`)
  
  // Add width and height attributes to ensure proper sizing
  coloredSvg = coloredSvg.replace(
    /<svg([^>]*)>/,
    '<svg$1 width="100%" height="100%" style="width: 100%; height: 100%;">'
  )
  
  return (
    <div 
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
    />
  )
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
    default: "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300",
    removable: "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
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