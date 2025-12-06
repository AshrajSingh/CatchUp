import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <RecoilRoot>
      <App />
  </RecoilRoot>,
)
