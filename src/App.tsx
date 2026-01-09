import { useState, useRef } from 'react'
import PromptInput from './components/PromptInput.tsx'
import Icon from './components/Icon.tsx'
import { normalizeSlug } from './utils/slugNormalizer.ts'
import './App.css'

interface Message {
  id: number;
  text: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [slug, setSlug] = useState('')
  const slugInputRef = useRef<HTMLInputElement>(null)
  const isSelectingAllRef = useRef(false)
  const lastNormalizedValueRef = useRef('')

  const handleSend = (message: string) => {
    console.log('Message sent:', message)
    setMessages(prev => [...prev, { id: Date.now(), text: message, timestamp: new Date() }])
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const originalValue = input.value
    const selectionStart = input.selectionStart || 0
    const selectionEnd = input.selectionEnd || 0

    // Normalize the input immediately
    const normalized = normalizeSlug(originalValue)

    // Update state - this will trigger a re-render with the normalized value
    setSlug(normalized)
    lastNormalizedValueRef.current = normalized

    // Restore cursor/selection position after React updates the DOM
    setTimeout(() => {
      if (slugInputRef.current) {
        // If Command+A was just used, select all
        if (isSelectingAllRef.current) {
          slugInputRef.current.setSelectionRange(0, normalized.length)
          isSelectingAllRef.current = false
          return
        }

        // Check if full text was selected
        const wasFullSelection = selectionStart === 0 && selectionEnd === originalValue.length && originalValue.length > 0
        
        if (wasFullSelection) {
          // Full selection - select all normalized text
          slugInputRef.current.setSelectionRange(0, normalized.length)
        } else {
          // Calculate new cursor position by normalizing text before cursor
          const textBeforeCursor = originalValue.substring(0, selectionStart)
          const normalizedBefore = normalizeSlug(textBeforeCursor)
          const newStart = Math.min(normalizedBefore.length, normalized.length)
          
          // Calculate new selection end
          const textBeforeEnd = originalValue.substring(0, selectionEnd)
          const normalizedBeforeEnd = normalizeSlug(textBeforeEnd)
          const newEnd = Math.min(normalizedBeforeEnd.length, normalized.length)

          // Restore selection or cursor position
          slugInputRef.current.setSelectionRange(newStart, newEnd)
        }
      }
    }, 0)
  }

  const handleSlugKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Detect Command+A (select all)
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      isSelectingAllRef.current = true
      // Let the default behavior happen, then we'll ensure selection in onChange
      return
    }
    
    // Intercept space key and convert to hyphen
    if (e.key === ' ' || e.key === 'Space') {
      e.preventDefault()
      const input = e.currentTarget
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const currentValue = slug
      
      // Insert hyphen at cursor position
      const newValue = currentValue.substring(0, start) + '-' + currentValue.substring(end)
      const normalized = normalizeSlug(newValue)
      
      setSlug(normalized)
      lastNormalizedValueRef.current = normalized
      
      // Set cursor position after the hyphen
      setTimeout(() => {
        if (slugInputRef.current) {
          const textBeforeCursor = newValue.substring(0, start + 1)
          const normalizedBefore = normalizeSlug(textBeforeCursor)
          const newPosition = Math.min(normalizedBefore.length, normalized.length)
          slugInputRef.current.setSelectionRange(newPosition, newPosition)
        }
      }, 0)
      return
    }
    
    // Allow other standard shortcuts - don't interfere
    if ((e.metaKey || e.ctrlKey) && ['c', 'v', 'x', 'z', 'y'].includes(e.key)) {
      return
    }
  }

  const handleSlugPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    
    // Normalize the pasted text (URL detection happens in normalizeSlug)
    const normalized = normalizeSlug(pastedText)
    
    const input = e.currentTarget
    const start = input.selectionStart || 0
    const end = input.selectionEnd || 0
    const currentValue = slug
    
    // Insert normalized text at cursor position
    const newValue = currentValue.substring(0, start) + normalized + currentValue.substring(end)
    const finalValue = normalizeSlug(newValue)
    
    setSlug(finalValue)
    
    // Set cursor position after the pasted content
    const newCursorPosition = start + normalized.length
    setTimeout(() => {
      if (slugInputRef.current) {
        const actualPosition = Math.min(newCursorPosition, finalValue.length)
        slugInputRef.current.setSelectionRange(actualPosition, actualPosition)
      }
    }, 0)
  }

  return (
    <div className="app">
      <div className="demo-container">
        
        <div className="demo-section">
          <PromptInput onSend={handleSend} />
          
          {/* Slug field */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Icon name="IconPaperclip" className="w-4 h-4" color="#6b7280" />
              <span>Slug</span>
            </label>
            <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Prefix section with border */}
              <div className="flex items-center justify-center px-4 py-2.5 border-r border-gray-200 bg-white">
                <span className="text-gray-700">/</span>
              </div>
              {/* Input section */}
              <input
                ref={slugInputRef}
                type="text"
                value={slug}
                onChange={handleSlugChange}
                onKeyDown={handleSlugKeyDown}
                onPaste={handleSlugPaste}
                className="flex-1 px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none border-0"
                placeholder=""
              />
            </div>
          </div>
        </div>


        {messages.length > 0 && (
          <div className="messages-section">
            <h2>Sent Messages</h2>
            <div className="messages-list">
              {messages.map((message) => (
                <div key={message.id} className="message-item">
                  <span className="message-text">{message.text}</span>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

