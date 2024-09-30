import React from 'react'
import { createRoot } from 'react-dom/client'

import { ReleaseNotification } from './ReleaseNotification'

createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <ReleaseNotification />
  </React.StrictMode>,
)
