import React from 'react'
import Tooltip from './Tooltip'

const IconButton = ({ 
  icon,
  tooltip,
  tooltipPosition = 'top',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  size = 'sm',
  variant = 'ghost',
  ...props 
}) => {
  const baseClasses = "border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    default: "bg-gray-300 hover:bg-gray-400",
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-100 hover:bg-gray-200",
    ghost: "hover:bg-gray-100"
  }
  
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  }
  
  const variantClasses = variants[variant] || variants.ghost
  const sizeClasses = sizes[size] || sizes.sm
  
  const buttonElement = (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon}
    </button>
  )
  
  // Always wrap with tooltip if tooltip is provided
  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition} disabled={disabled}>
        {buttonElement}
      </Tooltip>
    )
  }
  
  return buttonElement
}

export default IconButton
