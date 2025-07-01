import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Zap, ArrowRight, ArrowDown } from 'lucide-react'
import { cn } from '../../utils/cn'

const VisualDiagram = ({ type, data, title, description }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set())

  useEffect(() => {
    let interval
    if (isAnimating && data.steps) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = (prev + 1) % data.steps.length
          if (data.steps[next].highlight) {
            setHighlightedNodes(new Set(data.steps[next].highlight))
          }
          return next
        })
      }, 1500)
    }
    return () => clearInterval(interval)
  }, [isAnimating, data.steps])

  const resetAnimation = () => {
    setCurrentStep(0)
    setHighlightedNodes(new Set())
    setIsAnimating(false)
  }

  const renderArrayVisualization = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="flex gap-1">
          {data.array?.map((value, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-12 h-12 border-2 flex items-center justify-center font-mono font-bold text-sm",
                highlightedNodes.has(index)
                  ? "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              )}
              animate={{
                scale: highlightedNodes.has(index) ? 1.1 : 1,
                y: highlightedNodes.has(index) ? -5 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Index labels */}
      <div className="flex items-center justify-center">
        <div className="flex gap-1">
          {data.array?.map((_, index) => (
            <div key={index} className="w-12 text-center text-xs text-gray-500 dark:text-gray-400">
              {index}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTreeVisualization = () => (
    <div className="flex flex-col items-center space-y-8">
      {/* Root */}
      <motion.div
        className={cn(
          "w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold",
          highlightedNodes.has('root')
            ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        )}
        animate={{ scale: highlightedNodes.has('root') ? 1.2 : 1 }}
      >
        {data.root}
      </motion.div>

      {/* Level 1 */}
      <div className="flex items-center space-x-16">
        {data.children?.map((child, index) => (
          <div key={index} className="flex flex-col items-center space-y-4">
            <ArrowDown className="w-4 h-4 text-gray-400" />
            <motion.div
              className={cn(
                "w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold",
                highlightedNodes.has(`child-${index}`)
                  ? "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              )}
              animate={{ scale: highlightedNodes.has(`child-${index}`) ? 1.2 : 1 }}
            >
              {child}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderGraphVisualization = () => (
    <div className="relative w-full h-64 flex items-center justify-center">
      <svg width="400" height="200" className="absolute">
        {/* Edges */}
        {data.edges?.map((edge, index) => {
          const [from, to] = edge
          const fromPos = data.positions[from]
          const toPos = data.positions[to]
          return (
            <motion.line
              key={index}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={highlightedNodes.has(`edge-${index}`) ? "#ef4444" : "#6b7280"}
              strokeWidth={highlightedNodes.has(`edge-${index}`) ? "3" : "2"}
              animate={{
                strokeWidth: highlightedNodes.has(`edge-${index}`) ? 3 : 2
              }}
            />
          )
        })}
      </svg>

      {/* Nodes */}
      {data.nodes?.map((node, index) => (
        <motion.div
          key={index}
          className={cn(
            "absolute w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm",
            highlightedNodes.has(`node-${index}`)
              ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          )}
          style={{
            left: data.positions[node].x - 20,
            top: data.positions[node].y - 20
          }}
          animate={{
            scale: highlightedNodes.has(`node-${index}`) ? 1.3 : 1
          }}
        >
          {node}
        </motion.div>
      ))}
    </div>
  )

  const renderStackVisualization = () => (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Top</div>
      <div className="flex flex-col-reverse space-y-reverse space-y-1">
        {data.stack?.map((value, index) => (
          <motion.div
            key={index}
            className={cn(
              "w-20 h-10 border-2 flex items-center justify-center font-mono font-bold",
              highlightedNodes.has(index)
                ? "border-purple-500 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            )}
            animate={{
              scale: highlightedNodes.has(index) ? 1.1 : 1,
              x: highlightedNodes.has(index) ? 10 : 0
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {value}
          </motion.div>
        ))}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Bottom</div>
    </div>
  )

  const renderVisualization = () => {
    switch (type) {
      case 'array':
        return renderArrayVisualization()
      case 'tree':
        return renderTreeVisualization()
      case 'graph':
        return renderGraphVisualization()
      case 'stack':
        return renderStackVisualization()
      default:
        return <div>Visualization type not supported</div>
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="btn btn-primary btn-sm"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnimating ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={resetAnimation}
            className="btn btn-secondary btn-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
        {renderVisualization()}
      </div>

      {/* Step Description */}
      {data.steps && data.steps[currentStep] && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {currentStep + 1}
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                {data.steps[currentStep].title}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {data.steps[currentStep].description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      {data.steps && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          {data.steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                index === currentStep
                  ? "bg-blue-500"
                  : index < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default VisualDiagram
