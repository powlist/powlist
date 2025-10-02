import React from 'react'
import Tooltip from './Tooltip'

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon,
  shortcut,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  tooltip,
  tooltipPosition = 'top',
  ...props 
}) => {
  const baseClasses = "border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    default: "bg-gray-300 hover:bg-gray-400",
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-100 hover:bg-gray-200",
    ghost: "hover:bg-gray-100"
  }
  
  const sizes = {
    sm: "w-9 h-9",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-10 h-10 sm:w-12 sm:h-12"
  }
  
  const variantClasses = variants[variant] || variants.default
  const sizeClasses = sizes[size] || sizes.md
  
  // Determine if this is an icon-only button
  const isIconOnly = icon && !children
  
  const buttonElement = (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon && icon}
      {children}
      {shortcut && (
        <span className="ml-1 text-sm opacity-50 font-normal">
          {shortcut}
        </span>
      )}
    </button>
  )
  
  // Wrap with tooltip if tooltip is provided and button is icon-only
  if (tooltip && isIconOnly) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition} disabled={disabled}>
        {buttonElement}
      </Tooltip>
    )
  }
  
  return buttonElement
}

export default Button
