import React, { useRef, useEffect, useState } from 'react'
import { getContextCategory, contextDatabase } from '../data/contextDatabase'

const ContextPopover = ({ 
  isOpen, 
  onClose, 
  items = [], 
  onItemSelect, 
  searchValue, 
  onSearchChange,
  className = ''
}) => {
  const popoverRef = useRef(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [showSubmenu, setShowSubmenu] = useState(false)

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])


  // Reset state when popover opens
  useEffect(() => {
    if (isOpen) {
      setHoveredCategory(null)
      setShowSubmenu(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Get categories for display
  const categories = Object.values(contextDatabase.categories)
  
  // Filter categories based on search
  const filteredCategories = searchValue.trim() 
    ? categories.filter(category => 
        category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        contextDatabase.entries[category.id].some(entry => 
          entry.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : categories

  const handleCategoryClick = (categoryId) => {
    console.log('Category clicked:', categoryId)
    console.log('Current hoveredCategory:', hoveredCategory)
    console.log('Current showSubmenu:', showSubmenu)
    
    // Always open the submenu for the clicked category
    setHoveredCategory(categoryId)
    setShowSubmenu(true)
  }

  const handleEntrySelect = (entry) => {
    onItemSelect(entry)
    setShowSubmenu(false)
  }

  return (
    <div 
      ref={popoverRef}
      className={`absolute top-12 left-2 z-50 w-60 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-visible ${className}`}
    >
      {/* Search input */}
      <div className="p-2 border-gray-100">
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={onSearchChange}
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent"
            autoFocus
          />
          {/* Clear search button */}
          {searchValue && (
            <button
              onClick={() => onSearchChange({ target: { value: '' } })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Content based on search state */}
      <div className="max-h-60 overflow-y-auto">
        {searchValue.trim() ? (
          /* Search Results - Grouped by Category */
          <div className="p-2">
            {Object.values(contextDatabase.categories).map(category => {
              const categoryEntries = contextDatabase.entries[category.id].filter(entry => 
                entry.toLowerCase().includes(searchValue.toLowerCase())
              )
              
              if (categoryEntries.length === 0) return null
              
              return (
                <div key={category.id} className="mb-4 last:mb-0">
                  {/* Category Header */}
                  <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {category.name}
                  </div>
                  
                  {/* Category Entries */}
                  <div className="space-y-1">
                    {categoryEntries.map((entry, entryIndex) => (
                      <button
                        key={entryIndex}
                        onClick={() => handleEntrySelect(entry)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                      >
                        {entry}
                      </button>
                    ))}
                  </div>
                </div>
              )
            }).filter(Boolean)}
            
            {/* No results message */}
            {Object.values(contextDatabase.categories).every(category => 
              contextDatabase.entries[category.id].every(entry => 
                !entry.toLowerCase().includes(searchValue.toLowerCase())
              )
            ) && (
              <div className="px-3 py-8 text-center text-sm text-gray-500">
                No results found for "{searchValue}"
              </div>
            )}
          </div>
        ) : (
          /* Default Categories List */
          <div className="relative">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="relative"
                >
                  <div 
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-gray-100 last:border-b-0 transition-colors duration-150 flex items-center justify-between cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Div clicked for:', category.id)
                      handleCategoryClick(category.id)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {/* Category Icon */}
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img 
                          src={`/icons/${category.icon}.svg`}
                          alt={category.name}
                          width="20"
                          height="20"
                          className="opacity-50"
                        />
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    {/* Chevron */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-1.5 text-center text-sm text-gray-500">
                No categories available
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Submenu rendered outside the scrollable container - only when not searching */}
      {!searchValue.trim() && hoveredCategory && showSubmenu && (
        <div className="absolute left-full top-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
             style={{ 
               maxHeight: '300px',
               overflow: 'hidden',
               top: '0px'
             }}>
          <div className="p-2 max-h-60 overflow-y-auto">
            {contextDatabase.entries[hoveredCategory]
              .map((entry, entryIndex) => (
                <button
                  key={entryIndex}
                  onClick={() => handleEntrySelect(entry)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                >
                  {entry}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextPopover
