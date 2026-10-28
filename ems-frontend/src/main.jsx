import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      containerStyle={{ top: 72 }}
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          fontSize: '15px',
          padding: '14px 20px',
          minWidth: '300px',
          maxWidth: '420px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          borderRadius: '10px',
          lineHeight: '1.5',
        },
      }}
    />
  </React.StrictMode>
)
