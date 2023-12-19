import React from 'react'
import { createRoot } from 'react-dom/client'

import { Options } from './Options'

createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
)
