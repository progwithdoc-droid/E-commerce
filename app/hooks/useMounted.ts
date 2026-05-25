'use client'

import { useEffect, useState } from 'react'

/** Avoid SSR/client mismatch for localStorage, session, and persist stores. */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
