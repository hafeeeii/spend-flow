"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, DollarSign, ShieldAlert } from "lucide-react"

const FUNNY_MESSAGES = [
  "Bribery department is approving this navigation...",
  "Consulting the budget oracle...",
  "Hiding the company credit card from the CEO...",
  "Applying double-entry bookkeeping... slowly...",
  "Chasing a runaway receipt under the couch...",
  "Polishing the gold coins for your dashboard...",
  "Checking if we can afford to load this page...",
  "Preventing unauthorized coffee machine purchases...",
  "Squeezing budget out of the marketing department...",
  "Auditing the audit logs for audit-worthiness...",
  "Stretching your dollar to fit this screen width...",
  "Tuning the money printer to 'Go Brrr'...",
  "Double checking with compliance (please look busy)...",
  "Borrowing some pixels from next month's budget...",
  "Locating the missing decimal point..."
]

const FUNNY_RECEIPT_ITEMS = [
  { name: "Organic Artisanal Coffee", price: "$8.50", category: "Snacks" },
  { name: "Emergency Pizza Party", price: "$180.00", category: "Team Building" },
  { name: "Enterprise AI Chatbot API", price: "$42,000.00", category: "Software" },
  { name: "CEO's 'Ergonomic' Yacht Chair", price: "$6,500.00", category: "Office Supplies" },
  { name: "Bribe for Finance Auditor", price: "$0.00", category: "Marketing" },
  { name: "Tax Loophole Consultation", price: "$15,000.00", category: "Legal" },
  { name: "Premium Bubble Wrap", price: "$12.99", category: "Shipping" },
  { name: "Lost Receipt (Under the couch)", price: "-$45.00", category: "Adjustment" },
]

interface PageLoaderProps {
  loading: boolean
  onClose: () => void
}

export function PageLoader({ loading, onClose }: PageLoaderProps) {
  const [message, setMessage] = React.useState("")
  const [receiptItem, setReceiptItem] = React.useState({ name: "", price: "", category: "" })

  React.useEffect(() => {
    if (!loading) return

    // Pick a random funny message
    const randomMsg = FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]
    setMessage(randomMsg)

    // Pick a random receipt item
    const randomItem = FUNNY_RECEIPT_ITEMS[Math.floor(Math.random() * FUNNY_RECEIPT_ITEMS.length)]
    setReceiptItem(randomItem)

    // Automatically end loading after 1800ms
    const timer = setTimeout(() => {
      onClose()
    }, 1200)

    return () => clearTimeout(timer)
  }, [loading, onClose])

  const skipLoading = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background backdrop-blur-md transition-colors duration-200 md:rounded-2xl"
        >
          {/* Main loader wrapper */}
          <div className="relative flex flex-col items-center max-w-md w-full px-6 text-center">
            
            {/* Background glowing rings */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

            {/* Mascot Container: Bouncing Coin */}
            <motion.div
              animate={{
                y: [0, -18, 0],
                scaleY: [1, 0.9, 1.05, 1],
                scaleX: [1, 1.1, 0.95, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-24 h-24 mb-4 flex items-center justify-center cursor-pointer"
            >
              {/* Cute SVG Coin */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                {/* Coin Body */}
                <circle cx="50" cy="50" r="45" fill="url(#coinGradient)" stroke="url(#coinBorder)" strokeWidth="3" />
                {/* Inner Ridges */}
                <circle cx="50" cy="50" r="37" fill="none" stroke="url(#coinInnerBorder)" strokeWidth="1.5" strokeDasharray="3 3" />
                
                {/* Dollar Symbol with motion */}
                <text
                  x="50"
                  y="58"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  fontSize="28"
                  fill="url(#dollarGradient)"
                  textAnchor="middle"
                  className="select-none"
                >
                  $
                </text>

                {/* Cute Mascot Face */}
                {/* Eyes */}
                <circle cx="38" cy="38" r="4.5" fill="#1C1917" />
                <circle cx="62" cy="38" r="4.5" fill="#1C1917" />
                {/* Eye Highlights */}
                <circle cx="36.5" cy="36.5" r="1.5" fill="white" />
                <circle cx="60.5" cy="36.5" r="1.5" fill="white" />
                
                {/* Blush Cheeks */}
                <circle cx="32" cy="44" r="3.5" fill="#FDA4AF" opacity="0.6" />
                <circle cx="68" cy="44" r="3.5" fill="#FDA4AF" opacity="0.6" />

                {/* Animated Mouth (Smiling) */}
                <path
                  d="M 44 46 Q 50 52 56 46"
                  stroke="#1C1917"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="coinGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FDE047" /> {/* Yellow 300 */}
                    <stop offset="50%" stopColor="#EAB308" /> {/* Yellow 500 */}
                    <stop offset="100%" stopColor="#CA8A04" /> {/* Yellow 600 */}
                  </linearGradient>
                  <linearGradient id="coinBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FEF08A" /> {/* Yellow 200 */}
                    <stop offset="100%" stopColor="#854D0E" /> {/* Yellow 800 */}
                  </linearGradient>
                  <linearGradient id="coinInnerBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#CA8A04" opacity="0.5" />
                    <stop offset="100%" stopColor="#FEF08A" opacity="0.8" />
                  </linearGradient>
                  <linearGradient id="dollarGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#854D0E" />
                    <stop offset="100%" stopColor="#A16207" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Sweat Drop if loading gets intense */}
              <motion.div
                animate={{
                  y: [0, 4, 8],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeIn"
                }}
                className="absolute right-4 top-6 text-sky-400 select-none text-xs"
              >
                💧
              </motion.div>
            </motion.div>

            {/* Mascot Legs running/cycling */}
            <div className="flex gap-4 justify-center items-center h-4 mb-6 -mt-3">
              <motion.div
                animate={{
                  rotate: [0, -360]
                }}
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-2.5 h-2.5 border-b-2 border-r-2 border-amber-600 rounded-full origin-top"
              />
              <motion.div
                animate={{
                  rotate: [180, -180]
                }}
                transition={{
                  duration: 0.35,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-2.5 h-2.5 border-b-2 border-r-2 border-amber-600 rounded-full origin-top"
              />
            </div>

            {/* The Receipt Treadmill */}
            <div className="relative w-full h-12 bg-card border border-border rounded-lg overflow-hidden flex items-center px-4 shadow-inner mb-6">
              {/* Receipt Treadmill Belt */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent z-10" />
              
              <motion.div
                animate={{
                  x: [0, -180]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="flex gap-12 items-center whitespace-nowrap text-xs text-muted-foreground/60 font-mono"
              >
                <span>🧾 {receiptItem.name || "Software License"} ... {receiptItem.price || "$99.99"}</span>
                <span>💸 Pizza Party ... $120.00</span>
                <span>💳 Travel Expense ... $450.00</span>
                <span>🧾 Office Desk ... $299.00</span>
                <span>⚡ SpendFlow Audit Completed</span>
              </motion.div>
            </div>

            {/* Funny Message */}
            <div className="h-14 mb-4 flex items-center justify-center">
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-medium text-foreground tracking-tight"
              >
                {message || "Loading next page..."}
              </motion.p>
            </div>

            {/* Interactive Skip Button: Bribe Loader */}
            <motion.button
              onClick={skipLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs font-semibold text-primary transition cursor-pointer shadow-sm"
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Bribe the Loader (Skip)</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
