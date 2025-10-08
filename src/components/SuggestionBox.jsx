import React from 'react'

const SuggestionBox = ({ 
  isVisible, 
  suggestion, 
  isTyping, 
  onAccept, 
  onDismiss,
  className = ''
}) => {
  if (!isVisible) return null

  return (
    <div className={`mx-1 mb-2 mt-1 ${className}`}>
      <div className="bg-gray-100 rounded-2xl p-3">
        <div className="text-sm text-gray-600 leading-relaxed mb-3">
          {suggestion}
        </div>
        {!isTyping && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Dismiss
            </button>
            <button
              onClick={onAccept}
              className="px-3 py-1.5 text-sm text-white bg-gray-500 hover:bg-gray-600 rounded-lg shadow-sm transition-all duration-200"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SuggestionBox
