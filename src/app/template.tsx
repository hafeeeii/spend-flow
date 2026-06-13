"use client"

import React from "react"
import { motion } from "framer-motion"
import { PageLoader } from "@/components/page-loader"

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="w-full h-full">
      <PageLoader loading={loading} onClose={() => setLoading(false)} />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: loading ? 0 : 1, y: loading ? 8 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}
