import { createInertiaApp } from '@inertiajs/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const appElement = document.getElementById('app')

if (appElement) {
  createInertiaApp({
    resolve: (name: string) => {
      const pages = import.meta.glob<{ default: React.ComponentType<any> }>('./Pages/**/*.tsx', { eager: true })
      const page = pages[`./Pages/${name}.tsx`]
      if (!page) {
        throw new Error(`Page not found: ${name}`)
      }
      return page.default
    },
    setup({ el, App: InertiaApp, props }) {
      ReactDOM.createRoot(el).render(<InertiaApp {...props} />)
    },
  })
} else {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
}
