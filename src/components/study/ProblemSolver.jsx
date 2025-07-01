import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  Zap,
  Trophy,
  Star,
  Filter,
  Search,
  Send,
  History,
  FileText,
  Terminal,
  Bug,
  Cpu,
  MemoryStick,
  Timer,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Flame,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Copy,
  Clipboard,
  Share2,
  ExternalLink,
  Info,
  AlertCircle,
  AlertTriangle,
  Loader,
  RefreshCw,
  StopCircle,
  FastForward,
  SkipForward,
  Volume2,
  VolumeX,
  Monitor,
  Smartphone,
  Tablet,
  Layout,
  Grid,
  List,
  Layers,
  Folder,
  FolderOpen,
  Plus,
  Minus,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useUserProfileStore } from '../../store/userProfileStore'

const ProblemSolver = ({ topics, selectedTopic: propSelectedTopic, selectedProblem, onProblemSelect, onBackToTopics }) => {
  // Enhanced state management
  const [selectedTopic, setSelectedTopic] = useState(propSelectedTopic || null)
  const [currentProblem, setCurrentProblem] = useState(null)

  // Update selected topic when prop changes
  useEffect(() => {
    if (propSelectedTopic && propSelectedTopic !== selectedTopic) {
      setSelectedTopic(propSelectedTopic)
      // Auto-select first problem of the topic if available
      const topicData = topics.find(([name]) => name === propSelectedTopic)?.[1]
      if (topicData?.problems?.length > 0) {
        setCurrentProblem(topicData.problems[0])
      }
    }
  }, [propSelectedTopic, selectedTopic, topics])
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [testResults, setTestResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showEditorial, setShowEditorial] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [problemFilter, setProblemFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('description') // description, submissions, discuss, editorial
  const [editorTheme, setEditorTheme] = useState('light') // light, dark
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [autoComplete, setAutoComplete] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [executionTime, setExecutionTime] = useState(0)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [showConsole, setShowConsole] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState([])
  const [customTestCase, setCustomTestCase] = useState('')
  const [showCustomTest, setShowCustomTest] = useState(false)
  const [problemStats, setProblemStats] = useState({})
  const [difficulty, setDifficulty] = useState('all')
  const [status, setStatus] = useState('all') // all, solved, attempted, todo
  const [companies, setCompanies] = useState([])
  const [tags, setTags] = useState([])
  const [sortBy, setSortBy] = useState('default') // default, difficulty, acceptance, frequency

  // Refs for editor functionality
  const editorRef = useRef(null)
  const timerRef = useRef(null)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // User profile store
  const {
    solvedProblems,
    addSolvedProblem,
    getTopicProgress,
    updateTopicProgress,
    problemHistory,
    addProblemAttempt,
    getSubmissionHistory,
    updateSubmissionHistory,
    performance
  } = useUserProfileStore()

  // Enhanced problem analysis and management
  const problemAnalysis = useMemo(() => {
    const analysis = {
      totalProblems: 0,
      byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      byStatus: { solved: 0, attempted: 0, todo: 0 },
      byTopic: {},
      averageAcceptance: 0,
      companies: new Set(),
      tags: new Set(),
      recentSubmissions: []
    }

    topics.forEach(([topicName, topicData]) => {
      if (topicData.studyContent?.practiceProblemsDetailed) {
        analysis.byTopic[topicName] = topicData.studyContent.practiceProblemsDetailed.length
        analysis.totalProblems += topicData.studyContent.practiceProblemsDetailed.length

        topicData.studyContent.practiceProblemsDetailed.forEach(problem => {
          const difficulty = problem.difficulty || 'Medium'
          analysis.byDifficulty[difficulty] = (analysis.byDifficulty[difficulty] || 0) + 1

          // Analyze status
          if (solvedProblems.includes(problem.id)) {
            analysis.byStatus.solved++
          } else if (problemHistory.some(h => h.problemId === problem.id)) {
            analysis.byStatus.attempted++
          } else {
            analysis.byStatus.todo++
          }

          // Collect companies and tags
          if (problem.companies) {
            problem.companies.forEach(company => analysis.companies.add(company))
          }
          if (problem.tags) {
            problem.tags.forEach(tag => analysis.tags.add(tag))
          }
        })
      }
    })

    analysis.companies = Array.from(analysis.companies)
    analysis.tags = Array.from(analysis.tags)

    return analysis
  }, [topics, solvedProblems, problemHistory])

  // Get all problems with enhanced metadata
  const getAllProblems = () => {
    const problems = []
    topics.forEach(([topicName, topicData]) => {
      if (topicData.studyContent?.practiceProblemsDetailed) {
        topicData.studyContent.practiceProblemsDetailed.forEach(problem => {
          const submissions = getSubmissionHistory(problem.id) || []
          const lastSubmission = submissions[submissions.length - 1]
          const isSolved = solvedProblems.includes(problem.id)
          const isAttempted = submissions.length > 0

          problems.push({
            ...problem,
            topicName,
            difficulty: problem.difficulty || topicData.difficulty || 'Medium',
            status: isSolved ? 'solved' : isAttempted ? 'attempted' : 'todo',
            submissions: submissions.length,
            lastSubmitted: lastSubmission?.timestamp,
            bestSubmission: submissions.find(s => s.status === 'accepted'),
            acceptance: problem.acceptance || Math.random() * 100, // Mock acceptance rate
            frequency: problem.frequency || Math.floor(Math.random() * 100), // Mock frequency
            companies: problem.companies || [],
            tags: problem.tags || [],
            estimatedTime: problem.estimatedTime || '30-45 min'
          })
        })
      }
    })
    return problems
  }

  // Advanced filtering and sorting
  const getFilteredProblems = () => {
    let problems = getAllProblems()

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      problems = problems.filter(problem =>
        problem.title.toLowerCase().includes(query) ||
        problem.description.toLowerCase().includes(query) ||
        problem.tags.some(tag => tag.toLowerCase().includes(query)) ||
        problem.companies.some(company => company.toLowerCase().includes(query))
      )
    }

    // Difficulty filter
    if (difficulty !== 'all') {
      problems = problems.filter(problem =>
        problem.difficulty.toLowerCase() === difficulty.toLowerCase()
      )
    }

    // Status filter
    if (status !== 'all') {
      problems = problems.filter(problem => problem.status === status)
    }

    // Companies filter
    if (companies.length > 0) {
      problems = problems.filter(problem =>
        problem.companies.some(company => companies.includes(company))
      )
    }

    // Tags filter
    if (tags.length > 0) {
      problems = problems.filter(problem =>
        problem.tags.some(tag => tags.includes(tag))
      )
    }

    // Sort problems
    problems.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2)
        case 'acceptance':
          return b.acceptance - a.acceptance
        case 'frequency':
          return b.frequency - a.frequency
        case 'recent':
          return new Date(b.lastSubmitted || 0) - new Date(a.lastSubmitted || 0)
        default:
          return a.title.localeCompare(b.title)
      }
    })

    return problems
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  // Starter code templates
  const getStarterCode = (language, problem) => {
    const templates = {
      javascript: `function ${problem?.id || 'solution'}() {
    // Write your solution here
    
}

// Test your solution
console.log(${problem?.id || 'solution'}());`,
      python: `def ${problem?.id || 'solution'}():
    # Write your solution here
    pass

# Test your solution
print(${problem?.id || 'solution'}())`,
      java: `public class Solution {
    public static void main(String[] args) {
        // Write your solution here
        
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`
    }
    return templates[language] || templates.javascript
  }

  // Enhanced code execution with detailed feedback
  const runCode = async () => {
    if (!code.trim()) {
      setConsoleOutput(prev => [...prev, { type: 'error', message: 'Please write some code first!' }])
      return
    }

    setIsRunning(true)
    setConsoleOutput([])
    const startExecution = Date.now()

    try {
      // Simulate code compilation
      setConsoleOutput(prev => [...prev, { type: 'info', message: 'Compiling code...' }])
      await new Promise(resolve => setTimeout(resolve, 500))

      // Simulate code execution
      setConsoleOutput(prev => [...prev, { type: 'info', message: 'Running test cases...' }])
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate realistic test results
      const testCases = currentProblem?.testCases || [
        { input: 'Test Case 1', expected: 'Expected Output 1' },
        { input: 'Test Case 2', expected: 'Expected Output 2' },
        { input: 'Test Case 3', expected: 'Expected Output 3' },
        { input: 'Test Case 4', expected: 'Expected Output 4' }
      ]

      const mockResults = testCases.map((testCase, index) => {
        const passed = Math.random() > 0.3 // 70% pass rate
        return {
          id: index + 1,
          input: testCase.input,
          expected: testCase.expected,
          actual: passed ? testCase.expected : `Different Output ${index + 1}`,
          passed,
          executionTime: Math.floor(Math.random() * 100) + 10, // 10-110ms
          memoryUsed: Math.floor(Math.random() * 50) + 10 // 10-60MB
        }
      })

      const executionTimeMs = Date.now() - startExecution
      const passedTests = mockResults.filter(r => r.passed).length
      const totalTests = mockResults.length

      setTestResults(mockResults)
      setExecutionTime(executionTimeMs)
      setMemoryUsage(Math.floor(Math.random() * 100) + 50) // Mock memory usage

      // Update console with results
      setConsoleOutput(prev => [
        ...prev,
        { type: 'success', message: `Execution completed in ${executionTimeMs}ms` },
        { type: 'info', message: `Test cases passed: ${passedTests}/${totalTests}` }
      ])

      // Track attempt
      addProblemAttempt({
        problemId: currentProblem.id,
        language,
        code,
        testResults: mockResults,
        timestamp: new Date().toISOString(),
        executionTime: executionTimeMs,
        memoryUsage
      })

    } catch (error) {
      setConsoleOutput(prev => [...prev, { type: 'error', message: `Runtime Error: ${error.message}` }])
    } finally {
      setIsRunning(false)
    }
  }

  // Submit solution
  const submitSolution = async () => {
    if (!code.trim()) {
      setConsoleOutput(prev => [...prev, { type: 'error', message: 'Please write some code first!' }])
      return
    }

    setIsSubmitting(true)
    const startTime = Date.now()

    try {
      // Simulate submission process
      setConsoleOutput([{ type: 'info', message: 'Submitting solution...' }])
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate submission result
      const allTestsPassed = Math.random() > 0.4 // 60% acceptance rate
      const submissionResult = {
        id: Date.now().toString(),
        problemId: currentProblem.id,
        language,
        code,
        status: allTestsPassed ? 'accepted' : 'wrong_answer',
        executionTime: Math.floor(Math.random() * 200) + 50,
        memoryUsage: Math.floor(Math.random() * 100) + 30,
        timestamp: new Date().toISOString(),
        testCasesPassed: allTestsPassed ? currentProblem?.testCases?.length || 4 : Math.floor(Math.random() * 3) + 1,
        totalTestCases: currentProblem?.testCases?.length || 4
      }

      // Update submissions
      setSubmissions(prev => [submissionResult, ...prev])
      updateSubmissionHistory(currentProblem.id, submissionResult)

      if (allTestsPassed) {
        addSolvedProblem(currentProblem.id)
        updateTopicProgress(currentProblem.topicName, getTopicProgress(currentProblem.topicName) + 15)
        setConsoleOutput(prev => [...prev, { type: 'success', message: '🎉 Accepted! Solution submitted successfully.' }])
      } else {
        setConsoleOutput(prev => [...prev, { type: 'error', message: '❌ Wrong Answer. Some test cases failed.' }])
      }

    } catch (error) {
      setConsoleOutput(prev => [...prev, { type: 'error', message: `Submission Error: ${error.message}` }])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Run custom test case
  const runCustomTest = async () => {
    if (!customTestCase.trim()) return

    setIsRunning(true)
    setConsoleOutput([{ type: 'info', message: 'Running custom test case...' }])

    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock custom test result
    const result = {
      input: customTestCase,
      output: `Output for: ${customTestCase}`,
      executionTime: Math.floor(Math.random() * 50) + 10,
      memoryUsed: Math.floor(Math.random() * 30) + 10
    }

    setConsoleOutput(prev => [
      ...prev,
      { type: 'success', message: `Custom test completed in ${result.executionTime}ms` },
      { type: 'info', message: `Input: ${result.input}` },
      { type: 'info', message: `Output: ${result.output}` }
    ])

    setIsRunning(false)
  }

  // Timer functionality
  useEffect(() => {
    if (currentProblem && !startTime) {
      setStartTime(Date.now())
    }

    if (startTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentProblem, startTime])

  // Initialize code when problem changes
  useEffect(() => {
    if (currentProblem) {
      setCode(currentProblem.starterCode || getStarterCode(language, currentProblem))
      setTestResults([])
      setShowHints(false)
      setShowSolution(false)
      setConsoleOutput([])
      setStartTime(Date.now())
      setElapsedTime(0)

      // Load previous submissions
      const history = getSubmissionHistory(currentProblem.id) || []
      setSubmissions(history)
    }
  }, [currentProblem, language])

  // Utility functions
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
  }





  const filteredProblems = getFilteredProblems()

  return (
    <div className={cn(
      "space-y-6",
      isFullscreen && "fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-y-auto"
    )}>
      {/* Enhanced Header with Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {onBackToTopics && (
              <button
                onClick={onBackToTopics}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Topics</span>
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedTopic ? `${selectedTopic} - Practice Problems` : 'Practice Problems'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredProblems.length} of {problemAnalysis.totalProblems} problems
                {selectedTopic && <span className="ml-2 text-blue-600 dark:text-blue-400">• {selectedTopic}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Problem Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {problemAnalysis.byStatus.solved}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Solved</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {problemAnalysis.byStatus.attempted}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Attempted</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-gray-600 dark:text-gray-400">
              {problemAnalysis.byStatus.todo}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">To Do</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {problemAnalysis.byDifficulty.Easy}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Easy</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {problemAnalysis.byDifficulty.Medium}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Medium</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {problemAnalysis.byDifficulty.Hard}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Hard</div>
          </div>
        </div>

        {/* Advanced Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems, companies, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
              <option value="todo">To Do</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="default">Default Order</option>
              <option value="difficulty">Sort by Difficulty</option>
              <option value="acceptance">Sort by Acceptance</option>
              <option value="frequency">Sort by Frequency</option>
              <option value="recent">Recently Attempted</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Problems List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-[600px] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Problems</h3>
            </div>
            
            <div className="p-2">
              {filteredProblems.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No problems found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProblems.map((problem, index) => {
                    const isSolved = solvedProblems.includes(problem.id)
                    const isSelected = currentProblem?.id === problem.id
                    
                    return (
                      <motion.button
                        key={problem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setCurrentProblem(problem)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-colors",
                          isSelected 
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isSolved ? (
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="font-medium text-gray-900 dark:text-white truncate">
                                {problem.title}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {problem.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getDifficultyColor(problem.difficulty))}>
                                {problem.difficulty}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {problem.topicName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor and Problem Details */}
        <div className="lg:col-span-2">
          {!currentProblem ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Problem</h3>
                <p className="text-gray-600 dark:text-gray-400">Choose a problem from the list to start coding</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Problem Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentProblem.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getDifficultyColor(currentProblem.difficulty))}>
                        {currentProblem.difficulty}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {currentProblem.topicName}
                      </span>
                      {solvedProblems.includes(currentProblem.id) && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Solved
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {currentProblem.description}
                </p>

                {/* Examples */}
                {currentProblem.examples && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Examples:</h4>
                    {currentProblem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-2">
                        <div className="text-sm space-y-1">
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                          {example.explanation && <div><strong>Explanation:</strong> {example.explanation}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hints */}
                <AnimatePresence>
                  {showHints && currentProblem.hints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Hints:</h4>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                          {currentProblem.hints.map((hint, index) => (
                            <li key={index}>• {hint}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Code Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCode(getStarterCode(language, currentProblem))}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={runCode}
                      disabled={isRunning}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border-none resize-none focus:outline-none font-mono text-sm text-gray-900 dark:text-white"
                  placeholder="Write your code here..."
                />
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Test Results</h4>
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          result.passed 
                            ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                            : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {result.input}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div>Expected: {result.expected}</div>
                          <div>Your Output: {result.actual}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProblemSolver
