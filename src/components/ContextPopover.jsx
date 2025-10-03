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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchResults, setSearchResults] = useState([])

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
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Generate search results when search value changes
  useEffect(() => {
    if (searchValue.trim()) {
      const results = []
      Object.values(contextDatabase.categories).forEach(category => {
        const categoryEntries = contextDatabase.entries[category.id].filter(entry => 
          entry.toLowerCase().includes(searchValue.toLowerCase())
        )
        categoryEntries.forEach(entry => {
          results.push({ entry, category: category.name, categoryId: category.id })
        })
      })
      setSearchResults(results)
      setSelectedIndex(0) // Reset to first item
    } else {
      setSearchResults([])
      setSelectedIndex(0)
    }
  }, [searchValue])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return

      // For search results
      if (searchValue.trim()) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            setSelectedIndex(prev => 
              prev < searchResults.length - 1 ? prev + 1 : 0
            )
            break
          case 'ArrowUp':
            event.preventDefault()
            setSelectedIndex(prev => 
              prev > 0 ? prev - 1 : searchResults.length - 1
            )
            break
          case 'Enter':
            event.preventDefault()
            if (searchResults[selectedIndex]) {
              handleEntrySelect(searchResults[selectedIndex].entry)
            }
            break
          case 'Escape':
            event.preventDefault()
            onClose()
            break
        }
      } else {
        // For category navigation
        const categories = Object.values(contextDatabase.categories)
        
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            setSelectedIndex(prev => 
              prev < categories.length - 1 ? prev + 1 : 0
            )
            break
          case 'ArrowUp':
            event.preventDefault()
            setSelectedIndex(prev => 
              prev > 0 ? prev - 1 : categories.length - 1
            )
            break
          case 'Enter':
            event.preventDefault()
            if (categories[selectedIndex]) {
              handleCategoryClick(categories[selectedIndex].id)
            }
            break
          case 'Escape':
            event.preventDefault()
            onClose()
            break
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, searchValue, selectedIndex, searchResults, onClose])

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
      <div className="p-2 border-gray-100" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" 
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
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-transparent"
            autoFocus
          />
          {/* Clear search button */}
          {searchValue && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSearchChange({ target: { value: '' } })
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors z-20"
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
          /* Search Results - Grouped by Category with Keyboard Navigation */
          <div className="p-2">
            {searchResults.length > 0 ? (
              <div>
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
                        {categoryEntries.map((entry, entryIndex) => {
                          // Find the global index of this entry in searchResults
                          const globalIndex = searchResults.findIndex(result => 
                            result.entry === entry && result.categoryId === category.id
                          )
                          
                          return (
                            <button
                              key={entryIndex}
                              onClick={() => handleEntrySelect(entry)}
                              className={`w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150 ${
                                globalIndex === selectedIndex ? 'bg-gray-100' : ''
                              }`}
                            >
                              {entry}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                }).filter(Boolean)}
              </div>
            ) : (
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
                    className={`w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-gray-100 last:border-b-0 transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
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
