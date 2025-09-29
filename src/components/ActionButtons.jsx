import React from 'react'
import Button from './Button'

const ActionButtons = ({ 
  hasContent, 
  disabled, 
  onRefine, 
  onSend,
  className = ''
}) => {
  const plusIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
      <path 
        d="M12 5V19M5 12H19" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )

  const sendIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.46967 2.59467C9.76256 2.30178 10.2374 2.30178 10.5303 2.59467L16.1553 8.21967C16.4482 8.51256 16.4482 8.98744 16.1553 9.28033C15.8624 9.57322 15.3876 9.57322 15.0947 9.28033L10.75 4.93566V16.875C10.75 17.2892 10.4142 17.625 10 17.625C9.58579 17.625 9.25 17.2892 9.25 16.875V4.93566L4.90533 9.28033C4.61244 9.57322 4.13756 9.57322 3.84467 9.28033C3.55178 8.98744 3.55178 8.51256 3.84467 8.21967L9.46967 2.59467Z" fill="white"/>
    </svg>
  )

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        {/* Plus button - always visible */}
        <Button 
          icon={plusIcon}
          variant="ghost"
          disabled={disabled}
        />
        
        {/* Refine button - only show when there's content */}
        {hasContent && (
          <button 
            className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            onClick={onRefine}
            disabled={disabled}
            type="button"
          >
            Refine prompt
            <span className="text-sm opacity-50 font-normal">⌘⇧↵</span>
          </button>
        )}
      </div>
      
      {/* Send button - always show */}
      <Button 
        icon={sendIcon}
        variant={hasContent ? 'primary' : 'default'}
        onClick={onSend}
        disabled={disabled || !hasContent}
      />
    </div>
  )
}

export default ActionButtons
