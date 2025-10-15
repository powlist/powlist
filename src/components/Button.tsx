import React from 'react'
import Tooltip from './Tooltip.tsx'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
}

const Button: React.FC<ButtonProps> = ({ 
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
  // Determine if this is an icon-only button
  const isIconOnly = icon && !children
  
  // Base classes for all buttons
  const baseClasses = "border-none flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  
  // Variants
  const variants: Record<ButtonVariant, string> = {
    default: "bg-gray-300 hover:bg-gray-400",
    primary: "hover:opacity-90",
    secondary: "bg-gray-100 hover:bg-gray-200",
    ghost: "hover:bg-gray-100"
  }
  
  // Sizes for icon-only buttons
  const iconOnlySizes: Record<ButtonSize, string> = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10"
  }
  
  // Sizes for text buttons
  const textButtonSizes: Record<ButtonSize, string> = {
    sm: "h-8 px-2 py-2",
    md: "h-9 px-3 py-2",
    lg: "h-10 px-4 py-2"
  }
  
  const variantClasses = variants[variant] || variants.default
  const sizeClasses = isIconOnly 
    ? iconOnlySizes[size] || iconOnlySizes.md 
    : textButtonSizes[size] || textButtonSizes.md
  
  // Shape classes
  const shapeClasses = isIconOnly ? 'rounded-full flex-shrink-0' : 'rounded-xl gap-2'
  
  // Primary icon-only specific styling
  const primaryIconClasses = variant === 'primary' && isIconOnly ? 'bg-[#0366dd]' : ''
  
  // Text button specific styling
  const textButtonClasses = !isIconOnly ? 'text-[#3d3d3d] text-sm font-medium' : ''
  
  const buttonElement = (
    <button
      className={`${baseClasses} ${shapeClasses} ${variantClasses} ${sizeClasses} ${primaryIconClasses} ${textButtonClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon && icon}
      {children}
      {shortcut && (
        <span className="text-sm opacity-50 font-normal">
          {shortcut}
        </span>
      )}
    </button>
  )
  
  // Wrap with tooltip if tooltip is provided
  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition} disabled={disabled}>
        {buttonElement}
      </Tooltip>
    )
  }
  
  return buttonElement
}

export default Button

