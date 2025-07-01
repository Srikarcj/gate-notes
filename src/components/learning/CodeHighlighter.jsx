import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Play, Download, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import { toast } from 'react-hot-toast'

const CodeHighlighter = ({ code, language = 'javascript', title, testCases, showRunButton = true }) => {
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState([])

  // Simple syntax highlighting for JavaScript
  const highlightCode = (code) => {
    if (language !== 'javascript') return code

    return code
      .replace(/(function|const|let|var|if|else|for|while|return|class|import|export)/g, '<span class="text-purple-400 font-semibold">$1</span>')
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-400">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
      .replace(/(\d+)/g, '<span class="text-blue-400">$1</span>')
      .replace(/(console\.log|console\.error|console\.warn)/g, '<span class="text-yellow-400">$1</span>')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }

  const runCode = async () => {
    if (language !== 'javascript') {
      toast.error('Code execution only supported for JavaScript')
      return
    }

    setIsRunning(true)
    setOutput('')
    setTestResults([])

    try {
      // Create a safe execution environment
      const originalLog = console.log
      let capturedOutput = []
      
      console.log = (...args) => {
        capturedOutput.push(args.join(' '))
      }

      // Execute the code
      const result = eval(code)
      
      // Restore console.log
      console.log = originalLog
      
      // Set output
      if (capturedOutput.length > 0) {
        setOutput(capturedOutput.join('\n'))
      } else if (result !== undefined) {
        setOutput(String(result))
      } else {
        setOutput('Code executed successfully!')
      }

      // Run test cases if available
      if (testCases && testCases.length > 0) {
        const results = testCases.map((testCase, index) => {
          try {
            const testResult = eval(testCase.test)
            const passed = String(testResult) === String(testCase.expected)
            return {
              index,
              input: testCase.input,
              expected: testCase.expected,
              actual: String(testResult),
              passed
            }
          } catch (error) {
            return {
              index,
              input: testCase.input,
              expected: testCase.expected,
              actual: `Error: ${error.message}`,
              passed: false
            }
          }
        })
        setTestResults(results)
      }

    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'code'}.${language === 'javascript' ? 'js' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Code downloaded!')
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          {title && (
            <span className="text-gray-300 text-sm font-medium">{title}</span>
          )}
          <span className="text-gray-500 text-xs px-2 py-1 bg-gray-700 rounded">
            {language}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {showRunButton && language === 'javascript' && (
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run'}
            </button>
          )}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code 
            className="text-gray-300 font-mono"
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
      </div>

      {/* Output Section */}
      {output && (
        <div className="border-t border-gray-700 bg-gray-800">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            Output:
          </div>
          <div className="p-4">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="border-t border-gray-700 bg-gray-800">
          <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
            Test Results:
          </div>
          <div className="p-4 space-y-2">
            {testResults.map((result) => (
              <motion.div
                key={result.index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: result.index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg text-sm",
                  result.passed 
                    ? "bg-green-900/20 border border-green-700" 
                    : "bg-red-900/20 border border-red-700"
                )}
              >
                {result.passed ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-gray-300">
                    <span className="font-medium">Input:</span> {result.input}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Expected: {result.expected} | Got: {result.actual}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeHighlighter
