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
  rows
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

  const handleFocus = () => {
    onFocus()
  }

  const handleBlur = () => {
    onBlur()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  // Render text with styled @ references
  const renderTextWithReferences = (text: string) => {
    if (!text) return null
    
    // Split by @ followed by any characters until we hit a space that's not part of the context name
    // The context names can contain spaces and parentheses, so we need to be more careful
    const parts = text.split(/(@[^@\s]+(?:\s+[^@\s]+)*)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        // This is an @ reference, style it with gray background
        const contextName = part.substring(1) // Remove the @
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
        onKeyDown={onKeyDown}
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
