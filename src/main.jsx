import React from 'react'
import ReactDOM from 'react-dom/client'
import { EditorProvider } from './context/EditorContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EditorProvider>
      <App />
    </EditorProvider>
  </React.StrictMode>
)
