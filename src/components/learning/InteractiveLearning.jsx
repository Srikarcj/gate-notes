import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Code,
  Eye,
  EyeOff,
  CheckCircle,
  Circle,
  Lightbulb,
  Target,
  Zap,
  Brain,
  Timer,
  Award
} from 'lucide-react'
import { cn } from '../../utils/cn'

const InteractiveLearning = ({ content, onProgress }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [showCode, setShowCode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeSpent, setTimeSpent] = useState(0)
  const [userProgress, setUserProgress] = useState(0)

  // Timer for tracking study time
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Auto-advance steps when playing
  useEffect(() => {
    let interval
    if (isPlaying && content.steps && currentStep < content.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1)
      }, 3000) // 3 seconds per step
    } else if (currentStep >= content.steps?.length - 1) {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, content.steps])

  const handleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(stepIndex)
    setCompletedSteps(newCompleted)
    
    const progress = (newCompleted.size / (content.steps?.length || 1)) * 100
    setUserProgress(progress)
    onProgress?.(progress)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'interactive', label: 'Interactive', icon: Play },
    { id: 'examples', label: 'Examples', icon: Code },
    { id: 'practice', label: 'Practice', icon: Target }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">{content.title}</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {formatTime(timeSpent)}
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {Math.round(userProgress)}%
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-white rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${userProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Overview Content */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {content.overview}
                </p>
              </div>

              {/* Key Concepts Grid */}
              {content.keyPoints && (
                <div className="grid md:grid-cols-2 gap-4">
                  {content.keyPoints.map((point, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {point.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {point.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'interactive' && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Interactive Controls */}
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-primary btn-sm"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentStep(0)
                      setIsPlaying(false)
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Step {currentStep + 1} of {content.steps?.length || 0}
                </div>
              </div>

              {/* Step Content */}
              {content.steps && content.steps[currentStep] && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {currentStep + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {content.steps[currentStep].title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {content.steps[currentStep].explanation}
                      </p>
                      
                      {/* Visual Representation */}
                      {content.steps[currentStep].visual && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                          <div className="font-mono text-sm">
                            {content.steps[currentStep].visual}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleStepComplete(currentStep)}
                        className={cn(
                          "btn btn-sm",
                          completedSteps.has(currentStep) 
                            ? "btn-primary" 
                            : "btn-secondary"
                        )}
                      >
                        {completedSteps.has(currentStep) ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="btn btn-secondary btn-sm disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentStep(Math.min((content.steps?.length || 1) - 1, currentStep + 1))}
                  disabled={currentStep >= (content.steps?.length || 1) - 1}
                  className="btn btn-primary btn-sm disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'examples' && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Code Examples */}
              {content.examples && (
                <div className="space-y-4">
                  {content.examples.map((example, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {example.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Complexity: <span className="font-mono text-primary-600">{example.complexity}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCode(!showCode)}
                          className="btn btn-ghost btn-sm"
                        >
                          {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {showCode ? 'Hide' : 'Show'} Code
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {example.explanation}
                        </p>
                        
                        {showCode && example.code && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-900 rounded-lg p-4 overflow-x-auto"
                          >
                            <pre className="text-green-400 text-sm">
                              <code>{example.code}</code>
                            </pre>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Practice Questions */}
              {content.practiceQuestions && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Brain className="w-6 h-6 text-primary-600" />
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Practice Questions
                    </h4>
                  </div>
                  
                  {content.practiceQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            {question}
                          </p>
                          <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Think about this →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default InteractiveLearning
