'use client'

import { useEffect } from 'react'

/** MetaMask and similar extensions inject scripts on all sites; rejections are not from this app. */
function isWalletExtensionNoise(message: string, stack = ''): boolean {
  const haystack = `${message}\n${stack}`.toLowerCase()
  return (
    haystack.includes('metamask') ||
    haystack.includes('failed to connect') ||
    haystack.includes('chrome-extension://') ||
    haystack.includes('user rejected the request')
  )
}

function reasonMessage(reason: unknown): string {
  if (typeof reason === 'string') return reason
  if (reason instanceof Error) return reason.message
  if (reason && typeof reason === 'object' && 'message' in reason) {
    return String((reason as { message: unknown }).message)
  }
  return ''
}

function reasonStack(reason: unknown): string {
  if (reason instanceof Error) return reason.stack ?? ''
  return ''
}

export function SuppressWalletExtensionErrors() {
  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = reasonMessage(event.reason)
      const stack = reasonStack(event.reason)
      if (isWalletExtensionNoise(message, stack)) {
        event.preventDefault()
      }
    }

    const onError = (event: ErrorEvent) => {
      if (event.filename?.startsWith('chrome-extension://')) {
        event.preventDefault()
        return
      }
      const stack = event.error instanceof Error ? event.error.stack ?? '' : ''
      if (isWalletExtensionNoise(event.message, stack)) {
        event.preventDefault()
      }
    }

    window.addEventListener('unhandledrejection', onUnhandledRejection)
    window.addEventListener('error', onError)
    return () => {
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
      window.removeEventListener('error', onError)
    }
  }, [])

  return null
}
