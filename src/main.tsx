import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './ui/tokens.css'
import './ui/motion.css'
import App from './ui/App.tsx'
import { createBrowserRunner } from './ui/runtime.ts'

const runner = createBrowserRunner()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App runner={runner} storage={window.localStorage} />
  </StrictMode>,
)
