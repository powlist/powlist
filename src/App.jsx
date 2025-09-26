import React, { useState } from 'react'
import PromptInput from './components/PromptInput'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])

  const handleSend = (message) => {
    console.log('Message sent:', message)
    setMessages(prev => [...prev, { id: Date.now(), text: message, timestamp: new Date() }])
  }

  return (
    <div className="app">
      <div className="demo-container">
        
        <div className="demo-section">
          <PromptInput onSend={handleSend} />
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
