import React from 'react'
import Button from './Button'
import Icon from './Icon'

const ActionButtons = ({ 
  hasContent, 
  disabled, 
  onRefine, 
  onSend,
  className = ''
}) => {
  const attachmentIcon = <Icon name="IconPaperclip" className="w-5 h-5" color="#6B7280" />
  const sendIcon = <Icon name="IconArrowUp" className="w-5 h-5" color="white" />

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1">
        {/* Attachment button - always visible */}
        <Button 
          icon={attachmentIcon}
          variant="ghost"
          disabled={disabled}
          size='sm'
          tooltip="Attach file"
        />
        
        {/* Refine button - only show when there's content */}
        {hasContent && (
          <button 
            className="px-3 py-1.5 text-sm text-gray-600  hover:bg-gray-100 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            onClick={onRefine}
            disabled={disabled}
            variant="ghost"
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
        tooltip={hasContent ? "Send message" : "Type a message to send"}
      />
    </div>
  )
}

export default ActionButtons
