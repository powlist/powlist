import React, { useRef, useEffect } from 'react'

interface StyledTextInputProps {
  value: string
  onChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder: string
  disabled: boolean
  className: string
  rows: number
  focusAfterUpdate?: boolean
}

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyPress,
  onKeyDown,
  placeholder,
  disabled,
  className,
  rows,
  focusAfterUpdate = false
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  // Handle focus after update
  useEffect(() => {
    if (focusAfterUpdate && textareaRef.current) {
      textareaRef.current.focus()
      // Position cursor at the end
      const cursorPosition = value.length
      textareaRef.current.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [focusAfterUpdate, value])

  const handleFocus = () => {
    onFocus()
  }

  const handleBlur = () => {
    onBlur()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const textarea = e.target
    const cursorPosition = textarea.selectionStart || 0
    
    // Find all @ context blocks in the new value
    const atContexts = newValue.match(/@[^@\s]+/g) || []
    
    // Check if cursor is inside any @ context block
    for (const context of atContexts) {
      const contextStart = newValue.indexOf(context)
      const contextEnd = contextStart + context.length
      
      if (cursorPosition > contextStart && cursorPosition < contextEnd) {
        // Cursor is inside a context block, prevent the change
        e.preventDefault()
        return
      }
    }
    
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget
    const cursorPosition = textarea.selectionStart || 0
    
    // Handle backspace for @ context blocks
    if (e.key === 'Backspace') {
      const textBeforeCursor = value.substring(0, cursorPosition)
      const textAfterCursor = value.substring(cursorPosition)
      
      // Check if cursor is at the end of an @ context block
      const atContextMatch = textBeforeCursor.match(/@[^@\s]+$/)
      
      if (atContextMatch) {
        // Cursor is at the end of an @ context, delete the entire block
        e.preventDefault()
        const contextStart = textBeforeCursor.lastIndexOf('@')
        const newValue = value.substring(0, contextStart) + textAfterCursor
        onChange(newValue)
        
        // Set cursor position after the deleted context
        setTimeout(() => {
          if (textarea) {
            textarea.setSelectionRange(contextStart, contextStart)
          }
        }, 0)
        return
      }
    }
    
    // Handle arrow keys to prevent cursor positioning inside context blocks
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const newPosition = e.key === 'ArrowLeft' ? cursorPosition - 1 : cursorPosition + 1
      
      // Check if the new position would be inside a context block
      const atContexts = value.match(/@[^@\s]+/g) || []
      for (const context of atContexts) {
        const contextStart = value.indexOf(context)
        const contextEnd = contextStart + context.length
        
        if (newPosition > contextStart && newPosition < contextEnd) {
          // Prevent cursor from moving inside context block
          e.preventDefault()
          // Move cursor to the end of the context block instead
          const targetPosition = e.key === 'ArrowLeft' ? contextStart : contextEnd
          setTimeout(() => {
            textarea.setSelectionRange(targetPosition, targetPosition)
          }, 0)
          return
        }
      }
    }
    
    // Call the original onKeyDown handler
    onKeyDown(e)
  }

  // Render text with styled @ references
  const renderTextWithReferences = (text: string) => {
    if (!text) return null
    
    // Find @ contexts without requiring trailing spaces
    // This matches @contextName as immutable blocks
    const atReferences = text.match(/@[^@\s]+/g) || []
    
    let result = text
    const placeholders: { [key: string]: string } = {}
    
    // Replace each @ reference with a placeholder
    atReferences.forEach((ref, index) => {
      const placeholder = `__AT_REF_${index}__`
      placeholders[placeholder] = ref // Keep the exact @contextName without spaces
      result = result.replace(ref, placeholder)
    })
    
    // Split by placeholders and render
    const parts = result.split(/(__AT_REF_\d+__)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('__AT_REF_')) {
        // This is a placeholder for an @ reference
        const ref = placeholders[part]
        const contextName = ref.substring(1) // Remove the @
        return (
          <span
            key={index}
            className="bg-gray-200 px-1 py-0.5 rounded text-gray-700 font-medium inline-block"
            style={{
              backgroundColor: '#ebebeb',
              borderRadius: '4px',
              padding: '2px 4px',
              margin: '0 1px',
              display: 'inline-block'
            }}
          >
            @{contextName}
          </span>
        )
      } else {
        // Regular text
        return <span key={index}>{part}</span>
      }
    })
  }

  return (
    <div className="relative w-full">
      {/* Visible styled text display */}
      <div
        ref={displayRef}
        className={`w-full border-none outline-none bg-transparent resize-none font-normal text-base leading-6 tracking-[-0.32px] text-black ${className}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          minHeight: '24px',
          maxHeight: '120px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1
        }}
      >
        {value ? renderTextWithReferences(value) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      
      {/* Transparent textarea for input handling and cursor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyPress={onKeyPress}
        onKeyDown={handleKeyDown}
        placeholder=""
        disabled={disabled}
        className="absolute inset-0 w-full h-full border-none outline-none bg-transparent resize-none font-normal text-base leading-6 tracking-[-0.32px] text-transparent cursor-text"
        rows={rows}
        style={{
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          zIndex: 2,
          caretColor: 'black'
        }}
      />
    </div>
  )
}

export default StyledTextInput
