import React, { useState, useRef, useEffect } from 'react'

const PromptInput = ({ 
  placeholder = "Message Product builder...", 
  onSend, 
  initialValue = "",
  disabled = false 
}) => {
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [displayedSuggestion, setDisplayedSuggestion] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestionAccepted, setSuggestionAccepted] = useState(false)
  const [showContextPopover, setShowContextPopover] = useState(false)
  const [contextSearch, setContextSearch] = useState('')
  const [recentItems, setRecentItems] = useState([
    'Marketing campaign strategy',
    'Product launch plan',
    'User research insights',
    'Competitive analysis',
    'Brand guidelines'
  ])
  const [selectedContexts, setSelectedContexts] = useState([])
  const [pillWidths, setPillWidths] = useState({})
  const [systemContext] = useState('Electronics') // System-defined context based on permissions
  const textareaRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const popoverRef = useRef(null)
  const pillRefs = useRef({})


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  // Generate adaptive suggestion based on input
  const generateSuggestion = (inputText) => {
    if (inputText.trim().length < 3) return null
    
    const lowerText = inputText.toLowerCase()
    
    // Priority-based matching - more specific matches first
    const suggestions = [
      {
        keywords: ['black friday', 'black friday exclusive'],
        suggestion: 'Develop a comprehensive marketing campaign titled "Black Friday Exclusive" that highlights unique offers and limited-time deals. This campaign should include eye-catching visuals, engaging social media posts, and targeted email blasts to attract customers. Consider incorporating countdown timers to create urgency and encourage immediate purchases. Additionally, outline strategies for in-store promotions and online exclusives to maximize reach and engagement during the Black Friday shopping frenzy.'
      },
      {
        keywords: ['marketing campaign', 'campaign for'],
        suggestion: 'Develop a comprehensive marketing campaign that highlights unique offers and limited-time deals. This campaign should include eye-catching visuals, engaging social media posts, and targeted email blasts to attract customers. Consider incorporating countdown timers to create urgency and encourage immediate purchases.'
      },
      {
        keywords: ['product strategy', 'product plan'],
        suggestion: 'Create a detailed product strategy that includes market research, competitive analysis, pricing strategy, and go-to-market plan. Consider user personas, feature prioritization, and success metrics to ensure product-market fit.'
      },
      {
        keywords: ['design system', 'ui design', 'user interface'],
        suggestion: 'Design a user-centered solution that focuses on usability, accessibility, and visual appeal. Include wireframes, prototypes, and design system components that align with brand guidelines and user needs.'
      },
      {
        keywords: ['business strategy', 'strategic plan'],
        suggestion: 'Develop a strategic plan that outlines objectives, key results, timeline, and resource allocation. Include risk assessment, stakeholder analysis, and success metrics to ensure effective execution.'
      },
      {
        keywords: ['data analysis', 'market analysis'],
        suggestion: 'Conduct a thorough analysis including data collection, trend identification, and actionable insights. Provide recommendations based on findings and suggest next steps for implementation.'
      },
      {
        keywords: ['marketing strategy', 'marketing plan'],
        suggestion: 'Create a comprehensive marketing strategy that includes audience segmentation, channel selection, content planning, and performance metrics. Consider both digital and traditional marketing approaches to maximize reach and engagement.'
      },
      {
        keywords: ['product launch', 'launch strategy'],
        suggestion: 'Develop a detailed product launch strategy that includes pre-launch buzz, launch day execution, and post-launch optimization. Consider influencer partnerships, media outreach, and customer feedback loops to ensure a successful launch.'
      },
      {
        keywords: ['website design', 'web development'],
        suggestion: 'Design and develop a user-friendly website that focuses on conversion optimization, mobile responsiveness, and search engine optimization. Include clear navigation, compelling content, and strong calls-to-action to drive user engagement.'
      },
      {
        keywords: ['mobile app', 'app development'],
        suggestion: 'Create a mobile application strategy that prioritizes user experience, performance, and scalability. Consider platform-specific features, user onboarding, and analytics integration to ensure long-term success.'
      },
      {
        keywords: ['campaign'],
        suggestion: 'Develop a comprehensive marketing campaign that highlights unique offers and limited-time deals. This campaign should include eye-catching visuals, engaging social media posts, and targeted email blasts to attract customers.'
      },
      {
        keywords: ['product'],
        suggestion: 'Create a detailed product strategy that includes market research, competitive analysis, pricing strategy, and go-to-market plan. Consider user personas, feature prioritization, and success metrics.'
      },
      {
        keywords: ['design'],
        suggestion: 'Design a user-centered solution that focuses on usability, accessibility, and visual appeal. Include wireframes, prototypes, and design system components that align with brand guidelines.'
      },
      {
        keywords: ['strategy'],
        suggestion: 'Develop a strategic plan that outlines objectives, key results, timeline, and resource allocation. Include risk assessment, stakeholder analysis, and success metrics.'
      },
      {
        keywords: ['analysis'],
        suggestion: 'Conduct a thorough analysis including data collection, trend identification, and actionable insights. Provide recommendations based on findings and suggest next steps.'
      }
    ]
    
    // Find the most specific match
    for (const { keywords, suggestion } of suggestions) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          return suggestion
        }
      }
    }
    
    return null
  }

  // Typing animation effect
  const typeSuggestion = (text, speed = 5) => {
    setIsTyping(true)
    setDisplayedSuggestion('')
    
    let index = 0
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedSuggestion(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
      }
    }, speed)
    
    return typeInterval
  }

  // Handle input change and suggestion generation - real-time adaptation
  useEffect(() => {
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Reset suggestion state if input is empty
    if (value.trim().length === 0) {
      setSuggestionAccepted(false)
    }

    // Don't show suggestions if user has already accepted one
    if (suggestionAccepted) {
      setShowSuggestion(false)
      setDisplayedSuggestion('')
      return
    }

    if (value.trim().length >= 3) {
      const newSuggestion = generateSuggestion(value)
      if (newSuggestion) {
        setSuggestion(newSuggestion)
        setShowSuggestion(true)
        
        // Start typing animation after a short delay
        typingTimeoutRef.current = setTimeout(() => {
          typeSuggestion(newSuggestion)
        }, 200)
      } else {
        setShowSuggestion(false)
        setDisplayedSuggestion('')
      }
    } else {
      setShowSuggestion(false)
      setDisplayedSuggestion('')
    }
  }, [value, suggestionAccepted])

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  // Capture natural width of pills when they're first rendered
  useEffect(() => {
    if (selectedContexts.length > 0) {
      const timeoutId = setTimeout(() => {
        const newWidths = {}
        selectedContexts.forEach((_, index) => {
          if (pillRefs.current[index] && !pillWidths[index]) {
            newWidths[index] = pillRefs.current[index].offsetWidth
          }
        })
        if (Object.keys(newWidths).length > 0) {
          setPillWidths(prev => ({ ...prev, ...newWidths }))
        }
      }, 0)
      
      return () => clearTimeout(timeoutId)
    }
  }, [selectedContexts, pillWidths])


  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowContextPopover(false)
      }
    }

    if (showContextPopover) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showContextPopover])

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
      setSuggestionAccepted(false) // Reset suggestion state when sending
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleAcceptSuggestion = () => {
    setValue(suggestion)
    setShowSuggestion(false)
    setDisplayedSuggestion('')
    setIsTyping(false)
    setSuggestionAccepted(true)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleDismissSuggestion = () => {
    setShowSuggestion(false)
    setDisplayedSuggestion('')
    setIsTyping(false)
  }

  const handleContextClick = () => {
    setShowContextPopover(!showContextPopover)
  }

  const handleContextSearch = (e) => {
    setContextSearch(e.target.value)
  }

  const handleContextItemSelect = (item) => {
    // Add the selected item to contexts if not already selected
    if (!selectedContexts.includes(item)) {
      setSelectedContexts(prev => [...prev, item])
    }
    // Keep popover open for multiple selections
    setContextSearch('')
    
    // Add to recent items if not already there
    if (!recentItems.includes(item)) {
      setRecentItems(prev => [item, ...prev.slice(0, 4)]) // Keep only 5 recent items
    }
    
    // Focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleRemoveContext = (itemToRemove) => {
    setSelectedContexts(prev => prev.filter(item => item !== itemToRemove))
  }


  const isEmpty = value.trim() === ''
  const hasContent = value.trim().length > 0

  // Filter recent items based on search
  const filteredItems = recentItems.filter(item => 
    item.toLowerCase().includes(contextSearch.toLowerCase())
  )

  return (
    <div className="relative">
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
      {/* Add context button row */}
      <div className="flex items-center mb-2 gap-2 flex-wrap">
        <button 
          className={`flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-all duration-200 hover:border-gray-300 ${
            selectedContexts.length > 0 ? 'px-1.5 w-8 h-8 justify-center' : ''
          }`}
          type="button"
          onClick={handleContextClick}
        >
          <span className="text-gray-500 font-medium">@</span>
          {selectedContexts.length === 0 && <span>Add context</span>}
        </button>
        
        {/* System context pill - always shown, disabled */}
        <div className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded-full cursor-not-allowed opacity-75">
          <span className="text-gray-400 font-medium">@</span>
          <span className="truncate">{systemContext}</span>
        </div>
        
        {/* User-selected context pills */}
        {selectedContexts.map((context, index) => (
          <div
            key={index}
            ref={(el) => { pillRefs.current[index] = el }}
            className="group relative inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-full transition-all duration-200 hover:bg-gray-100 hover:border-gray-300"
            style={{
              width: pillWidths[index] ? `${pillWidths[index]}px` : 'auto'
            }}
          >
            <span className="text-gray-500 font-medium">@</span>
            <span className="truncate flex-1 min-w-0">{context}</span>
            <button
              onClick={() => handleRemoveContext(context)}
              className="hidden w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all duration-200 group-hover:flex bg-white rounded-full hover:bg-gray-100 shadow-sm border border-gray-200 flex-shrink-0"
              type="button"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Context Popover */}
      {showContextPopover && (
        <div 
          ref={popoverRef}
          className="absolute top-16 left-0 z-50 w-80 bg-white border border-gray-200 rounded-xl shadow-lg"
        >
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search context..."
              value={contextSearch}
              onChange={handleContextSearch}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          
          {/* Recent items list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleContextItemSelect(item)}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="truncate">{item}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                {contextSearch ? 'No items found' : 'No recent items'}
              </div>
            )}
          </div>
        </div>
      )}
      
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
      
      {/* Suggestion box - separate div between text and buttons */}
      {showSuggestion && (
        <div className="mx-1 mb-2 mt-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Suggestion:</div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="text-sm text-gray-600 leading-relaxed mb-3">
              {displayedSuggestion}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={handleDismissSuggestion}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Dismiss
              </button>
              <button
                onClick={handleAcceptSuggestion}
                className="px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-sm transition-all duration-200"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      
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
        
        {/* Send button - always show */}
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
    </div>
  )
}

export default PromptInput
