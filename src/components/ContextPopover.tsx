import React, { useRef, useEffect, useState } from 'react'
import { contextDatabase } from '../data/contextDatabase.ts'
import Icon from './Icon.tsx'

interface SearchResult {
  entry: string;
  category: string;
  categoryId: string;
}

interface ContextPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onItemSelect: (item: string) => void;
  searchValue: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileAttach?: (files: File[]) => void;
  className?: string;
}

// MenuItem Component - Reusable option/item component
interface MenuItemProps {
  icon?: string;
  iconNode?: React.ReactNode;
  label: string;
  showChevron?: boolean;
  isHovered?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  iconNode, 
  label, 
  showChevron = false, 
  isHovered = false,
  onClick,
  onMouseEnter
}) => {
  return (
    <div
      className={`w-full px-2 py-2.5 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors duration-150 flex items-center justify-between cursor-pointer group ${
        isHovered ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className={`transition-colors duration-150 ${
            isHovered ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
          }`}>
            <Icon 
              name={icon} 
              className="w-5 h-5"
            />
          </span>
        )}
        {iconNode && iconNode}
        <span className={`text-sm font-normal transition-colors duration-150 ${
          isHovered ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
        }`}>{label}</span>
      </div>
      {showChevron && (
        <span className="text-gray-400 group-hover:text-gray-500 transition-colors duration-150">
          <Icon name="IconCaretRight" className="w-4 h-4" />
        </span>
      )}
    </div>
  )
}

// Define which categories are shown as primary options
const PRIMARY_CATEGORIES = ['product', 'locales']

const ContextPopover: React.FC<ContextPopoverProps> = ({ 
  isOpen, 
  onClose, 
  onItemSelect, 
  searchValue, 
  onSearchChange,
  onFileAttach,
  className = ''
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moreSubmenuRef = useRef<HTMLDivElement>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [showSubmenu, setShowSubmenu] = useState(false)
  const [showMoreSubmenu, setShowMoreSubmenu] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [submenuTop, setSubmenuTop] = useState(0)
  const [thirdLevelTop, setThirdLevelTop] = useState(0)

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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
      setShowMoreSubmenu(false)
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Generate search results when search value changes
  useEffect(() => {
    if (searchValue.trim()) {
      const results: SearchResult[] = []
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
    const handleKeyDown = (event: KeyboardEvent) => {
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
  const primaryCategories = categories.filter(cat => PRIMARY_CATEGORIES.includes(cat.id))
  const otherCategories = categories.filter(cat => !PRIMARY_CATEGORIES.includes(cat.id))

  const handleCategoryClick = (categoryId: string, event?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
    console.log('Category clicked:', categoryId)
    console.log('Current hoveredCategory:', hoveredCategory)
    console.log('Current showSubmenu:', showSubmenu)
    
    // Calculate position relative to popover
    if (event) {
      const target = event.currentTarget
      const popover = popoverRef.current
      if (target && popover) {
        const targetRect = target.getBoundingClientRect()
        const popoverRect = popover.getBoundingClientRect()
        setSubmenuTop(targetRect.top - popoverRect.top)
      }
    }
    
    // Always open the submenu for the clicked category
    setHoveredCategory(categoryId)
    setShowSubmenu(true)
    setShowMoreSubmenu(false)
  }

  const handleMoreClick = (event?: React.MouseEvent<HTMLDivElement>) => {
    console.log('More clicked')
    
    // Calculate position relative to popover
    if (event) {
      const target = event.currentTarget
      const popover = popoverRef.current
      if (target && popover) {
        const targetRect = target.getBoundingClientRect()
        const popoverRect = popover.getBoundingClientRect()
        setSubmenuTop(targetRect.top - popoverRect.top)
      }
    }
    
    setShowMoreSubmenu(true)
    setShowSubmenu(false)
    setHoveredCategory(null)
  }

  const handleMoreCategoryClick = (categoryId: string, event?: React.MouseEvent<HTMLDivElement>) => {
    console.log('More category clicked:', categoryId)
    
    // Calculate position relative to the More submenu
    if (event) {
      const target = event.currentTarget
      const moreSubmenu = moreSubmenuRef.current
      if (target && moreSubmenu) {
        const targetRect = target.getBoundingClientRect()
        const moreSubmenuRect = moreSubmenu.getBoundingClientRect()
        setThirdLevelTop(targetRect.top - moreSubmenuRect.top)
      }
    }
    
    // Keep More submenu open and show category entries in third level
    setHoveredCategory(categoryId)
    setShowSubmenu(true)
    // Keep showMoreSubmenu true to maintain the More categories visible
  }

  const handleEntrySelect = (entry: string) => {
    onItemSelect(entry)
    setShowSubmenu(false)
    setShowMoreSubmenu(false)
  }

  const handleFileAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      onFileAttach?.(Array.from(files))
      onClose()
    }
    event.target.value = ''
  }

  const handleGoogleDriveClick = () => {
    // Mocked for now
    alert('Google Drive integration coming soon!')
  }

  return (
    <div 
      ref={popoverRef}
      className={`absolute top-12 left-2 z-50 w-60 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-visible ${className}`}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept="*/*"
        multiple
      />

      {/* Search input */}
      <div className="p-3 border-gray-100" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Icon name="IconMagnifyingGlass" className="w-4 h-4" color="#6B7280" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={onSearchChange}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent bg-transparent"
              autoFocus
            />
            {/* Clear search button */}
            {searchValue && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20"
              >
                <Icon name="IconX" className="w-4 h-4" color="currentColor" />
              </button>
            )}
          </div>
        </div>
      
      {/* Content based on search state */}
      {searchValue.trim() ? (
        /* Search Results - Grouped by Category */
        <div className="max-h-60 overflow-y-auto pb-3">
          <div className="px-3">
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
        </div>
      ) : (
        /* Default View: Options + Attachments */
        <div>
          {/* Options Section */}
          <div className="px-1.5">
            {primaryCategories.map((category) => (
              <MenuItem
                key={category.id}
                icon={category.icon}
                label={category.name === 'Product' ? 'Products' : category.name === 'locales' ? 'Locale' : category.name}
                showChevron={true}
                isHovered={showSubmenu && !showMoreSubmenu && hoveredCategory === category.id}
                onMouseEnter={(e) => handleCategoryClick(category.id, e)}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleCategoryClick(category.id, e)
                }}
              />
            ))}
            
            {/* More option */}
            <MenuItem
              icon="IconDotsThreeVertical"
              label="More"
              showChevron={true}
              isHovered={showMoreSubmenu}
              onMouseEnter={(e) => handleMoreClick(e)}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleMoreClick(e)
              }}
            />
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200"></div>

          {/* Attachments Section */}
          <div className="px-1.5 pb-1.5">
            {/* Attach file */}
            <MenuItem
              icon="IconPaperclip"
              label="Attach file"
              onClick={handleFileAttach}
            />

            {/* Add from Google Drive */}
            <MenuItem
              iconNode={
                <div className="w-5 h-5 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                </div>
              }
              label="Add from Google Drive"
              onClick={handleGoogleDriveClick}
            />
          </div>
        </div>
      )}
      
      {/* Submenu for category entries (second level - for primary categories) */}
      {!searchValue.trim() && hoveredCategory && showSubmenu && !showMoreSubmenu && (
        <div 
          className="absolute left-full -ml-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-[300px] overflow-hidden"
          style={{ top: `${submenuTop}px` }}
        >
          <div className="px-1.5 py-1.5 max-h-60 overflow-y-auto">
            {contextDatabase.entries[hoveredCategory]
              .map((entry, entryIndex) => (
                <MenuItem
                  key={entryIndex}
                  label={entry}
                  onClick={() => handleEntrySelect(entry)}
                />
              ))
            }
          </div>
        </div>
      )}

      {/* Submenu for More categories */}
      {!searchValue.trim() && showMoreSubmenu && (
        <div 
          ref={moreSubmenuRef}
          className="absolute left-full -ml-2 w-60 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-[300px] overflow-hidden"
          style={{ top: `${submenuTop}px` }}
        >
          <div className="px-1.5 py-1.5 max-h-60 overflow-y-auto">
            {otherCategories.map((category) => (
              <MenuItem
                key={category.id}
                icon={category.icon}
                label={category.name}
                showChevron={true}
                isHovered={showSubmenu && hoveredCategory === category.id}
                onMouseEnter={(e) => handleMoreCategoryClick(category.id, e)}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleMoreCategoryClick(category.id, e)
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Third level - Category entries from More submenu */}
      {!searchValue.trim() && showMoreSubmenu && hoveredCategory && showSubmenu && (
        <div 
          className="absolute left-full -ml-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-lg z-[60] max-h-[300px] overflow-hidden"
          style={{ 
            top: `${submenuTop + thirdLevelTop}px`,
            left: 'calc(100% + 14.5rem)'
          }}
        >
          <div className="px-1.5 py-1.5 max-h-60 overflow-y-auto">
            {contextDatabase.entries[hoveredCategory]
              .map((entry, entryIndex) => (
                <MenuItem
                  key={entryIndex}
                  label={entry}
                  onClick={() => handleEntrySelect(entry)}
                />
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextPopover

