import React, { useState, useRef, useEffect } from 'react'

const PromptInput = ({ 
  placeholder = "Message Product builder...", 
  onSend, 
  initialValue = "",
  disabled = false 
}) => {
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleContainerClick = (e) => {
    // Don't focus if clicking on buttons
    if (e.target.closest('button')) {
      return
    }
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleSend = () => {
    if (value.trim() && onSend) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = value.trim() === ''
  const hasContent = value.trim().length > 0

  return (
    <div 
      className={`
        bg-white shadow-sm border border-gray-200 
        flex flex-col gap-3 transition-all duration-200 
        relative p-3 px-4 sm:p-4 sm:px-5
        hover:border-gray-300 hover:shadow-md
        ${isFocused ? 'border-blue-500 shadow-md' : ''} 
        ${disabled ? 'opacity-60 cursor-not-allowed hover:border-gray-200 hover:shadow-sm' : ''}
      `} 
      style={{ borderRadius: '1.75rem', minHeight: '100px' }}
      onClick={handleContainerClick}
    >
      {/* Message text area */}
      <div className="flex-1 flex items-start relative min-h-[24px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-none outline-none bg-transparent text-base leading-6 text-gray-900 resize-none font-inherit min-h-[24px] max-h-[120px] placeholder:text-gray-400 placeholder:text-base disabled:cursor-not-allowed focus:outline-none"
          rows={1}
        />
        
      </div>
      
      {/* Actions row */}
      <div className="flex items-center justify-between">
        {/* Plus button - always visible */}
        <button 
          className="border-none rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          type="button"
          disabled={disabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
            <path 
              d="M12 5V19M5 12H19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        {/* Send button - always visible */}
        <button 
          className={`border-none rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            hasContent 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          onClick={handleSend}
          disabled={disabled || !hasContent}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.46967 2.59467C9.76256 2.30178 10.2374 2.30178 10.5303 2.59467L16.1553 8.21967C16.4482 8.51256 16.4482 8.98744 16.1553 9.28033C15.8624 9.57322 15.3876 9.57322 15.0947 9.28033L10.75 4.93566V16.875C10.75 17.2892 10.4142 17.625 10 17.625C9.58579 17.625 9.25 17.2892 9.25 16.875V4.93566L4.90533 9.28033C4.61244 9.57322 4.13756 9.57322 3.84467 9.28033C3.55178 8.98744 3.55178 8.51256 3.84467 8.21967L9.46967 2.59467Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PromptInput
