import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' 
import './index.css' // 🛑 هذا السطر يضمن تحميل التصميم 🛑

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)