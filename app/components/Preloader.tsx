'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function Preloader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55 } }}
          className="fixed inset-0 z-[300] bg-void flex items-center justify-center"
        >
          <div className="text-center">
            <p className="font-heading text-[clamp(3rem,10vw,7rem)] tracking-[0.08em] text-cream aurum-glow">
              AURUM
            </p>
            <p className="text-[10px] tracking-[0.45em] uppercase text-electric/80 mt-3">
              Curating the next look
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
