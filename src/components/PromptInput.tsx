import React, { useState, useRef, useEffect } from 'react'
import Pill from './Pill.tsx'
import Button from './Button.tsx'
import ContextPopover from './ContextPopover.tsx'
import SuggestionBox from './SuggestionBox.tsx'
import ActionButtons from './ActionButtons.tsx'
import Tooltip from './Tooltip.tsx'
import Icon from './Icon.tsx'
import { 
  getRecentItems, 
  searchEntries, 
  addToRecentItems, 
  getContextCategory
} from '../data/contextDatabase.ts'

interface PromptInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  initialValue?: string;
  disabled?: boolean;
}

interface SuggestionConfig {
  keywords: string[];
  suggestion: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
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
  const [recentItems, setRecentItems] = useState<string[]>(getRecentItems())
  const [selectedContexts, setSelectedContexts] = useState<string[]>([])
  const [pillWidths, setPillWidths] = useState<Record<number, number>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pillRefs = useRef<Record<number, HTMLDivElement | null>>({})


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])

  // Generate adaptive suggestion based on input
  const generateSuggestion = (inputText: string): string | null => {
    if (inputText.trim().length < 3) return null
    
    const lowerText = inputText.toLowerCase()
    
    // Priority-based matching - more specific matches first
    const suggestions: SuggestionConfig[] = [
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
  const typeSuggestion = (text: string, speed: number = 5): NodeJS.Timeout => {
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
        const newWidths: Record<number, number> = {}
        selectedContexts.forEach((_, index) => {
          if (pillRefs.current[index] && !pillWidths[index]) {
            newWidths[index] = pillRefs.current[index]!.offsetWidth
          }
        })
        if (Object.keys(newWidths).length > 0) {
          setPillWidths(prev => ({ ...prev, ...newWidths }))
        }
      }, 0)
      
      return () => clearTimeout(timeoutId)
    }
  }, [selectedContexts, pillWidths])



  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't focus if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleSend = () => {
    if (value.trim() && onSend) {
      // Attach selected contexts to the message
      let messageToSend = value.trim()
      if (selectedContexts.length > 0) {
        const contextsString = selectedContexts.map(ctx => `@${ctx}`).join(' ')
        messageToSend = `${contextsString}\n\n${messageToSend}`
      }
      
      onSend(messageToSend)
      setValue('')
      setSelectedContexts([]) // Clear selected contexts after sending
      setSuggestionAccepted(false) // Reset suggestion state when sending
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleContextSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContextSearch(e.target.value)
  }

  const handleContextItemSelect = (item: string) => {
    // Add the selected item to contexts if not already selected
    if (!selectedContexts.includes(item)) {
      setSelectedContexts(prev => [...prev, item])
    }
    // Keep popover open for multiple selections
    setContextSearch('')
    
    // Add to recent items using database function
    addToRecentItems(item)
    setRecentItems(getRecentItems())
    
    // Focus back to textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleRemoveContext = (itemToRemove: string) => {
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

  // Filter items based on search - use database search if there's a search term
  const filteredItems = contextSearch.trim() 
    ? searchEntries(contextSearch)
    : recentItems.filter(item => 
        item.toLowerCase().includes(contextSearch.toLowerCase())
      )

  return (
    <div className="relative">
      <div 
        className={`
          bg-white shadow-sm transition-all duration-200 
          relative flex flex-col rounded-[1.75rem] min-h-[100px] p-3
          border border-gray-200
          ${isFocused ? 'shadow-md border-gray-300' : ''} 
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        `} 
        onClick={handleContainerClick}
      >
      {/* Add context button row */}
      <div className="flex items-center gap-1 flex-wrap pb-5">
        <Tooltip 
          content="Add context"
          position="top"
        >
          <button 
            className="w-8 h-8 flex items-center justify-center text-sm text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-all duration-200 hover:border-gray-300"
            type="button"
            onClick={handleContextClick}
          >
            <Icon name="IconPlus" className="w-4 h-4" color="#6B7280" />
          </button>
        </Tooltip>
        
        {/* User-selected context pills */}
        {selectedContexts.map((context, index) => {
          const category = getContextCategory(context)
          
          return (
            <Pill
              key={index}
              ref={(el) => { pillRefs.current[index] = el }}
              variant="removable"
              showRemove
              onRemove={() => handleRemoveContext(context)}
              icon={category.icon}
              iconColor={category.iconColor}
              style={{
                width: pillWidths[index] ? `${pillWidths[index]}px` : 'auto'
              }}
            >
              {context}
            </Pill>
          )
        })}
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
      <div className="flex-1 flex items-start relative min-h-[24px] px-2 pb-4">
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
          className="w-full border-none outline-none bg-transparent resize-none font-normal min-h-[24px] max-h-[120px] disabled:cursor-not-allowed focus:outline-none text-base leading-6 tracking-[-0.32px] text-black placeholder:text-gray-400"
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

