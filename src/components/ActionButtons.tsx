import React from 'react'
import Button from './Button.tsx'
import Icon from './Icon.tsx'
import Tooltip from './Tooltip.tsx'

interface ActionButtonsProps {
  hasContent: boolean;
  disabled: boolean;
  onRefine: () => void;
  onSend: () => void;
  onContextClick: () => void;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  hasContent, 
  disabled, 
  onRefine, 
  onSend,
  onContextClick,
  className = ''
}) => {
  const sendIcon = <Icon name="IconArrowUp" className="w-5 h-5" color="white" />

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1">
        {/* Add context button - always visible */}
        <Tooltip 
          content="Add context"
          position="top"
        >
          <button 
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            onClick={onContextClick}
            disabled={disabled}
          >
            <Icon name="IconPlus" className="w-4 h-4" color="#6B7280" />
          </button>
        </Tooltip>
        
        {/* Refine button - only show when there's content */}
        {hasContent && (
          <button 
            className="h-8 px-2 py-2 rounded-xl gap-2 text-[#3d3d3d] text-sm font-medium hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
        tooltip={hasContent ? "Send message" : "Type a message to send"}
      />
    </div>
  )
}

export default ActionButtons

