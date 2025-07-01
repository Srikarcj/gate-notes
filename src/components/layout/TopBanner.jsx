import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const TopBanner = () => {
  const stats = [
    { number: '24/7', label: 'AI Support' },
    { number: '100+', label: 'Colleges' },
    { number: '1000+', label: 'Resources' }
  ]

  return (
    <motion.div 
      className="gradient-bg text-white py-6 relative overflow-hidden"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              GATE Ready
            </h2>
            <p className="text-lg opacity-90">
              AI-Powered Study Assistant
            </p>
          </motion.div>

          {/* Right Stats */}
          <motion.div 
            className="flex gap-4 lg:gap-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={cn(
                  "text-center px-4 lg:px-6 py-3 lg:py-4",
                  "bg-white/10 backdrop-blur-md rounded-xl",
                  "border border-white/20",
                  "hover:bg-white/15 transition-all duration-300",
                  "hover:scale-105 hover:shadow-lg"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6 + (index * 0.1) 
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-xl lg:text-2xl font-bold">
                  {stat.number}
                </div>
                <div className="text-xs lg:text-sm opacity-80 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-4 right-1/4 w-2 h-2 bg-white/20 rounded-full"
        animate={{
          y: [0, -10, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-4 left-1/3 w-1 h-1 bg-white/30 rounded-full"
        animate={{
          y: [0, -8, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.div>
  )
}

export default TopBanner
