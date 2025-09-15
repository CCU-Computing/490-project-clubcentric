import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router"; // BrowserRouter allows for multiple pages
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Wrap entire app with BrowserRouter */}
        <App />
    </BrowserRouter>
  </StrictMode>,
)
