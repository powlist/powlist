import React from 'react'
import Tooltip from './Tooltip.tsx'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const IconButton: React.FC<IconButtonProps> = ({ 
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
  const baseClasses = "border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants: Record<ButtonVariant, string> = {
    default: "bg-gray-300 hover:bg-gray-400",
    primary: "hover:opacity-90",
    secondary: "bg-gray-100 hover:bg-gray-200",
    ghost: "hover:bg-gray-100"
  }
  
  const sizes: Record<ButtonSize, string> = {
    sm: "w-9 h-9",
    md: "w-9 h-9",
    lg: "w-10 h-10"
  }
  
  const variantClasses = variants[variant] || variants.ghost
  const sizeClasses = sizes[size] || sizes.sm
  
  const primaryClasses = variant === 'primary' ? 'bg-[#0366dd] w-9 h-9 p-3' : '';
  const sizeSmClasses = size === 'sm' && variant !== 'primary' ? 'w-9 h-9 p-3' : '';
  
  const buttonElement = (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${primaryClasses} ${sizeSmClasses} ${className}`}
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

