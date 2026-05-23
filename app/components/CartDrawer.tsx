"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useCart } from "../store/cart"

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen)
  const setCartOpen = useCart((s) => s.setCartOpen)
  const items = useCart((s) => s.items)
  const removeFromCart = useCart((s) => s.removeFromCart)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const subtotal = useCart((s) => s.subtotal())
  const clearCart = useCart((s) => s.clearCart)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-[101] h-full w-full max-w-md bg-void border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-heading text-2xl tracking-wider text-cream">
                CART
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-cream/60 hover:text-cream transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-body text-sm text-muted mb-2">Your cart is empty</p>
                  <p className="font-body text-xs text-caption">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-surface">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-body text-sm text-cream leading-tight">
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="font-body text-xs text-caption mt-1">
                              Size: {item.size}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border border-white/20 text-cream/60 hover:border-cream/40 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-body text-sm text-cream w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center border border-white/20 text-cream/60 hover:border-cream/40 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-body text-sm text-cream">
                              ${item.price * item.quantity}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-cream/30 hover:text-cream/60 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">Subtotal</span>
                  <span className="font-body text-lg text-cream">${subtotal}</span>
                </div>
                <button
                  onClick={clearCart}
                  className="w-full py-3 bg-electric text-void font-body text-sm tracking-[0.18em] uppercase hover:bg-cream transition-colors duration-300"
                >
                  Checkout
                </button>
                <p className="font-body text-xs text-caption text-center">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}