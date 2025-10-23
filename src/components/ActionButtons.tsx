import React from 'react'
import Button from './Button.tsx'
import Icon from './Icon.tsx'

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
  const plusIcon = <Icon name="IconPlus" className="w-4 h-4" color="#6B7280" />
  const sendIcon = <Icon name="IconArrowUp" className="w-5 h-5" color="white" />

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1">
        {/* Add context button - always visible */}
        <Button 
          icon={plusIcon}
          variant="ghost"
          size="md"
          onClick={onContextClick}
          disabled={disabled}
          tooltip="Add context"
        />
        
        {/* Refine button - only show when there's content */}
        {hasContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefine}
            disabled={disabled}
            shortcut="⌘⇧↵"
          >
            Refine prompt
          </Button>
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

