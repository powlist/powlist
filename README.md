# Powlist - AI Prompt Input Component

A beautiful, interactive prompt input component for AI products, built with React.

## Features

- **Empty State**: Shows placeholder text with a plus icon
- **Active State**: Displays blinking cursor when typing
- **Send Button**: Blue circular button appears when content is entered
- **Auto-resize**: Textarea grows with content
- **Keyboard Support**: Press Enter to send, Shift+Enter for new lines
- **Responsive Design**: Works on desktop and mobile

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to see the demo at `http://localhost:5173`

## Component Usage

```jsx
import PromptInput from './components/PromptInput'

// Basic usage
<PromptInput onSend={handleSend} />

// With custom placeholder
<PromptInput 
  placeholder="Ask me anything..." 
  onSend={handleSend} 
/>

// With pre-filled content
<PromptInput 
  initialValue="Create a campaign called 'Black Friday Exclusive'."
  onSend={handleSend} 
/>

// Disabled state
<PromptInput 
  disabled={true}
  onSend={handleSend} 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | string | "Message Product builder..." | Placeholder text |
| `onSend` | function | - | Callback when message is sent |
| `initialValue` | string | "" | Pre-filled content |
| `disabled` | boolean | false | Disable the input |

## Design Features

- Clean white cards with subtle shadows
- Smooth focus states with blue accent
- Animated blinking cursor
- Responsive plus icon and send button
- Mobile-optimized touch targets

## File Structure

```
src/
├── components/
│   ├── PromptInput.jsx    # Main component
│   └── PromptInput.css    # Component styles
├── App.jsx                # Demo application
├── App.css               # App styles
├── main.jsx              # React entry point
└── index.css             # Global styles
```
