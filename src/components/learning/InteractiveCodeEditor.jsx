import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  RotateCcw, 
  Save, 
  Copy, 
  Check, 
  X, 
  Clock,
  Zap,
  Target,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useAdvancedStudyStore } from '../../store/advancedStudyStore'

const InteractiveCodeEditor = ({ 
  problem, 
  initialCode = '', 
  language = 'javascript',
  testCases = [],
  onSolutionSubmit 
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('dark')
  const [startTime, setStartTime] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [copied, setCopied] = useState(false)
  
  const editorRef = useRef(null)
  const timerRef = useRef(null)
  
  const { submitProblemSolution, preferences } = useAdvancedStudyStore()

  useEffect(() => {
    setStartTime(Date.now())
    timerRef.current = setInterval(() => {
      if (startTime) {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [startTime])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    setTestResults([])

    try {
      // Simulate code execution (in a real app, this would call a backend service)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock test case execution
      const results = testCases.map((testCase, index) => {
        // Simple simulation - in reality, you'd execute the code with test inputs
        const passed = Math.random() > 0.3 // 70% pass rate for demo
        return {
          id: index,
          input: testCase.input,
          expected: testCase.expected,
          actual: passed ? testCase.expected : 'Wrong output',
          passed,
          executionTime: Math.floor(Math.random() * 100) + 10
        }
      })
      
      setTestResults(results)
      
      const allPassed = results.every(r => r.passed)
      if (allPassed) {
        setOutput('✅ All test cases passed! Great job!')
        submitProblemSolution(problem.id, code, true, timeSpent)
        if (onSolutionSubmit) {
          onSolutionSubmit(true, code, timeSpent)
        }
      } else {
        setOutput('❌ Some test cases failed. Check your logic and try again.')
      }
      
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput('')
    setTestResults([])
    setStartTime(Date.now())
    setTimeSpent(0)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const saveCode = () => {
    // Save to local storage or backend
    localStorage.setItem(`code_${problem.id}`, code)
    // Could also save to the study store
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''} flex flex-col h-full`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {problem.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {problem.difficulty}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSize(Math.max(10, fontSize - 2))}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              -
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-center">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={saveCode}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Save Code"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={copyCode}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={resetCode}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-4 font-mono bg-gray-900 text-green-400 border-none resize-none focus:outline-none"
            style={{ fontSize: `${fontSize}px` }}
            placeholder="// Write your solution here..."
            spellCheck={false}
          />
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Press Ctrl+Enter to run
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white">Test Results</h4>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Output */}
            {output && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</h5>
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Test Cases */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Cases ({testResults.filter(r => r.passed).length}/{testResults.length} passed)
                </h5>
                <div className="space-y-2">
                  {testResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border ${
                        result.passed 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className="text-sm font-medium">
                          Test Case {result.id + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.executionTime}ms
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Input:</span> {JSON.stringify(result.input)}
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span> {JSON.stringify(result.expected)}
                        </div>
                        <div>
                          <span className="font-medium">Actual:</span> {JSON.stringify(result.actual)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Test Cases Preview */}
            {testCases.length > 0 && testResults.length === 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Test Cases ({testCases.length})
                </h5>
                <div className="space-y-2">
                  {testCases.slice(0, 3).map((testCase, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Input:</span> {JSON.stringify(testCase.input)}
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span> {JSON.stringify(testCase.expected)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {testCases.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{testCases.length - 3} more test cases
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveCodeEditor
