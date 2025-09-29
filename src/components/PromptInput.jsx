import React, { useState, useRef, useEffect } from 'react'
import Pill from './Pill'
import Button from './Button'
import ContextPopover from './ContextPopover'
import SuggestionBox from './SuggestionBox'
import ActionButtons from './ActionButtons'

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

  // Reset suggestion state when input changes
  useEffect(() => {
    // Reset suggestion state if input is empty
    if (value.trim().length === 0) {
      setSuggestionAccepted(false)
      setShowSuggestion(false)
      setDisplayedSuggestion('')
    }
  }, [value])

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

  const handleKeyDown = (e) => {
    // Cmd+Shift+Enter to trigger refine
    if (e.key === 'Enter' && e.metaKey && e.shiftKey) {
      e.preventDefault()
      if (hasContent) {
        handleRefine()
      }
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

  const handleRefine = () => {
    if (value.trim().length >= 3) {
      const newSuggestion = generateSuggestion(value)
      if (newSuggestion) {
        setSuggestion(newSuggestion)
        setShowSuggestion(true)
        setSuggestionAccepted(false)
        
        // Start typing animation after a short delay
        typingTimeoutRef.current = setTimeout(() => {
          typeSuggestion(newSuggestion)
        }, 200)
      } else {
        // If no specific suggestion found, provide a generic refinement
        const genericSuggestion = `Refine and expand on: "${value.trim()}". Provide more specific details, context, and actionable steps to make this request more comprehensive and effective.`
        setSuggestion(genericSuggestion)
        setShowSuggestion(true)
        setSuggestionAccepted(false)
        
        // Start typing animation after a short delay
        typingTimeoutRef.current = setTimeout(() => {
          typeSuggestion(genericSuggestion)
        }, 200)
      }
    }
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
            selectedContexts.length > 0 ? 'px-3 py-1.5 justify-center' : ''
          }`}
          type="button"
          onClick={handleContextClick}
        >
          <span className="text-gray-500 text-sm">@</span>
          {selectedContexts.length === 0 && <span className="text-sm">Add context</span>}
        </button>
        
        {/* System context pill - always shown, disabled */}
        <Pill variant="system" disabled>
          {systemContext}
        </Pill>
        
        {/* User-selected context pills */}
        {selectedContexts.map((context, index) => (
          <Pill
            key={index}
            ref={(el) => { pillRefs.current[index] = el }}
            variant="removable"
            showRemove
            onRemove={() => handleRemoveContext(context)}
            style={{
              width: pillWidths[index] ? `${pillWidths[index]}px` : 'auto'
            }}
          >
            {context}
          </Pill>
        ))}
      </div>

      {/* Context Popover */}
      <ContextPopover
        isOpen={showContextPopover}
        onClose={() => setShowContextPopover(false)}
        items={filteredItems}
        onItemSelect={handleContextItemSelect}
        searchValue={contextSearch}
        onSearchChange={handleContextSearch}
      />
      
      {/* Message text area */}
      <div className="flex-1 flex items-start relative min-h-[24px] py-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-none outline-none bg-transparent text-base leading-6 text-gray-900 resize-none font-inherit min-h-[24px] max-h-[120px] placeholder:text-gray-400 placeholder:text-base disabled:cursor-not-allowed focus:outline-none"
          rows={1}
        />
      </div>
      
      {/* Suggestion box - separate div between text and buttons */}
      <SuggestionBox
        isVisible={showSuggestion}
        suggestion={displayedSuggestion}
        isTyping={isTyping}
        onAccept={handleAcceptSuggestion}
        onDismiss={handleDismissSuggestion}
      />
      
      {/* Actions row */}
      <ActionButtons
        hasContent={hasContent}
        disabled={disabled}
        onRefine={handleRefine}
        onSend={handleSend}
      />
      </div>
    </div>
  )
}

export default PromptInput
