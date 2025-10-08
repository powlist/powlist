import React, { useEffect, useState } from 'react'

/**
 * Icon Component - Loads SVG icons from the /icons/ folder
 * 
 * @param {string} name - Icon filename without .svg extension (e.g., "IconPlus", "banner", "code")
 * @param {string} className - Tailwind classes for sizing and positioning
 * @param {string} color - Color for the icon (supports any CSS color value)
 * @param {object} style - Additional inline styles
 */
const Icon = ({ name, className = "w-4 h-4", color = "currentColor", style = {} }) => {
  const [svgContent, setSvgContent] = useState(null)
  
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/icons/${name}.svg`)
        const svgText = await response.text()
        setSvgContent(svgText)
      } catch (error) {
        console.warn(`Failed to load icon: ${name}`)
        setSvgContent(null)
      }
    }
    
    if (name) {
      loadSvg()
    }
  }, [name])
  
  // If no SVG content loaded, show a simple fallback icon
  if (!svgContent) {
    return (
      <div className={className} style={{ color, ...style }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10 1.75C5.44365 1.75 1.75 5.44365 1.75 10C1.75 14.5563 5.44365 18.25 10 18.25C14.5563 18.25 18.25 14.5563 18.25 10C18.25 5.44365 14.5563 1.75 10 1.75ZM3.25 10C3.25 6.27208 6.27208 3.25 10 3.25C13.7279 3.25 16.75 6.27208 16.75 10C16.75 13.7279 13.7279 16.75 10 16.75C6.27208 16.75 3.25 13.7279 3.25 10Z" fill="currentColor"/>
        </svg>
      </div>
    )
  }
  
  // Replace fill colors and add size constraints to the SVG
  let coloredSvg = svgContent.replace(/fill="#[^"]*"/g, `fill="${color}"`)
  
  // Add width and height attributes to ensure proper sizing
  coloredSvg = coloredSvg.replace(
    /<svg([^>]*)>/,
    '<svg$1 width="100%" height="100%" style="width: 100%; height: 100%;">'
  )
  
  return (
    <div 
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
    />
  )
}

export default Icon

