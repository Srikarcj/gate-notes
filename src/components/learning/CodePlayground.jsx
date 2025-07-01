import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Copy, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Code,
  Terminal,
  Lightbulb
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { toast } from 'react-hot-toast'

const CodePlayground = ({ initialCode, language, title, description, testCases }) => {
  const [code, setCode] = useState(initialCode || '')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState([])
  const [activeTab, setActiveTab] = useState('code')

  const runCode = async () => {
    setIsRunning(true)
    setOutput('')
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Simple JavaScript evaluation for demo
        if (language === 'javascript') {
          const result = eval(code)
          setOutput(String(result))
        } else {
          setOutput('Code executed successfully!')
        }
        
        // Run test cases if available
        if (testCases) {
          runTestCases()
        }
      } catch (error) {
        setOutput(`Error: ${error.message}`)
      }
      setIsRunning(false)
    }, 1000)
  }

  const runTestCases = () => {
    const results = testCases.map((testCase, index) => {
      try {
        // Simple test case evaluation
        const result = eval(`${code}; ${testCase.test}`)
        return {
          id: index,
          passed: result === testCase.expected,
          input: testCase.input,
          expected: testCase.expected,
          actual: result
        }
      } catch (error) {
        return {
          id: index,
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: `Error: ${error.message}`
        }
      }
    })
    setTestResults(results)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${language === 'javascript' ? 'js' : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  const resetCode = () => {
    setCode(initialCode || '')
    setOutput('')
    setTestResults([])
  }

  const tabs = [
    { id: 'code', label: 'Code Editor', icon: Code },
    { id: 'output', label: 'Output', icon: Terminal },
    { id: 'tests', label: 'Test Cases', icon: CheckCircle }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-600 rounded text-xs font-medium">
              {language}
            </span>
            
            <button
              onClick={runCode}
              disabled={isRunning}
              className="btn btn-primary btn-sm"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Running...' : 'Run'}
            </button>
            
            <button onClick={copyCode} className="btn btn-ghost btn-sm text-white">
              <Copy className="w-4 h-4" />
            </button>
            
            <button onClick={downloadCode} className="btn btn-ghost btn-sm text-white">
              <Download className="w-4 h-4" />
            </button>
            
            <button onClick={resetCode} className="btn btn-ghost btn-sm text-white">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
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
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="h-96">
        {activeTab === 'code' && (
          <div className="h-full">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-green-400 border-none outline-none resize-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'output' && (
          <div className="h-full p-4 bg-gray-900 text-white font-mono text-sm overflow-auto">
            {output ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="whitespace-pre-wrap"
              >
                {output}
              </motion.div>
            ) : (
              <div className="text-gray-500 italic">
                Run your code to see the output here...
              </div>
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="h-full p-4 overflow-auto">
            {testCases ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Test Cases ({testResults.filter(r => r.passed).length}/{testCases.length} passed)
                  </h4>
                </div>
                
                {testCases.map((testCase, index) => {
                  const result = testResults[index]
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-3 rounded-lg border",
                        result?.passed
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : result?.passed === false
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                          : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {result?.passed === true ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : result?.passed === false ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className="font-medium text-sm">Test Case {index + 1}</span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Input:</span> {testCase.input}
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span> {testCase.expected}
                        </div>
                        {result && (
                          <div>
                            <span className="font-medium">Actual:</span> {result.actual}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No test cases available for this example</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CodePlayground
