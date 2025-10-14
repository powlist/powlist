import React, { useState, useRef, useEffect } from 'react'

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: TooltipPosition;
  disabled?: boolean;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const positions: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  const arrows: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  }

  const handleMouseEnter = () => {
    if (!disabled && content) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(true)
      // Start animation after a brief delay to allow positioning
      timeoutRef.current = setTimeout(() => setIsAnimating(true), 10)
    }
  }

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsAnimating(false)
    // Hide after animation completes
    timeoutRef.current = setTimeout(() => setIsVisible(false), 200)
  }

  const handleFocus = () => {
    if (!disabled && content) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsVisible(true)
      // Start animation after a brief delay to allow positioning
      timeoutRef.current = setTimeout(() => setIsAnimating(true), 10)
    }
  }

  const handleBlur = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsAnimating(false)
    // Hide after animation completes
    timeoutRef.current = setTimeout(() => setIsVisible(false), 200)
  }

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let newPosition: React.CSSProperties = { ...tooltipPosition }

      // Adjust position based on viewport boundaries
      if (position === 'top' && triggerRect.top - tooltipRect.height < 0) {
        newPosition = { ...newPosition, top: triggerRect.bottom + 8 }
      } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > viewport.height) {
        newPosition = { ...newPosition, top: triggerRect.top - tooltipRect.height - 8 }
      }

      setTooltipPosition(newPosition)
    }
  }, [isVisible, position, tooltipPosition])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Get animation transform based on position
  const getAnimationTransform = () => {
    if (!isAnimating) {
      const transforms: Record<TooltipPosition, string> = {
        top: 'translate-y-1 scale-95',
        bottom: '-translate-y-1 scale-95',
        left: 'translate-x-1 scale-95',
        right: '-translate-x-1 scale-95'
      }
      return transforms[position] || ''
    }
    return ''
  }

  if (!content || disabled) {
    return <>{children}</>
  }

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap transition-all duration-200 ease-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          } ${positions[position]} ${getAnimationTransform()}`}
          style={tooltipPosition}
          role="tooltip"
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 transition-all duration-200 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          } ${arrows[position]}`} />
        </div>
      )}
    </div>
  )
}

export default Tooltip

