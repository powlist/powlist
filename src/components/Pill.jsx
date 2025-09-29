import React from 'react'

const Pill = ({ 
  children, 
  variant = 'default', 
  onRemove, 
  showRemove = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-all duration-200"
  
  const variants = {
    default: "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300",
    system: "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed opacity-75",
    removable: "text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
  }
  
  const variantClasses = variants[variant] || variants.default
  
  return (
    <div
      className={`group relative ${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="text-gray-500 text-sm">@</span>
      <span className="truncate flex-1 min-w-0 text-sm">{children}</span>
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="hidden w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 group-hover:flex bg-white rounded-full hover:bg-gray-100 shadow-sm border border-gray-200 flex-shrink-0"
          type="button"
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}

export default Pill
