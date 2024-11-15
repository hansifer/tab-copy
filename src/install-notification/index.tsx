import React from 'react'
import { createRoot } from 'react-dom/client'

import { InstallNotification } from './InstallNotification'

createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <InstallNotification />
  </React.StrictMode>,
)
